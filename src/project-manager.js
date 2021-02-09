const electron = require("electron");
const ipc = electron.ipcRenderer;
const {settings} = require("./js/global_settings");
const { dialog } = require('electron').remote
function init(){
    settings.GlobalSettings.lang = "cn";
    settings.localizeInterface();
}

function refreshProjects(){
    /**
     * Get the list of the projects in com.mojang
     */
    let cont = document.getElementById("projectGrid");

}

function onOpenProjectPressed(){
    /**
     * Open a folder select dialog
     */
    var result = dialog.showOpenDialogSync({ properties: ['openDirectory','promptToCreate'], defaultPath: settings.comMojang });
    if(result == undefined) return; // user pressed cancel

    var path = result[0];

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
        ipc.on("windowStateMaximized", (event,args)=>{
            vm.maximised = true
        });
        ipc.on("windowStateRestored", (event,args)=>{
            vm.maximised = false
        });
    }
  })