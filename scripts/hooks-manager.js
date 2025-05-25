import { Utils } from "./utils.js";
import { registerSettings } from "./settings.js";
import { FLAGS, SETTING_KEYS } from "./module-config.js";
import { TCAL } from "./tcal.js";

export class HooksManager {
    /**
     * Registers hooks
     */
    static registerHooks() {

        Hooks.on("init", async () => {
            game.tcal = game.tcal ?? {};

            // Expose API
            game.tcal.importTransientActor = TCAL.importTransientActor;
            game.tcal.isTransientActor = TCAL.isTransientActor;

            registerSettings();
        });

        Hooks.on("ready", async () => {
            if (!game.user.isGM) return;

            //Loop over all our actors and delete any transient actors that aren't currently referenced by a scene
            for (let actor of game.actors) {
                if (Utils.getModuleFlag(actor, FLAGS.isTransient)) {
                    let hasReference = false;
                    for (let scene of game.scenes) {
                        if (scene.tokens.find((t) => t.actor?.id == actor.id)) {
                            hasReference = true;
                            break;
                        }
                    }

                    if (!hasReference) {
                        actor.delete();
                    }
                }
            }

            //If we haven't yet created the transient folder, do it now
            let transientFolder = Utils.getSetting(SETTING_KEYS.transientFolder);
            if (!transientFolder) {
                transientFolder = await Folder.create({ name: 'Transient Actors', type: 'Actor', parent: null });
                Utils.setSetting(SETTING_KEYS.transientFolder, transientFolder.id);
            }
        });

        Hooks.on('renderActorDirectory', (app, html) => {
            let showFolder = game.user.isGM ? Utils.getSetting(SETTING_KEYS.showFolder) : false;
            if (!showFolder) {
                let transientFolder = Utils.getSetting(SETTING_KEYS.transientFolder);
                const folder = html.find(`.folder[data-folder-id="${transientFolder}"]`);
                folder.remove();
            }
        });
    }
}