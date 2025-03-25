import { NAME, TITLE } from "./module-config.js";

/**
 * Provides helper methods for use elsewhere in the module
 */
export class Utils {

    /**
     * Get a single setting using the provided key
     */
    static getSetting(key) {
        return game.settings.get(NAME, key);
    }

    /**
     * Sets a single game setting
     */
    static async setSetting(key, value) {
        return game.settings.set(NAME, key, value);
    }

    /**
     * Register a single setting using the provided key and setting data
     */
    static registerSetting(key, metadata) {
        return game.settings.register(NAME, key, metadata);
    }
    
    /**
     * Formats and writes a message to the console
     */
    static consoleMessage(type, {objects=[], message="", subStr=[]}) {
        const msg = `${TITLE} | ${message}`;
        const params = [];
        if (objects && objects.length) params.push(objects);
        if (msg) params.push(msg);
        if (subStr && subStr.length) params.push(subStr);
        return console[type](...params);
    }

    /**
     * Checks if the provided object has any flags belonging to this module
     */
    static hasModuleFlags(obj) {
        if (!obj.flags) {
            return false;
        }

        return obj.flags[NAME] ? true : false;
    }

    /**
     * Gets the corresponding flag value from this module's scope
     */
    static getModuleFlag(obj, flag) {
        if (!Utils.hasModuleFlags(obj)) {
            return;
        }

        return obj.flags[NAME][flag];
    }
}