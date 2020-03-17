/*
Goals:
6. Add shading to the planet -- let's hope this isn't necessary....
9. Test how adding an orbital line looks --- need to adjust this
11. Create a create planet function 
12. Add multiple planets
14. Add in the Relativity toolbar
15. Create a function that creates info boxes for planets 
16. Begin work on individual page view
17. Load the images properly via loader
18. Figure out how to do different frame scrolls without picture glitching -- let's hope this isn't necessary....
19. Get everything to accurately reposition upon resize
20. Set z-index of info boxes to always be highest
22. Solve the whole delta/step problem with
23. Add a nicer info text load? Lower priority
24. Fix Mars' texture frame glitching at start (maybe I can change the start position?)
26. Write in the navbar links
27. Add the links to the hover effects.

COMPLETED:
1. Get the initial sun setup DONE 03/13
2. Add a corona to the sun -> to be used as atmostphere DONE 03/13
3. Add a planet DONE 03/12
4. Rotate the planet around the sun DONE 03/12
5. Add the planets atmosphere (may differ from the corona setup) DONE 03/13
7. Make the planet stop when hover DONE 03/16
8. Make the planet restart when stopped hovering DONE 03/16
10. Add an info box upon hovering DONE 03/15
13. Add in the navbar DONE 03/17
21. Add setting for planet's initial positioning (Can set via the STEP attribute) DONE 03/16
25. Make the Navbar always collapsable hamburger DONE 03/17

*/

PIXI.utils.skipHello(); // remove pixi message in console

let mainScreenState = {
	plutoHover: false
};

var canvas = document.getElementById("stage");
var rendererOptions = {
	width: window.innerWidth,
	height: window.innerHeight - 56,
	view: canvas,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	backgroundColor: 0x191919,
	antialias: true
};

let _ = undefined;
const app = new PIXI.Application(rendererOptions);

const planetContainer = new PIXI.Container();
planetContainer.scale.y = 0.2;
planetContainer.scale.x = 0.5;
planetContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(planetContainer);

const isometryPlane = new PIXI.Graphics();
planetContainer.addChild(isometryPlane);

//create the loader
const loader = PIXI.Loader.shared;
loader
	.add("./assets/plutoShrunk.jpg")
	.add("./assets/plutomap1k.jpg")
	.add("./assets/sunShrunk.jpg")
	.add("./assets/sun.jpg")
	.add("./assets/mars.jpg")
	.add("./assets/earthcloudmap.jpg")
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
		.lineStyle(30, 0xcc9f4c, 0.5, 0.5)
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

	let marsInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc07158)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	marsInfo.visible = false;
	isometryPlane.addChild(marsInfo);
	planetConstructor(marsGraphic, marsTexture, marsSettings);

	let marsText = new PIXI.Text(
		"Name: Bridgewater \nTitle: Associate \nYears: 2017-2018",
		planetTextOptions
	);
	marsText.position.set(30, 30); //moves text within the box
	marsInfo.addChild(marsText);

	/* START OF NEW PLANET */

	let cyberburnTexture =
		PIXI.Loader.shared.resources["./assets/earthcloudmap.jpg"].texture;
	cyberburnTexture.frame = new PIXI.Rectangle(0, 0, 400, 400); //Texture.frame (x, y, width, height)
	let cyberburnGraphic = new PIXI.Graphics()
		.lineStyle(18, 0xb3caff, 0.25, 0.5) //add atmostphere
		.beginTextureFill(cyberburnTexture)
		.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
		.drawCircle(0, 0, 90)
		.endFill();
	cyberburnGraphic.interactive = true;
	isometryPlane.addChild(cyberburnGraphic);

	//create an infographic for on hover
	let cyberburnInfo = new PIXI.Graphics()
		.lineStyle(2, 0xb3caff)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	cyberburnInfo.visible = false;
	isometryPlane.addChild(cyberburnInfo);

	let cyberburnText = new PIXI.Text(
		"Name: Cyberburn \nTitle: Owner and CEO \nYears: 2009-2015",
		planetTextOptions
	);
	cyberburnText.position.set(30, 30); //moves text within the box
	cyberburnInfo.addChild(cyberburnText);

	/*END OF NEW PLANET*/

	let textureTicker = 0;
	let planetSpeed = 0.015;

	let plutoOrbitControl = {
		graphic: plutoGraphic,
		texture: plutoTexture,
		info: plutoInfo,
		radius: 450,
		speedFactor: 1,
		textureTickerFactor: 1,
		hovering: false,
		step: 0 //can use this as a hacky way to set initial position
	};
	let marsOrbitControl = {
		graphic: marsGraphic,
		texture: marsTexture,
		info: marsInfo,
		radius: 750,
		speedFactor: 0.68,
		textureTickerFactor: -7,
		hovering: false,
		step: 120000
	};
	let cyberburnOrbitControl = {
		graphic: cyberburnGraphic,
		texture: cyberburnTexture,
		info: cyberburnInfo,
		radius: 1050,
		speedFactor: 1.15,
		textureTickerFactor: 4,
		hovering: false,
		step: 190000
	};

	let planetOrbitControlArr = [
		plutoOrbitControl,
		marsOrbitControl,
		cyberburnOrbitControl
	];

	//Build Orbital Lines
	isometryPlane.lineStyle(1.2, 0xffffff);
	planetOrbitControlArr.map(planet => {
		isometryPlane.drawCircle(0, 0, planet.radius);
	});

	app.ticker.add(delta => {
		textureTicker += 0.7;

		//Controls the positioning and texture scrolling of all planets
		planetOrbitControlArr.map(planet => {
			planet.texture.frame.width =
				200 + textureTicker * planet.textureTickerFactor;
			planet.texture.updateUvs();
			planet.graphic.geometry.invalidate();
			if (!planet.hovering) {
				planet.step += delta;
				planet.graphic.position.set(
					Math.cos(planet.step * planetSpeed * planet.speedFactor) *
						planet.radius,
					Math.sin(planet.step * planetSpeed * planet.speedFactor) *
						planet.radius
				);
				planet.info.position.set(
					Math.cos(planet.step * planetSpeed * planet.speedFactor) *
						planet.radius,
					Math.sin(planet.step * planetSpeed * planet.speedFactor) *
						planet.radius
				);
			}
		});

		//control scrolling of sun's texture/background
		sunTexture.frame.width = 200 + textureTicker / 3;
		sunTexture.updateUvs();
		sunGraphic.geometry.invalidate();
	});

	//Add event listeners
	plutoGraphic.on("mouseover", plutoHoverEffects);
	plutoGraphic.on("mouseout", plutoHoverEffects);
	marsGraphic.on("mouseover", marsHoverEffects);
	marsGraphic.on("mouseout", marsHoverEffects);
	cyberburnGraphic.on("mouseover", cyberburnHoverEffects);
	cyberburnGraphic.on("mouseout", cyberburnHoverEffects);
	function plutoHoverEffects() {
		plutoInfo.visible = !plutoInfo.visible;
		plutoOrbitControl.hovering = !plutoOrbitControl.hovering;
	}
	function marsHoverEffects() {
		marsInfo.visible = !marsInfo.visible;
		marsOrbitControl.hovering = !marsOrbitControl.hovering;
	}
	function cyberburnHoverEffects() {
		cyberburnInfo.visible = !cyberburnInfo.visible;
		cyberburnOrbitControl.hovering = !cyberburnOrbitControl.hovering;
	}
}

function planetConstructor(planet, planetTexture, planetSettings) {
	planet.lineStyle(planetSettings.lineStyleOptions);

	// .beginTextureFill(planetSettings.texture)
	// .setTransform(
	// 	planetSettings.setTransformOptions.x,
	// 	planetSettings.setTransformOptions.y,
	// 	planetSettings.setTransformOptions.scaleX,W
	// 	planetSettings.setTransformOptions.scaleY,
	// 	planetSettings.setTransformOptions.skewX,
	// 	planetSettings.setTransformOptions.skewY
	// )
	// .drawCircle(planetSettings.drawCircleOptions);
	// planet.interactive = planetSettings.interactiveSetting;
	isometryPlane.addChild(planet);
}
// isometryPlane.drawRoundedRect(200, 200, i, i + 50, 100); //can maybe use this as framing for my window popup on planet hoves
// isometryPlane.drawEllipse(0, 0, i, i + 30); //by extending y you can vary the height of a circle with this.
