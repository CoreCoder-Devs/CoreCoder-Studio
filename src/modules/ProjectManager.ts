/**
 * Project manager
 * non-gui implementation of the project manager
 */

declare type ProjectType = "behavior" | "resource" | "skin" | "world";

class ProjectCreateOptions{
    project !: ProjectData | ProjectData[];
    comMojangPath !: String;
}

class ProjectData{
    name!: String;
    description!: String;
    uuid!: String;
    isValid: boolean = false;
    dependencies: ProjectData | ProjectData[] | undefined;
    type!: ProjectType; 
}

class ProjectCreateError extends Error{}
/**
 * Get all the project
 * @returns All the project
 */
function getAllProjects() :Array<ProjectData>{
    // TODO: implement function
    return [];
}
/**
 * Create a new project if error returns ProjectCreateError 
 * if success, returns ProjectData
 * @param opts Options
 */
function createProject(opts: ProjectCreateOptions):ProjectCreateError|ProjectData|void{
    // TODO: implement function
}

/**
 * Deletes a project
 * @param project The project to delete, or path to the project folder
 * @param deleteLinked whether or not to delet linked projects
 * @returns Success or not
 */
function deleteProject(project: ProjectData|string, deleteLinked?:Boolean):Boolean{
    return true;
}

/**
 * Parse a project to get ProjectData
 * @param path Project folder path
 */
function parseProject(path:String):ProjectData|Error|void{
    // TODO: implement function
}

export default {
    ProjectCreateOptions,
    ProjectData,
    getAllProjects,
    createProject,
    deleteProject,
    parseProject
};