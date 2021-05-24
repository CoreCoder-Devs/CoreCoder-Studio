/**
 * All the dialogs used in editor.js
 * warning: is not sandboxed, cannot be used outside this program
 */
const fs = require("fs");
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
                if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
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
                if (filename.match(/([\\~#%&*{}/:<>?|\"-])/gi) != null) {
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
                if (filename == ""){
                    alertIndicator.innerText = "Filename can't be empty";
                }
                else if (inputW.value == "" || inputH.value == ""){
                    alertIndicator.innerText = "Size can't be empty";
                }
                else if (isnum(inputW.value) == false || isnum(inputH.value) == false){
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

module.exports = {
    showCreateNewFileDialog,
    showCreateNewFolderDialog,
    showDeleteFileDialog,
    showRenameDialog,
    showCreateNewImageDialog
}