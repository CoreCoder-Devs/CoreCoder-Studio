/**
 * Project manager
 * non-gui implementation of the project manager
 */
import * as p from "path";
import CoreCoder from "./CoreCoder";
import File from "./File";
declare type ProjectType = "behavior" | "resource" | "skin" | "world";

class ProjectCreateOptions {
    project!: ProjectData | ProjectData[];
    comMojangPath!: String;
}

class ProjectData {
    name!: String;
    description!: String;
    uuid!: String;
    isValid: boolean = false;
    dependencies: ProjectData | ProjectData[] | undefined;
    type!: ProjectType;
    path!: String;
}

class ProjectCreateError extends Error { }
/**
 * Get all the project
 * @returns All the project
 */
function getAllProjects(type: ProjectType, includeNonDev: Boolean = false): Array<ProjectData> {
    // TODO: async mode
    var comMojang = CoreCoder.getComMojang() as string;
    var path = comMojang;
    var result: ProjectData[] = [] as ProjectData[];

    //TODO: implement non dev packs loading
    if (includeNonDev)
        throw Error("Unimplemented");
    if (typeof comMojang !== "string")
        throw Error("Failed to get com.mojang folder");

    // Get the path
    switch (type) {
        case "behavior":
            path = p.join(comMojang, "development_behavior_packs");
            break;
        case "resource":
            path = p.join(comMojang, "development_resource_packs");
            break;
        default:
            throw new Error("Unimplemented project type");
    }
    var folders = File.getAllFilesInFolder(path);
    if (!(folders instanceof Error)) {
        for (var folder in folders) {
            // Loop through and prase one by one
            if (typeof folder === "string") {
                var i : number = Number.parseInt(folder);
                var folderName = folders[i];
                if(typeof folderName !== "string")
                    continue;
                var projectPath = p.join(path, folderName as string);
                var project = parseProject(projectPath);

                if (project instanceof ProjectData)
                    result.push(project);
                else continue;
            }
        };
    }
    return result;
}
/**
 * Create a new project if error returns ProjectCreateError
 * if success, returns ProjectData
 * @param opts Options
 */
function createProject(
    opts: ProjectCreateOptions
): ProjectCreateError | ProjectData | void {
    // TODO: implement function
}

/**
 * Deletes a project
 * @param project The project to delete, or path to the project folder
 * @param deleteLinked whether or not to delet linked projects
 * @returns Success or not
 */
function deleteProject(
    project: ProjectData | string,
    deleteLinked?: Boolean
): Boolean {
    return true;
}

/**
 * Parse a project to get ProjectData
 * @param path Project folder path
 */
function parseProject(path: string): ProjectData | Error | void {
    // TODO: async mode
    // TODO: better error handling
    try {
        var manifestPath = p.join(path, "manifest.json");
        var content = File.readFile(manifestPath);
        if (typeof content === "string") {
            // Begin parsing the JSON
            var json = JSON.parse(content);
            var project: ProjectData = new ProjectData();
            project.name = json["header"]["name"];
            project.description = json["header"]["description"];
            project.uuid = json["header"]["uuid"];
            project.path = path;
            return project;
        } else {
            return Error("Error parsing manifest");
        }
    } catch (e) {
        if (e instanceof Error) {
            console.log(e.message);
            return e;
        }
    }
}

export {
    ProjectCreateOptions,
    ProjectData,
    ProjectType,
    getAllProjects,
    createProject,
    deleteProject,
    parseProject,
};
