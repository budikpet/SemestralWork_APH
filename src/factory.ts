import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { PlayerSteeringComponent } from './steering_component';
import { Attributes } from './constants';
import { PlayerRotationComponent } from './rotation_component';
import { GameModel, PlayerModel } from './game_model';

export class Factory {
	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		let gameModel = new GameModel()

		scene.clearScene();
		scene.assignGlobalAttribute(Attributes.FACTORY, this);
		scene.assignGlobalAttribute(Attributes.GAME_MODEL, gameModel);
		
		scene.addGlobalComponent(new ECSA.KeyInputComponent());
		scene.addGlobalComponent(new ECSA.PointerInputComponent(true, false, true, false))

		let player = this.addPlayer(scene, gameModel)
		this.addUI(scene, gameModel)
	}

	addPlayer(scene: ECSA.Scene, gameModel: GameModel): ECSA.Container {
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
			.scale(Factory.globalScale)
			.relativePos(0.5, 0.5)
			// .withComponent(new PaddleInputController())
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withComponent(new PlayerSteeringComponent("PlayerSteering", 10))
			.withComponent(new PlayerRotationComponent())
			.withParent(scene.stage)
			.buildInto(player);
	}

	addUI(scene: ECSA.Scene, gameModel: GameModel) {
		new ECSA.Builder(scene)
			.relativePos(0.75, 0.75)
			.anchor(0.5)
			.withParent(scene.stage)
			.withComponent(new ECSA.GenericComponent('rotation')
				.doOnUpdate((cmp, delta, absolute) => {
					let localPosStr = `${Math.floor(gameModel.player.obj.position.x)}/${Math.floor(gameModel.player.obj.position.y)}`
					cmp.owner.asText().text = `Pos [loc]: [${localPosStr}]`
				})
			)
			.asText('text', "tst", new PIXI.TextStyle({ fill: '#FF0000', fontSize: 10 }))
			.build();
	}
}