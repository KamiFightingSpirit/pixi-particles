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

const isoScalingContainer = new PIXI.Container();
isoScalingContainer.scale.y = 0.18;
isoScalingContainer.scale.x = 0.5;
isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(isoScalingContainer);

const isometryPlane = new PIXI.Graphics();
// isometryPlane.rotation = Math.PI / 4;
isoScalingContainer.addChild(isometryPlane);

let numOfRowCols = 1300;
isometryPlane.lineStyle(1.2, 0xffffff); //creates the grid
// for (let i = -numOfRowCols; i <= numOfRowCols; i += 50) {
// 	isometryPlane.moveTo(-numOfRowCols, i);
// 	isometryPlane.lineTo(numOfRowCols, i);
// 	isometryPlane.moveTo(i, -numOfRowCols);
// 	isometryPlane.lineTo(i, numOfRowCols);
// }
let startRadius = 100;
for (let i = 325; i <= numOfRowCols; i += 125) {
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
	.load(setup);
function setup() {
	//sun color: #cc9f4c
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
		.drawCircle(0, 0, 50)
		.endFill();
	plutoGraphic.interactive = true;
	isometryPlane.addChild(plutoGraphic);

	//create an infographic for on hover
	window.plutoInfo = new PIXI.Graphics()
		.lineStyle(2, 0xc3b6aa)
		.beginFill(0x0c0d0c)
		.setTransform(_, _, _, 2, _, _)
		.drawRoundedRect(0, 0, 400, 300, 50);
	plutoInfo.visible = false;
	isometryPlane.addChild(plutoInfo);

	let planetTextOptions = {
		fontFamily: "Arial",
		fontSize: 35,
		fill: "silver",
		wordWrap: true,
		wordWrapWidth: plutoInfo.width - 40,
		leading: 4
	};

	let plutoText = new PIXI.Text(
		"This is just a test, this is not real, if it was real, it wouldn't be a test",
		planetTextOptions
	);
	plutoText.position.set(30, 30);
	plutoInfo.addChild(plutoText);

	let textureTicker = 0;
	let step = 0;
	app.ticker.add(delta => {
		textureTicker += 0.7;

		//control scrolling of a planets texture/background
		sunTexture.frame.width = 200 + textureTicker / 3;
		plutoTexture.frame.width = 200 + textureTicker;
		sunTexture.updateUvs();
		plutoTexture.updateUvs();
		sunGraphic.geometry.invalidate();
		plutoGraphic.geometry.invalidate();

		//control movement of a planet
		const radiusPluto = 450;
		const speedPluto = 0.015;

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
	});

	//Add event listeners
	plutoGraphic.on("mouseover", plutoHoverEffects);
	plutoGraphic.on("mouseout", plutoHoverEffects);
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
