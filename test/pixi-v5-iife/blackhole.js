var imagePaths = ["./assets/bgassets/particlefromeditor.png"];

PIXI.utils.skipHello(); // remove pixi message in console

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
// var particle, next; //dicking around

// Update function every frame
var update = function(time) {
	// TWEEN.update(time);
	var now = Date.now();
	delta = now - elapsed; //16 or 17 (1000/60 fps?)

	//check if user has clicked enterText
	if (enterScreenState.clicked === true) {
		//ticker setup
		radiusTicker += 10 / delta;
		//Expand radius
		emitter.spawnCircle = {
			x: -2,
			y: 0,
			radius: 210 + radiusTicker,
			type: 2,
			minRadius: 170 + radiusTicker / 7
		};

		//dick around with expanding particle scale

		// if (simpleTicker % 20 === 0) {
		// 	for (
		// 		particle = emitter._activeParticlesFirst;
		// 		particle;
		// 		particle = next
		// 	) {
		// 		particle.scale.x = 1 + Math.sin(simpleTicker) / 10;
		// 		particle.transform.scale.y = 1 + Math.sin(simpleTicker) / 10;
		// 		next = particle.next; //n+1 = null, thus for loop will fail due falsy
		// 	}

		// if (particle.next === null) {
		// }
		// }
	}

	// Update the emitter's next frame
	updateId = requestAnimationFrame(update);
	if (emitter) emitter.update(delta * speedController);
	elapsed = now;
	//update all TWEENs
	TWEEN.update();
	// render the stage
	renderer.render(stage);

	// emitter.parent.transform.skew.x = Math.sin(delta) / 100;
};

//LOADER IS NOT SETUP CORRECTLY Dont think it is even really being used right now.
//the loader allows pixi to execute actions only when the required utilities are ready
var loader = PIXI.Loader.shared;
// loader.add(imagePaths);

loader.load(function() {
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

	//collect the textures, now that they are all loaded - but this isn't even accessing loader LOLLLL
	var art = imagePaths;

	// Create the new emitter and attach it to the stage
	var emitterContainer = new PIXI.Container();
	stage.addChild(emitterContainer);
	window.emitter = emitter = new PIXI.particles.Emitter(
		emitterContainer,
		art,
		config
	);

	// Start the update
	update();
});

//MOUSEOVER: Effects from hovering on enterText
let enterTextHoverEffects = function() {
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
		//Editing the radius
		emitter.spawnCircle = {
			x: -2,
			y: 0,
			radius: 160,
			type: 2,
			minRadius: 140
		};
		//Changes how long each particle survives
		emitter.minLifetime = 0.6;
		emitter.maxLifetime = 0.6;

		//this is pretty good, but would want to ease-in
		// emitter.startScale.value = 0.5;
	}
};

//MOUSEOUT: Effects from exiting hover
let enterTextExitEffects = function() {
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
	}
};

//MOUSECLICK: Effects from clicking enterText
let enterTextClickEffects = function() {
	//update enterScreenState
	enterScreenState.clicked = true;
	//stop user from clicking creating additional effects
	enterText.parent.destroy();
	enterText.destroy();
	spaceCowboy();

	//-------------------MOUSECLICK: EDIT THE EMITTER------------------
	emitter.minimumSpeedMultiplier = 3;
	emitter.particlesPerWave = 1;
	emitter.minLifetime = 3;
	emitter.maxLifetime = 3;
	emitter.minimumScaleMultiplier = 5;
	// speedController = 0.0015;

	//Age some existing particles to shorten new wave spawn
	var particle, next;
	for (particle = emitter._activeParticlesFirst; particle; particle = next) {
		next = particle.next;

		if (particle.age < 0.4) {
			particle.age = 0.4;
		}
	}
};

enterText.on("mouseover", enterTextHoverEffects);
enterText.on("mouseout", enterTextExitEffects);
enterText.on("pointerdown", enterTextClickEffects);

//Kills existing particles upon window resize
let particleCleanup = function() {
	for (particle = emitter._activeParticlesFirst; particle; particle = next) {
		next = particle.next;
		particle.kill();
	}
};

// Cleanly center emitter upon window resize
window.onresize = function() {
	//resize the canvas to the size of the window
	let _w = window.innerWidth;
	let _h = window.innerHeight;
	renderer.resize(_w, _h);

	//reposition containers
	if (!emitter) return;
	emitter.updateOwnerPos(renderer.screen.width / 2, renderer.screen.height / 2);
	enterText.parent.x = renderer.screen.width / 2;
	enterText.parent.y = renderer.screen.height / 2;

	//Kill existing particles
	particleCleanup();
};
window.addEventListener("resize", window.onresize());

//Destroy Emitter Function -- Placeholder currently
window.destroyEmitter = function() {
	emitter.destroy();
	emitter = null;
	window.destroyEmitter = null;
};

//Placeholder printouts
console.log(
	emitter,
	"_activeParticlesFirst:",
	setTimeout(() => console.log(emitter._activeParticlesFirst), 10)
);

//Create the spaceCowboy text
spaceCowboy = function() {
	//Setup container to hold all our text
	this.sCowboyContainer = new PIXI.Container();
	stage.addChild(sCowboyContainer);
	//Create a variable to directly access the text objects in the container
	let sCowboyChildren = sCowboyContainer.children;
	//object to be used for styling the text
	spaceCowboyStyle = {
		fontFamily: "Verdana",
		fontSize: 25,
		fill: "silver",
		fontWeight: 700
	};
	//create the individual text lines
	spaceCowboyOne = new PIXI.Text("See", spaceCowboyStyle);
	spaceCowboyTwo = new PIXI.Text("You", spaceCowboyStyle);
	spaceCowboyThree = new PIXI.Text("Space", spaceCowboyStyle);
	spaceCowboyFour = new PIXI.Text("Cowboy", spaceCowboyStyle);

	//add them to their parent container
	sCowboyContainer.addChild(
		spaceCowboyOne,
		spaceCowboyTwo,
		spaceCowboyThree,
		spaceCowboyFour
	);

	//CREATE A FILTER FOR spaceCowboy
	//new PIXI.filters.BlurFilter (strength, quality, resolution, kernelSize)
	let sCowboyFilter = new PIXI.filters.BlurFilter();
	//Position the text within the container
	let posY = 0; //Used to seperate each text line
	let startAlpha = 0.01; //used as our starting point for alpha
	sCowboyChildren.map(sCowboyText => {
		sCowboyText.anchor.set(0.5, 0.5);
		sCowboyText.position.set(0, posY);
		posY += 50;
		sCowboyText.alpha = startAlpha;
		sCowboyText.filters = [new PIXI.filters.BlurFilter()];
	});
	//center the container on the stage
	sCowboyContainer.position = {
		x: window.innerWidth / 2,
		y: window.innerHeight / 2 - sCowboyContainer.height / 2 + 10 //offset to center children -- not sure if hard coding is good practice
	};

	//now that we have our text container all setup, let's call the function for spaceCowboyAnimation
	spaceCowboyAnimation(sCowboyChildren, sCowboyFilter);
};

//REWRITE ALL OF THIS SHIT
//Animates spaceCowboyText
function spaceCowboyAnimation(sCowboyChildren, sCowboyFilter) {
	//temp printout of a PIXI.Text
	console.log(sCowboyChildren[0]);
	// sCowboyFilter.blur = 0;
	//there is some weird issue, alphaTweenZero2 is running automatically without a .start() on it but alphaTweenZero won't.
	//this is making it so alphaTweenZero isn't finishing first before kicking off alphaTweenZero2

	let midAlpha = { alpha: 0.8 };
	let endAlpha = { alpha: 0 };
	// let alphaCurve = { alpha: [startAlpha, midAlpha, endAlpha] };
	let alphaTime = 1500; //used to control total time of alpha tweens
	let posY = -80;
	let baseDelay = 470;

	// sCowboyContainer.children[0].filters[0].blur = 0;
	// //Tweens for "See"
	let alphaTweenZero2 = new TWEEN.Tween(sCowboyChildren[0])
		.to({ alpha: 0 })
		.to(endAlpha, 1100)
		.easing(TWEEN.Easing.Quartic.Out);
	//create our tweens to interact with our array of PIXI.Text
	let alphaTweenZero = new TWEEN.Tween(sCowboyChildren[0])
		.to({ alpha: 0 }, 2000)
		.to(midAlpha, 2000)
		.easing(TWEEN.Easing.Quartic.Out)
		.chain(alphaTweenZero2)
		.start();
	let translateYZero = new TWEEN.Tween(sCowboyChildren[0])
		.to({ angle: 25, x: 40, y: posY }, 1300)
		.easing(TWEEN.Easing.Sinusoidal.In)
		.delay(1400)
		.start();
	let blurFilterZero2 = new TWEEN.Tween(sCowboyChildren[0].filters[0])
		.to({ blur: 0 })
		.to({ blur: 8 }, 1100)
		.easing(TWEEN.Easing.Back.Out);
	let blurFilterZero = new TWEEN.Tween(sCowboyChildren[0].filters[0])
		.to({ blur: 8 }, 1700)
		.to({ blur: 0 }, 2000)
		.easing(TWEEN.Easing.Cubic.InOut)
		.chain(blurFilterZero2)
		.start();

	//Tweens for "You"
	let alphaTweenOne2 = new TWEEN.Tween(sCowboyChildren[1])
		.to(endAlpha, 1100)
		.easing(TWEEN.Easing.Quartic.Out);
	let alphaTweenOne = new TWEEN.Tween(sCowboyChildren[1])
		.to({ alpha: 0 }, 2000)
		.to(midAlpha, 2000)
		.easing(TWEEN.Easing.Quartic.Out)
		.chain(alphaTweenOne2)
		.delay(baseDelay)
		.start();
	let translateYOne = new TWEEN.Tween(sCowboyChildren[1])
		.to({ angle: 25, x: 40, y: posY + 10 }, 1300)
		.easing(TWEEN.Easing.Sinusoidal.In)
		.delay(1400 + baseDelay)
		.start();
	let blurFilterOne2 = new TWEEN.Tween(sCowboyChildren[1].filters[0])
		.to({ blur: 0 })
		.to({ blur: 8 }, 1100)
		.easing(TWEEN.Easing.Back.Out);
	let blurFilterOne = new TWEEN.Tween(sCowboyChildren[1].filters[0])
		.to({ blur: 8 }, 1700)
		.to({ blur: 0 }, 2000)
		.easing(TWEEN.Easing.Cubic.InOut)
		.chain(blurFilterOne2)
		.delay(baseDelay)
		.start();

	//Tweens for "Space"
	let alphaTweenTwo2 = new TWEEN.Tween(sCowboyChildren[2])
		.to(endAlpha, 1100)
		.easing(TWEEN.Easing.Quartic.Out);
	let alphaTweenTwo = new TWEEN.Tween(sCowboyChildren[2])
		.to({ alpha: 0 }, 2000)
		.to(midAlpha, 2000)
		.easing(TWEEN.Easing.Quartic.Out)
		.chain(alphaTweenTwo2)
		.delay(baseDelay * 1.8)
		.start();
	let translateYTwo = new TWEEN.Tween(sCowboyChildren[2])
		.to({ angle: 25, x: 40, y: posY + 15 }, 1300)
		.easing(TWEEN.Easing.Sinusoidal.In)
		.delay(1400 + baseDelay * 1.8)
		.start();
	let blurFilterTwo2 = new TWEEN.Tween(sCowboyChildren[2].filters[0])
		.to({ blur: 0 })
		.to({ blur: 8 }, 1100)
		.easing(TWEEN.Easing.Back.Out);
	let blurFilterTwo = new TWEEN.Tween(sCowboyChildren[2].filters[0])
		.to({ blur: 8 }, 1700)
		.to({ blur: 0 }, 2000)
		.easing(TWEEN.Easing.Cubic.InOut)
		.chain(blurFilterTwo2)
		.delay(baseDelay * 1.8)
		.start();

	//Tweens for "Cowboy"
	let alphaTweenThree2 = new TWEEN.Tween(sCowboyChildren[3])
		.to(endAlpha, 1100)
		.easing(TWEEN.Easing.Quartic.Out);
	let alphaTweenThree = new TWEEN.Tween(sCowboyChildren[3])
		.to({ alpha: 0 }, 2000)
		.to(midAlpha, 2000)
		.easing(TWEEN.Easing.Quartic.Out)
		.chain(alphaTweenThree2)
		.delay(baseDelay * 2.6)
		.start();
	let translateYThree = new TWEEN.Tween(sCowboyChildren[3])
		.to({ angle: 25, x: 40, y: posY + 20 }, 1300)
		.easing(TWEEN.Easing.Sinusoidal.In)
		.delay(1400 + baseDelay * 2.6)
		.start();
	let blurFilterThree2 = new TWEEN.Tween(sCowboyChildren[3].filters[0])
		.to({ blur: 0 })
		.to({ blur: 8 }, 1100)
		.easing(TWEEN.Easing.Back.Out);
	let blurFilterThree = new TWEEN.Tween(sCowboyChildren[3].filters[0])
		.to({ blur: 8 }, 1700)
		.to({ blur: 0 }, 2000)
		.easing(TWEEN.Easing.Cubic.InOut)
		.chain(blurFilterThree2)
		.delay(baseDelay * 2.6)
		.start();

	//EVENTUALLY I WILL WANT THIS TO BE IN A LOOP FOR DRY CODE PLEASE
	// let tweenTest = new TWEEN();
	// sCowboyChildren.map(sCowboyText => {
	// 	tweenTest
	// 		.Tween(sCowboyText)
	// 		.to({ alpha: 0 }, 2000)
	// 		.to({ alpha: 1 }, 2000)
	// 		.start();
	// });
}
