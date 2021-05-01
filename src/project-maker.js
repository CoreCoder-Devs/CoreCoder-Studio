const electron = require("electron");
const ipc = electron.ipcRenderer;
const { settings } = require("./js/global_settings");
const { dialog } = require('electron').remote
const Projects = require('./js/projects')
const uuid = require('uuid');
const fs = require("fs");
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

var packType = "addons";
function onPackTypeChange(elm, value) {
    //TODO: if you ever add translations, make sure to change this too
    switch (value) {
        case "Addons (Behavior and Resource)":
            packType = "addons";
            break;
        case "Behavior Pack":
            packType = "data";
            break;
        case "Resource Pack":
            packType = "resources";
            break;
    }
}

const $ = (id) => document.getElementById(id);
const comMojang = localStorage.getItem("com_mojang");
function createProject() {
    var name = $("packname").value.replace(/[\/\\\*\:\?\|]]/gi, "");
    var desc = $("packdesc").value;
    var auth = $("packauth").value;
    var type = packType;
    var path = comMojang;

    if (name == "") name = "My Pack";
    if (desc == "") desc = "Created using CoreCoder";
    if (auth == "") auth = "";

    var rpUUID = uuid.v4();

    localStorage.removeItem("bp_path");
    localStorage.removeItem("rp_path");
    var recentProjectPath = "";

    if (type == "addons" || type == "resources") {
        let pack_path = path + "/development_resource_packs/" + name;
        if (createPack(pack_path, desc, name, rpUUID, "resources", null)) {
            // Succesfully created the BP
            localStorage.setItem("bp_path", pack_path);
            recentProjectPath = pack_path;
        }
    }
    if (type == "addons" || type == "data") {
        let pack_path = path + "/development_behavior_packs/" + name;
        if (createPack(pack_path, desc, name, uuid.v4(), "data", rpUUID)) {
            // Succesfully created the RP
            localStorage.setItem("rp_path", pack_path);

            // If we're just creating resource, put this resource in recent list
            if (recentProjectPath == "")
                recentProjectPath = pack_path;
        }
    }

    if (recentProjectPath != "")
        Projects.add({
            path : recentProjectPath
        });

    // Move to the editor automatically
    window.location = "./editor.html";
}

/**
 * 
 * @param {String} path The absolute path to the pack location
 * @param {String} name Pack name, never empty
 * @param {String} pack_uuid Pack UUID
 * @param {String} type Pack type "addons" | "data" | "resource"
 */
function createPack(path, desc, name, pack_uuid, type, dependency_uuid) {
    // Actually create the pack files
    if (fs.existsSync(path)) return false;

    // Create the folder
    fs.mkdirSync(path);

    // Create manifest
    let manifest = {
        "format_version": 2,
        "header": {
            "description": desc,
            "name": name,
            "uuid": pack_uuid,
            "version": [0, 0, 1],
            "min_engine_version": [1, 13, 0]
        },
        "modules": [
            {
                "description": desc,
                "type": type,
                "uuid": uuid.v4(),
                "version": [0, 0, 1]
            }
        ],
        "dependencies": [
            {
                "uuid": dependency_uuid,
                "version": [0, 0, 1]
            }
        ]
    };

    if (dependency_uuid == null) {
        delete manifest.dependencies;
    }
    fs.writeFileSync(path + "/manifest.json", JSON.stringify(manifest, null, 4));

    // Create pack_icon.png
    let file = fs.readFileSync("src/resources/icon.png");
    fs.writeFileSync(path + "/pack_icon.png", file);

    return true;
}