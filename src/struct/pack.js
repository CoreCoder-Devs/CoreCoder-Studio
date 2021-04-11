const fs = require('fs')
const path = require('path')

/**
 * Pack class
 */
class Pack {


    /**
     * @param {String} [data.name] Pack Name
     * @param {Object} data Pack Data
     * @param {String} data.path Pack Path
     * @param {String} [data.uuid] Pack UUID
     * @param {Number[]} [data.version] Pack Version
     */
    constructor(data) {
        
        this.path = data.path

        if(!data.name || !data.uuid || !data.version) {

            try {
                const manifest = require(this.path)

                this.name = manifest.header.name

                this.uuid = manifest.header.uuid

                this.version = manifest.header.version

            } catch (e) {
                if(e.message.toLowerCase().includes('module not found')) throw new Error('Specified path not found')
                console.log(e)
            }

        } else {
            this.name = data.name
    
            if(data.uuid.match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-5][0-9a-f]{3}-[089ab][0-9a-f]{3}-[0-9a-f]{12}$/i)) {
    
                this.uuid = data.uuid
    
            } else {
    
                throw SyntaxError('Invalid UUID ' + data.uuid)
            }
    
            this.version = data.version
            
        }
    }

    /**
     * Returns the version string of the pack, e.g 1.2.3
     * @returns {string}
     */
    get versionString() {
        return this.version.join('.')
    }

    get iconPath() {
        try {
            const icon = fs.readFileSync(path.join(this.path, "/pack_icon.png"))
            return path.join(this.path, "/pack_icon.png")
        } catch(e) {
            return null
        }
    }

    get manifestPath() {
        return path.join(this.path, "/manifest.json")
    }

    /**
     * Converts the pack to an Object
     */
    toJSON() {
        const pack = {
            name: this.name,
            path: this.path,
            version: this.version,
            uuid: this.uuid
        }
        return pack
    }
}


module.exports = Pack