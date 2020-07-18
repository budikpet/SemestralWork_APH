import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import DynamicsComponent from './utils/dynamics_component';
import { PlayerSteeringComponent } from './ship_steering';

export class Factory {

	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		scene.addGlobalComponent(new ECSA.KeyInputComponent());

		this.addPlayer(scene)
	}

	addPlayer(scene: ECSA.Scene) {
		let builder = new ECSA.Builder(scene);

		let player = new ECSA.Graphics('Player');
		player.beginFill(0x47a1d5);
		player.drawPolygon([-10, -10, -10, 10, 15, 0]);
		// player.moveTo(100, 100)
		// player.lineTo(110, 100);
		// player.lineTo(105, 80);
		// player.lineTo(100, 100);
		player.endFill();

		builder
			.scale(2*Factory.globalScale)
			.relativePos(0.5, 0.5)
			// .withComponent(new PaddleInputController())
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withComponent(new PlayerSteeringComponent("PlayerSteering", 10))
			.withParent(scene.stage)
			.buildInto(player);
	}
}