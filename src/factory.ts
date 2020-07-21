import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { PlayerSteeringComponent } from './steering_component';
import { Attributes, HEIGHT, WALLS_SIZE, WIDTH } from './constants';
import { PlayerRotationComponent } from './rotation_component';
import { GameModel } from './game_model';
import { CollisionManagerComponent } from './collision_manager_component';

export class Factory {
	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		let gameModel = new GameModel()

		scene.clearScene();
		scene.assignGlobalAttribute(Attributes.FACTORY, this);
		scene.assignGlobalAttribute(Attributes.GAME_MODEL, gameModel);
		
		scene.addGlobalComponent(new ECSA.KeyInputComponent());
		scene.addGlobalComponent(new ECSA.PointerInputComponent(true, false, true, false))
		scene.addGlobalComponent(new CollisionManagerComponent(gameModel))

		this.addWalls(scene, gameModel)
		this.addPlayer(scene, gameModel)
		this.addUI(scene, gameModel)
	}

	addWalls(scene: ECSA.Scene, gameModel: GameModel) {
		let wallTop = new ECSA.Graphics(Attributes.WALL_TOP)
		let wallBottom = new ECSA.Graphics(Attributes.WALL_BOTTOM)
		let wallLeft = new ECSA.Graphics(Attributes.WALL_LEFT)
		let wallRight = new ECSA.Graphics(Attributes.WALL_RIGHT)
		let wallColor = 0xE23814
		gameModel.walls = [wallTop, wallBottom, wallLeft, wallRight]

		wallTop.beginFill(wallColor);
		wallTop.drawRect(0, 0, WIDTH, WALLS_SIZE*2)
		wallTop.endFill()
		wallTop.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(0, 1))

		wallBottom.beginFill(wallColor);
		wallBottom.drawRect(0, 0, WIDTH, WALLS_SIZE)
		wallBottom.endFill()
		wallBottom.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(0, -1))

		wallLeft.beginFill(wallColor);
		wallLeft.drawRect(0, 0, WALLS_SIZE, HEIGHT)
		wallLeft.endFill()
		wallLeft.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(1, 0))

		wallRight.beginFill(wallColor);
		wallRight.drawRect(0, 0, WALLS_SIZE, HEIGHT)
		wallRight.endFill()
		wallRight.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(-1, 0))


		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).relativePos(0, 0).buildInto(wallTop)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).globalPos(0, HEIGHT - WALLS_SIZE).buildInto(wallBottom)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).relativePos(0, 0).buildInto(wallLeft)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).globalPos(WIDTH - WALLS_SIZE, 0).buildInto(wallRight)
			
	}

	addPlayer(scene: ECSA.Scene, gameModel: GameModel) {
		let builder = new ECSA.Builder(scene);

		let player = new ECSA.Graphics(Attributes.PLAYER);
		gameModel.player = player
		player.beginFill(0x47a1d5);
		player.drawPolygon([-10, -10, -10, 10, 15, 0]);
		// player.moveTo(100, 100)
		// player.lineTo(110, 100);
		// player.lineTo(105, 80);
		// player.lineTo(100, 100);
		player.endFill();

		builder
			.scale(Factory.globalScale)
			.relativePos(0.5, 0.5)
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withComponent(new PlayerSteeringComponent(Attributes.PLAYER_STEERING, gameModel))
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
					let localPosStr = `${Math.floor(gameModel.player.position.x)}/${Math.floor(gameModel.player.position.y)}`
					cmp.owner.asText().text = `Pos [loc]: [${localPosStr}]`
				})
			)
			.asText('text', "tst", new PIXI.TextStyle({ fill: '#FF0000', fontSize: 10 }))
			.build();
	}
}