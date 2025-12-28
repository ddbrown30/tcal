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

        // Save the current sidebar state before importing
        const currentTab = ui.sidebar.tabGroups.primary;
        const tabExpanded = ui.sidebar.expanded;

        updateData.folder = Utils.getSetting(SETTING_KEYS.transientFolder);
        updateData.flags = { tcal: {} };
        updateData.flags.tcal[FLAGS.isTransient] = true;

        const importedActor = await game.actors.importFromCompendium(game.packs.get(actor.pack), actor.id, updateData);

        // Restore the previous sidebar state if it changed
        if (currentTab && ui.sidebar.tabGroups.primary !== currentTab) {
            ui.sidebar.changeTab(currentTab, "primary");
        }

        if (ui.sidebar.expanded != tabExpanded) {
            ui.sidebar.toggleExpanded(tabExpanded);
        }

        return importedActor;
    }

    static isTransientActor(actor) {
        return actor ? Utils.getModuleFlag(actor, FLAGS.isTransient) : false;
    }

    /**
     * Deletes a transient actor and all its tokens from scenes
     * @param {Actor|string} actorOrId - The actor object or actor ID to delete
     * @returns {Promise<boolean>} - True if deleted successfully, false otherwise
     */
    static async deleteTransientActor(actorOrId) {
        let actor;

        if (typeof actorOrId === 'string') {
            actor = game.actors.get(actorOrId);
        } else {
            actor = actorOrId;
        }

        if (!actor) {
            Utils.consoleMessage("error", {
                message: "deleteTransientActor was called with an invalid actor.",
                subStr: "actorOrId: " + actorOrId,
            });
            return false;
        }

        if (!this.isTransientActor(actor)) {
            Utils.consoleMessage("error", {
                message: "deleteTransientActor was called with a non-transient actor.",
                subStr: "actor: " + actor.name + " (id: " + actor.id + ")",
            });
            return false;
        }

        // Delete all tokens of this actor from all scenes
        for (let scene of game.scenes) {
            const tokensToDelete = scene.tokens.filter(t => t.actor?.id === actor.id);
            if (tokensToDelete.length > 0) {
                await scene.deleteEmbeddedDocuments("Token", tokensToDelete.map(t => t.id));
            }
        }

        // Delete the actor itself
        await actor.delete();

        return true;
    }
}
