export class Assets {
	constructor(app) {
		this.app = app;
	}
	init() {
		const loader = this.app.loader;
		loader.baseUrl = "./assets/";
		loader
			.add("earthcloudmap.jpg") //cyberburn
			.add("jupiter1k.jpg")
			.add("jupitermap.jpg")
			.add("mars.jpg") //mars
			.add("mercurymap.jpg")
			.add("plutomap1k.jpg") //pluto
			.add("plutoShrunk.jpg")
			.add("sun.jpg")
			.add("sunShrunk.jpg") //sun
			.add("venusbump.jpg")
			.add("venusmap.jpg")
			.add("bgassets/particlefromeditor.png");

		loader.load(() => {
			this.app.runners.load.run();
		});
	}
}
