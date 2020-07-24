import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { PlayerMovementComponent, ProjectileMovementComponent, EnemyMovementComponent } from './components/movement_component';
import { Attributes, HEIGHT, WALLS_SIZE, WIDTH } from './constants';
import { PlayerWeaponComponent, EnemyWeaponComponent } from './components/weapon_component';
import { GameModel } from './game_model';
import { CollisionManagerComponent } from './components/collision_manager_component';

/**
 * Creates all in-game objects.
 */
export class Factory {
	static globalScale = 1;

	initializeLevel(scene: ECSA.Scene) {
		let gameModel = new GameModel()

		scene.clearScene();
		scene.assignGlobalAttribute(Attributes.FACTORY, this);
		scene.assignGlobalAttribute(Attributes.GAME_MODEL, gameModel);
		
		scene.addGlobalComponent(new ECSA.KeyInputComponent());
		scene.addGlobalComponent(new ECSA.PointerInputComponent(false, true, true, true))
		scene.addGlobalComponent(new CollisionManagerComponent(gameModel))

		this.addWalls(scene, gameModel)
		this.addPlayer(scene, gameModel)
		this.addUI(scene, gameModel)

		this.addEnemy(scene, gameModel)
	}

	addWalls(scene: ECSA.Scene, gameModel: GameModel) {
		let wallTop = new ECSA.Graphics(Attributes.WALL_TOP)
		let wallBottom = new ECSA.Graphics(Attributes.WALL_BOTTOM)
		let wallLeft = new ECSA.Graphics(Attributes.WALL_LEFT)
		let wallRight = new ECSA.Graphics(Attributes.WALL_RIGHT)
		let wallColor = 0xBBBCBF
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
			.withComponent(new PlayerMovementComponent(Attributes.PLAYER_MOVEMENT, gameModel))
			.withComponent(new PlayerWeaponComponent())
			.withAttribute(Attributes.ATTACK_FREQUENCY, 5*gameModel.baseAttackFrequency)
			.withAttribute(Attributes.MAX_VELOCITY, 5*gameModel.baseVelocity)
			.withAttribute(Attributes.MAX_ACCELERATION, 5*5*gameModel.baseAcceleration)
			.withParent(scene.stage)
			.buildInto(player);
	}

	addEnemy(scene: ECSA.Scene, gameModel: GameModel) {
		let enemy = new ECSA.Graphics(Attributes.ENEMY);
		enemy.beginFill(0xE56987);
		enemy.drawPolygon([-10, -10, -10, 10, 15, 0]);
		enemy.endFill();
		gameModel.addEnemy(enemy)
		// let xpos = Math.random()*WIDTH
		// let ypos = Math.random()*HEIGHT
		let xpos = 100
		let ypos = 100

		new ECSA.Builder(scene)
			.scale(Factory.globalScale)
			.localPos(xpos, ypos)
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withComponent(new EnemyMovementComponent(Attributes.ENEMY_MOVEMENT, gameModel))
			.withComponent(new EnemyWeaponComponent())
			.withAttribute(Attributes.ATTACK_FREQUENCY, gameModel.baseAttackFrequency)
			.withAttribute(Attributes.MAX_VELOCITY, gameModel.baseVelocity)
			.withAttribute(Attributes.MAX_ACCELERATION, gameModel.baseAcceleration)
			.withParent(scene.stage)
			.buildInto(enemy);
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

	addProjectile(character: ECSA.Container, gameModel: GameModel) {
		let projectile = new ECSA.Graphics(Attributes.PROJECTILE);
		projectile.beginFill(0x43E214);
		projectile.drawRect(0, 0, 10, 5)
		projectile.endFill();

		gameModel.addProjectile(projectile)

		new ECSA.Builder(character.scene)
			.localPos(character.x, character.y)
			.anchor(0.5)
			.withComponent(new ProjectileMovementComponent(Attributes.PROJECTILE_MOVEMENT, gameModel, character.rotation))
			.withAttribute(Attributes.MAX_VELOCITY, gameModel.baseVelocity*1.25)
			.withAttribute(Attributes.MAX_ACCELERATION, gameModel.baseAcceleration*1.75)
			.withParent(character.scene.stage)
			.buildInto(projectile)
	}
}