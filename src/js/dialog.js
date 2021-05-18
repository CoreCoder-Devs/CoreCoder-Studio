/**
 * Dialog system for CoreCoder2, make sure to import the css too
 * by Hanprogramer
 */


function createWindowElm(title) {
    let temp = document.createElement('div');
    var html = `<div class="ccdlgwindow">
    <div class="ccdlgcaption">
        <a id="ccdlg.title">${title}</a>

        <div style="flex-grow: 1; min-width: 64px;"></div>

        <div class="ccdlgwindow-captionbtn closebtn"></div>
    </div>

    <div id="ccdlgcontent">
        <!-- Generated -->
    </div>
</div>`;
    html = html.trim(); // Never return a space text node as a result
    temp.innerHTML = html
    return temp.firstElementChild;
}

/**
 * Create the dialog, if button text is "Cancel", the cancel handler autamtically added
 * @param {String} title Dialog title
 * @param {Node} contentElm The content of the dialog
 * @param {Array} buttonLabels The buttons of the dialogs
 * @param {function(dialogelm : Node, id : Number)} onclickbutton callback when user pressed a button
 */
function createDialog(title, contentElm, buttonLabels, onclickbutton = function (dialogelm, id) { }) {
    // Create the base container
    var elm = document.createElement("div");
    elm.classList.add("ccdlg");
    elm.onclickbutton = onclickbutton;

    // Create the black background
    var shadow = document.createElement("div");
    shadow.classList.add("ccdlgshadow");
    elm.appendChild(shadow);

    // The container for the content
    var dlgwindow = createWindowElm(title);

    // Put in the dialog content
    var content = dlgwindow.lastElementChild;
    content.appendChild(contentElm);

    var closebtn = dlgwindow.getElementsByClassName("closebtn")[0];
    closebtn.onclick = function (ev) {
        elm.remove();
    }

    // Create the dialog footer
    var footer = document.createElement("div");
    footer.classList.add("ccdlgcaption");
    var i = 0;
    for (var label of buttonLabels) {
        if (typeof label == "string") {
            let btn = document.createElement("button");
            btn.innerText = label;
            btn.buttonId = i;
            i++;
            btn.addEventListener("click", (ev) => {
                onclickbutton(content, btn.buttonId);
                if (btn.innerText == "Cancel")
                    // Close the dialog
                    elm.remove();
            });
            footer.appendChild(btn);
        }
    }
    dlgwindow.appendChild(footer);




    shadow.appendChild(dlgwindow);

    // Show the element in the window
    document.body.appendChild(elm);
    return elm;
}

module.exports = {
    createDialog
}