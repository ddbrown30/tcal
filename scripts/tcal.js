import { Utils } from "./utils.js";
import { FLAGS, SETTING_KEYS } from "./module-config.js";

export class TCAL {

    static async importTransientActor(uuid) {
        if (!uuid.startsWith("Compendium")) {
            Utils.consoleMessage("error", {
                message: "importTransientActor was called with a uuid for a non-compendium actor.",
                subStr: "uuid: " + uuid,
            });
            return;
        }

        let actor = await fromUuid(uuid);
        if (!actor) return;

        let updateData = {
            folder: Utils.getSetting(SETTING_KEYS.transientFolder),
            flags: { tcal: {} },
        };

        updateData.flags.tcal[FLAGS.isTransient] = true;
        return await game.actors.importFromCompendium(game.packs.get(actor.pack), actor.id, updateData);
    }

    static isTransientActor(actor) {
        return actor ? Utils.getModuleFlag(actor, FLAGS.isTransient) : false;
    }
} 