const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const { dialog } = require('electron').remote
const Projects = require('./js/projects')

Vue.component('project', {
    props: ['project'],
    created() {
    }
})


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