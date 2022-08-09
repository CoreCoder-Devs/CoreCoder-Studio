const { ipcRenderer } = require("electron");

// export interface CoreCoderWindow extends Window {
//     ipcRenderer:any;
// }
// declare let window : CoreCoderWindow;
window.ipcRenderer = ipcRenderer;
// console.log("PRELOAD SCRIPT IS RUNNING");
