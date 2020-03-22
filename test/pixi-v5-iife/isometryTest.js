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
20. Set z-index of info boxes to always be highest DONE 03/20
22. Solve the whole delta/step problem with DONE 03/16
28. understand z-index and see if you can shrink the orbits. DONE 03/20
35. look to see if isometry plane is necessary of if everything should be inside of the planetContainer instead. DONE 03/22
36. Make the blinking of the stars have an easy speed control DONE 03/22
38. Make the stars have a maxScale based off their random initial scale (note: rejected - max is randomized via initial anyays) DONE 03/22
39. Try out having multiple images for stars to see if it makes a significant impact? Might just be a nice to have DONE 03/22
40. GOOD: Add dynamic starry background DONE 03/22
41. Fade the suicide stars out DONE 03/22

TO DO:
11. Create a create planet function  -- wait until React import
14. Add in the Relativity toolbar -- wait until React import
15. Create a function that creates info boxes for planets   -- wait until React import
16. Begin work on individual page view
26. Write in the navbar links 
27. Add the links to the hover effects. 
30. Add in an animated background (LARGEST NICE TO HAVE BUT WILL USE EVERYWHERE)
31. Get rid of the random 200 in texture ticker update
32. Properly adjust the wordWrapWidth on info boxes
33. Cleanup the event listeners section DRY CODE  -- wait until React import
34. Add in contact me icons in navbar



NICE TO HAVES:
GOOD: Add in additional hover effects for planets (highlighting, etc)
1. Make everything resize on screen resize
2. Add a text animation effect on planets 
3. Make the resize happen when you drop down the nav
4. Make the texture frame wiggle up and down
5. Add shading to the planet
6. Make a planet texture move backwards without glitching
7. Make orbit lines look better in terms of zindex (not sure...)
8. Maybe work on the random function for the planets initial positioning... have some sort of a guaranteed space between them
9. Create a random shooting star effect

11. Get rid of stars that spawn on orbital lines
*/

PIXI.utils.skipHello(); // remove pixi message in console

var canvas = document.getElementById("stage");
var rendererOptions = {
	width: window.innerWidth,
	height: window.innerHeight,
	view: canvas,
	resolution: window.devicePixelRatio,
	backgroundColor: 0x191919,
	autoDensity: true,
	antialias: true
};

let _ = void 0;
const app = new PIXI.Application(rendererOptions);
app.stage.sortableChildren = true;

const planetContainer = new PIXI.Container();
planetContainer.scale.y = 0.2;
planetContainer.scale.x = 0.5;
planetContainer.position.set(app.screen.width / 2, app.screen.height / 2);
planetContainer.sortableChildren = true;
app.stage.addChild(planetContainer);

//Is this actually necessary? Why don't I just have everything in the planet container instead?
const isometryPlane = new PIXI.Graphics();
isometryPlane.zIndex = -10000;
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
	.add("./assets/bgassets/Bubbles99.png")
	.add("./assets/bgassets/CartoonSmoke.png")
	.add("./assets/bgassets/HardRain.png")
	.add("./assets/bgassets/particlefromeditor.png")
	.add("./assets/bgassets/smokeparticle.png")
	.add("./assets/bgassets/snow100.png")
	.add("./assets/bgassets/Sparks.png")
	.load(setup);

function setup() {
	//Cinzel|Noto+Serif|Titilliu
	let planetTextOptions = {
		fontFamily: "Noto+Serif",
		fontSize: 35,
		fill: "white",
		fontWeight: "800",
		wordWrap: true,
		wordWrapWidth: 400,
		leading: 4,
		resolution: 3
	};

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
	planetContainer.addChild(sunGraphic);
	//add a background sun to create a double layered corona for the sun
	let backgroundSun = new PIXI.Graphics();
	backgroundSun
		.lineStyle(30, 0xcc9f4c, 0.5, 0.5)
		.drawCircle(0, 0, 127)
		.setTransform(_, _, _, 2.1, _, _).filters = [
		new PIXI.filters.BlurFilter(4)
	];
	planetContainer.addChild(backgroundSun);

	//create an infographic for on hover
	let sunInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc9b799)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	sunInfo.zIndex = 10000;
	sunInfo.visible = false;
	planetContainer.addChild(sunInfo);

	let sunText = new PIXI.Text("About\nThis\nSite", planetTextOptions);
	sunText.position.set(
		sunInfo.width / 4 + sunText.width / 4,
		sunInfo.height / 10 - sunText.height / 5
	);
	sunText.style.fontSize = 50;
	sunText.style.align = "center";
	sunInfo.addChild(sunText);

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
	planetContainer.addChild(plutoGraphic);

	//create an infographic for on hover
	window.plutoInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc3b6aa)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	plutoInfo.zIndex = 10000;
	plutoInfo.visible = false;
	planetContainer.addChild(plutoInfo);

	let plutoText = new PIXI.Text(
		"Name: BlackRock \nTitle: Analyst \nYears: 2015-2017",
		planetTextOptions
	);
	plutoText.style.align = "center";
	plutoText.position.set(65, 35); //moves text within the box
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
	// planetContainer.addChild(marsGraphic);
	let marsSettings = {
		lineStyleOptions: {
			width: 200,
			color: 0xc07158,
			alpha: 0.25,
			alignment: 0.5
		}
	};

	let marsInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc07158)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	marsInfo.zIndex = 10000;
	marsInfo.visible = false;
	planetContainer.addChild(marsInfo);
	planetConstructor(marsGraphic, marsTexture, marsSettings);

	let marsText = new PIXI.Text(
		"Name: Bridgewater \nTitle: Associate \nYears: 2017-2018",
		planetTextOptions
	);
	marsText.style.align = "center";
	marsText.position.set(55, 35); //moves text within the box
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
	planetContainer.addChild(cyberburnGraphic);

	//create an infographic for on hover
	let cyberburnInfo = new PIXI.Graphics()
		.lineStyle(2, 0xb3caff)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	cyberburnInfo.zIndex = 10000;
	cyberburnInfo.visible = false;
	planetContainer.addChild(cyberburnInfo);

	let cyberburnText = new PIXI.Text(
		"Name: Cyberburn \nTitle: Owner and CEO \nYears: 2009-2015",
		planetTextOptions
	);
	cyberburnText.style.align = "center";
	cyberburnText.position.set(30, 30); //moves text within the box
	cyberburnInfo.addChild(cyberburnText);

	let otherTexture =
		PIXI.Loader.shared.resources["./assets/jupiter1k.jpg"].texture;
	otherTexture.frame = new PIXI.Rectangle(0, 0, 900, 450); //Texture.frame (x, y, width, height)

	let otherGraphic = new PIXI.Graphics()
		.lineStyle(12, 0xf2ddbb, 0.25, 0.5) //add atmostphere
		.beginTextureFill(otherTexture)
		.setTransform(_, _, _, 2, _, _)
		.drawCircle(0, 0, 90)
		.endFill();
	otherGraphic.interactive = true;
	planetContainer.addChild(otherGraphic);

	//create an infographic for on hover
	let otherInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc9b799)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 200, 50);
	otherInfo.zIndex = 10000;
	otherInfo.visible = false;
	planetContainer.addChild(otherInfo);

	let otherText = new PIXI.Text(
		"Tech and Programming Experience\nYears: 2009-2020",
		planetTextOptions
	);
	otherText.style.align = "center";
	otherText.position.set(25, 35);
	otherInfo.addChild(otherText);

	let sunOrbitControl = {
		graphic: sunGraphic,
		texture: sunTexture,
		info: sunInfo,
		orbitRadius: _,
		speedFactor: _,
		textureTickerFactor: 0.33,
		hover: false,
		step: _
	};

	let plutoOrbitControl = {
		graphic: plutoGraphic,
		texture: plutoTexture,
		info: plutoInfo,
		orbitRadius: 300,
		speedFactor: 1,
		textureTickerFactor: 0.9,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000)) //randomize initial position
	};
	let marsOrbitControl = {
		graphic: marsGraphic,
		texture: marsTexture,
		info: marsInfo,
		orbitRadius: 450,
		speedFactor: 1.1,
		textureTickerFactor: 10,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};
	let cyberburnOrbitControl = {
		graphic: cyberburnGraphic,
		texture: cyberburnTexture,
		info: cyberburnInfo,
		orbitRadius: 700,
		speedFactor: 0.5,
		textureTickerFactor: 4,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};
	let otherOrbitControl = {
		graphic: otherGraphic,
		texture: otherTexture,
		info: otherInfo,
		orbitRadius: 900,
		speedFactor: 0.5,
		textureTickerFactor: 4,
		hovering: false,
		step: Math.floor(Math.random() * Math.floor(8000))
	};

	let planetOrbitControlArr = [
		sunOrbitControl,
		plutoOrbitControl,
		marsOrbitControl,
		cyberburnOrbitControl,
		otherOrbitControl
	];

	//Add event listeners
	sunGraphic.on("mouseover", sunHoverEffects);
	sunGraphic.on("mouseout", sunHoverEffects);
	plutoGraphic.on("mouseover", plutoHoverEffects);
	plutoGraphic.on("mouseout", plutoHoverEffects);
	marsGraphic.on("mouseover", marsHoverEffects);
	marsGraphic.on("mouseout", marsHoverEffects);
	cyberburnGraphic.on("mouseover", cyberburnHoverEffects);
	cyberburnGraphic.on("mouseout", cyberburnHoverEffects);
	otherGraphic.on("mouseover", otherHoverEffects);
	otherGraphic.on("mouseout", otherHoverEffects);
	function sunHoverEffects() {
		sunInfo.visible = !sunInfo.visible;
		sunOrbitControl.hovering = !sunOrbitControl.hovering;
	}
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

	function animatePlanetTextures(planetOrbitControlArr, delta) {
		//Controls the positioning and texture scrolling of all planets
		planetOrbitControlArr.map(planet => {
			//texture scrolling
			planet.texture.frame.width =
				200 + textureTicker * planet.textureTickerFactor;
			planet.texture.updateUvs();
			planet.graphic.geometry.invalidate();
			//positioning of planet and infoText
			if (planet.orbitRadius) {
				if (!planet.hovering) {
					planet.step += delta;
					planet.graphic.position.set(
						Math.cos(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius,
						Math.sin(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius
					);
					planet.info.position.set(
						Math.cos(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius,
						Math.sin(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius
					);
				}
			}
			//Adjust the zIndex of planets based on their y-position
			planet.graphic.zIndex = Math.floor(planet.graphic.position.y);
		});
	}

	//Build Orbital Lines
	isometryPlane.lineStyle(1.5, 0xffffff);
	planetOrbitControlArr.map(planet => {
		isometryPlane.drawCircle(0, 0, planet.orbitRadius);
	});

	//ADD IN DYNAMIC BACKGROUND
	//Create the container to hold all stars
	const staticStarContainer = new PIXI.Container();
	let starsArr = staticStarContainer.children;
	staticStarContainer.position.set(0, 0);
	staticStarContainer.zIndex = -1;
	app.stage.addChild(staticStarContainer);
	let starTexture =
		PIXI.Loader.shared.resources["./assets/bgassets/particlefromeditor.png"]
			.texture;

	addStarSprites();
	//ADD STATIONARY STARS RANDOMLY THROUGHOUT THE CANVAS
	function addStarSprites() {
		for (let i = 0; i < 777; i++) {
			let starSprite = new PIXI.Sprite(starTexture);
			//Place star randomly on screen
			let randX = Math.random() * app.renderer.screen.width;
			let randY = Math.random() * app.renderer.screen.height;
			//Randomize alpha between 0.3 and 1 to create depth
			let randAlpha = Math.floor(Math.random() * (10 - 3) + 3) / 10;
			starSprite.anchor.set(0.5);
			//Randomize brightness to add depth to the background
			starSprite.alpha = randAlpha;
			//Randomize star's starting size
			starSprite.currentScale = Math.random() / 6.5;
			//Set the max size the star will become
			starSprite.maxScale = starSprite.currentScale + 0.06;
			//Make half of the stars expand to start and half shrink
			starSprite.yoyo = starsArr.length % 2 === 0 ? false : true;
			starSprite.setTransform(
				randX,
				randY,
				starSprite.currentScale,
				starSprite.currentScale
			);
			staticStarContainer.addChild(starSprite);
		}
	}

	//Blinks the static stars
	function blinkStars(starsArr, starTicker) {
		if (starTicker % 3 === 0) {
			starsArr.map(star => {
				if (star.currentScale < star.maxScale && star.yoyo === false) {
					star.currentScale += 0.0033;
					star.scale = new PIXI.Point(star.currentScale, star.currentScale);
					if (star.currentScale > star.maxScale) {
						star.yoyo = true;
					}
				} else {
					star.currentScale -= 0.0033;
					star.scale = new PIXI.Point(star.currentScale, star.currentScale);
					if (star.currentScale < 0.05) {
						star.yoyo = false;
					}
				}
			});
		}
	}

	//create a bunch of stars that that flicker in and out of existence
	let suicideStarContainer = new PIXI.Container();
	let suicideStarsArr = suicideStarContainer.children;
	suicideStarContainer.zIndex = -1;
	app.stage.addChild(suicideStarContainer);
	function createSuicideStar() {
		if (Math.random() > 0.6) {
			let suicideStar = new PIXI.Sprite(starTexture);
			let randX = Math.random() * app.renderer.screen.width;
			let randY = Math.random() * app.renderer.screen.height;
			let randAlpha = Math.floor(Math.random() * (10 - 6) + 6) / 10; //LOL double check this shit, is this really necessary? I may prefer weighted random over floored
			suicideStar.currentScale = Math.random() / 6;
			// suicideStar.maxScale = suicideStar.currentScale + 0.5;
			suicideStar.alpha = randAlpha;
			suicideStar.yoyo = false;
			suicideStar.anchor.set(0.5);
			suicideStar.setTransform(
				randX,
				randY,
				suicideStar.currentScale,
				suicideStar.currentScale
			);
			suicideStar.fadeAway = function() {
				this.alpha > 0.05 ? (this.alpha -= 0.005) : this.destroy();
			};
			suicideStarContainer.addChild(suicideStar);
		}
	}

	//Create variables that are passed into the animation function
	let starTicker = 0;
	let textureTicker = 0;
	const planetSpeed = 0.015; //can this be removed?

	//Animate everything
	app.ticker.add(delta => {
		textureTicker += 0.7;
		starTicker += 1;
		createSuicideStar();
		blinkStars(starsArr, starTicker);
		suicideStarsArr.map(suicideStar => {
			suicideStar.fadeAway();
		});
		animatePlanetTextures(planetOrbitControlArr, delta);
	});
}
//instead of redrawing the stars, try to resize the starContainer to the size of the screen -- If I"m doing this, then maybe just redraw the whole thing
// minus the navbar
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
	planetContainer.addChild(planet);
}
// isometryPlane.drawRoundedRect(200, 200, i, i + 50, 100); //can maybe use this as framing for my window popup on planet hoves
// isometryPlane.drawEllipse(0, 0, i, i + 30); //by extending y you can vary the height of a circle with this.
