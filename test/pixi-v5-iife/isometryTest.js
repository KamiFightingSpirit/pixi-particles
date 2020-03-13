/*
Goals:
1. Get the initial sun setup
2. Add a corona to the sun -> to be used as atmostphere
3. Add a planet
4. Rotate the planet around the sun
5. Add the planets atmosphere (may differ from the corona setup)
6. Add shading to the planet
7. Make the planet stop when hover
8. Make the planet restart when stopped hovering
9. Test how adding an orbital line looks
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
isoScalingContainer.scale.y = 0.5;
// isoScalingContainer.scale.x = 0.5;
isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(isoScalingContainer);

const isometryPlane = new PIXI.Graphics();
isometryPlane.rotation = Math.PI / 4;
isoScalingContainer.addChild(isometryPlane);

let numOfRowCols = 1000;
isometryPlane.lineStyle(1, 0xffffff); //creates the grid
// for (let i = -numOfRowCols; i <= numOfRowCols; i += 50) {
// 	isometryPlane.moveTo(-numOfRowCols, i);
// 	isometryPlane.lineTo(numOfRowCols, i);
// 	isometryPlane.moveTo(i, -numOfRowCols);
// 	isometryPlane.lineTo(i, numOfRowCols);
// }
let startRadius = 100;
for (let i = 200; i <= numOfRowCols; i += 100) {
	isometryPlane.drawCircle(0, 0, i);
}

//create the loader
PIXI.Loader.shared
	.add("./assets/plutoShrunk.jpg")
	.add("./assets/plutomap1k.jpg")
	.add("./assets/sunShrunk.jpg")
	.add("./assets/sun.jpg")
	.add("./assets/eggHead.png")
	.load(setup);
function setup() {
	let sunTexture =
		PIXI.Loader.shared.resources["./assets/sunShrunk.jpg"].texture;
	console.log(sunTexture.width, sunTexture.height);
	sunTexture.frame = new PIXI.Rectangle(2, 0, 200, 100); //Texture.frame (x, y, width, height)
	let sunGraphic = new PIXI.Graphics();
	sunGraphic.lineStyle(0);
	sunGraphic.beginTextureFill(sunTexture); // can have sunGraphic.beginTextureFill(sunTexture, 0xff00ff, 1); to color the planet
	sunGraphic.drawCircle(0, 0, 100);
	sunGraphic.endFill();
	sunGraphic.setTransform(_, _, _, 1.6, -0.8, _); //setTransform(x, y, x-scale,y-scale,xkew,yskew )
	isometryPlane.addChild(sunGraphic);

	let plutoTexture =
		PIXI.Loader.shared.resources["./assets/plutomap1k.jpg"].texture;
	plutoTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
	let plutoGraphic = new PIXI.Graphics();
	plutoGraphic.lineStyle(0);
	plutoGraphic.beginTextureFill(plutoTexture); // can have sunGraphic.beginTextureFill(sunTexture, 0xff00ff, 1); to color the planet
	plutoGraphic.drawCircle(0, 0, 50);
	plutoGraphic.endFill();
	plutoGraphic.setTransform(_, _, _, _, _, 0.5);
	isometryPlane.addChild(plutoGraphic);

	const sprite4 = new PIXI.projection.Sprite2d(
		PIXI.Loader.shared.resources["./assets/eggHead.png"].texture
	);
	sprite4.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sprite4.anchor.set(0.5, 1.0);
	sprite4.scale.set(0.3, 0.5); // make it small but tall!
	isometryPlane.addChild(sprite4);

	let textureTicker = 0;
	let step = 0;
	app.ticker.add(delta => {
		textureTicker += 0.7;
		sunTexture.frame.width = 200 + textureTicker * 2;
		plutoTexture.frame.width = 200 + textureTicker;

		sunTexture.updateUvs();
		plutoTexture.updateUvs();

		sunGraphic.geometry.invalidate();
		plutoGraphic.geometry.invalidate();

		// sprite3.rotation = step * 0.05;
		step += delta;

		const radiusPluto = 200;
		const speedPluto = 0.05;
		plutoGraphic.position.set(
			Math.cos(step * speedPluto * 1) * radiusPluto,
			Math.sin(step * speedPluto * 1) * radiusPluto
		);

		const radius4 = 300;
		const speed4 = 0.01;
		sprite4.position.set(
			Math.cos(step * speed4) * radius4,
			Math.sin(step * speed4) * radius4
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
