/**
 * Base class of the app.
 * Provides basic functionality
 */
import Settings from "./Settings";

export default class CoreCoder{
    private settings!: Settings;
    static instance : CoreCoder;
    
    constructor(){
        CoreCoder.instance = this;
        this.settings = new Settings();
    }

    /**
     * Get the project root folder for all projects
     * @returns absolute path
     */
    public static getComMojang():String|Error{
        return Error("Unimplemented");
    }
    /**
     * Get the settings object
     * @returns The settings object
     */
    public static getSettings():Settings{
        return CoreCoder.instance.settings;
    }
}