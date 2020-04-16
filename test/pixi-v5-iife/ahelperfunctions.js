export const helperFunction = {
	animatePlanetTextures: function(
		planetOrbitControlArr,
		delta,
		textureTicker,
		planetSpeed
	) {
		textureTicker += 0.7;
		//Controls the positioning and texture scrolling of all planets
		planetOrbitControlArr.map(planet => {
			//gives the appearance of the planet rotating
			planet.texture.frame.width =
				200 + textureTicker * planet.textureTickerFactor;
			planet.texture.updateUvs();
			planet.graphic.geometry.invalidate();
			//positioning of planet and infoText
			if (planet.orbitRadius) {
				if (!planet.graphic.hovering) {
					planet.step += delta;
					planet.graphic.position.set(
						Math.cos(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius,
						Math.sin(planet.step * planetSpeed * planet.speedFactor) *
							planet.orbitRadius
					);
					// planet.graphic.info.position.set(
					// 	Math.cos(planet.step * planetSpeed * planet.speedFactor) *
					// 		planet.orbitRadius,
					// 	Math.sin(planet.step * planetSpeed * planet.speedFactor) *
					// 		planet.orbitRadius
					// );
				}
			}
			//Adjust the zIndex of planets based on their y-position
			planet.graphic.zIndex = Math.floor(planet.graphic.position.y);
		});
	}
};
