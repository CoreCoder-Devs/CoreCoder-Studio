/**
 * Base class of the app.
 * Provides basic functionality
 */
import Settings from "./Settings";
import process from "process";
import path from "path";
const MINECRAFT_APP = "Microsoft.MinecraftUWP_8wekyb3d8bbwe";
const MINECRAFT_PREVIEW_APP = "Microsoft.MinecraftWindowsBeta_8wekyb3d8bbwe";
export default class CoreCoder {
    private settings!: Settings;
    static instance: CoreCoder;

    constructor() {
        CoreCoder.instance = this;
        this.settings = new Settings();
    }

    /**
     * Get the project root folder for all projects
     * @returns absolute path
     */
    public static getComMojang(isBeta: Boolean = false): String | Error {
        switch (process.platform) {
            case "aix":
            case "darwin":
            case "freebsd":
            case "openbsd":
            case "sunos":
            case "linux":
                return Error("Unimplemented");

            case "win32":
                var localAppData = process.env["LOCALAPPDATA"];
                if(localAppData != null)
                return path.join(
                    localAppData,
                    "packages",
                    (isBeta ? MINECRAFT_PREVIEW_APP : MINECRAFT_APP),
                    "LocalState","games","com.mojang"
                );
                else return Error("Can't get LocalAppData folder");

            case "android":
                return Error("Unimplemented");
        }
        return Error("Unknown OS");
    }
    /**
     * Get the settings object
     * @returns The settings object
     */
    public static getSettings(): Settings {
        return CoreCoder.instance.settings;
    }
}
