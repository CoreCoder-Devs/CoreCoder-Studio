/**
 * File.ts
 * Base abstraction layer for fs
 * all files functions must have async mode
 */
function readFile(path:String){}
async function readFileAsync(path:String){}
function writeFile(path:String, overwrite:Boolean=false){}
async function writeFileAsync(path:String){}

function createFile(path:String){}
async function createFileAsync(path:String){}

function deleteFile(path:String){}
async function deleteFileAsync(path:String){}
function deleteFolder(path:String){}
async function deleteFolderAsync(path:String){}

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
    deleteFolderAsync
};