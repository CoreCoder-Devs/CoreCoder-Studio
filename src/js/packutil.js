const fs = require("fs");
const util = require("util");

/** Packutil
 * used by editor.js to search for pack with specific uuid asynchronously
 * using promises so we can use "await"
 * using localStorage "com_mojang" for getting the com.mojang folder
 * sets the "rp_path" localStorage when done
 */


/**
 * Look for Resource pack needed for this datapacks in the com.mojang folder
 * asynchronously
 */
 function lookForDependencies(currentDir) {
    if (currentDir == null) {
        return;
    }

    // Read the manifest of the current pack
    fs.readdir(currentDir, callback = (err, files) => {
        // Look if it is a manifest
        for (file of files) {
            if (file == "manifest.json") {
                var content = "";
                fs.readFile(currentDir + "/" + file, callback = (err, data) => {
                    var json = JSON.parse(data.toString());
                    var uuid = json["header"]["uuid"];
                    var dependencyUUID = json["dependencies"][0]["uuid"];
                    lookForPackWithUUID(dependencyUUID, "resources").then((value) => {
                        // console.log(value)
                        if (value != null) {
                            localStorage.setItem("rp_path", value);
                            rp_path = value;
                        }
                    });
                });
            }
        }
    });
}

async function lookForPackWithUUID(uuid, type) {
    var com_mojang = localStorage.getItem("com_mojang");
    var _readdir = util.promisify(fs.readdir);
    var _exists = util.promisify(fs.exists);
    var _read = util.promisify(fs.readFile);

    var foldersToLook = [
        "resource_packs", "behavior_packs",
        "development_resource_packs", "development_behavior_packs"
    ];

    /**
     * Look for a pack in packs folder
     * @param {String} path Path of the "resource_packs" folder for example
     * @param {String} uuid Pack uuid to search for
     * @param {String} type data|resources
     * @returns {String} a path to the found pack, empty string otherwise
     */
    var lookForInFolder = async (folder_path, uuid, type) => {
        var result = "";
        var folders = await _readdir(folder_path);
        for (var f of folders) {
            if (fs.statSync(folder_path + path.sep + f).isDirectory()) {
                var manifest_path = folder_path + path.sep + f + path.sep + "manifest.json";
                if (await _exists(manifest_path)) {
                    // Has manifest.json, proceed reading it
                    try {
                        var content = (await _read(manifest_path)).toString();
                        var json = JSON.parse(content);
                        var uuid = json["header"]["uuid"];
                        result = folder_path + path.sep + f;
                        break;
                    } catch (err) {
                        //TODO: make a better error message window / alerting
                        console.log(err);
                        continue;
                    }
                }
            }
        }
        return result;
    }

    for (var folder of foldersToLook) {
        if (await _exists(com_mojang + path.sep + folder)) {
            var found = (await lookForInFolder(com_mojang + path.sep + folder, uuid, type));
            if (found != "") {
                // Found the pack
                console.log("Found a dependency at");
                console.log(found);
                return found;
            }//TODO:errors for cant find dependencies
        }
    }
    return null;
}

module.exports = {
    lookForDependencies
}