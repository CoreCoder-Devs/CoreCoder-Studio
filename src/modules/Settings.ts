class SettingsItem {
    id!:String;
    name!: String;
    description!: String;
    value: any;
    constructor(id:String, name:String,description:String,value:any){
        this.id = id;
        this.name = name;
        this.description = description;
        this.value = value;
    }
}
export default class Settings{
    fullscreen:SettingsItem = new SettingsItem(
        "fullscreen", 
        "Fullscreen", 
        "Fullscreen mode", 
        false);
    openLastProject:SettingsItem = new SettingsItem(
        "openLastProject", 
        "Open Last Project", 
        "Open last project on startup",
        false);
    
    constructor(){}

    /**
     * Load settings from localStorage
     */
    loadSettings(): void{
        
    }

    /**
     * Save settings to localStorage
     */
    saveSettings(): void{

    }
}