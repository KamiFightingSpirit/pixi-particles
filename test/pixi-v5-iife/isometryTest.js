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

const app = new PIXI.Application(rendererOptions);
// document.body.appendChild(app.view);

const isoScalingContainer = new PIXI.Container();
isoScalingContainer.scale.y = 0.5;
// isoScalingContainer.scale.x = 0.5;
isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(isoScalingContainer);

const isometryPlane = new PIXI.Graphics();
isometryPlane.rotation = Math.PI / 4;
isoScalingContainer.addChild(isometryPlane);

let numOfRowCols = 500;
isometryPlane.lineStyle(2, 0xffffff); //creates the grid
for (let i = -numOfRowCols; i <= numOfRowCols; i += 50) {
	isometryPlane.moveTo(-numOfRowCols, i);
	isometryPlane.lineTo(numOfRowCols, i);
	isometryPlane.moveTo(i, -numOfRowCols);
	isometryPlane.lineTo(i, numOfRowCols);
}
let startRadius = 100;
for (let i = 0; i <= numOfRowCols; i += 100) {
	isometryPlane.drawCircle(0, 0, i);
}

//create the loader
PIXI.Loader.shared
	.add("./assets/plutoShrunk.jpg")
	.add("./assets/sunShrunk.jpg")
	.add("./assets/eggHead.png")
	.load(setup);
function setup() {
	let eggHeadTexture =
		PIXI.Loader.shared.resources["./assets/eggHead.png"].texture;

	const sprite3 = new PIXI.Sprite(eggHeadTexture);
	sprite3.anchor.set(0.5, 1.0);
	// sprite3.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sprite3.scale.set(0.3, 0.8); // make it small but tall!
	sprite3.rotation = 5.5;
	isometryPlane.addChild(sprite3);

	//TEMP -- TRYING OUT TWO SPRITES
	const sprite4 = new PIXI.projection.Sprite2d(
		PIXI.Loader.shared.resources["./assets/eggHead.png"].texture
	);
	sprite4.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sprite4.anchor.set(0.5, 1.0);
	sprite4.scale.set(0.3, 0.5); // make it small but tall!
	isometryPlane.addChild(sprite4);

	//Create textures
	let sunTexture =
		PIXI.Loader.shared.resources["./assets/sunShrunk.jpg"].texture;
	//Set the position of image that you want to use as your initial view
	sunTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
	//Create a circle
	let sunGraphic = new PIXI.Graphics();
	sunGraphic.lineStyle(0);
	sunGraphic.beginTextureFill(sunTexture); // can have sunGraphic.beginTextureFill(sunTexture, 0xff00ff, 1); to color the planet
	sunGraphic.drawCircle(0, 0, 50);
	sunGraphic.endFill();
	let testTexture = app.renderer.generateTexture(sunGraphic);

	let sunSprite = new PIXI.Sprite(testTexture);
	// sunSprite.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sunSprite.anchor.set(0.5, 1.0);
	// sunSprite.scale.set(3, 5);
	sunSprite.rotation = 2.3;
	isometryPlane.addChild(sunGraphic);

	//Create textures
	let plutoTexture =
		PIXI.Loader.shared.resources["./assets/plutoShrunk.jpg"].texture;
	//Set the position of image that you want to use as your initial view
	plutoTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
	let plutoGraphic = new PIXI.Graphics();
	plutoGraphic.lineStyle(0);
	plutoGraphic.beginTextureFill(plutoTexture); // can have sunGraphic.beginTextureFill(sunTexture, 0xff00ff, 1); to color the planet
	console.log(plutoTexture.width, sunTexture.width);
	plutoGraphic.drawCircle(0, 0, 50);
	plutoGraphic.endFill();

	let _ = undefined;
	//this is a way that we can change our graphics appearance after adjusting the scale of our entire stage.
	plutoGraphic.setTransform(_, _, _, _, _, 0.5);
	let plutoTestTexture = app.renderer.generateTexture(plutoGraphic);

	let plutoSprite = new PIXI.projection.Sprite2d(plutoTestTexture);
	plutoSprite.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	plutoSprite.anchor.set(0.5, 1.0);
	isometryPlane.addChild(plutoGraphic);

	let textureTicker = 0;
	let step = 0;
	app.ticker.add(delta => {
		textureTicker += 0.7;
		sunTexture.frame.width = 200 + textureTicker * 2;
		plutoTexture.frame.width = 200 + textureTicker;
		plutoTexture.updateUvs();
		sunTexture.updateUvs();
		plutoGraphic.geometry.invalidate();
		sunGraphic.geometry.invalidate();

		// sprite3.rotation = step * 0.05;
		step += delta;

		const radiusPluto = 200;
		const speedPluto = 0.005;
		plutoGraphic.position.set(
			Math.cos(step * speedPluto * 2) * radiusPluto,
			Math.sin(step * speedPluto * 2) * radiusPluto
		);

		const radius3 = 200;
		const speed3 = 0.005;
		sprite3.position.set(
			Math.cos(step * speed3 * 2) * radius3,
			Math.sin(step * speed3 * 2) * radius3
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
	sprite.position.set(
		Math.cos(step * speed) * radius,
		Math.sin(step * speed) * radius
	);
}
