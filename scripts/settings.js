
import { SETTING_KEYS } from "./module-config.js";
import { Utils } from "./utils.js";

export function registerSettings() {
    
    Utils.registerSetting(SETTING_KEYS.transientFolder, {
        scope: "world",
        config: false,
        type: String,
        default: "",
        onChange: () => {
            ui.sidebar.render(true);
        },
    });
    
    Utils.registerSetting(SETTING_KEYS.showFolder, {
        name: "TCAL.Settings.ShowFolderN",
        hint: "TCAL.Settings.ShowFolderH",
        scope: "world",
        config: true,
        type: Boolean,
        default: false,
        onChange: () => {
            ui.sidebar.render(true);
        },
    });
}