/**
 * Filebrowser API
 * generates HTML string/elements from a folder, output asynchronously
 * written by: Hanprogramer
 */

 module.exports = {
    generateFileBrowserItem : function(name, path, icon, onclick, type){
        /** generateFileBrowserItem
         * Generates HTML string for the item
         * @param {string} name - the name that will be shown
         * @param {string} path - absolute path to the file
         * @param {string} icon - path to the icon
         * @param {function} onclick - onclick callback
         * @type {string} type - type of the item
         */
        return `<div data-path="${path}" onclick="${onclick}();" class="filebrowseritem">
                    <img class="filebrowseritem-icon" src="${icon}">${name}
                </div>`;
    }
 };