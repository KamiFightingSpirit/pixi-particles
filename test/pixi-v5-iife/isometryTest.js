/*
Goals:
1. Get the initial sun setup DONE 03/13
2. Add a corona to the sun -> to be used as atmostphere DONE 03/13
3. Add a planet DONE 03/12
4. Rotate the planet around the sun DONE 03/12
5. Add the planets atmosphere (may differ from the corona setup) DONE 03/13
6. Add shading to the planet -- let's hope this isn't necessary....
7. Make the planet stop when hover 
8. Make the planet restart when stopped hovering
9. Test how adding an orbital line looks, need to adjust this
10. Add an info box upon hovering
11. Create a create planet function 
12. Add multiple planets
13. Add in the navbar
14. Add in the Relativity toolbar
15. Create a function that creates info boxes for planets 
16. Begin work on individual page view
17. Load the images properly via loader
18. Figure out how to do different frame scrolls without picture glitching
19. Get everything to accurately reposition upon resize
*/

PIXI.utils.skipHello(); // remove pixi message in console

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
	// isometryPlane.drawRoundedRect(0, 0, i, i + 50, 100); //can maybe use this as framing for my window popup on planet hoves
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
		.lineStyle(8, 0xcc9f4c, 0.25, 0.5) //add a semi-transparent corona lineStyle(width, color, alpha,alignment,native),
		.beginTextureFill(sunTexture)
		.drawCircle(0, 0, 100)
		.endFill()
		.setTransform(_, _, _, 2, _, _); //setTransform(x, y, x-scale,y-scale,xkew,yskew )
	isometryPlane.addChild(sunGraphic);
	//add a background sun to create a double layered corona for the sun
	let backgroundSun = new PIXI.Graphics();
	backgroundSun
		.lineStyle(20, 0xcc9f4c, 0.5, 0.5)
		.drawCircle(0, 0, 102)
		.setTransform(_, _, _, 2, _, _).filters = [new PIXI.filters.BlurFilter(6)];
	isometryPlane.addChild(backgroundSun);

	let plutoTexture =
		PIXI.Loader.shared.resources["./assets/plutomap1k.jpg"].texture;
	plutoTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
	let plutoGraphic = new PIXI.Graphics()
		.lineStyle(8, 0xc3b6aa, 0.25, 0.5) //add atmostphere
		.beginTextureFill(plutoTexture)
		.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
		.drawCircle(0, 0, 50)
		.endFill();
	isometryPlane.addChild(plutoGraphic);

	let textureTicker = 0;
	let step = 0;
	app.ticker.add(delta => {
		textureTicker += 0.7;
		step += delta;

		//control scrolling of planet background
		sunTexture.frame.width = 200 + textureTicker / 3;
		plutoTexture.frame.width = 200 + textureTicker;
		sunTexture.updateUvs();
		plutoTexture.updateUvs();
		sunGraphic.geometry.invalidate();
		plutoGraphic.geometry.invalidate();

		//control movement of a planet
		const radiusPluto = 450;
		const speedPluto = 0.02;
		plutoGraphic.position.set(
			Math.cos(step * speedPluto * 1) * radiusPluto,
			Math.sin(step * speedPluto * 1) * radiusPluto
		);
	});
}

function position(step, speed, radius, sprite) {
	sprite = this;
	this.position.set(
		Math.cos(step * speed) * radius,
		Math.sin(step * speed) * radius
	);
}
