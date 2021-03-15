/**
 * project class
 */
const Pack = require('./pack')

class Project extends Pack{
    /**
     * @param {Object|Pack} data Project Data
     * @param {String} data.name Project Name
     * @param {String} data.path Project Path
     * @param {String} data.uuid Project UUID
     * @param {Number[]} data.version Project Version
     * @param {Object[]|Pack[]} data.dependencies Dependency packs
     * @param {String} data.dependencies[].name Pack name
     * @param {String} data.dependencies[].path Pack path
     * @param {String} data.dependencies[].uuid Pack UUID
     * @param {String} data.dependencies[].version Pack Version
     */
    constructor(data) {
        super(data);
        if(data.dependencies) {
            this.dependencies = data.dependencies
        }
    }

    toJSON() {
        const project = super.toJSON()
        project["dependencies"] = this.dependencies
        return project;
    }

}
module.exports = Project