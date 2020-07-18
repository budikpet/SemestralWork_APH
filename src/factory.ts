import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import DynamicsComponent from './utils/dynamics_component';

export class Factory {

	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		this.addPlayer(scene)
	}

	addPlayer(scene: ECSA.Scene) {
		let builder = new ECSA.Builder(scene);

		let player = new ECSA.Graphics('Player');
		player.beginFill(0x47a1d5);
		player.drawPolygon([-10, -10, -10, 10, 15, 0]);
		player.endFill();

		builder
			.scale(2*Factory.globalScale)
			.relativePos(0.5, 0.5)
			// .withComponent(new PaddleInputController())
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withParent(scene.stage)
			.buildInto(player);
	}
}