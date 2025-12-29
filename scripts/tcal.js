import { Utils } from "./utils.js";
import { FLAGS, SETTING_KEYS } from "./module-config.js";

export class TCAL {

    static async importTransientActor(uuid, options={}, updateData={}) {
        if (!uuid.startsWith("Compendium")) {
            Utils.consoleMessage("error", {
                message: "importTransientActor was called with a uuid for a non-compendium actor.",
                subStr: "uuid: " + uuid,
            });
            return;
        }

        let actor = await fromUuid(uuid);
        if (!actor) return;

        if (options.preferExisting) {
            //The caller wants to reuse an existing actor if possible
            //Search for a transient actor that matches our compendium actor
            let existingActor = game.actors.find((a) => this.isTransientActor(a) && a._stats.compendiumSource == uuid);
            if (existingActor) {
                return existingActor;
            }
        }

        updateData.folder = Utils.getSetting(SETTING_KEYS.transientFolder);
        updateData.flags = { tcal: {} };
        updateData.flags.tcal[FLAGS.isTransient] = true;

        //Note: This is essentially the contents of importFromCompendium but allows us to skip the call to directory.activate(). Replace this if they ever add an option
        const actorDocument = await game.packs.get(actor.pack).getDocument(actor.id);
        const sourceData = game.actors.fromCompendium(actorDocument);
        const createData = foundry.utils.mergeObject(sourceData, updateData);
        const importedActor = foundry.documents.Actor.create(createData, { fromCompendium: true });

        return importedActor;
    }

    static isTransientActor(actor) {
        return actor ? Utils.getModuleFlag(actor, FLAGS.isTransient) : false;
    }
}
