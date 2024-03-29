const { appFolder } = require('./global_settings').settings
const path = require('path')
const fs = require('fs')
const Project = require('../struct/project')
const Pack = require('../struct/pack')

/**
 * {
 *      name: String
 *      path: String (absolute)
 *      uuid: String
 *      version: Number[]
 *      dependencies: Object[]|Pack[]
 * }
 */


module.exports = new class Projects {
    constructor() {
        //init projects file
        this.projectFilePath = path.join(appFolder, '/projects.json')
        /**
         *
         * @type {Project[]}
         */
        this.projects = []

        try {
            const projects = require(this.projectFilePath);
            for (const project of projects) {
                //validate data
                if (fs.readdirSync(project.path)) { //check if it is still a thing

                    const manifest = require(project.path + "/manifest.json")

                    if (manifest.header.uuid !== project.uuid) { //update uuid
                        project.uuid = manifest.header.uuid
                    }

                    if (manifest.header.name !== project.name) { //update uuid
                        project.name = manifest.header.name
                    }

                    if (manifest.header.version !== project.version) { //update version
                        project.version = manifest.header.version
                    }

                    this.projects.push(
                        new Project(project)
                    )
                }

            }
        } catch (e) {
            console.log(e)
            if (e.message.startsWith('Error: Cannot find module')) {
                fs.writeFileSync(this.projectFilePath, JSON.stringify([{}]))
            }
        }
        this.save()
    }

    save() {
        fs.writeFileSync(this.projectFilePath, JSON.stringify(this.projects.map(p => p.toJSON()), "  "))
    }

    /**
     *
     * @param {Project | Object} project
     */
    add(project) {
        if (this.projects.find(p => p.path === project.path)) return
        if (project instanceof Pack || project instanceof Project) {
            this.projects.unshift(project)
        }
        else if (project instanceof Object) {
            this.projects.unshift(new Pack({
                path: project.path
            }))
        }
        this.save()
    }

    /**
     * Add a new project to the manager and save to the projects file
     * @returns The project
     * @param {Object} data
     */
    createProject(data) {
        const project = new Project(data)
        return project
    }

    /**
     *
     * @param {String} uuid
     * @param {String} ver
     */
    get(uuid, ver) {
        return this.projects.filter(p => p.uuid === uuid && p.version === ver);
    }

    /**
     *
     * @param condition
     */
    find(condition) {
        if (condition === undefined) return this.projects
        return this.projects.find(condition)
    }

    /**
     *
     * @param {Project | Object} project
     */
    remove(project) {
        for(var i = 0; i < this.projects.length; i++){
            if(this.projects[i].path == project.path && this.projects[i].uuid == project.uuid){
                this.projects.splice(i,1);
                break;
            }
        }
        this.save()
    }

}
