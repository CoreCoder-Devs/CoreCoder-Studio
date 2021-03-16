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


module.exports = new class Projects{
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
            for(const project of projects) {
                this.projects.push(
                    new Project(project)
                )
            }
        } catch (e) {
            console.log(e)
            fs.writeFileSync(this.projectFilePath, JSON.stringify([{}]))
        }
        this.save()
    save() {
        fs.writeFileSync(this.projectFilePath, JSON.stringify(this.projects.map(p => p.toJSON()), "  "))
    }

    /**
     *
     * @param {Project} project
     */
    add(project) {
        this.projects.push(project)
        fs.writeFileSync(this.projectFilePath, JSON.stringify(project.toJSON()))
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
        if(condition === undefined) return this.projects
        return this.projects.find(condition)
    }
}
