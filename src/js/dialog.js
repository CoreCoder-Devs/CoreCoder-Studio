/**
 * Dialog system for CoreCoder2
 * by Hanprogramer
 */

/**
 * How it works
 * The dialog is stored on an array,
 * this is to prevent multiple dialog stacking away
 * dialog is then get popped out of the array to be shown
 * 
 * the dialog content itself is provided as an argument to a function
 * 
 * you have to handle dialog buttons yourself too
 */

var dialogs = [];


function createDialog(strTitle, htmlElem) {
    /**
     * Creates a dialog with htmlElem as the content view
     * @param {String} strTitle - title of the dialog
     * @param {Node} htmlElem - content element
     */
    dialogs.appendChild(new Dialog(strTitle, htmlElem));
}

function createDialogSimple(strTitle, strContent) {
    /**
     * Creates a dialog with simple text
     * @param {String} strTitle - title of the dialog
     * @param {String} strContent - content
     */
    let elem = document.createElement("a");
    elem.innerText = strContent;
    dialogs.appendChild(new Dialog(strTitle, elem));
}

function getDialogToShow(){
    /**
     * Get a dialog to show from the dialog stack
     */
    return dialogs.pop();
}

// Export all as module
module.exports = {
    Dialog : new class Dialog {
        title = "dialog.title";
        htmlElem = null;
        constructor(_title, _htmlElem) {
            this.title = _title;
            this.htmlElem = _htmlElem;
        }
        show(dialogElem) {
            //  First, remove all element from the dialog container
            while (dialogElem.firstChild) {
                dialogElem.removeChild(dialogElem.lastChild);
            }
    
            // Add the dialog to the dialogElem
            dialogElem.appendChild(htmlElem);
        }
    }
};