# Transient Compendium Actor Library

This library adds API functionality that allows other modules to import actors from compendiums in such a way that they do not appear in the Actors tab and that are automatically deleted when they are no longer referenced.

## API

#### importTransientActor
```js
game.tcal.importTransientActor(uuid, options, updateData)
``` 
This function is used to import an actor from a compendium as a transient actor. It takes a uuid for a compendium actor and returns the imported actor. It must be called with `await` if you want the returned value.

* `uuid` The uuid for the compendium actor.
* `options`
  * `preferExisting` If true, `importTransientActor` will first look for an existing transient actor for the provided uuid and will return that. If one is not found, it will import the actor as normal.
* `updateData` This object is passed on to the Foundry import function. See the Foundry API documentation for more info.


#### isTransientActor
```js
game.tcal.isTransientActor(actor)
``` 
This function can be used by other modules to know if an actor is transient. The main intent with adding this is to allow other modules to exclude transient actors from their logic. For example, one of my other modules, [Actor Browser](https://foundryvtt.com/packages/actor-browser), excludes transient actors from its results.

* `actor` The actor to check

#### deleteTransientActor
```js
await game.tcal.deleteTransientActor(actorOrId)
``` 
This function is used to delete a transient actor and all of its tokens from all scenes. It must be called with `await` as it returns a promise. The function includes safety checks to ensure only transient actors can be deleted.

* `actorOrId` Either an Actor object or an actor ID (string) to delete
* Returns `true` if the deletion was successful, `false` if there was an error (e.g., actor not found or not transient)

## Settings

The library has a single setting which shows the hidden folder where the transient actors are stored. Ideally, this should never be needed but it does allow a way to do manual clean up if required. Even when enabled, the folder is only shown to GM users.
