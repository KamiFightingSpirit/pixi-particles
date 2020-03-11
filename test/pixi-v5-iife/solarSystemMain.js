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
//Create the canvas
var canvas = document.getElementById("stage");

// Basic PIXI Setup -- Setting the resolution and autoDensity "sharpens" everything and makes appearence the same for retina devices
var rendererOptions = {
	width: window.innerWidth,
	height: window.innerHeight,
	view: canvas,
	resolution: window.devicePixelRatio,
	autoDensity: true,
	backgroundColor: 0x191919,
	antialias: true
};

//Create the root container and renderer
var stage = new PIXI.Container(),
	renderer = new PIXI.Renderer(rendererOptions);

//Create container to hold all planets and add to root container
var planetContainer = new PIXI.Container();
stage.addChild(planetContainer);

//Create textures
let sunTexture = new PIXI.Texture.from("./assets/sunShrunk.jpg");
//Set the position of image that you want to use as your initial view
sunTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
//Create a circle
let sunGraphic = new PIXI.Graphics();
sunGraphic.x = renderer.width / 2;
sunGraphic.y = renderer.height / 2;
stage.addChild(sunGraphic);
//Setting the line style lineStyle(width, color, alpha)
sunGraphic.lineStyle(1);
sunGraphic.beginTextureFill(sunTexture); // can have sunGraphic.beginTextureFill(sunTexture, 0xff00ff, 1); to color the planet
//draw the circle (x, y, radius)
sunGraphic.drawCircle(0, 0, 50);
//because we are using fill we call endFill.
sunGraphic.endFill();

let plutoTexture = new PIXI.Texture.from("./assets/sunShrunk.jpg");
plutoTexture.frame = new PIXI.Rectangle(0, 0, 220, 250);

let plutoGraphic = new PIXI.Graphics();
plutoGraphic.x = renderer.width / 4;
plutoGraphic.y = renderer.height / 2;
stage.addChild(plutoGraphic);
plutoGraphic.beginTextureFill(plutoTexture);
plutoGraphic.drawCircle(0, 0, 100);
plutoGraphic.endFill();

//adds in a ticker manually (determines frame rate etc I think)
const ticker = new PIXI.Ticker();
//adds the animation function into the ticker
ticker.add(animate);
//starts the ticker
let textureTicker = 0;
let yTicker = 0;
ticker.start();
function animate() {
	textureTicker += 1;
	//having these inside here causes our sprites to be recentered when the window changes size
	// sun.x = renderer.screen.width / 2;
	// sun.y = renderer.screen.height / 2;
	sunTexture.frame.width = 200 + textureTicker;

	yTicker += 0.01; //this controls how much the tilt moves each step
	// sunTexture.frame.height = 250 + Math.cos(yTicker) * 50; // the * N controls the range of the y movement

	sunTexture.updateUvs();
	sunGraphic.geometry.invalidate();
	// sun.rotation += 0.001;

	renderer.render(stage);
}
