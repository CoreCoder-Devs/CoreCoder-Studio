/**
 * This is a custom implementation of window
 * basically only adds values and methods to window
 * you need to import this file whenever you need to use it's values or methods
 */

// to use:
/*
import {CoreCoderWindow} from "@/CoreCoderWindow";
declare let window : CoreCoderWindow;
*/

export interface CoreCoderWindow extends Window {
    ipcRenderer: any;
}
