/*
Goals:
6. Add shading to the planet -- let's hope this isn't necessary....
7. Make the planet stop when hover 
8. Make the planet restart when stopped hovering
9. Test how adding an orbital line looks --- need to adjust this
10. Add an info box upon hovering
11. Create a create planet function 
12. Add multiple planets
13. Add in the navbar
14. Add in the Relativity toolbar
15. Create a function that creates info boxes for planets 
16. Begin work on individual page view
17. Load the images properly via loader
18. Figure out how to do different frame scrolls without picture glitching -- let's hope this isn't necessary....
19. Get everything to accurately reposition upon resize
20. Set z-index of info boxes to always be highest

COMPLETED:
1. Get the initial sun setup DONE 03/13
2. Add a corona to the sun -> to be used as atmostphere DONE 03/13
3. Add a planet DONE 03/12
4. Rotate the planet around the sun DONE 03/12
5. Add the planets atmosphere (may differ from the corona setup) DONE 03/13

*/

PIXI.utils.skipHello(); // remove pixi message in console

let mainScreenState = {
	plutoHover: false
};

var canvas = document.getElementById("stage");
var rendererOptions = {
	width: window.innerWidth,
	height: window.innerHeight,
	view: canvas,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	backgroundColor: 0x191919,
	antialias: true
};

let _ = undefined;
const app = new PIXI.Application(rendererOptions);

const planetContainer = new PIXI.Container();
planetContainer.scale.y = 0.18;
planetContainer.scale.x = 0.5;
planetContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(planetContainer);

const isometryPlane = new PIXI.Graphics();
planetContainer.addChild(isometryPlane);

//Build Orbital Lines
isometryPlane.lineStyle(1.2, 0xffffff);
let maxRadius = 1300;
for (let i = 300; i <= maxRadius; i += 150) {
	isometryPlane.drawCircle(0, 0, i);
	// isometryPlane.drawRoundedRect(200, 200, i, i + 50, 100); //can maybe use this as framing for my window popup on planet hoves
	// isometryPlane.drawEllipse(0, 0, i, i + 30); //by extending y you can vary the height of a circle with this.
}

//create the loader
PIXI.Loader.shared
	.add("./assets/plutoShrunk.jpg")
	.add("./assets/plutomap1k.jpg")
	.add("./assets/sunShrunk.jpg")
	.add("./assets/sun.jpg")
	.add("./assets/mars.jpg")
	.load(setup);
function setup() {
	let sunTexture =
		PIXI.Loader.shared.resources["./assets/sunShrunk.jpg"].texture;
	sunTexture.frame = new PIXI.Rectangle(2, 0, 200, 100); //Texture.frame (x, y, width, height)
	let sunGraphic = new PIXI.Graphics()
		.lineStyle(12, 0xcc9f4c, 0.15, 0.5) //add a semi-transparent corona lineStyle(width, color, alpha,alignment,native),
		.beginTextureFill(sunTexture)
		.drawCircle(0, 0, 125)
		.endFill()
		.setTransform(_, _, _, 2.1, _, _); //setTransform(x, y, x-scale,y-scale,xkew,yskew )
	sunGraphic.interactive = true;
	isometryPlane.addChild(sunGraphic);
	//add a background sun to create a double layered corona for the sun
	let backgroundSun = new PIXI.Graphics();
	backgroundSun
		.lineStyle(20, 0xcc9f4c, 0.5, 0.5)
		.drawCircle(0, 0, 127)
		.setTransform(_, _, _, 2.1, _, _).filters = [
		new PIXI.filters.BlurFilter(4)
	];
	isometryPlane.addChild(backgroundSun);

	let plutoTexture =
		PIXI.Loader.shared.resources["./assets/plutomap1k.jpg"].texture;
	plutoTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
	let plutoGraphic = new PIXI.Graphics()
		.lineStyle(7, 0xc3b6aa, 0.25, 0.5) //add atmostphere
		.beginTextureFill(plutoTexture)
		.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
		.drawCircle(0, 0, 60)
		.endFill();
	plutoGraphic.interactive = true;
	isometryPlane.addChild(plutoGraphic);

	//create an infographic for on hover
	window.plutoInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc3b6aa)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	plutoInfo.visible = false;
	isometryPlane.addChild(plutoInfo);

	//
	//Cinzel|Noto+Serif|Titilliu
	let planetTextOptions = {
		fontFamily: "Noto+Serif",
		fontSize: 35,
		fill: "white",
		fontWeight: "800",
		wordWrap: true,
		wordWrapWidth: plutoInfo.width - 40,
		leading: 4,
		resolution: 3
	};

	let plutoText = new PIXI.Text(
		"Name: BlackRock \nTitle: Analyst \nYears: 2015-2017",
		planetTextOptions
	);
	plutoText.position.set(30, 30); //moves text within the box
	plutoInfo.addChild(plutoText);

	let marsTexture = PIXI.Loader.shared.resources["./assets/mars.jpg"].texture;
	marsTexture.frame = new PIXI.Rectangle(0, 0, 700, 300);
	let marsGraphic = new PIXI.Graphics()
		.lineStyle(8, 0xc07158, 0.25, 0.8) //add atmostphere
		.beginTextureFill(marsTexture)
		.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
		.drawCircle(0, 0, 60)
		.endFill();
	marsGraphic.interactive = true;
	// isometryPlane.addChild(marsGraphic);
	let marsSettings = {
		lineStyleOptions: {
			width: 200,
			color: 0xc07158,
			alpha: 0.25,
			alignment: 0.5
		}
		// 	setTransformOptions: {
		// 		x: _,
		// 		y: _,
		// 		scaleX: _,
		// 		scaleY: 2,
		// 		skewX: _,
		// 		skewY: _
		// 	},
		// 	drawCircleOptions: { x: 0, y: 0, radius: 500 },
		// 	interactiveSetting: true
	};
	planetConstructor(marsGraphic, marsTexture, marsSettings);

	let textureTicker = 0;
	let step = 0;
	app.ticker.add(delta => {
		textureTicker += 0.7;

		//control scrolling of a planets texture/background
		sunTexture.frame.width = 200 + textureTicker / 3;
		plutoTexture.frame.width = 200 + textureTicker;
		marsTexture.frame.width = 0 - textureTicker * 7;
		sunTexture.updateUvs();
		plutoTexture.updateUvs();
		marsTexture.updateUvs();
		sunGraphic.geometry.invalidate();
		plutoGraphic.geometry.invalidate();
		marsGraphic.geometry.invalidate();

		//control movement of a planet
		const radiusPluto = 450;
		const speedPluto = 0.015;
		const radiusMars = 750;
		const speedMars = 0.02;
		if (!mainScreenState.plutoHover) {
			step += delta;
			plutoGraphic.position.set(
				Math.cos(step * speedPluto * 1) * radiusPluto,
				Math.sin(step * speedPluto * 1) * radiusPluto
			);

			plutoInfo.position.set(
				Math.cos(step * speedPluto * 1) * radiusPluto,
				Math.sin(step * speedPluto * 1) * radiusPluto
			);
		}

		if (!mainScreenState.marsHover) {
			marsGraphic.position.set(
				Math.cos(step * speedMars * 1) * radiusMars,
				Math.sin(step * speedMars * 1) * radiusMars
			);
		}
	});

	//Add event listeners
	plutoGraphic.on("mouseover", plutoHoverEffects);
	plutoGraphic.on("mouseout", plutoHoverEffects);
}

function planetConstructor(planet, planetTexture, planetSettings) {
	planet.lineStyle(planetSettings.lineStyleOptions);
	// .beginTextureFill(planetSettings.texture)
	// .setTransform(
	// 	planetSettings.setTransformOptions.x,
	// 	planetSettings.setTransformOptions.y,
	// 	planetSettings.setTransformOptions.scaleX,
	// 	planetSettings.setTransformOptions.scaleY,
	// 	planetSettings.setTransformOptions.skewX,
	// 	planetSettings.setTransformOptions.skewY
	// )
	// .drawCircle(planetSettings.drawCircleOptions);
	// planet.interactive = planetSettings.interactiveSetting;
	isometryPlane.addChild(planet);
}

function plutoHoverEffects() {
	mainScreenState.plutoHover = !mainScreenState.plutoHover;
	plutoInfo.visible = !plutoInfo.visible;
}

//PLACEHOLDER ONLY for controlling orbits of planets
function position(step, speed, radius, sprite) {
	sprite = this;
	this.position.set(
		Math.cos(step * speed) * radius,
		Math.sin(step * speed) * radius
	);
}
