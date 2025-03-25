# Transient Compendium Actor Library

This library adds API functionality that allows other modules to import actors from compendiums in such a way that they do not appear in the Actors tab and that are automatically deleted when they are no longer referenced.

## API

#### importTransientActor
```js
game.tcal.importTransientActor(uuid, options)
``` 
This function is used to import an actor from a compendium as a transient actor. It takes a uuid for a compendium actor and returns the imported actor. It must be called with `await` if you want the returned value.

* `uuid` The uuid for the compendium actor.
* `options`
  * `preferExisting` If true, `importTransientActor` will first look for an existing transient actor for the provided uuid and will return that. If one is not found, it will import the actor as normal. 


#### isTransientActor
```js
game.tcal.isTransientActor(actor)
``` 
This function can be used by other modules to know if an actor is transient. The main intent with adding this is to allow other modules to exclude transient actors from their logic. For example, one of my other modules, [Actor Browser](https://foundryvtt.com/packages/actor-browser), excludes transient actors from its results.

* `actor` The actor to check

## Settings

The library has a single setting which shows the hidden folder where the transient actors are stored. Ideally, this should never be needed but it does allow a way to do manual clean up if required. Even when enabled, the folder is only shown to GM users.
