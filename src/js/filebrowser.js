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
        var style = "";

        // If filename starts with dot, make it transparent
        if (name.startsWith(".")) {
            style = `style="opacity:50%;"`
        }

        if (isDirectory) {
            // Add the folder icon
            if (icon == "") {
                title += `<i class="fas fa-folder"></i>&nbsp;`
            } else {
                title += `<i class="fas fa-folder fb-small-badge"></i>&nbsp;`
            }
        }
        else if (icon == "") {
            // Add the file icon
            if (name.endsWith(".json") || name.endsWith(".js")) title += `<i class="fas fa-file-alt"></i>&nbsp;`
            else if (name.endsWith(".png")) title += `<i class="fas fa-image"></i>&nbsp;`
            else title += `<i class="fas fa-file"></i>&nbsp;`
        } else {
            // Add a space
            title += "&nbsp;";
        }
        title += name;
        return `<div data-path="${path}" onclick="${onclick}" class="filebrowseritem" ${style}>
                    `+ ((icon !== "") ? `<img class="filebrowseritem-icon" src="${icon}">` : ``) + `${title}
                </div>`;
    },

    generateFileBrowserItemElm: function (name, path, icon, onclick, type, isDirectory) {
        const div = document.createElement('div')
        div.innerHTML = this.generateFileBrowserItem(name, path, icon, onclick, type, isDirectory);
        return div.firstElementChild;
    },

    /**
     * Generate a context menu for the filebrowser
     * @param {String} title Context title
     * @param {String} iconHTML HTML string for the icon element
     * @param {String} onclick a string to execute
     * @param {function} onhover when mouse over
     * @returns Node
     */
    generateContextMenuElm: function (title, iconHTML = "", onclick = function(e){}, onhover = function (x, y) { }, isgroup = false) {
        const div = document.createElement('div')
        div.innerHTML = `<div class="contextitem ${isgroup?"contextgroup":""}">
            ${iconHTML}
            <a>${title}</a>
        </div>`;

        var elm = div.firstElementChild;
        elm.addEventListener("mouseover", e => {
            // Mouse Hovered
            if(elm.classList.contains("active") == false){
                var rect = elm.getBoundingClientRect();
                onhover(rect.right, rect.top - 4);
                elm.classList.add("active")
            }
        });
        elm.addEventListener("mouseout", e => {
            // Mouse Leave
            if(elm.classList.contains("active")){
                elm.classList.remove("active");
            }
        });
        elm.addEventListener("click", e => { if(onclick)onclick(e); });
        return elm;
    }

};