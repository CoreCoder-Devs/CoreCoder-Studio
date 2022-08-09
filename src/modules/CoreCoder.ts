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

    public static getComMojang():String|Error{
        return Error("Unimplemented");
    }

    public static getSettings():Settings{
        return CoreCoder.instance.settings;
    }
}