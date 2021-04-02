const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const { dialog } = require('electron').remote
const Projects = require('./js/projects')
const path = require("path");
const filebrowser = require("./js/filebrowser");
const fs = require("fs");
var browsePath = "/";
var comMojang = "";
var selected = undefined;
Vue.component('project', {
    props: ['project'],
    template: `
      <div class="project">
         <img style="float:left;" v-bind:src="project.iconPath" width="50" v-bind:style="{'filter': 'image-rendering: pixelated;'}">
         <h3>{{ project.name }}</h3>
         <label class="project-path">{{ project.uuid }}@{{ project.versionString }}</label><br>
      </div>
    `,
    created() {
        console.log(this.project)
    }
})

function init() {
    settings.GlobalSettings.lang = "cn";
    settings.localizeInterface();

    comMojang = window.localStorage.getItem("com_mojang");
    comMojang = comMojang.replace(/\\\\/gi, "\\").replace(/\\/gi, "/").replace(/\/\//gi, "/");
    var elm = document.getElementById("text-path");
    browsePath = comMojang.replace(/\\/gi, "/");
    elm.value = browsePath;
    refreshFileBrowser();

    // Path viewer
    var input = document.getElementById("text-path");
    var elm = document.getElementById("filebrowserpath");
    input.addEventListener("focusout", (ev) => {
        // when the input path is not focused
        onPathUnclicked();
    });

    // Input on enter
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            // Trigger the button element with a click
            browsePath = input.value;
            refreshFileBrowser();
            onPathUnclicked();
        }
    });
}

function refreshProjects() {
    /**
     * Get the list of the projects in com.mojang
     */
    let cont = document.getElementById("projectGrid");

}

function onOpenProjectPressed() {
    /**
     * Open a folder select dialog
     */

    //TODO: this should've been a custom dialog instead, that'll show pack's details
    const result = dialog.showOpenDialogSync({ properties: ['openDirectory', 'promptToCreate'], defaultPath: settings.comMojang });
    if (result === undefined) return; // user pressed cancel
    const path = result[0];

    if (path.includes("behavior_packs")) {
        // Add to the localStorage
        // if it is a behavior_packs
        window.localStorage.setItem("bp_path", path);
    } else if (path.includes("resource_packs")) {
        // Add to the localStorage
        // if it is a resource_packs
        window.localStorage.setItem("rp_path", path);
    } else {
        // TODO:: detect the pack by looking at it's JSON files manifest.json
    }


    window.location = "./editor.html";
}

let app = new Vue({
    el: '#app',
    data: {
        //TITLE BAR
        maximised: false,
        ipc: ipc,
        settings: settings,
        projects: []
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

        this.projects.push(Projects.projects)
    }
})





function refreshFileBrowser() {
    // Clear the filebrowser
    var cont = document.getElementById("filebrowsercontent");
    cont.innerHTML = "";
    var result = "";
    // BP or RP
    if (true) {
        // console.log(browsePath);
        if (browsePath == null) return; // TODO::makes warn user that either BP or RP is not found
        var files = fs.readdirSync(browsePath);
        files.sort(function (a, b) {
            var value = 0;
            try {
                value = fs.statSync(browsePath + path.sep + b).isDirectory() -
                    fs.statSync(browsePath + path.sep + a).isDirectory();
            } catch (e) {
                console.log(e);
            }
            return value;
        });
        if (path != "C://") {
            // Go up one folder button
            result += filebrowser.generateFileBrowserItem(
                "..",               // Title
                "",  // Path
                "",                   // Icon
                `goUpOneFolder();`,
                "",                     // Type
                true);    // isDirectory
        }

        for (var i in files) {
            var stat;
            try {
                stat = fs.statSync(browsePath + path.sep + files[i]);
            } catch (e) {
                console.log(e);
                continue;
            }
            var icon = "";
            if (stat.isDirectory()) {
                if (fs.existsSync(browsePath + path.sep + files[i] + "/pack_icon.png")) {
                    icon = browsePath + path.sep + files[i] + "/pack_icon.png";
                }
            }
            if (files[i].endsWith(".png")) {
                icon = browsePath + path.sep + files[i];
            }
            result += filebrowser.generateFileBrowserItem(
                files[i],               // Title
                browsePath + path.sep + files[i],  // Path
                icon,                   // Icon
                stat.isDirectory() ? `goInFolder('${files[i] + path.sep + path.sep}');` : `openFile('${files[i]}')`,
                "",                     // Type
                stat.isDirectory());    // isDirectory
        }
        cont.innerHTML = result;
    }
    browsePath = browsePath.replace(/\\\\/gi, "\\").replace(/\\/gi, "/").replace(/\/\//gi, "/");
    // Update the path input text
    document.getElementById("text-path").value = browsePath;
    refreshPathVisualizer();
}

function goInFolder(folderName) {
    if(fs.existsSync(browsePath + path.sep + folderName + path.sep + "manifest.json")){
        // It's a pack! Parse it
        selected = browsePath + path.sep + folderName + path.sep;
        onOpenProject();
    }else{
        browsePath += path.sep + folderName
        refreshFileBrowser();
    }
}
function goUpOneFolder() {
    var value = browsePath;
    var result = path.dirname(value);
    if (!result.endsWith(path.sep)) result += path.sep;
    browsePath = result;
    refreshFileBrowser();
}

// When the path visualizer is clicked (not the input)
function onPathClicked() {
    var input = document.getElementById("text-path");
    var elm = document.getElementById("filebrowserpath");
    input.classList.remove("invisible");
    elm.classList.add("invisible");
    input.focus();
    input.select();
}

function onPathUnclicked() {
    var input = document.getElementById("text-path");
    var elm = document.getElementById("filebrowserpath");
    elm.classList.remove("invisible");
    input.classList.add("invisible");
    refreshPathVisualizer();
}

function refreshPathVisualizer() {
    var elm = document.getElementById("filebrowserpath");
    elm.innerHTML = '';
    var path = browsePath;
    var currentPath = "";

    if (browsePath.startsWith(comMojang)) {
        path = browsePath.replace(comMojang, "");
        currentPath += comMojang;
        elm.innerHTML += `<div class="filebrowserpathitem" onclick="onPathItemClicked(event, '${comMojang}'); return false;">com.mojang</div>`
        if (browsePath != comMojang)
            elm.innerHTML += `<div class="filebrowserpathitemsep"> > </div>`
    }
    var words = path.split("/");

    for (var i in words) {
        //TODO: implement for linux and MacOS
        currentPath += words[i] + "/";
        if (words[i] == "") continue;
        elm.innerHTML += `<div class="filebrowserpathitem" onclick="onPathItemClicked(event, '${currentPath}'); return false;">${words[i]}</div>`

        if (i == words.length - 2) continue;
        elm.innerHTML += `<div class="filebrowserpathitemsep"> > </div>`
    }
}

function onPathItemClicked(e, path) {
    // Prevent element below's onclick
    e.stopPropagation();

    // Go into the path specified
    browsePath = path;
    refreshFileBrowser();
}

function openFile(path) {
    //TODO: Implement selecting .mcpack and installing it from here
}

function onHomeClicked() {
    // Set filebrowser's path to com.mojang
    browsePath = comMojang;
    refreshFileBrowser();
}

function onOpenProject() {
    /**
     * Open a folder select dialog
     */

    //TODO: this should've been a custom dialog instead, that'll show pack's details
    // TODO: auto detect pack dependencies
    if (selected === undefined) return; // user pressed cancel

    if (selected.includes("behavior_packs")) {
        // Add to the localStorage
        // if it is a behavior_packs
        window.localStorage.setItem("bp_path", selected);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("rp_path");
    } else if (selected.includes("resource_packs")) {
        // Add to the localStorage
        // if it is a resource_packs
        window.localStorage.setItem("rp_path", selected);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("bp_path");
    } else {
        // TODO:: detect the pack by looking at it's JSON files manifest.json
    }

    window.location = "./editor.html";

}
init();