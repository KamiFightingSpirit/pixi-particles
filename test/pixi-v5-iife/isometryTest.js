/*
Goals:
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
29. Randomize planet's initial position DONE 03/19
24. Fix Mars' texture frame glitching at start DONE 03/18
19. Get everything to accurately reposition upon resize DONE 03/19
9. Test how adding an orbital line looks DONE 03/19
12. Add multiple planets DONE 03/19
17. Load the images properly via loader DONE 03/19
22. Solve the whole delta/step problem with DONE 03/16

TO DO:
11. Create a create planet function 
14. Add in the Relativity toolbar
15. Create a function that creates info boxes for planets 
16. Begin work on individual page view
20. Set z-index of info boxes to always be highest
26. Write in the navbar links
27. Add the links to the hover effects.
28. understand z-index and see if you can shrink the orbits.
30. Add in an animated background (LARGEST NICE TO HAVE BUT WILL USE EVERYWHERE)
31. Get rid of the random 200 in texture ticker update

NICE TO HAVES:
1. Make everything resize on screen resize
2. Add a text animation effect on planets 
3. Make the resize happen when you drop down the nav
4. Make the texture frame wiggle up and down
5. Add shading to the planet
6. Make a planet texture move backwards without glitching
7. Make orbit lines look better in terms of zindex (not sure...)
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
planetContainer.scale.y = 0.2;
planetContainer.scale.x = 0.5;
planetContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(planetContainer);

//Is this actually necessary? Why don't I just have a separate
const isometryPlane = new PIXI.Graphics();
isometryPlane.sortableChildren = true;
planetContainer.addChild(isometryPlane);

//create the loader
const loader = PIXI.Loader.shared;
loader
	.add("./assets/earthcloudmap.jpg") //cyberburn
	.add("./assets/jupiter1k.jpg")
	.add("./assets/jupitermap.jpg")
	.add("./assets/mars.jpg") //mars
	.add("./assets/mercurymap.jpg")
	.add("./assets/plutomap1k.jpg") //pluto
	.add("./assets/plutoShrunk.jpg")
	.add("./assets/sun.jpg")
	.add("./assets/sunShrunk.jpg") //sun
	.add("./assets/venusbump.jpg")
	.add("./assets/venusmap.jpg")

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
	marsTexture.frame = new PIXI.Rectangle(-250, -150, 250, 150);
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

	/* START OF NEW PLANET */

	let otherTexture =
		PIXI.Loader.shared.resources["./assets/jupiter1k.jpg"].texture;
	otherTexture.frame = new PIXI.Rectangle(0, 0, 900, 450); //Texture.frame (x, y, width, height)

	let otherGraphic = new PIXI.Graphics()
		.lineStyle(18, 0xb3caff, 0.25, 0.5) //add atmostphere
		.beginTextureFill(otherTexture)
		.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
		.drawCircle(0, 0, 90)
		.endFill();
	otherGraphic.interactive = true;
	isometryPlane.addChild(otherGraphic);

	//create an infographic for on hover
	let otherInfo = new PIXI.Graphics()
		.lineStyle(2, 0xb3caff)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	otherInfo.visible = false;
	isometryPlane.addChild(otherInfo);

	let otherText = new PIXI.Text(
		"Name: Education and Other\nSchool: UVA - McIntire\nYears: 2009-2015",
		planetTextOptions
	);
	otherText.position.set(30, 30);
	otherInfo.addChild(otherText);

	console.log(cyberburnGraphic.localTransform.get);
	console.log(cyberburnGraphic.localTransform);
	console.log(cyberburnGraphic);

	/*END OF NEW PLANET*/

	let textureTicker = 0;
	let planetSpeed = 0.015;

	let plutoOrbitControl = {
		graphic: plutoGraphic,
		texture: plutoTexture,
		info: plutoInfo,
		radius: 450,
		speedFactor: 1,
		textureTickerFactor: 0.9,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000)) //randomize initial position
	};
	let marsOrbitControl = {
		graphic: marsGraphic,
		texture: marsTexture,
		info: marsInfo,
		radius: 750,
		speedFactor: 0.68,
		textureTickerFactor: 10,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};
	let cyberburnOrbitControl = {
		graphic: cyberburnGraphic,
		texture: cyberburnTexture,
		info: cyberburnInfo,
		radius: 1050,
		speedFactor: 1.15,
		textureTickerFactor: 4,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};
	let otherOrbitControl = {
		graphic: otherGraphic,
		texture: otherTexture,
		info: otherInfo,
		radius: 900,
		speedFactor: 1.15,
		textureTickerFactor: 4,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};

	let planetOrbitControlArr = [
		plutoOrbitControl,
		marsOrbitControl,
		cyberburnOrbitControl,
		otherOrbitControl
	];

	//Build Orbital Lines
	isometryPlane.lineStyle(1.2, 0xffffff);
	planetOrbitControlArr.map(planet => {
		isometryPlane.drawCircle(0, 0, planet.radius);
	});

	// let navContainer = new PIXI.Container();
	// navContainer.position.set(0, 0);
	// app.stage.addChild(navContainer);

	// let headerOne = new PIXI.Text("Overview:", planetTextOptions);
	// navContainer.addChild(headerOne);

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
	otherGraphic.on("mouseover", otherHoverEffects);
	otherGraphic.on("mouseout", otherHoverEffects);
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
	function otherHoverEffects() {
		otherInfo.visible = !otherInfo.visible;
		otherOrbitControl.hovering = !otherOrbitControl.hovering;
	}
}

// Cleanly center emitter upon window resize
window.onresize = function() {
	//resize the canvas to the size of the window
	let _w = window.innerWidth;
	let _h = window.innerHeight;
	app.renderer.resize(_w, _h);
	//recenters all containers upon resize.
	app.stage.children.map(container => {
		container.position.set(
			app.renderer.screen.width / 2,
			app.renderer.screen.height / 2
		);
	});
};
window.addEventListener("resize", window.onresize());

//TEMPORY WORK BELOW THIS

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
