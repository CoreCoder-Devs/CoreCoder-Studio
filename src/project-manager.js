const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const { dialog } = require('electron').remote
const Projects = require('./js/projects')
const imagesize = require('image-size')

Vue.component('project', {
    /**
     * Summary:
     * This component inherits template from a string, 
     * the onclick function is running the "openRecentProject" function
     * the argument is the 'project' as [object Object]
     * containing name, path and uuid
     */
    props: ['project'],
    template: `
      <div class="project" 
        :data-project="JSON.stringify(project)" 
        :onclick="'openRecentProject( JSON.parse( this.getAttribute(\\\'data-project\\\')) )'" 
        :oncontextmenu="'removeRecentProject( JSON.parse( this.getAttribute(\\\'data-project\\\')), this )'"
      >
         <img style="float:left;image-rendering: pixelated; margin-right:16px;" v-bind:src="project.iconPath" width="50" v-bind:style="{'filter': 'image-rendering: pixelated;'}">
         <h3>{{ project.name }}</h3>
         <label class="project-path">{{ project.uuid }}@{{ project.versionString }}</label><br>
      </div>
    `,

    data: function () {
        return {
            filter: true
        }
    },
    methods: {
        openRecentProject: function (evnt) {
            console.log(evnt);
        }
    },

    created() {
        if (this.project.iconPath) {
            try {
                const size = imagesize(this.project.iconPath)
                if (size.width > 128 || size.height > 128) {
                    this.filter = false
                    //TODO doesnt correctly add filters
                }
            } catch (e) {
                console.log(e)
            }
        }
    }
})

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
    const result = dialog.showOpenDialogSync({ properties: ['openDirectory', 'promptToCreate'], defaultPath: settings.comMojang });
    if (result === undefined) return; // user pressed cancel
    const path = result[0];

    if (path.includes("behavior_packs")) {
        // Add to the localStorage
        // if it is a behavior_packs
        window.localStorage.setItem("bp_path", path);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("rp_path");
    } else if (path.includes("resource_packs")) {
        // Add to the localStorage
        // if it is a resource_packs
        window.localStorage.setItem("rp_path", path);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("bp_path");
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
    methods: {
        openRecentProject(event) {
            if (event.which === 3) {
                console.log("Right mouse down");
            }
        },
        removeRecentProject(event) {
            if (event.which === 3) {
                console.log("Right mouse up");
            }
        }
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

function openRecentProject(project) {
    /**
     * Project : {name,uuid,path}
     */
    let path = project.path;
    let ver = project.version;

    if (path.includes("behavior_packs")) {
        // Add to the localStorage
        // if it is a behavior_packs
        window.localStorage.setItem("bp_path", path);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("rp_path");
    } else if (path.includes("resource_packs")) {
        // Add to the localStorage
        // if it is a resource_packs
        window.localStorage.setItem("rp_path", path);
        // TODO:Auto detect pack dependencies
        window.localStorage.removeItem("bp_path");
    } else {
        // TODO:: detect the pack by looking at it's JSON files manifest.json
    }

    // Move the project to the very top
    Projects.remove(project);
    Projects.add(project);
    Projects.save();

    window.location = "./editor.html";
}

function removeRecentProject(project,elm) {
    /**
     * Remove recently opened project from the list
     */
    Projects.remove(project);
    elm.outerHTML = "";
}