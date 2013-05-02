Core
=====

A collection of core classes used in other libraries and APIs. See the docs for a full and detailed description
of the Core classes.

## Building

```Console
>npm install
...
>grunt
```

##Quick Start

* [Eventable](#eventable)
* [Dom](#dom)

---

##Eventable

```javascript
var cat = new CORE.Eventable()
	, dog = new CORE.Eventable()
	;

	//cat listens for the dogs 'bark' event
	cat.on(dog, 'bark', cat.runAway);

	//dog fires its 'bark' event
	dog.fire({
		type: 'bark'
	});

	//cat.runAway(event) is called

	//cat stops listening to the dogs 'bark' event
	cat.off(dog, 'bark', cat.runAway);

	//dog fires its 'bark' event
	dog.fire({
		type: 'bark'
	});

	//cat does not respond as it is no longer listening to the dogs bark event.

	//cat listens for the dogs 'bark' event
    cat.on(dog, 'bark', cat.runAway);

    //dispose of the cat
    cat.dispose();

    //dog fires its 'bark' event
    dog.fire({
    	type: 'bark'
    });

    //cat does not respond because there is no cat

```

##Dom

inherit in the usual way:

```Javascript

	var myDomControl = function(arg){

		CORE.Dom.call(this, someArgs);

		// + Some custom properties for myDomControl

	};

	myDomControl.prototype = Object.create(CORE.Dom.prototype);

	// + some custom methods for myDomControl

```



