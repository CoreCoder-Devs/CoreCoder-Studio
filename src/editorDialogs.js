/**
 * All the dialogs used in editor.js
 * warning: is not sandboxed, cannot be used outside this program
 */
const fs = require("fs");
const { createDialog } = require("./js/dialog");
const Pixy = require("./lib/pixydust/pixydust")
function showCreateNewFileDialog() {
    // Create a new file
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    var label = document.createElement("a");
    label.innerText = "File name";
    var input = document.createElement("input");
    input.type = "text";
    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "";
    alertIndicator.style.color = "red";

    dlgContent.appendChild(label);
    dlgContent.appendChild(input);
    dlgContent.appendChild(alertIndicator);

    var dlg = Dialog.createDialog(
        "Create a new file",   // Dialog title
        dlgContent,            // Content element
        ["Create", "Cancel"],  // Dialog buttons
        function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                let filename = input.value;
                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                if (filename == "") {
                    alertIndicator.innerText = "Filename can't be empty";
                }
                else if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
                    // Alert errror
                    alertIndicator.innerText = "Filename contains illegal character";
                }
                else if (fs.existsSync(browsePath + path.sep + filename)) {
                    alertIndicator.innerText = "Filename already exists\n" + browsePath + path.sep + filename;
                } else {
                    alertIndicator.innerText = "";
                    fs.writeFileSync(browsePath + path.sep + filename, "");

                    refreshFileBrowser();
                    openFile(filename);
                    dlg.remove();
                }
            }
        });
    // Focus on the input automatically
    input.focus();

    // Enable the press enter to proceed
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}

function showCreateNewFolderDialog() {
    // Create a new file
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    var label = document.createElement("a");
    label.innerText = "File name";
    var input = document.createElement("input");
    input.type = "text";
    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "";
    alertIndicator.style.color = "red";

    dlgContent.appendChild(label);
    dlgContent.appendChild(input);
    dlgContent.appendChild(alertIndicator);

    var dlg = Dialog.createDialog(
        "Create new folder",   // Dialog title
        dlgContent,            // Content element
        ["Create", "Cancel"],  // Dialog buttons
        function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                let filename = input.value;
                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
                    // Alert errror
                    alertIndicator.innerText = "Filename contains illegal character";
                }
                else if (fs.existsSync(browsePath + path.sep + filename)) {
                    alertIndicator.innerText = "Filename already exists";
                } else {
                    alertIndicator.innerText = "";
                    fs.mkdirSync(browsePath + path.sep + filename);

                    refreshFileBrowser();
                    dlg.remove();
                }
            }
        });
    // Focus on the input automatically
    input.focus();

    // Enable the press enter to proceed
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}


function showDeleteFileDialog(filepath, filename) {
    // Create a new file
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    var label = document.createElement("a");
    label.innerText = "Are you sure you want to delete " + filename + "?";
    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "This cannot be undone";
    alertIndicator.style.color = "red";

    dlgContent.appendChild(label);
    dlgContent.appendChild(alertIndicator);

    var dlg = Dialog.createDialog(
        "Delete file",   // Dialog title
        dlgContent,            // Content element
        ["Delete", "Cancel"],  // Dialog buttons
        function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                let filepath = browsePath + path.sep + filename;
                var stat = fs.statSync(filepath);
                if (stat.isDirectory())
                    fs.rmdirSync(filepath, { recursive: true });
                else
                    fs.unlinkSync(filepath);

                refreshFileBrowser();
                dlg.remove();
            }
        });

    // Enable the press enter to proceed
    window.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}


function showRenameDialog(filepath, filename) {
    // Create a new file
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    var label = document.createElement("a");
    label.innerText = "New name";
    var input = document.createElement("input");
    input.type = "text";
    input.value = filename;
    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "";
    alertIndicator.style.color = "red";

    dlgContent.appendChild(label);
    dlgContent.appendChild(input);
    dlgContent.appendChild(alertIndicator);

    var dlg = Dialog.createDialog(
        "Rename " + filename,   // Dialog title
        dlgContent,            // Content element
        ["Rename", "Cancel"],  // Dialog buttons
        function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                if (filename == "") {
                    alertIndicator.innerText = "Filename can't be empty";
                }
                else if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
                    // Alert errror
                    alertIndicator.innerText = "Filename contains illegal character";
                }
                else if (fs.existsSync(browsePath + path.sep + input.value)) {
                    alertIndicator.innerText = "Filename already exists";
                } else {
                    alertIndicator.innerText = "";
                    fs.renameSync(browsePath + path.sep + filename, browsePath + path.sep + input.value);

                    refreshFileBrowser();
                    dlg.remove();
                }
            }
        });
    // Focus on the input automatically
    input.focus();

    // Enable the press enter to proceed
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}
/**
 * Check if string val is number only
 */
let isnum = (val) => /^\d+$/.test(val);

async function showCreateNewImageDialog() {
    // Create a new file
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    // Filename
    var label = document.createElement("a");
    label.innerText = "File name";
    dlgContent.appendChild(label);
    var input = document.createElement("input");
    input.type = "text";
    dlgContent.appendChild(input);

    // Width
    var label = document.createElement("a");
    label.innerText = "Width(px)";
    dlgContent.appendChild(label);
    var inputW = document.createElement("input");
    inputW.type = "text";
    dlgContent.appendChild(inputW);

    // Height
    var label = document.createElement("a");
    label.innerText = "Height(px)";
    dlgContent.appendChild(label);
    var inputH = document.createElement("input");
    inputH.type = "text";
    dlgContent.appendChild(inputH);



    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "";
    alertIndicator.style.color = "red";
    dlgContent.appendChild(alertIndicator);


    var dlg = Dialog.createDialog(
        "Create a new image",   // Dialog title
        dlgContent,            // Content element
        ["Create", "Cancel"],  // Dialog buttons
        async function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                let filename = input.value;
                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;
                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                if (filename == "") {
                    alertIndicator.innerText = "Filename can't be empty";
                }
                else if (inputW.value == "" || inputH.value == "") {
                    alertIndicator.innerText = "Size can't be empty";
                }
                else if (isnum(inputW.value) == false || isnum(inputH.value) == false) {
                    alertIndicator.innerText = "Size must be round numbers only";
                }
                else if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
                    // Alert errror
                    alertIndicator.innerText = "Filename contains illegal character";
                }
                else if (fs.existsSync(browsePath + path.sep + filename)) {
                    alertIndicator.innerText = "Filename already exists\n" + browsePath + path.sep + filename;
                } else {
                    alertIndicator.innerText = "";
                    // fs.writeFileSync(browsePath + path.sep + filename, "");
                    await Pixy.createImage(browsePath + path.sep + filename, Number(inputW.value), Number(inputH.value))

                    refreshFileBrowser();
                    openFile(filename);
                    dlg.remove();
                }
            }
        });
    // Focus on the input automatically
    input.focus();

    // Enable the press enter to proceed
    input.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}
/**
 * Write Object to file text
 * @param {String} filepath Path where the json will be created
 * @param {Object} obj the json object
 */
function createJSON(filepath, obj) {
    return fs.writeFileSync(filepath, JSON.stringify(obj, null, '\t'));
}
function toTitleCase(str) {
    return str.toLowerCase().split('_').map(function (word) {
      return (word.charAt(0).toUpperCase() + word.slice(1));
    }).join(' ');
  }
async function showCreateNewItemDialog() {
    // Create a new minecraft item
    var dlgContent = document.createElement("div");
    dlgContent.style.cssText = `
                display: flex; flex-direction:column;
            `
    // Item ID
    var label = document.createElement("a");
    label.innerText = "Item ID";
    dlgContent.appendChild(label);
    var idInput = document.createElement("input");
    idInput.type = "text";
    idInput.placeholder = "corecoder:item_name";
    dlgContent.appendChild(idInput);

    // Durability
    var div = document.createElement("div");
    var durabilityInput = document.createElement("input");
    durabilityInput.type = "text";
    durabilityInput.placeholder = "100";
    durabilityInput.style.display = "none";
    var durabilityCheckbox = document.createElement("input");
    durabilityCheckbox.id = "durabilityCheckbox";
    durabilityCheckbox.onclick = function (ev) {
        if (this.checked)
            durabilityInput.style.display = "block";
        else
            durabilityInput.style.display = "none";
    }
    durabilityCheckbox.type = "checkbox";
    div.appendChild(durabilityCheckbox);
    var label = document.createElement("label");
    label.innerText = "Durablity";
    label.setAttribute("for", "durabilityCheckbox");
    div.appendChild(label);
    dlgContent.appendChild(div);
    dlgContent.appendChild(durabilityInput);

    // Stacked by data
    var div = document.createElement("div");
    var stackedInput = document.createElement("input");
    stackedInput.type = "checkbox";
    stackedInput.id = "stackedInput";
    div.appendChild(stackedInput);
    var label = document.createElement("label");
    label.innerText = "Stacked by data";
    label.setAttribute("for", "stackedInput");
    div.appendChild(label);
    dlgContent.appendChild(div);

    // Glint
    var div = document.createElement("div");
    var glintInput = document.createElement("input");
    glintInput.type = "checkbox";
    glintInput.id = "glintInput";
    div.appendChild(glintInput);
    var label = document.createElement("label");
    label.innerText = "Glint";
    label.setAttribute("for", "glintInput");
    div.appendChild(label);
    dlgContent.appendChild(div);

    // Hand Equipped
    var div = document.createElement("div");
    var handequippedInput = document.createElement("input");
    handequippedInput.type = "checkbox";
    handequippedInput.id = "handequippedInput";
    div.appendChild(handequippedInput);
    var label = document.createElement("label");
    label.innerText = "Hand Equipped";
    label.setAttribute("for", "handequippedInput");
    div.appendChild(label);
    dlgContent.appendChild(div);


    // Damage
    var div = document.createElement("div");
    var damageInput = document.createElement("input");
    damageInput.type = "text";
    damageInput.placeholder = "100";
    damageInput.style.display = "none";
    var damageCheckbox = document.createElement("input");
    damageCheckbox.id = "damageCheckbox";
    damageCheckbox.onclick = function (ev) {
        if (this.checked)
            damageInput.style.display = "block";
        else
            damageInput.style.display = "none";
    }
    damageCheckbox.type = "checkbox";
    div.appendChild(damageCheckbox);
    var label = document.createElement("label");
    label.innerText = "Attack Damage";
    label.setAttribute("for", "damageCheckbox");
    div.appendChild(label);
    dlgContent.appendChild(div);
    dlgContent.appendChild(damageInput);


    var alertIndicator = document.createElement("a");
    alertIndicator.innerText = "";
    alertIndicator.style.color = "red";
    dlgContent.appendChild(alertIndicator);


    var dlg = Dialog.createDialog(
        "Create a new Minecraft item",   // Dialog title
        dlgContent,            // Content element
        ["Create", "Help", "Cancel"],  // Dialog buttons
        async function (dialogelm, id) { // Onclick handler
            // When clicked a button
            if (id == 0) {
                let id = idInput.value == "" ? idInput.placeholder : idInput.value;
                let damage = damageInput.value == "" ? "100" : damageInput.value;
                let durability = durabilityInput.value == "" ? "100" : durabilityInput.value;
                let stackedByData = stackedInput.checked;
                let glint = glintInput.checked;
                let handequipped = handequippedInput.checked;
                let itemname = "item";
                itemname = id.split(":");
                if (itemname.length > 1) {
                    itemname = itemname[1];
                }
                
                let displayname = toTitleCase(itemname);
                filename = itemname + ".json";
                var filepath = bp_path + path.sep + "items" + path.sep + filename;

                var browsePath = openedFileBrowser == 0 ? bp_path : rp_path;



                browsePath += openedFileBrowser == 0 ? bp_relativepath : rp_relativepath;
                if (id == "") {
                    alertIndicator.innerText = "Item ID can't be empty";
                } else if (id.match(":") == null) {
                    alertIndicator.innerText = "Item ID must be in format of namespace:name";
                }
                else if ((damageCheckbox.checked && isnum(damage) == false) || (durabilityCheckbox.checked && isnum(durability) == false)) {
                    alertIndicator.innerText = "Durability or damage invalid";
                }
                else if (id.match(/([\\~#%&*{}/<>?|\"-])/gi) != null) {
                    // Alert errror
                    alertIndicator.innerText = "Filename contains illegal character";
                }
                else if (fs.existsSync(filepath)) {
                    alertIndicator.innerText = "Filename already exists\n" + filepath;
                } else {
                    alertIndicator.innerText = "";

                    if (bp_path == null || bp_path == path.sep) {
                        // cont.innerHTML = "Cannot detect pack of this type"; return;
                        let a = document.createElement("a");
                        a.innerText = "Error: BP path is unknown";
                        return createDialog("Error", a);
                    }

                    if (!fs.existsSync(bp_path + path.sep + "items"))
                        fs.mkdirSync(bp_path + path.sep + "items", { recursive: true });

                    var obj =
                    {
                        "format_version": "1.16.100",
                        "minecraft:item": {
                            "description": {
                                "identifier": id
                            },
                            "components": {
                                "minecraft:stacked_by_data": stackedByData,
                                "minecraft:glint": { "value": glint }, // Still untested
                                "minecraft:hand_equipped": handequipped,
                                "minecraft:display_name" : {"value":displayname},
                                "minecraft:icon": {
                                    "texture": itemname
                                },
                            }
                        }
                    };

                    if (durabilityCheckbox.checked) {
                        // Add the durabiity component
                        obj["minecraft:item"]["components"]["minecraft:durability"] = {
                            "max_durability": Number(durability),
                            "damage_chance": {
                                "min": 5,
                                "max": 10
                            }
                        }
                    }

                    if (damageCheckbox.checked) {
                        obj["minecraft:item"]["components"]["minecraft:damage"] = Number(damage);
                    }

                    if (stackedByData) {
                        obj["minecraft:item"]["components"]["minecraft:max_stack_size"] = 1;
                    }
                    createJSON(filepath, obj);



                    refreshFileBrowser();
                    openFile(filepath, true);
                    dlg.remove();
                }
            } else if (id == 1) {
                // Help button
                var a = document.createElement("a");
                a.innerText = `Generates item on the Behavior side only. Does not require pack to have resource pack. You have to specify the item ID as it will be used in the icon component`
                Dialog.createDialog("About item generator", a);
            }
        });
    // Focus on the input automatically
    idInput.focus();

    // Enable the press enter to proceed
    idInput.addEventListener("keyup", function (event) {
        // Number 13 is the "Enter" key on the keyboard
        if (event.keyCode === 13) {
            // Cancel the default action, if needed
            event.preventDefault();
            dlg.onclickbutton(dlg, 0); // Execute the button press function
        }
    });
}
module.exports = {
    showCreateNewFileDialog,
    showCreateNewFolderDialog,
    showDeleteFileDialog,
    showRenameDialog,
    showCreateNewImageDialog,
    showCreateNewItemDialog
}