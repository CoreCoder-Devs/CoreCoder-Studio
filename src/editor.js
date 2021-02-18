const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const fs = require("fs");
const filebrowser = require("./js/filebrowser");
const path = require("path");

var openedFileBrowser = 0;
var bp_path = window.localStorage.getItem("bp_path");
var bp_relativepath = path.sep;
var rp_path = window.localStorage.getItem("rp_path");
var rp_relativepath = path.sep;

/**
 * Opened tabs
 * key: filepath
 * value: {contentEl}
 */
var openedTabs = {};
/**
 * key: tabElement
 * value: MonacoModel */
var models = new WeakMap();

const app = new Vue({
    el: '#app',
    data: {
        //TITLE BAR
        maximised: false,
        ipc: ipc,
        settings: settings,
        sidePanelOpen: false,
        noFileOpen: true
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

var monacoEditor = null;

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
            monacoEditor = editor;
        })
    }

    loaderScript.setAttribute('src', '../node_modules/monaco-editor/min/vs/loader.js')
    document.body.appendChild(loaderScript)
}

function openSidePanel(id, tabElem) {
    if (tabElem == null || tabElem.classList.contains("selected")) {
        // If the tab is active, deactivate all tabs
        var children = document.getElementById("sidebar").children;
        for (var i = 0; i < children.length; i++) {
            var dom = children[i];
            dom.classList.remove("selected");
        }

        // Hide the panel
        document.getElementById("sidePanel").style.display = "none";

        // Set the vue variable 
        app.$data.sidePanelOpen = false;

        let v1 = document.documentElement.style.getPropertyValue("--var-sidebar-width");
        document.documentElement.style.setProperty("--var-side-width", "32px");

        if(tabElem == null){ // While dragging to the left of the sizer
            document.documentElement.style.setProperty("--var-sidepanel-width", "256px");
            // document.documentElement.style.setProperty("--var-side-width", "288px");
        }

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
        document.querySelector('.resizer-editor').style.left = v1 + 32 + "px";
    }

    if(id == "fileBrowser"){
        refreshFileBrowser();
    }
}
function initTabs(){
    const ChromeTabs = require("../src/lib/chrome-tabs-custom");
    var el = document.querySelector(".chrome-tabs");
    chromeTabs = new ChromeTabs();
    document.documentElement.classList.add("dark-theme");
    el.classList.add("chrome-tabs-dark-theme");

    chromeTabs.init(el);
    el.addEventListener("activeTabChange", (elm) => {
        if (elm.detail.tabEl === undefined) return;
        var id = elm.detail.tabEl.id;
        document.querySelectorAll(".editor-content-content").forEach((elmnt) => {
            // elmnt.style.width = 0;
            elmnt.style.display = "none";
        });
        var tabEl = elm.detail.tabEl;
        var prop = JSON.parse(unescape(tabEl.getAttribute("data-properties-original")));
        var path = escape(prop.path);
        var data = openedTabs[prop.path];

        if(data != undefined){
            data.contentEl.style.display = "block";
            if(data.isEditor != undefined){
                // If it is an editor, set the editor model
                monacoEditor.setModel(models.get(tabEl));
                monacoEditor.layout();
            }
        }

        // if (id != "") {
        //     if (items_source[id].type == "ace") {
        //         setEditSession(id);
        //         document.getElementById("editor").style.display = "block";
        //     } else {
        //         document.getElementById("navBarInput").value = items_source[id].data.webview.src;
        //         document.getElementById("navBar").style.visibility = "visible";
        //         //document.getElementById("editor").style.width = "100%";
        //         items_source[id].data.webview.style.width = "100%";
        //     }
        // }
        // ipcRenderer.send('discord-activity-change', {
        //     details: `${project_info.bp_name}`,
        //     state: `${chromeTabs.activeTabEl.children[2].children[1].innerText}`,
        // })
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

function initResizableSidePanel(){
    const Draggabilly = require("../src/lib/chrome-tabs-custom/node_modules/draggabilly");
    var elem = document.querySelector('.resizer-editor');
    var draggie = new Draggabilly( elem, {
    // options...
        axis: 'x'
    });

    draggie.on( 'dragMove', function( event, pointer, moveVector ) {
        // Move a different variable
        if(pointer.pageX > 64){
            document.documentElement.style.setProperty("--var-sidepanel-width", (pointer.pageX-32)+"px");
            document.documentElement.style.setProperty("--var-side-width", pointer.pageX+"px");
        }else{
            document.documentElement.style.setProperty("--var-sidepanel-width", "0px");
            document.documentElement.style.setProperty("--var-side-width", "32px");
        }
    });
    draggie.on( 'dragEnd', function( event, pointer, moveVector ) {
        // Move a different variable
        if(pointer.pageX <= 64){
            openSidePanel(-1, null);
        }
    });
} 

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

function goInFolder(folderName){
    if(openedFileBrowser == 0) bp_relativepath += folderName;
    if(openedFileBrowser == 1) rp_relativepath += folderName;
    refreshFileBrowser();
}
function goUpOneFolder(){
    var value = (openedFileBrowser == 0? bp_relativepath : rp_relativepath);
    var result = path.dirname(value);
    if(!result.endsWith(path.sep)) result += path.sep;
    if(openedFileBrowser == 0){
        bp_relativepath = result;
    }
    if(openedFileBrowser == 1){
        rp_relativepath = result;
    }
    refreshFileBrowser();
}

function openFile(p){
    var filePath = (openedFileBrowser == 0? bp_path+bp_relativepath : rp_path+rp_relativepath) + p;
    
    if(escape(filePath) in openedTabs){
        // Change the active tab instead when the tab is already opened
        // chromeTabs.activeTabEl = openedTabs[escape(filePath)].tabEl;
        return;
    }
    if(filePath.endsWith(".png")){
        // Open the image editor
        let filename = path.parse(filePath).base;
        
        var elem = htmlToElem(`<div style="height:100%" class="editor-content-content"></div>`);
        var img = document.createElement("img");
        img.src = filePath;
        elem.appendChild(img);
        document.getElementById("editor-content").appendChild(elem);

        // Add to the opened file tabs
        openedTabs[escape(filePath)] = {contentEl:elem};

        // Open a tab
        let tab = chromeTabs.addTab({
            title: filename,
            favicon: filePath.replace(/\\/gi, "\\\\"),
            path: escape(filePath)
        });

    }else{
        // Open the text editor
        let source = fs.readFileSync(filePath).toString();

        let lang = null;
        if(filePath.endsWith(".json")) lang = "json";
        if(filePath.endsWith(".js")) lang = "javascript";
        if(filePath.endsWith(".html")) lang = "html";
        
        let model = monaco.editor.createModel(source,lang);
        monacoEditor.setModel(model);
        
        var elem = document.getElementById("myeditor");
        openedTabs[escape(filePath)] = {contentEl:elem,isEditor:true};

        let filename = path.parse(filePath).base;
        let tab = chromeTabs.createNewTabEl();
        models.set(tab, model);
        chromeTabs.addTabEl(tab,{
            title: filename,
            path: escape(filePath)
        });
    }
    app.$data.noFileOpen = false;
}

function refreshFileBrowser(){
    // Clear the filebrowser
    var cont = document.getElementById("filebrowsercontent");
    cont.innerHTML = "";
    var result = "";
    // BP or RP
    if(openedFileBrowser == 0 || openedFileBrowser == 1){
        var browsePath = openedFileBrowser==0?bp_path+bp_relativepath:rp_path+rp_relativepath;
        if(browsePath == null) return; // TODO::makes warn user that either BP or RP is not found
        var files = fs.readdirSync(browsePath);
        files.sort(function(a, b) {
            return fs.statSync(browsePath +path.sep+ b).isDirectory() -
                   fs.statSync(browsePath +path.sep+ a).isDirectory();
        });
        if((openedFileBrowser == 0 && bp_relativepath !== path.sep && bp_relativepath !== "") || (openedFileBrowser == 1 && rp_relativepath !== path.sep && rp_relativepath !== "")){
            // Go up one folder button
            result+=filebrowser.generateFileBrowserItem(
                "..",               // Title
                "",  // Path
                "",                   // Icon
                `goUpOneFolder();`,           
                "",                     // Type
                true);    // isDirectory
        }

        for(var i in files){
            var stat = fs.statSync(browsePath + path.sep + files[i]);
            var icon = "";

            if(files[i].endsWith(".png")){
                icon = browsePath + path.sep + files[i];
            }
            result+=filebrowser.generateFileBrowserItem(
                files[i],               // Title
                browsePath + path.sep + files[i],  // Path
                icon,                   // Icon
                stat.isDirectory()?`goInFolder('${files[i]+path.sep+path.sep}');`:`openFile('${files[i]}')`,           
                "",                     // Type
                stat.isDirectory());    // isDirectory
        }
        cont.innerHTML = result;
    }
}

function htmlToElem(html) {
    // HTML string to js dom element
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
  }

function init(){
    initMonaco();
    initTabs();
    initResizableSidePanel();
}