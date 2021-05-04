/**
 * Filebrowser API
 * generates HTML string/elements from a folder, output asynchronously
 * written by: Hanprogramer
 */
const fs = require("fs");
const node_path = require('path')
module.exports = {

    itemComponent: {
        /**
         * dir.path - path for the directory
         * dir.icon OPTIONAL - path for the folder icon
         * dir.onclick - executed on clicking the function
         * dir.isfolder OPTIONAL - whether dir is a folder or not
         * dir.name OPTIONAL - display name
         */
        props: [ 'dir' ],
        template: `
            <div :data-path="dir.path" v-on:click="onclick()" class="filebrowseritem">
                <i class="fas" :class="icon"></i>
                <img v-if="dir.icon" class="filebrowseritem-icon" :src="dir.icon">
                &nbsp; {{ name }}
            </div>
            `,
        data: {
            name: '',
            type: '',
            icon: 'fa-file'
        },
        
        mounted() {
            if(this.dir.path) {
                this.name = node_path.basename(this.dir.path)
    
                if(!this.dir.isfolder) this.dir.isfolder = fs.lstatSync(dir.path).isDirectory()
    
                if(!this.isDirectory) {
                    this.type = this.name.split('.')[this.name.split('.').length-1]
                } else this.type = 'folder'
    
                switch(this.type) {
                    case 'json':
                        this.icon = 'fa-file-alt'
                        break;
                        case 'mcfunction':
                            this.icon = 'fa-scroll'
                            break;
                        default:
                            this.icon = 'fa-folder'
                }
            }
            else {
                this.name = this.dir.name
                this.icon = 'fa-folder'
            }
        },

        methods: {
            onclick() {
                this.dir.onclick()
            }
        }
    },
    
    generateFileBrowserItem: function (name, path, icon, onclick, type, isDirectory) {
        /** generateFileBrowserItem
         * Generates HTML string for the item
         * @param {string} name - the name that will be shown
         * @param {string} path - absolute path to the file
         * @param {string} icon - path to the icon
         * @param {function} onclick - onclick callback
         * @param {string} type - type of the item
         * @param {bool} isDirectory - is directory?
         */
        var title = "";
        if(isDirectory){
            // Add the folder icon
            if(icon == ""){
                title += `<i class="fas fa-folder"></i>&nbsp;`
            }else{
                title += `<i class="fas fa-folder fb-small-badge"></i>&nbsp;`
            }
        }
        else if(icon == ""){
            // Add the file icon
            if(name.endsWith(".json")) title += `<i class="fas fa-file-alt"></i>&nbsp;`
            else if(name.endsWith(".png")) title += `<i class="fas fa-image"></i>&nbsp;`
            else title += `<i class="fas fa-file"></i>&nbsp;`
        }else{
            // Add a space
            title += "&nbsp;";
        }
        title += name;
        return `<div data-path="${path}" onclick="${onclick}" class="filebrowseritem">
                    `+((icon !== "")?`<img class="filebrowseritem-icon" src="${icon}">`:``)+`${title}
                </div>`;
    }
};