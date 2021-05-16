const electron = require("electron").remote;
const { dialog } = require('electron').remote;
const ipc = require("electron").ipcRenderer;
const { settings } = require("./js/global_settings");
const fs = require("fs");
const filebrowser = require("./js/filebrowser");
const path = require("path");
const packutil = require("./js/packutil");
const ChromeTabs = require("../src/lib/chrome-tabs-custom");
const chromeTabs = new ChromeTabs();
const util = require("util");

const Pixy = require("../src/lib/pixydust/pixydust");
const Dialog = require("../src/js/dialog");

var _fswrite = util.promisify(fs.writeFile);

/**
 * Look for Element with specific id
 * @param {String} id Element id to look for
 * @returns Node
 */
var $ = (id) => { return document.getElementById(id) };

/**
 * document.querySelectorAll(query);
 * @param {String} query Query the element to look for
 * @returns {Node} Node
 */
var $q = (query) => { return document.querySelectorAll(query); };
// const chromeTabs = require("../src/lib/chrome-tabs-custom");
// const chromeTabs = require("../src/lib/chrome-tabs-custom");

var openedFileBrowser = 0;
var bp_path = window.localStorage.getItem("bp_path");
var bp_relativepath = path.sep;
var rp_path = window.localStorage.getItem("rp_path");
var rp_relativepath = path.sep;

if (bp_path == null && rp_path != null) {
    openedFileBrowser = 1;
    openFileBrowser(1);
}

if (rp_path == null && bp_path != null) {
    openedFileBrowser = 0;
    openFileBrowser(0);
}

/**
 * Opened tabs
 * key: filepath
 * value: {contentEl [,isEditor] [,isSaved]}
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
        noFileOpen: true,
        paths: [
            //  {
            //      path: '/',  
            //      icon: '/',  OPTIONAL
            //      onclick() {},  
            //      isfolder: false  OPTIONAL, recommended for performance
            //  }
        ]
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
    // ----- Initializing Monaco ------ //
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


            editor.addAction({
                // An unique identifier of the contributed action.
                id: 'save',

                // A label of the action that will be presented to the user.
                label: 'Save Current File',

                // An optional array of keybindings for the action.
                keybindings: [
                    monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S,
                    // chord
                    monaco.KeyMod.chord(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S)
                ],

                // A precondition for this action.
                precondition: null,

                // A rule to evaluate on top of the precondition in order to dispatch the keybindings.
                keybindingContext: null,

                contextMenuGroupId: 'navigation',

                contextMenuOrder: 1.5,

                // Method that will be executed when the action is triggered.
                // @param editor The editor instance is passed in as a convinience
                run: function (ed) {
                    onMonacoSave();
                    return null;
                }
            });
        })
    }

    loaderScript.setAttribute('src', '../node_modules/monaco-editor/min/vs/loader.js')
    document.body.appendChild(loaderScript);

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

        if (tabElem == null) { // While dragging to the left of the sizer
            document.documentElement.style.setProperty("--var-sidepanel-width", "256px");
            // document.documentElement.style.setProperty("--var-side-width", "288px");
        }

        // Disable the resizer
        document.querySelector('.resizer-editor').style.display = "none";
    } else {
        // Make the tab active
        var sidebar = document.getElementById("sidebar");
        var children = sidebar.children;
        for (var i = 0; i < children.length; i++) {
            var dom = children[i];
            dom.classList.remove("selected");
        }
        tabElem.classList.add("selected");
        app.$data.sidePanelOpen = true;
        let v1 = parseInt(document.documentElement.style.getPropertyValue("--var-sidepanel-width"), 10);
        if (isNaN(v1)) v1 = 256;
        document.documentElement.style.setProperty("--var-sidepanel-width", v1 + "px");
        let v2 = parseInt(document.documentElement.style.getPropertyValue("--var-sidebar-width"), 10);
        if (isNaN(v2)) v2 = 256;
        document.documentElement.style.setProperty("--var-side-width", (v1 + 32) + "px");
        // Opens a side panel with specific id
        var cont = document.getElementById("sidePanel");
        if (cont != undefined) {
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

    if (id == "fileBrowser") {
        refreshFileBrowser();
    }
}



async function initTabs() {
    var el = document.querySelector(".chrome-tabs");
    document.documentElement.classList.add("dark-theme");
    el.classList.add("chrome-tabs-dark-theme");

    chromeTabs.init(el);
    el.addEventListener("activeTabChange", (elm) => {
        if (elm.detail.tabEl === undefined) return;
        var id = elm.detail.tabEl.id;
        document.querySelectorAll(".editor-content-content").forEach((elmnt) => {
            elmnt.style.display = "none";
        });
        var tabEl = elm.detail.tabEl;
        var prop = JSON.parse(unescape(tabEl.getAttribute("data-properties-original")));
        var path = escape(prop.path);
        var data = openedTabs[prop.path];

        //  Disable all active toolbars
        for (var elm of document.querySelectorAll(".toolbar-group")) {
            elm.style.display = "none";
        }

        // Activate the correct editor if data exists
        if (data != undefined) {
            data.contentEl.style.display = "block";
            if (data.isEditor != undefined) {
                // If it is an editor, set the editor model
                monacoEditor.setModel(models.get(tabEl));
                monacoEditor.layout();
                // Enable the editor toolbar
                $("toolbar-editor").style.display = "block";
            }
        }
        // ipcRenderer.send('discord-activity-change', {
        //     details: `${project_info.bp_name}`,
        //     state: `${chromeTabs.activeTabEl.children[2].children[1].innerText}`,
        // })
    });

    el.addEventListener("tabRemove", async function (evt) {
        var elm = evt.detail.tabEl;
        var props = chromeTabs.getTabProperties(elm);
        var path = props.path; // Path is still on escaped format
        var tab = openedTabs[path];

        if ("isSaved" in tab && tab.isSaved == false) {
            var result = dialog.showMessageBoxSync(electron.getCurrentWindow(), {
                message: "File is not saved, would you like to save first?",
                buttons: ["Yes", "No", "Cancel"],
                type: "warning"
            });
            if (result == 0) {
                // YES
                await onMonacoSave();
                delete openedTabs[path];
                models.delete(elm);
                chromeTabs.removeTab(elm);
            } else if (result == 1) {
                // NO
                delete openedTabs[path];
                models.delete(elm);
                chromeTabs.removeTab(elm);
            } else if (result == 2) {
                // Cancel
            }

        } else {
            delete openedTabs[path];
            models.delete(elm);
            chromeTabs.removeTab(elm);
        }
        if (!chromeTabs.activeTabEl) {
            // Close all tabs
            document.querySelectorAll(".editor-content-content").forEach((elmnt) => {
                elmnt.style.display = "none";
            });

            //  Disable all active toolbars
            for (var elm of document.querySelectorAll(".toolbar-group")) {
                elm.style.display = "none";
            }

            //     ipcRenderer.send('discord-activity-change', {
            //         details: `${project_info.bp_name}`
            //     })
        }
    });
}

function initResizableSidePanel() {
    const Draggabilly = require("../src/lib/chrome-tabs-custom/node_modules/draggabilly");
    var elem = document.querySelector('.resizer-editor');
    var draggie = new Draggabilly(elem, {
        // options...
        axis: 'x'
    });

    draggie.on('dragMove', function (event, pointer, moveVector) {
        // Move a different variable
        if (pointer.pageX > 64) {
            if (pointer.pageX <= window.innerWidth - 64) {
                document.documentElement.style.setProperty("--var-sidepanel-width", (pointer.pageX - 32) + "px");
                document.documentElement.style.setProperty("--var-side-width", pointer.pageX + "px");
            }
        } else if (pointer.pageX < 64) {
            document.documentElement.style.setProperty("--var-sidepanel-width", "0px");
            document.documentElement.style.setProperty("--var-side-width", "32px");
        }
    });
    draggie.on('dragEnd', function (event, pointer, moveVector) {
        // Move a different variable
        if (pointer.pageX <= 64) {
            openSidePanel(-1, null);
        }
        if (pointer.pageX > window.innerWidth - 64) {
            document.querySelector('.resizer-editor').style.left = window.innerWidth - 64 + "px";
        }
    });
}

function openFileBrowser(id) {
    /**
     * Open a specific file browser tab
     */
    var cont = document.getElementById("filebrowserheader");
    for (var i = 0; i < cont.children.length; i++) {
        cont.children[i].classList.remove("selected");
    }

    var tabId = "";
    if (id == 0) tabId = "fbHeaderBP";
    if (id == 1) tabId = "fbHeaderRP";

    // if (id == 0 || id == 1) {
    //     // Detect for missing dependencies
    //     if (rp_path == "" || rp_path == null)
    //         rp_path = await packutil.lookForDependencies();
    // }

    if (id == 2) tabId = "fbHeaderDOC";

    var tab = document.getElementById(tabId);
    tab.classList.add("selected");

    openedFileBrowser = id;
    refreshFileBrowser();
}

function goInFolder(folderName) {
    if (openedFileBrowser == 0) bp_relativepath += folderName;
    if (openedFileBrowser == 1) rp_relativepath += folderName;
    refreshFileBrowser();
}
function goUpOneFolder() {
    var value = (openedFileBrowser == 0 ? bp_relativepath : rp_relativepath);
    var result = path.dirname(value);
    if (!result.endsWith(path.sep)) result += path.sep;
    if (openedFileBrowser == 0) {
        bp_relativepath = result;
    }
    if (openedFileBrowser == 1) {
        rp_relativepath = result;
    }
    refreshFileBrowser();
}

function openFile(p) {
    var filepath = (openedFileBrowser == 0 ? bp_path + bp_relativepath : rp_path + rp_relativepath) + p;

    // Convert the \ to / for OS compatibility
    filepath = filepath.replace(/\\/gi, "/");

    // Clean up multiple slashes
    filepath = filepath.replace(/\/+/gi, "/");

    if (escape(filepath) in openedTabs) {
        // Change the active tab instead when the tab is already opened
        // chromeTabs.activeTabEl = openedTabs[escape(filePath)].tabEl;
        return;
    }
    if (filepath.endsWith(".png")) {
        // Open the image editor
        let filename = path.parse(filepath).base;

        var elem = htmlToElem(`<div style="height:100%" class="editor-content-content"></div>`);

        var pixy = Pixy.createEditor(elem, filepath);

        // console.log(img.zoom);

        elem.appendChild(pixy.elm);
        document.getElementById("editor-content").appendChild(elem);

        // Add to the opened file tabs
        openedTabs[escape(filepath)] = { contentEl: elem };

        // Open a tab
        // Favicon path needs to remove quotation marks in order to work properly on some folder
        let tab = chromeTabs.addTab({
            title: filename,
            favicon: filepath.replace(/[\"\']/gi, "\\\'"),
            path: escape(filepath)
        });

    } else {
        // Open the text editor
        let source = fs.readFileSync(filepath).toString();

        let lang = null;
        if (filepath.endsWith(".json")) lang = "json";
        if (filepath.endsWith(".js")) lang = "javascript";
        if (filepath.endsWith(".html")) lang = "html";
        if (filepath.endsWith(".py")) lang = "python";
        if (filepath.endsWith(".css")) lang = "css";

        let model = monaco.editor.createModel(source, lang);


        monacoEditor.setModel(model);

        var elem = document.getElementById("myeditor");
        openedTabs[escape(filepath)] = {
            contentEl: elem,
            isEditor: true,
            isSaved: true
        };

        let filename = path.parse(filepath).base;
        let tab = chromeTabs.createNewTabEl();
        models.set(tab, model);
        chromeTabs.addTabEl(tab, {
            title: '<i class="fas fa-file-alt" style="font-size: 16px"></i>&nbsp;' + filename,
            path: escape(filepath)
        });


        // ----- Enabling Monaco Integrations with CoreCoder ------ //
        initMonacoModel(model, tab, filepath);
    }
    app.$data.noFileOpen = false;
}

/**
 * Init the monaco model with connections to CoreCoder events
 * @param {ITextModel} model The model to initialize
 * @param {Element} tabEl ChromeTabs element for this model
 */
function initMonacoModel(model, tabEl, filepath) {
    model.onDidChangeContent((e) => {
        chromeTabs.setUnsaved(tabEl);
        openedTabs[escape(filepath)].isSaved = false;
    });
}

/**
 * Event trigerred when user clicked save, use Ctrl+s or use Monaco's Command Pallete
 */
async function onMonacoSave() {
    var tab = chromeTabs.activeTabEl;
    var props = chromeTabs.getTabProperties(tab);
    var filepath = unescape(props.path);
    var model = models.get(tab);
    var content = model.getValue();
    try {
        await _fswrite(filepath, content);
        chromeTabs.setSaved(tab);
    } catch (err) {
        alert(err);
    }
}

function refreshFileBrowser() {
    try {
        if (typeof app === 'undefined') {
            return;
        }
    } catch (ReferenceError) {
        console.log(ReferenceError.message);
        return;
    }
    // Clear the filebrowser
    var cont = document.getElementById("filebrowsercontent");
    cont.innerHTML = "";
    // BP or RP
    if (openedFileBrowser == 0 || openedFileBrowser == 1) {
        var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
        if (browsePath == null || browsePath == path.sep) {
            cont.innerHTML = "Cannot detect pack of this type"; return;
        } // TODO::makes warn user that either BP or RP is not found
        browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;

        var files = fs.readdirSync(browsePath);
        files.sort(function (a, b) {
            return fs.statSync(browsePath + path.sep + b).isDirectory() -
                fs.statSync(browsePath + path.sep + a).isDirectory();
        });
        if ((openedFileBrowser == 0 && bp_relativepath !== path.sep && bp_relativepath !== "") || (openedFileBrowser == 1 && rp_relativepath !== path.sep && rp_relativepath !== "")) {
            // Go up one folder button

            var el = filebrowser.generateFileBrowserItemElm(
                "..",               // Title
                "",  // Path
                "",                   // Icon
                `goUpOneFolder();`,
                "",                     // Type
                true);    // isDirectory
            cont.appendChild(el);
            initFileBrowserItem(el);
        }

        for (var i in files) {
            var stat = fs.statSync(browsePath + path.sep + files[i]);
            var icon = "";

            if (files[i].endsWith(".png")) {
                icon = browsePath + path.sep + files[i];
            }
            var el = filebrowser.generateFileBrowserItemElm(
                files[i],               // Title
                browsePath + path.sep + files[i],  // Path
                icon,                   // Icon
                stat.isDirectory() ? `goInFolder('${files[i] + path.sep + path.sep}');` : `openFile('${files[i]}')`,
                "",                     // Type
                stat.isDirectory());    // isDirectory
            cont.appendChild(el);
            initFileBrowserItem(el);
        }
    }
}

function htmlToElem(html) {
    // HTML string to js dom element
    let temp = document.createElement('template');
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html;
    return temp.content.firstChild;
}

async function init() {
    initMonaco();
    initTabs();
    initResizableSidePanel();
    if (rp_path == null)
        rp_path = await packutil.lookForDependencies(bp_path, "resources");
    if (bp_path == null)
        bp_path = await packutil.lookForDependencies(rp_path, "data");


    initFileBrowserContextMenu();
}

/**
 * Initialize a filebrowser item with context menu functionalities
 * @param {Node} el The element
 */
function initFileBrowserItem(el) {
    el.addEventListener("auxclick", e => {
        if (e.which == 3) {
            showFileBrowserContextMenu(e);
        }
    });
}

function showFileBrowserContextMenu(e) {

    // NOTE IF YOU WANT TO CHANGE THE CONTEXT MENU CODE
    /**
     * The context menu code is supposed to be dynamic. As we are going to implement many types
     * of context menu for different types of editor.
     */
    // Right clicked

    // Remove all opened contextmenu
    for (var elm of $q(".contextmenu")) elm.remove();

    var contentElm = document.createElement("div");

    // -------------Create-------------
    // Create sub menus
    var createSubMenuEl = document.createElement("div");
    var menuFile = filebrowser.generateContextMenuElm("File", '<i class="fas fa-file-alt" style="position: absolute; left: 8px; margin-top: 4px"></i>',
        function (e) {
            // Create a new file
            var dlgContent = document.createElement("div");
            var label = document.createElement("a");
            label.innerText = "File name";
            var input = document.createElement("input");
            input.type = "text";

            dlgContent.appendChild(label);
            dlgContent.appendChild(input);

            Dialog.createDialog(
                "Create a new file",   // Dialog title
                dlgContent,            // Content element
                ["Create", "Cancel"],  // Dialog buttons
                function (dialogelm, id) { // Onclick handler
                    // When clicked a button
                    console.log(`Dialog clicked [${id}]`);
                });
        });
    var menuFolder = filebrowser.generateContextMenuElm("Folder", '<i class="fas fa-folder" style="position: absolute; left: 8px; margin-top: 4px"></i>');
    createSubMenuEl.appendChild(menuFile);
    createSubMenuEl.appendChild(menuFolder);

    // Create sub menu unhover
    var createSubMenuUnhover = function () {
        if (createSubMenuContext)
            createSubMenuContext.remove();
        createSubMenuContext = null;
    }
    var createSubMenuContext = null;


    var createMenu = filebrowser.generateContextMenuElm("Create", "", null, function (x, y) {
        // On Show children
        if (createSubMenuContext == null)
            createSubMenuContext = createContextMenu(x, y, createSubMenuEl);
    }, true);
    contentElm.appendChild(createMenu);
    // -------------Create End-------------

    // Rename
    contentElm.appendChild(filebrowser.generateContextMenuElm("Rename", "", null, (x, y) => createSubMenuUnhover()));

    // Delete
    contentElm.appendChild(filebrowser.generateContextMenuElm("Delete", "", null, (x, y) => createSubMenuUnhover()));

    // Show the context menu
    createContextMenu(e.clientX, e.clientY, contentElm);
}

/**
 * Initialize the file browser context menu system
 */
function initFileBrowserContextMenu() {
    document.addEventListener("click", (ev) => {
        // Remove all opened contextmenu
        for (var elm of $q(".contextmenu")) elm.remove();
    });

    $("filebrowsercontent").addEventListener("auxclick", ev => {
        if (ev.which == 3) {
            showFileBrowserContextMenu(ev);
        }
    });

}

function createContextMenu(x, y, contentElm) {
    var div = document.createElement('div')
    div.innerHTML = `<div class="contextmenu"></div>`;
    var elm = div.firstElementChild;

    elm.style.left = x + "px";
    elm.style.top = y + "px";
    try {
        var child = contentElm;
        elm.appendChild(child);
        document.body.appendChild(elm);
    } catch (e) { }

    return elm;
}