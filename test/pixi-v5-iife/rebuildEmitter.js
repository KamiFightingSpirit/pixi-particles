/// <reference path="node_modules/pixi-particles/ambient.d.ts" />
/// <reference path="node_modules/pixi.js/pixi.js.d.ts" />

var configClicked = {
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
		y: 180
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

var loaderClicked = PIXI.Loader.shared;
for (var i = 0; i < urls.length; ++i) loader.add("img" + i, urls[i]);
loaderClicked.load(function() {
	//collect the textures, now that they are all loaded
	var art = imagePaths;

	// Create the new emitter and attach it to the stage
	var emitterContainer = new PIXI.Container();

	stage.addChild(emitterContainer);

	window.emitter = emitter = new PIXI.particles.Emitter(
		emitterContainer,
		art,
		configClicked
	);

	// Center all containers on the stage
	enterText.parent.x = window.innerWidth / 2;
	enterText.parent.y = window.innerHeight / 2;
	emitter.updateOwnerPos(window.innerWidth / 2, window.innerHeight / 2);

	// Start the update
	update();
	console.log(emitter);
});
