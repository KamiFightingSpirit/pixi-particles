export class IsometryPlane {}

//Build Orbital Lines
//Kick off the event handlers
const isometryPlane = new PIXI.Graphics();
isometryPlane.zIndex = -10000;
isometryPlane.lineStyle(1.5, 0xffffff);
planetContainer.addChild(isometryPlane);
planetOrbitControlArr.map(planet => {
	isometryPlane.drawCircle(0, 0, planet.orbitRadius);
});
