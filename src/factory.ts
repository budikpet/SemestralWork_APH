import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import DynamicsComponent from './utils/dynamics_component';
import { PlayerSteeringComponent } from './ship_steering';
import { Attributes } from './constants';
import { PlayerRotationComponent } from './rotation_component';

export class Factory {

	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		scene.addGlobalComponent(new ECSA.KeyInputComponent());
		scene.addGlobalComponent(new ECSA.PointerInputComponent(true, false, true))

		let player = this.addPlayer(scene)

		new ECSA.Builder(scene)
			.relativePos(0.75, 0.75)
			.anchor(0.5)
			.withParent(scene.stage)
			.withComponent(new ECSA.GenericComponent('rotation')
				.doOnUpdate((cmp, delta, absolute) => {
					let tmp = player.getGlobalPosition()
					let localPosStr = `${Math.floor(player.position.x)}/${Math.floor(player.position.y)}`
					let globalPosStr = `${Math.floor(tmp.x)}/${Math.floor(tmp.y)}`
					cmp.owner.asText().text = `Pos [loc] (glob): [${localPosStr}] (${globalPosStr})`
				})
			)
			.asText('text', "tst", new PIXI.TextStyle({ fill: '#FF0000', fontSize: 10 }))
			.build();
	}

	addPlayer(scene: ECSA.Scene): ECSA.Container {
		let builder = new ECSA.Builder(scene);

		let player = new ECSA.Graphics(Attributes.PLAYER);
		player.beginFill(0x47a1d5);
		player.drawPolygon([-10, -10, -10, 10, 15, 0]);
		// player.moveTo(100, 100)
		// player.lineTo(110, 100);
		// player.lineTo(105, 80);
		// player.lineTo(100, 100);
		player.endFill();

		return builder
			.scale(Factory.globalScale/2)
			.relativePos(0.5, 0.5)
			// .withComponent(new PaddleInputController())
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withComponent(new PlayerSteeringComponent("PlayerSteering", 10))
			.withComponent(new PlayerRotationComponent())
			.withParent(scene.stage)
			.buildInto(player);
	}
}