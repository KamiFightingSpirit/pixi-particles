// // Update function every frame
// let Update = function(
// 	elapsed,
// 	updateId,
// 	delta,
// 	speedController,
// 	radiusTicker,
// 	enterScreenState,
// 	emitter
// ) {
// 	// TWEEN.update(time);
// 	var now = Date.now();
// 	delta = now - elapsed; //16 or 17 (1000/60 fps?)

// 	//check if user has clicked enterText
// 	if (enterScreenState.clicked === true) {
// 		//ticker setup
// 		radiusTicker += 10 / delta;
// 		//Expand radius
// 		emitter.spawnCircle = {
// 			x: -2,
// 			y: 0,
// 			radius: 210 + radiusTicker,
// 			type: 2,
// 			minRadius: 170 + radiusTicker / 7
// 		};
// 	}

// 	// Update the emitter's next frame
// 	updateId = requestAnimationFrame(Update);
// 	if (emitter) emitter.update(delta * speedController);
// 	elapsed = now;
// 	//update all TWEENs
// 	TWEEN.update();
// 	// render the stage
// 	renderer.render(stage);

// 	// emitter.parent.transform.skew.x = Math.sin(delta) / 100;
// };

// export default Update;
