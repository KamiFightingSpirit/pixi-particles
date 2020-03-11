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

// === THIRD PART ===
// Better isometry plane.
// We can even rotate it if you want!
const isoScalingContainer = new PIXI.Container();
isoScalingContainer.scale.y = 0.5; // isometry can be achieved by setting scaleY 0.5 or tan(30 degrees)
// isoScalingContainer.scale.x = 0.5
isoScalingContainer.position.set(app.screen.width / 2, app.screen.height / 2);
app.stage.addChild(isoScalingContainer);

const isometryPlane = new PIXI.Graphics();
isometryPlane.rotation = Math.PI / 4;
isoScalingContainer.addChild(isometryPlane);

isometryPlane.lineStyle(2, 0xffffff); //creates the grid
for (let i = -300; i <= 300; i += 50) {
	isometryPlane.moveTo(-300, i);
	isometryPlane.lineTo(300, i);
	isometryPlane.moveTo(i, -300);
	isometryPlane.lineTo(i, 300);
}
isometryPlane.drawCircle(0, 0, 100); //creates the circle in the grid
isometryPlane.drawCircle(0, 0, 300); //creates the circle in the grid

//create the loader
PIXI.Loader.shared.add("./assets/eggHead.png").load(setup);
function setup() {
	let eggHeadTexture =
		PIXI.Loader.shared.resources["./assets/eggHead.png"].texture;
	// let sheet = PIXI.Loader.shared.resources["assets/spritesheet.json"].spritesheet;
	// let sprite = new PIXI.Sprite(sheet.textures["image.png"]);
	const sprite3 = new PIXI.Sprite(eggHeadTexture);
	console.log(sprite3);
	sprite3.anchor.set(0.5, 1.0);
	// sprite3.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sprite3.scale.set(0.3, 0.5); // make it small but tall!
	// not-proportional scale can't work without special flag `scaleAfterAffine`
	// fortunately, its `true` by default
	isometryPlane.addChild(sprite3);

	//TEMP -- TRYING OUT TWO SPRITES
	const sprite4 = new PIXI.Sprite(eggHeadTexture);
	sprite4.anchor.set(0.5, 1.0);
	// sprite3.proj.affine = PIXI.projection.AFFINE.AXIS_X;
	sprite4.scale.set(0.3, 0.5); // make it small but tall!
	// not-proportional scale can't work without special flag `scaleAfterAffine`
	// fortunately, its `true` by default
	isometryPlane.addChild(sprite4);

	let step = 0;
	app.ticker.add(delta => {
		// sprite3.rotation = step * 0.05;
		step += delta;
		const radius3 = 300;
		const speed3 = 0.005;
		sprite3.position.set(
			Math.cos(step * speed3) * radius3,
			Math.sin(step * speed3) * radius3
		);

		const radius4 = 100;
		const speed4 = 0.05;
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
