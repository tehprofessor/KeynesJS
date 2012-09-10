# Keynes.js #

A client-side MVC JS framework for development of modern web-applications. Please check out the docs, and code for examples and information on how it all works.

#### Currently Under Heavy Development ####

**Update** 03/04/2012

Keynes.Model with localStorage is working as it should, and has tests... (though there could/should be more). I'm currently working on the Controllers and Views. It'll probably be pretty gruesome over the next week as work progresses. 

I'll begin work on a `remoteStorage` option as the controllers and views finish up. It'll most
likely: use localStorage as a cache, offline mode, and backup, then syncing with the remote server.

With this commit I've added:

* `keynes.controller.js` is the base of the controller
* `keynes.historian.js` is used by routes and the controller to manage the history

_Additional Notes_

A view will have two components: logic and template. The former containing methods and functions, the latter HTML (with mustache markup). My goal is to completely remove the need to put logic in the templates.

The models are pretty well supported by Mustache.js as they return the objects it (Mustache) 
will render (arrays are a little rough, but if you know how to use mustache it should be easy).
This will be worked out as the week goes on...



**Update** 31/08/2012

Tests are currently passing. I'm still working on the belongs_to relationship,
and deciding if I want to allow more complex ones. Most of the hold up is
whether I want the data store to live in browser memory and sync it from time
to time. I'm leaning towards not having a JS datastore, and continuing to
use localStorage as its well supported and persistent... Plus most end users
will behave somewhat erratically and loading/writing/reading localStorage into
an in memory relational data store might be more trouble than its worth.

### Why? ###

Too often, I find myself in some sort of desperate hell surrounded by erb or haml,
intermixed with coffeescript, wearing a mustache for some reason. There is logic in templates, templates are logic?! This isn't russia! Then the sky turns red, and the sun explodes behind me like a supernova. "WTF, have I done?" I shout into the sky, "Why does this syntactical sugar add so much complexity? What complexity was I trying to avoid? Why did I think it was necessary to incorporate every technology on hackernews that day?! Arrrgh!"

### What! ###

During one of the universal resets provided by my dear leader, the Spaghetti monster, I had a crazy idea: "What if, I just used Javascript to route, get and post requests from a JSON backend server?! OH YOUR GOD." 

The sun set that night and in the morning, I awoke next to an oracle disguised like a Denver Omlet... It turned to me and asked, "What about templates?" My jaw dropped, my eyes rolled back into my head, and I remembered my youth-- writing simple HTML for the Animator Gif-Jif. It was simple, beautiful, documented, and standardized... My eyes shot open, I ate the oracle, and decided I would never a mix server-side language with my templates again. 

I will only use HTML. I will only use the actual tool for the job. I will eliminate the guise of complexity, in the name of simplicity. "Am I alive?" I quitetly ponder... "why am I still wearing this mustache?" Because mustaches don't contain logic.

### Depends On ###

jQuery, Mustache.js, and probably underscore.js

### Overall Road Map ####

1. Keynes.Model: data access and storage (local and remote)
1. Keynes.Controller: managing states (views), history, and syncing data changes
1. Keynes.View: templates (to be powered by mustache.js)

Currently on: Keynes.Model (local data storage)