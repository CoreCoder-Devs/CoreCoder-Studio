const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const { dialog } = require('electron').remote
function init() {
    settings.GlobalSettings.lang = "cn";
    settings.localizeInterface();
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
    var result = dialog.showOpenDialogSync({ properties: ['openDirectory', 'promptToCreate'], defaultPath: settings.comMojang });
    if (result == undefined) return; // user pressed cancel
    var path = result[0];

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

var app = new Vue({
    el: '#app',
    data: {
        //TITLE BAR
        maximised: false,
        ipc: ipc,
        settings: settings
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
})