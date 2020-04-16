import { helperFunction } from "./ahelperfunctions.js";

export class Planets {
	constructor(app) {
		this.app = app;
	}
	load() {
		/*
		 * I want to return an object that is attached to app, like app.planets.all
		 * you do this by writing this.XXXX = {foobar}
		 * I want this so that any helper functions I setup can access the properties needed
		 */

		const _ = void 0;
		const stage = this.app.stage;
		const loader = this.app.loader;
		const ticker = this.app.ticker;

		const planetContainer = new PIXI.Container();
		planetContainer.scale.y = 0.2;
		planetContainer.scale.x = 0.5;
		planetContainer.position.set(
			this.app.screen.width / 2,
			this.app.screen.height / 2
		); //adjusted this from this.app.stage
		planetContainer.sortableChildren = true;
		stage.addChild(planetContainer);

		this.app.planets = planetContainer.children;

		//Cinzel|Noto+Serif|Titilliu
		const planetTextOptions = {
			fontFamily: "Noto+Serif",
			fontSize: 37,
			fill: "white",
			fontWeight: "800",
			wordWrap: true,
			wordWrapWidth: 400,
			leading: 4,
			resolution: 3
		};

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
			sunInfo.width - sunText.width,
			sunInfo.height / 10 - sunText.height / 5
		);
		sunText.style.fontSize = 50;
		sunText.style.align = "center";
		sunInfo.addChild(sunText);

		let sunTexture = loader.resources["sunShrunk.jpg"].texture;
		sunTexture.frame = new PIXI.Rectangle(2, 0, 200, 100);
		let sunGraphic = new PIXI.Graphics()
			.lineStyle(12, 0xcc9f4c, 0.15, 0.5)
			.beginTextureFill(sunTexture)
			.drawCircle(0, 0, 135)
			.endFill()
			.setTransform(_, _, _, 2.1, _, _);
		sunGraphic.interactive = true;
		sunGraphic.hovering = false;
		sunGraphic.info = sunInfo;
		sunGraphic.name = "sun";
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

		let plutoTexture = loader.resources["plutomap1k.jpg"].texture;
		plutoTexture.frame = new PIXI.Rectangle(0, 0, 200, 250); //Texture.frame (x, y, width, height)
		let plutoGraphic = new PIXI.Graphics()
			.lineStyle(7, 0xc3b6aa, 0.25, 0.5) //add atmostphere
			.beginTextureFill(plutoTexture)
			.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
			.drawCircle(0, 0, 60)
			.endFill();
		plutoGraphic.interactive = true;
		plutoGraphic.sortableChildren = true;
		plutoGraphic.hovering = false;

		planetContainer.addChild(plutoGraphic);

		//create an infographic for on hover
		let plutoInfo = new PIXI.Graphics()
			.lineStyle(2, 0xc3b6aa)
			.beginFill(0x0c0d0c)
			.setTransform(_, _, _, _, _, _)
			.drawRoundedRect(0, 0, 400, 200, 50);
		plutoInfo.zIndex = 20000;
		plutoInfo.visible = false;
		plutoGraphic.addChild(plutoInfo);
		plutoGraphic.info = plutoInfo;
		console.log(plutoGraphic);
		console.log(sunGraphic);

		let plutoText = new PIXI.Text(
			"Name: BlackRock \nTitle: Analyst \nYears: 2015-2017",
			planetTextOptions
		);
		plutoText.style.align = "center";
		plutoText.position.set(61, 35); //moves text within the box
		plutoInfo.addChild(plutoText);

		let marsInfo = new PIXI.Graphics()
			.lineStyle(2, 0xc07158)
			.beginFill(0x0c0d0c)
			.setTransform(_, _, _, 2, _, _)
			.drawRoundedRect(0, 0, 400, 200, 50);
		marsInfo.zIndex = 10000;
		marsInfo.visible = false;

		let marsText = new PIXI.Text(
			"Name: Bridgewater \nTitle: Associate \nYears: 2017-2018",
			planetTextOptions
		);
		marsText.style.align = "center";
		marsText.position.set(48, 35); //moves text within the box
		marsInfo.addChild(marsText);

		let marsTexture = loader.resources["mars.jpg"].texture;
		marsTexture.frame = new PIXI.Rectangle(-250, -150, 250, 150);
		let marsGraphic = new PIXI.Graphics()
			.lineStyle(8, 0xc07158, 0.25, 0.8) //add atmostphere
			.beginTextureFill(marsTexture)
			.setTransform(_, _, _, 2, _, _)
			.drawCircle(0, 0, 60)
			.endFill();
		marsGraphic.interactive = true;
		marsGraphic.hovering = false;
		marsGraphic.info = marsInfo;
		planetContainer.addChild(marsGraphic);
		marsGraphic.addChild(marsInfo);

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
		cyberburnText.position.set(20, 30); //moves text within the box
		cyberburnInfo.addChild(cyberburnText);

		let cyberburnTexture = loader.resources["earthcloudmap.jpg"].texture;
		cyberburnTexture.frame = new PIXI.Rectangle(0, 0, 400, 400); //Texture.frame (x, y, width, height)
		let cyberburnGraphic = new PIXI.Graphics()
			.lineStyle(18, 0xb3caff, 0.25, 0.5) //add atmostphere
			.beginTextureFill(cyberburnTexture)
			.setTransform(_, _, _, 2, _, _) //setTransform(x, y, x-scale,y-scale,xkew,yskew )
			.drawCircle(0, 0, 90)
			.endFill();
		cyberburnGraphic.interactive = true;
		cyberburnGraphic.hovering = false;
		cyberburnGraphic.info = cyberburnInfo;
		planetContainer.addChild(cyberburnGraphic);

		//create an infographic for on hover
		let otherInfo = new PIXI.Graphics()
			.lineStyle(2, 0xc9b799)
			.beginFill(0x0c0d0c)
			.setTransform(_, _, _, 2, _, _)
			.drawRoundedRect(0, 0, 400, 200, 50);
		otherInfo.zIndex = 10000;
		otherInfo.visible = false;
		planetContainer.addChild(otherInfo);
		//Create the text within the infographic
		let otherText = new PIXI.Text(
			"Tech and Programming Experience\nYears: 2009-Today",
			planetTextOptions
		);
		otherText.style.align = "center";
		otherText.position.set(14, 35);
		otherInfo.addChild(otherText);

		let otherTexture = loader.resources["jupiter1k.jpg"].texture;
		otherTexture.frame = new PIXI.Rectangle(0, 0, 900, 450);

		let otherGraphic = new PIXI.Graphics()
			.lineStyle(12, 0xf2ddbb, 0.25, 0.5) //add atmostphere
			.beginTextureFill(otherTexture)
			.setTransform(_, _, _, 2, _, _)
			.drawCircle(0, 0, 120)
			.endFill();
		otherGraphic.interactive = true;
		otherGraphic.hovering = false;
		otherGraphic.info = otherInfo;
		planetContainer.addChild(otherGraphic);

		let sunOrbitControl = {
			graphic: sunGraphic,
			texture: sunTexture,
			orbitRadius: _,
			speedFactor: _,
			textureTickerFactor: 0.33,
			step: _,
			hoverEffects: hoverEffects
		};

		let plutoOrbitControl = {
			graphic: plutoGraphic,
			texture: plutoTexture,
			orbitRadius: 300,
			speedFactor: 1,
			textureTickerFactor: 0.9,
			step: Math.floor(Math.random() * Math.floor(8000)), //randomize initial position
			hoverEffects: hoverEffects
		};
		let marsOrbitControl = {
			graphic: marsGraphic,
			texture: marsTexture,
			orbitRadius: 450,
			speedFactor: 1.1,
			textureTickerFactor: 10,
			step: Math.floor(Math.random() * Math.floor(8000)),
			hoverEffects: hoverEffects
		};
		let cyberburnOrbitControl = {
			graphic: cyberburnGraphic,
			texture: cyberburnTexture,
			orbitRadius: 700,
			speedFactor: 0.5,
			textureTickerFactor: 4,
			step: Math.floor(Math.random() * Math.floor(8000)),
			hoverEffects: hoverEffects
		};

		let otherOrbitControl = {
			graphic: otherGraphic,
			texture: otherTexture,
			orbitRadius: 950,
			speedFactor: 1,
			textureTickerFactor: 4,
			step: Math.floor(Math.random() * Math.floor(8000)),
			hoverEffects: hoverEffects
		};

		let planetOrbitControlArr = [
			sunOrbitControl,
			plutoOrbitControl,
			marsOrbitControl,
			cyberburnOrbitControl,
			otherOrbitControl
		];

		//Build Orbital Lines
		//Kick off the event handlers
		const isometryPlane = new PIXI.Graphics();
		isometryPlane.zIndex = -10000;
		isometryPlane.lineStyle(1.5, 0xffffff);
		planetContainer.addChild(isometryPlane);
		planetOrbitControlArr.map(planet => {
			isometryPlane.drawCircle(0, 0, planet.orbitRadius);
			planet.hoverEffects();
		});
		let textureTicker = 0;
		const planetSpeed = 0.015; //can this be removed?

		ticker.add(delta => {
			helperFunction.animatePlanetTextures(
				planetOrbitControlArr,
				delta,
				textureTicker,
				planetSpeed
			);
		});
	}
}
//Event handlers for planets
function hoverEffects() {
	this.graphic.on("mouseover", function() {
		this.hovering = !this.hovering;
		this.info.visible = !this.info.visible;
	});
	this.graphic.on("mouseout", function() {
		this.hovering = !this.hovering;
		this.info.visible = !this.info.visible;
	});
}
