/**
 * File.ts
 * Base abstraction layer for fs
 * all files functions must have async mode
 */

import * as fs from "fs";

function readFile(path:String):String|Error{
    return fs.readFileSync(path as fs.PathLike).toString();
}
async function readFileAsync(path:String){}
function writeFile(path:String, content:String, overwrite:Boolean=false){
    return fs.writeFileSync(path as fs.PathLike,content as string);
}
async function writeFileAsync(path:String){}

function createFile(path:String){}
async function createFileAsync(path:String){}

function deleteFile(path:String){}
async function deleteFileAsync(path:String){}
function deleteFolder(path:String){}
async function deleteFolderAsync(path:String){}

function getAllFilesInFolder(path:String):String[]|Error{
    var result : Array<String> = [];
    try{
        result = fs.readdirSync(path as fs.PathLike);
    }catch(e){
        //TODO: Better error handling
        if(e instanceof Error){
            console.log(e.message);
        }
    }
    return result;
}


export default {
    readFile,
    readFileAsync,
    writeFile,
    writeFileAsync,
    createFile,
    createFileAsync,
    deleteFile,
    deleteFileAsync,
    deleteFolder,
    deleteFolderAsync,
    getAllFilesInFolder
};