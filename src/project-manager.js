const electron = require("electron");
const ipc = electron.ipcRenderer;
const {settings} = require("./js/global_settings");

function initTitleBar(){
    /// TITLE BAR
    /// Initialize the titlebar's click function
    
    let minimizeBtn = document.getElementById("tbBtnMin");
    let maximizeBtn = document.getElementById("tbBtnMax");
    let closeBtn = document.getElementById("tbBtnCls");

    minimizeBtn.addEventListener("click", ()=>{
        // Minimize
        ipc.send("minimize");
    });
    maximizeBtn.addEventListener("click", ()=>{
        if(maximizeBtn.classList.contains("maximizebtn")){
            // Minimize
            ipc.send("maximize");
        }
        else if(maximizeBtn.classList.contains("restorebtn")){
            // Restore
            ipc.send("restore");
        }
    });
    closeBtn.addEventListener("click", ()=>{
        // Minimize
        ipc.send("close");
    });

    // Listens for windows event
    ipc.on("windowStateMaximized", (event,args)=>{
        let maximizeBtn = document.getElementById("tbBtnMax");
        maximizeBtn.classList.remove("maximizebtn");
        maximizeBtn.classList.add("restorebtn");
    });
    ipc.on("windowStateRestored", (event,args)=>{
        let maximizeBtn = document.getElementById("tbBtnMax");
        maximizeBtn.classList.add("maximizebtn");
        maximizeBtn.classList.remove("restorebtn");
    });
}

function init(){
    initTitleBar();
    settings.GlobalSettings.lang = "cn";
    settings.localizeInterface();
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