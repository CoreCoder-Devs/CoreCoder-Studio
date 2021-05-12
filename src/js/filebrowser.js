/**
 * Filebrowser API
 * generates HTML string/elements from a folder, output asynchronously
 * written by: Hanprogramer
 */
const fs = require("fs");
module.exports = {
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