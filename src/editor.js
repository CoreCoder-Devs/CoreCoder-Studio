const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const fs = require("fs");
const filebrowser = require("./js/filebrowser");

var openedFileBrowser = 0;
var bp_path = window.localStorage.getItem("bp_path");
var rp_path = window.localStorage.getItem("rp_path");

/**
 * Opened tabs
 * key: filepath
 * value: {title,icon,htmlElement}
 */
var openedTabs = {};

const app = new Vue({
    el: '#app',
    data: {
        //TITLE BAR
        maximised: false,
        ipc: ipc,
        settings: settings,
        sidePanelOpen: false
    },

    created() {
        settings.GlobalSettings.lang = "cn";
        settings.localizeInterface();
        let vm = this
        // Listens for windows event
        ipc.on("windowStateMaximized", (event, args) => {
            vm.maximised = true
        });
        ipc.on("windowStateRestored", (event, args) => {
            vm.maximised = false
        });
    }
});


function initMonaco() {
    const nodeRequire = global.require
    const loaderScript = document.createElement('script')

    loaderScript.onload = () => {
        const amdRequire = global.require
        global.require = nodeRequire

        var path = require('path')

        function uriFromPath(_path) {
            var pathName = path.resolve(_path).replace(/\\/g, '/')

            if (pathName.length > 0 && pathName.charAt(0) !== '/') {
                pathName = '/' + pathName
            }

            return encodeURI('file://' + pathName)
        }

        amdRequire.config({
            baseUrl: uriFromPath(path.join(__dirname, '../node_modules/monaco-editor/min'))
        })

        // workaround monaco-css not understanding the environment
        self.module = undefined

        // workaround monaco-typescript not understanding the environment
        self.process.browser = true

        amdRequire(['vs/editor/editor.main'], function () {
            var editor = this.monaco.editor.create(document.getElementById('myeditor'), {
                value: [
                    'function x() {',
                    '\tconsole.log("Hello world!");',
                    '}'
                ].join('\n'),
                language: 'json',
                theme: "vs-dark",
                automaticLayout: true
            });
            editor.layout();
            global.editor = editor;
        })
    }

    loaderScript.setAttribute('src', '../node_modules/monaco-editor/min/vs/loader.js')
    document.body.appendChild(loaderScript)
}

function openSidePanel(id, tabElem) {

    if (tabElem.classList.contains("selected")) {
        // If the tab is active, deactivate all tabs
        tabElem.classList.remove("selected");
        document.getElementById("sidePanel").style.display = "none";
        app.$data.sidePanelOpen = false;
        let v1 = document.documentElement.style.getPropertyValue("--var-sidebar-width");
        document.documentElement.style.setProperty("--var-side-width", "32px");

        // Disable the resizer
        document.querySelector('.resizer-editor').style.display = "none";
    }else{
        // Make the tab active
        var sidebar = document.getElementById("sidebar");
        var children = sidebar.children;
        for (var i = 0; i < children.length; i++) {
            var dom = children[i];
            dom.classList.remove("selected");
        }
        tabElem.classList.add("selected");
        app.$data.sidePanelOpen = true;
        let v1 = parseInt(document.documentElement.style.getPropertyValue("--var-sidepanel-width"),10);
        if(isNaN(v1)) v1 = 256;
        document.documentElement.style.setProperty("--var-sidepanel-width", v1+"px");
        let v2 = parseInt(document.documentElement.style.getPropertyValue("--var-sidebar-width"),10);
        if(isNaN(v2)) v2 = 256;
        document.documentElement.style.setProperty("--var-side-width", (v1+32)+"px");
        global.editor.layout();
        // Opens a side panel with specific id
        var cont = document.getElementById("sidePanel");
        if(cont != undefined){
            cont.style.display = "block";
            var elem = document.getElementById(id);

            // Activate the panel
            var children = cont.children;
            for (var i = 0; i < children.length; i++) {
                var dom = children[i];
                dom.style.display = "none";
            }
            elem.style.display = "block";
        }
        // Enable the resizer
        document.querySelector('.resizer-editor').style.display = "block";
    }

    if(id == "fileBrowser"){
        refreshFileBrowser();
    }
}
initMonaco();

function initTabs(){
    const ChromeTabs = require("../src/lib/chrome-tabs-custom");
    var el = document.querySelector(".chrome-tabs");
    chromeTabs = new ChromeTabs();
    document.documentElement.classList.add("dark-theme");
    el.classList.add("chrome-tabs-dark-theme");

    chromeTabs.init(el);

    chromeTabs.addTab({
		title: 'Untitled',
		favicon: "images/025-files-and-folders.png"
	});
    chromeTabs.addTab({
		title: 'Untitled',
		favicon: "images/025-files-and-folders.png"
	});
    el.addEventListener("activeTabChange", (elm) => {
        if (elm.detail.tabEl === undefined) return;
        var id = elm.detail.tabEl.id;
        document.querySelectorAll("webview").forEach((elm) => {
            elm.style.width = 0;
        });
        document.getElementById("editor").style.display = "none";
        document.getElementById("navBar").style.visibility = "collapse";
        if (id != "") {
            if (items_source[id].type == "ace") {
                setEditSession(id);
                document.getElementById("editor").style.display = "block";
            } else {
                document.getElementById("navBarInput").value = items_source[id].data.webview.src;
                document.getElementById("navBar").style.visibility = "visible";
                //document.getElementById("editor").style.width = "100%";
                items_source[id].data.webview.style.width = "100%";
            }
        }
        let stateText
        if(chromeTabs.activeTabEl.children[2].children[1].innerText == "Web Browser") {
            stateText = ""
        }
        ipcRenderer.send('discord-activity-change', {
            details: `${project_info.bp_name}`,
            state: `${chromeTabs.activeTabEl.children[2].children[1].innerText}`,
        })
    });
    
    el.addEventListener("tabRemove", function (elm) {
        var id = elm.detail.tabEl.id;
        if (id != "") {
            if (items_source[id].type === "web") {
                items_source[id].data.webview.remove();
            } else if (items_source[id].type === "ace") {
                delete open_tabs[items_source[id].data["path"]];
            }
            delete items_source[id];

            if (Object.keys(items_source).length === 0 && items_source.constructor === Object) {
                // If it is empty
                if (editor) {
                    document.getElementById("editor").style.display = "none";
                    document.getElementById("navBar").style.visibility = "collapse";
                }
            }
            chromeTabs.removeTab(elm.detail.tabEl);
        }
        if(!chromeTabs.activeTabEl) {
            ipcRenderer.send('discord-activity-change', {
            details: `${project_info.bp_name}`
        })
        }
    });
    var ctrlPressed = false;
    window.addEventListener("keydown", (event) => {
        if (event.ctrlKey && event.key === "n") {
            createNewFile();
        } else if (event.ctrlKey && event.key === "s") {
            saveCurrentFile();
        }
        if (event.ctrlKey) {
            ctrlPressed = true;
        }
    });
    window.addEventListener("keyup", (event) => {
        if (event.ctrlKey) {
            ctrlPressed = false;
        }
    });
    window.addEventListener("wheel", (event) => {
        if (ctrlPressed) {
            // if(event.deltaY > 0)
            // currentWebBrowserZoomIn();
            // if(event.deltaY < 0)
            // currentWebBrowserZoomOut();
        }
    });
}
initTabs();

function initResizableSidePanel(){
    const Draggabilly = require("../src/lib/chrome-tabs-custom/node_modules/draggabilly");
    var elem = document.querySelector('.resizer-editor');
    var draggie = new Draggabilly( elem, {
    // options...
        axis: 'x'
    });

    draggie.on( 'dragMove', function( event, pointer, moveVector ) {
        // Move a different variable
        // var val = parseInt(document.documentElement.style.getPropertyValue("--var-sidepanel-width"),10);
        // var val2 = parseInt(document.documentElement.style.getPropertyValue("--var-sidebar-width"),10);
        document.documentElement.style.setProperty("--var-sidepanel-width", (pointer.pageX-32)+"px");
        document.documentElement.style.setProperty("--var-side-width", pointer.pageX+"px");
    });
} initResizableSidePanel();

function openFileBrowser(id){
    /**
     * Open a specific file browser tab
     */
    var cont = document.getElementById("filebrowserheader");
    for(var i = 0; i < cont.children.length; i++){
        cont.children[i].classList.remove("selected");
    }

    var tabId = "";
    if(id == 0) tabId = "fbHeaderBP";
    if(id == 1) tabId = "fbHeaderRP";
    if(id == 2) tabId = "fbHeaderDOC";

    var tab = document.getElementById(tabId);
    tab.classList.add("selected");

    openedFileBrowser = id;
    refreshFileBrowser();
}

function refreshFileBrowser(){
    // Clear the filebrowser
    var cont = document.getElementById("filebrowsercontent");
    cont.innerHTML = "";
    var result = "";
    // BP or RP
    if(openedFileBrowser == 0 || openedFileBrowser == 1){
        var path = openedFileBrowser==0?bp_path:rp_path;
        if(path == null) return; // TODO::makes warn user that either BP or RP is not found
        var files = fs.readdirSync(path);
        for(var i in files){
            result+=filebrowser.generateFileBrowserItem(files[i], "","",function(){},"");
        }
        cont.innerHTML = result;
    }
}