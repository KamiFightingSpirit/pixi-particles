/// <reference path="node_modules/pixi-particles/ambient.d.ts" />
/// <reference path="node_modules/pixi.js/pixi.js.d.ts" />

var imagePaths = ["../../docs/examples/images/particle.png"];
PIXI.utils.skipHello(); // remove pixi message in console log

let enterScreenState = {
	clicked: false
};

//Config for the emitter - https://pixijs.io/pixi-particles-editor/
var config = {
	alpha: {
		start: 1,
		end: 0.5
	},
	scale: {
		start: 0.12,
		end: 0.01,
		minimumScaleMultiplier: 1
	},
	color: {
		start: "#ffffff",
		end: "#0abab5 "
	},
	speed: {
		start: 100,
		end: 50,
		minimumSpeedMultiplier: 1
	},
	acceleration: {
		x: 0,
		y: 0
	},
	maxSpeed: 0,
	startRotation: {
		min: 90,
		max: 0
	},
	noRotation: false,
	rotationSpeed: {
		min: 500,
		max: 500
	},
	lifetime: {
		min: 2,
		max: 2
	},
	blendMode: "normal",
	frequency: 0.001,
	emitterLifetime: -1,
	maxParticles: 5000,
	pos: {
		x: 0,
		y: 0
	},
	addAtBack: true,
	spawnType: "ring",
	spawnCircle: {
		x: -2,
		y: 0,
		r: 160,
		minR: 150
	}
};

//Create the canvas
var canvas = document.getElementById("stage");

// Basic PIXI Setup -- Setting the resolution and autoDensity "sharpens" everything and makes appearence the same for retina devices
var rendererOptions = {
	width: canvas.innerWidth,
	height: canvas.innerHeight,
	view: canvas,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	backgroundColor: 0x191919
};

//Create the base container
var stage = new PIXI.Container(),
	renderer = new PIXI.Renderer(rendererOptions),
	emitter = null,
	bg = null;

// Calculate the current time
var elapsed = Date.now();
// Setup needed ticker variables
var updateId, delta;
let speedController = 0.001; //controls the speed of emitter, the greater the number the faster it is
let radiusTicker = 0; //used to expand radius post enterText click
let particleScaleTicker = 0; //dicking around
var particle, next; //dicking around
var simpleTicker = 0; //dicking around

// Update function every frame
var update = function() {
	//
	simpleTicker += 0.1;
	var now = Date.now();
	delta = now - elapsed; //16 or 17 (1000/60 fps?)

	if (enterScreenState.clicked === true) {
		//ticker setup
		radiusTicker += 10 / delta;
		particleScaleTicker += 50 / delta;

		//Expand radius
		emitter.spawnCircle = {
			x: -2,
			y: 0,
			radius: 190 + radiusTicker,
			type: 2,
			minRadius: 160 + radiusTicker
		};
		//dick around with expanding particle scale
		for (particle = emitter._activeParticlesFirst; particle; particle = next) {
			// particle.transform.scale.x =
			// 	particle.transform.scale.x + particleScaleTicker;
			particle.transform.scale.x = Math.sin(simpleTicker) / 10;
			next = particle.next; //n+1 = null, thus for loop will fail due falsy

			// if (particle.next === null) {
			// 	// console.log(particle.transform.scale.x);
			// }
		}
	}

	// Update the emitter's next frame
	updateId = requestAnimationFrame(update);
	if (emitter) emitter.update(delta * speedController);
	elapsed = now;
	// render the stage
	renderer.render(stage);

	// emitter.parent.transform.skew.x = Math.sin(delta) / 100;
};

// Preload the particle images and create PIXI textures from it
var urls = []; // imagePaths.slice();
urls.push("../../docs/examples/images/bg.png");

//the loader allows pixi to execute actions only when the required utilities are ready
var loader = PIXI.Loader.shared;
for (var i = 0; i < urls.length; ++i) loader.add("img" + i, urls[i]);
loader.load(function() {
	//collect the textures, now that they are all loaded
	var art = imagePaths;

	// Create the new emitter and attach it to the stage
	var emitterContainer = new PIXI.Container();
	stage.addChild(emitterContainer);
	window.emitter = emitter = new PIXI.particles.Emitter(
		emitterContainer,
		art,
		config
	);

	//Create the container to hold the welcome text
	var textContainer = new PIXI.Container();
	stage.addChild(textContainer);

	//Create the welcome text and position it
	window.enterText = enterText = new PIXI.Text("- Hover -", {
		fontFamily: "Arial",
		fontSize: 20,
		fill: "silver"
	});
	enterText.anchor.set(0.5);
	enterText.interactive = true;
	enterText.cursor = "pointer";
	textContainer.addChild(enterText);

	// Center all containers on the stage
	enterText.parent.x = window.innerWidth / 2;
	enterText.parent.y = window.innerHeight / 2;
	emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

	enterText.mouseover = function(mousedata) {
		console.log("_activeParticlesFirst:", emitter._activeParticlesFirst);

		//-------------------MOUSEOVER: EDIT THE TEXT--------------------
		this.style.fill = "#FFFFFF";
		this.style.fontSize = 21;
		this.text = "- Enter -";

		//-------------------MOUSEOVER: EDIT THE EMITTER------------------
		if (enterScreenState.clicked === false) {
			//Creates burst effect
			emitter.particlesPerWave = 500;

			//Ties into the update function, a smaller number is slower
			speedController = 0.0003;

			//this is pretty good, problem is needs to ease-in
			// emitter.startScale.value = 0.5;

			//Editing the radius
			emitter.spawnCircle = {
				x: -2,
				y: 0,
				radius: 160,
				type: 2,
				minRadius: 140
			};

			//Changes how long each particle survives
			emitter.minLifetime = 0.82;
			emitter.maxLifetime = 0.82;
		}

		/*
		GOOD SETTINGS:
		
		emitter.particlesPerWave = 500;
		speedController = 0.0003;
		emitter.spawnCircle = { x: -2, y: 0, radius: 160, type: 2, minRadius: 140 };	
		emitter.minLifetime = 0.82;
		emitter.maxLifetime = 0.82;	
		*/

		//this one only works once, can't reset
		// emitter.minimumScaleMultiplier = 5;

		// emitter.startScale.next.value = 0.2;
		// emitter.startScale.next.time = 4;
		//this one looks quite good: creates a burst effect -- can also do this via particlesPerWave
		// emitter.frequency = 0.00000000000001;
	};

	enterText.mouseout = function(mousedata) {
		if (enterScreenState.clicked === false) {
			//-------------------MOUSEOUT: RESET THE TEXT---------------------
			this.style.fill = "silver";
			this.style.fontSize = 20;

			//-------------------MOUSEOUT: RESET THE EMITTER------------------
			emitter.particlesPerWave = 1;
			speedController = 0.001;
			emitter.spawnCircle = {
				x: -2,
				y: 0,
				radius: 160,
				type: 2,
				minRadius: 150
			};
			emitter.minLifetime = 2;
			emitter.maxLifetime = 2;

			// emitter.startScale.value = 0.1; //this works but is sudden, need ease
			// emitter.minimumScaleMultiplier = 1;
		}
	};

	//CLICK FUNCTION
	enterText.pointerdown = function() {
		enterScreenState.clicked = true;
		//placeholder for spaceCowboy
		this.text === "Clicked"
			? (this.text = "- Enter -")
			: (this.text = "See You Space Cowboy");
		enterText.interactive = false;

		// edit emitter

		//I SHOULD HAVE A RESET FUNCTION AS I AM USING IT TWICE IN ORDER TO HAVE DRY CODE
		//WANT TO SLOW DOWN THE PARTICLES
		emitter.minimumSpeedMultiplier = 3;
		emitter.particlesPerWave = 1;
		// emitter.acceleration = new PIXI.Point(0, 180);
		emitter.minLifetime = 3;
		emitter.maxLifetime = 3;

		// var particle, next;
		// for (particle = emitter._activeParticlesFirst; particle; particle = next) {
		// 	next = particle.next;
		// 	// console.log(particle.age);
		// 	if (particle.age < 1.7) {
		// 		particle.age = 0.5;
		// 	}

		// 	// emitter.recycle(particle);
		// 	// if (particle.parent) particle.parent.removeChild(particle);
		// 	// particle.x = window.innerWidth / 2;
		// 	// particle.y = window.innerHeight / 2;
		// 	// particle.rotationSpeed(1000);

		// 	if (particle.next === null) {
		// 		console.log(particle);
		// 		console.log(particle.transform.rotation);
		// 	}
		// }

		emitter.spawnCircle = { x: -2, y: 0, radius: 190, type: 2, minRadius: 180 };

		// speedController = 0.0015;
		emitter.minimumScaleMultiplier = 5;
	};
	// Start the update
	update();
	console.log(emitter);
});

// Upon window resize, resize the canvas to the size of the window
window.onresize = function() {
	let _w = window.innerWidth;
	let _h = window.innerHeight;
	renderer.resize(_w, _h);

	if (!emitter) return;
	emitter.updateOwnerPos(renderer.screen.width / 2, renderer.screen.height / 2);
	enterText.parent.x = renderer.screen.width / 2;
	enterText.parent.y = renderer.screen.height / 2;
};
window.addEventListener("resize", window.onresize());

//Destroy Emitter Function
window.destroyEmitter = function() {
	emitter.destroy();
	emitter = null;
	window.destroyEmitter = null;
};
