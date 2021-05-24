const electron = require("electron").remote;
const { dialog,BrowserView } = require('electron').remote;
const ipc = require("electron").ipcRenderer;
const { settings } = require("./js/global_settings");
const fs = require("fs");
const filebrowser = require("./js/filebrowser");
const path = require("path");
const packutil = require("./js/packutil");
const ChromeTabs = require("../src/lib/chrome-tabs-custom");
const chromeTabs = new ChromeTabs();
const util = require("util");
const open = require("open") // Cross platform open a file

const Pixy = require("../src/lib/pixydust/pixydust");
const Dialog = require("../src/js/dialog");
const editorDialogs = require("./editorDialogs");

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
 * value: MonacoModel or Pixy instance */
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
        if (data) {
            data.contentEl.style.display = "block";
            if (data.isEditor && data.isEditor == "monaco") {
                // If it is an editor, set the editor model
                monacoEditor.setModel(models.get(tabEl));
                monacoEditor.layout();
                // Enable the editor toolbar
                $("toolbar-monaco").style.display = "block";
            } else if (data.isEditor && data.isEditor == "pixy") {
                // Pixydust editor
                // Enable the Pixydust toolbar
                $("toolbar-pixy").style.display = "block";
            } else if (data.isEditor && data.isEditor == "preview-html") {
                // Pixydust editor
                // Enable the Pixydust toolbar
                $("toolbar-html").style.display = "block";
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
                if (tab.isEditor == 'monaco')
                    await onMonacoSave();
                else if (tab.isEditor == 'pixy')
                    await onPixyDustSave();
                else
                    console.log(tab.isEditor);

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

            app.$data.noFileOpen = true;
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
    folderName = folderName.replace(/\\+/gi, '/');
    folderName = folderName.replace(/\/+/gi, '/');
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

function openFile(p, absolute=false) {
    var filepath = (openedFileBrowser == 0 ? bp_path + bp_relativepath : rp_path + rp_relativepath) + p;
    if(absolute)
        filepath = p;

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
        openedTabs[escape(filepath)] = { contentEl: elem, isEditor: 'pixy' };

        // Open a tab
        // Favicon path needs to remove quotation marks in order to work properly on some folder
        let tab = chromeTabs.addTab({
            title: filename,
            favicon: filepath.replace(/[\"\']/gi, "\\\'"),
            path: escape(filepath)
        });
        models.set(tab, pixy);
        pixy.addEventListener("edit", (arg) => {
            // When content changed
            chromeTabs.setUnsaved(tab);
            openedTabs[escape(filepath)].isSaved = false;
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
            isEditor: 'monaco',
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
 * Like open file, but for previewer
 * @param {String} p path
 */
function openPreviewer(p) {
    // var filepath = (openedFileBrowser == 0 ? bp_path + bp_relativepath : rp_path + rp_relativepath) + p;

    // Convert the \ to / for OS compatibility
    // filepath = filepath.replace(/\\/gi, "/");

    // Clean up multiple slashes
    // filepath = filepath.replace(/\/+/gi, "/");
    var filepath = p;

    if (escape(filepath) in openedTabs) {
        // Change the active tab instead when the tab is already opened
        // chromeTabs.activeTabEl = openedTabs[escape(filePath)].tabEl;
        return;
    }
    if (filepath.endsWith(".html")) {
        // Open the image editor
        let filename = path.parse(filepath).base;

        var elem = htmlToElem(`<div style="height:100%" class="editor-content-content"></div>`);

        var webview = document.createElement("webview");
        webview.style.cssText = `
        height:480px; 
        width :640px; 
        background-color: white;
        display: inline-flex;`
        // webview.setAttribute("src", `http://www.google.com`);
        webview.src = `file:///${filepath}`;
        // webview.setBounds({ x: 0, y: 0, width: 300, height: 300 })
        // webview.webContents.loadURL('https://electronjs.org')

        console.log(webview);

        elem.appendChild(webview);
        document.getElementById("editor-content").appendChild(elem);

        // Add to the opened file tabs
        openedTabs[escape(filepath)] = { contentEl: elem, isEditor: 'preview-html' };

        // Open a tab
        // Favicon path needs to remove quotation marks in order to work properly on some folder
        let tab = chromeTabs.addTab({
            title: '<i class="fas fa-globe" style="font-size: 16px"></i>&nbsp;' + filename,
            path: escape(filepath)
        });
        // models.set(tab, pixy);
        // pixy.addEventListener("edit", (arg) => {
        //     // When content changed
        //     chromeTabs.setUnsaved(tab);
        //     openedTabs[escape(filepath)].isSaved = false;
        // });

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

        // Set the saved state in editor
        openedTabs[escape(filepath)]["isSaved"] = true;
    } catch (err) {
        var elm = document.createElement("a");
        elm.innerText = String(err);
        Dialog.createDialog("Error", elm);
    }
}

/**
 * Refresh the currently opened HTML Previewer
 */
function onHTMLPreviewRefresh(){
    var tab = chromeTabs.activeTabEl;
    var props = chromeTabs.getTabProperties(tab);
    var filepath = unescape(props.path);
    var tabData = openedTabs[escape(filepath)];

    try {
        var webview = tabData.contentEl.firstElementChild;
        webview.reload();
    } catch (err) {
        console.log(err);
        var elm = document.createElement("a");
        elm.innerText = String(err);
        Dialog.createDialog("Error", elm);
    }
}

/**
 * Event trigerred when user clicked save, on the Pixydust editor
 */
async function onPixyDustSave() {
    var tab = chromeTabs.activeTabEl;
    var props = chromeTabs.getTabProperties(tab);
    var filepath = unescape(props.path);
    var model = models.get(tab);
    var content = await model.getImageContent();
    try {
        // await _fswrite(filepath, content);
        var buffer = Buffer.from(await content.arrayBuffer());
        await _fswrite(filepath, buffer, () => console.log('image saved!'));

        // Set the saved state in editor
        openedTabs[escape(filepath)]["isSaved"] = true;
        chromeTabs.setSaved(tab);
        refreshFileBrowser();
    } catch (err) {
        console.log(err);
        var elm = document.createElement("a");
        elm.innerText = String(err);
        Dialog.createDialog("Error", elm);
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
                path.dirname(browsePath),  // Path
                "",                   // Icon
                `goUpOneFolder();`,
                "",                     // Type
                true);    // isDirectory
            cont.appendChild(el);
            initFileBrowserItem(el, browsePath + path.sep + files[i]);
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
            initFileBrowserItem(el, browsePath + path.sep + files[i]);
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
function initFileBrowserItem(el, filepath) {
    el.addEventListener("auxclick", e => {
        if (e.which == 3 && e.target == el) {
            showFileBrowserContextMenu(e, filepath);
        }
    });
}

function showFileBrowserContextMenu(e, filepath = "") {
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
    var menuFile = filebrowser.generateContextMenuElm("File", '<i class="fas fa-file-alt" style="position: absolute; left: 7px; margin-top: 7px"></i>', () => editorDialogs.showCreateNewFileDialog());
    var menuImage = filebrowser.generateContextMenuElm("Image", '<i class="fas fa-image" style="position: absolute; left: 7px; margin-top: 7px"></i>', () => editorDialogs.showCreateNewImageDialog());
    var menuFolder = filebrowser.generateContextMenuElm("Folder", '<i class="fas fa-folder" style="position: absolute; left: 7px; margin-top:7px"></i>', () => editorDialogs.showCreateNewFolderDialog());

    // Minecraft content creator
    var menuItem   = filebrowser.generateContextMenuElm("Item", '<img src="./resources/images/folder/item.png"     style="width: 16px; height: 16px; object-fit: scale-down; position: absolute; left: 7px; margin-top:7px"></img>', () => editorDialogs.showCreateNewItemDialog());
    var menuBlock  = filebrowser.generateContextMenuElm("Block", '<img src="./resources/images/folder/blocks.png"  style="width: 16px; height: 16px; object-fit: scale-down; position: absolute; left: 7px; margin-top:7px"></img>', () => editorDialogs.showCreateNewFolderDialog());
    var menuEntity = filebrowser.generateContextMenuElm("Entity", '<img src="./resources/images/folder/entity.png" style="width: 16px; height: 16px; object-fit: scale-down; position: absolute; left: 7px; margin-top:7px"></img>', () => editorDialogs.showCreateNewFolderDialog());
    createSubMenuEl.appendChild(menuFile);
    createSubMenuEl.appendChild(menuFolder);
    createSubMenuEl.appendChild(menuImage);

    let divider = document.createElement("div");
    divider.classList.add("contextdivider");

    createSubMenuEl.appendChild(divider);
    createSubMenuEl.appendChild(menuItem);
    createSubMenuEl.appendChild(menuBlock);
    createSubMenuEl.appendChild(menuEntity);


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

    if (filepath != "") {
        // Show in explorer
        contentElm.appendChild(filebrowser.generateContextMenuElm("Show in explorer", '<i class="fas fa-folder-open"  style="position: absolute; left: 7px; margin-top: 7px"></i>', (clickev) => {
            var stat = fs.statSync(filepath);
            if (stat.isDirectory()) {
                // Open the folder
                open(filepath);
            }
            else {
                // Open the folder containing the file
                open(path.dirname(filepath));
            }
        }, (x, y) => createSubMenuUnhover()));

        // Open HTML preview
        if (filepath.endsWith(".html"))
            contentElm.appendChild(filebrowser.generateContextMenuElm("Open HTML preview", '<i class="fas fa-globe"  style="position: absolute; left: 7px; margin-top: 7px"></i>', (clickev) => {
                openPreviewer(filepath);
            }, (x, y) => createSubMenuUnhover()));

        // Rename
        contentElm.appendChild(filebrowser.generateContextMenuElm("Rename", "", (clickev) => {
            editorDialogs.showRenameDialog(filepath, path.basename(filepath));
        }, (x, y) => createSubMenuUnhover()));

        // Delete
        contentElm.appendChild(filebrowser.generateContextMenuElm("Delete", '<i class="fas fa-trash"  style="position: absolute; left: 7px; margin-top: 7px"></i>', (clickev) => {
            editorDialogs.showDeleteFileDialog(filepath, path.basename(filepath))
        }, (x, y) => createSubMenuUnhover()));
    } else {

        // Show in explorer
        contentElm.appendChild(filebrowser.generateContextMenuElm("Show in explorer", '<i class="fas fa-folder-open"  style="position: absolute; left: 7px; margin-top: 7px"></i>', (clickev) => {
            var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
            if (browsePath == null || browsePath == path.sep) {
                // cont.innerHTML = "Cannot detect pack of this type"; return;
                return;
            } // TODO::makes warn user that either BP or RP is not found
            browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;

            open(browsePath);
        }, (x, y) => createSubMenuUnhover()));
    }
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
        if (ev.which == 3 && ev.target == $("filebrowsercontent")) {
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