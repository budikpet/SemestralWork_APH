import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { PlayerMovementComponent, ProjectileMovementComponent, EnemyMovementComponent } from './components/movement_component';
import { Attributes, HEIGHT, WALLS_SIZE, WIDTH, CharacterTypes, Messages, States, Assets, Names } from './constants';
import { PlayerWeaponComponent, EnemyWeaponComponent } from './components/weapon_component';
import { GameModel } from './game_model';
import { CollisionManagerComponent } from './components/collision_manager_component';
import { DeathCheckerComponent } from './components/death_checker_component';
import { WaveManagerComponent } from './components/wave_manager_component';
import { WaveCountdownComponent as WaveTextVisibilityComponent, FinalScoreScreen as FinalScoreScreenComponent } from './components/ui_components';
import { SpriteData, SpriteFrame, SpriteDimensions, SpriteAnimation } from './utils/sprite_utils';

/**
 * Creates all in-game objects.
 */
export class Factory {
	static globalScale = 1;

	private spritesData: SpriteData
	private spriteSheet: PIXI.BaseTexture;

	constructor(spritesData: any) {
		this.spritesData = spritesData
		this.spriteSheet = PIXI.BaseTexture.from(Assets.SPRITESHEET);
	}

	resetGame(scene: ECSA.Scene) {
		let gameModel: GameModel = scene.getGlobalAttribute(Names.GAME_MODEL)
		gameModel.clear()
		scene.clearScene()

		this.initializeLevel(scene, gameModel)
	}

	initializeLevel(scene: ECSA.Scene, gameModel: GameModel) {
		scene.assignGlobalAttribute(Names.FACTORY, this);
		scene.assignGlobalAttribute(Names.GAME_MODEL, gameModel);
		
		scene.addGlobalComponent(new ECSA.KeyInputComponent());
		scene.addGlobalComponent(new ECSA.PointerInputComponent(false, true, true, true))
		scene.addGlobalComponent(new CollisionManagerComponent())
		scene.addGlobalComponent(new DeathCheckerComponent())
		scene.addGlobalComponent(new WaveManagerComponent())

		this.addWalls(scene, gameModel)
		this.addBg(scene, gameModel)
		this.addPlayer(scene, gameModel)
		this.addUI(scene, gameModel)
	}

	addBg(scene: ECSA.Scene, gameModel: GameModel) {
		let spriteFrame: SpriteFrame = this.spritesData.frames.background

		let background: ECSA.Sprite = new ECSA.Builder(scene)
			.scale(Factory.globalScale)
			.localPos(WALLS_SIZE, WALLS_SIZE)
			.asSprite(this.createTexture(spriteFrame), Names.BACKGROUND)
			.withParent(scene.stage)
			.build();

		background.width = WIDTH - 2*WALLS_SIZE
		background.height = HEIGHT - 2*WALLS_SIZE
	}

	addWalls(scene: ECSA.Scene, gameModel: GameModel) {
		let outerWallColor = 0x738394
		let innerWallColor = 0x3d4c5c

		// Create walls

		let wallTop = new ECSA.Graphics(Names.WALL)
		let wallBottom = new ECSA.Graphics(Names.WALL)
		let wallLeft = new ECSA.Graphics(Names.WALL)
		let wallRight = new ECSA.Graphics(Names.WALL)
		gameModel.walls = [wallTop, wallBottom, wallLeft, wallRight]

		wallTop.beginFill(outerWallColor);
		wallTop.drawRect(0, 0, WIDTH, WALLS_SIZE)
		wallTop.endFill()
		wallTop.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(0, 1))

		wallBottom.beginFill(outerWallColor);
		wallBottom.drawRect(0, 0, WIDTH, WALLS_SIZE)
		wallBottom.endFill()
		wallBottom.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(0, -1))

		wallLeft.beginFill(outerWallColor);
		wallLeft.drawRect(0, 0, WALLS_SIZE, HEIGHT)
		wallLeft.endFill()
		wallLeft.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(1, 0))

		wallRight.beginFill(outerWallColor);
		wallRight.drawRect(0, 0, WALLS_SIZE, HEIGHT)
		wallRight.endFill()
		wallRight.assignAttribute(Attributes.WALL_REPULSIVE_FORCE, new ECSA.Vector(-1, 0))

		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).relativePos(0, 0).buildInto(wallTop)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).globalPos(0, HEIGHT - WALLS_SIZE).buildInto(wallBottom)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).relativePos(0, 0).buildInto(wallLeft)
		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).globalPos(WIDTH - WALLS_SIZE, 0).buildInto(wallRight)
		
		// Make outer bound of the game space
		let outerPartSize = WALLS_SIZE/5
		let wallsShape = new ECSA.Graphics()
		wallsShape.beginFill(innerWallColor);
		wallsShape.drawRect(outerPartSize, outerPartSize, WIDTH - 2*outerPartSize, HEIGHT - 2*outerPartSize)
		wallsShape.endFill()

		new ECSA.Builder(scene).withParent(scene.stage).scale(Factory.globalScale).relativePos(0, 0).buildInto(wallsShape)
	}

	addPlayer(scene: ECSA.Scene, gameModel: GameModel) {
		let spriteFrame: SpriteFrame = this.spritesData.frames.soldier_01

		gameModel.player = new ECSA.Builder(scene)
			.scale(Factory.globalScale)
			.relativePos(0.5, 0.5)
			.anchor(0.5, 0.5)
			.asSprite(this.createTexture(spriteFrame), Names.PLAYER)
			.withAttribute(Attributes.ATTACK_FREQUENCY, 5*gameModel.baseAttackFrequency)
			.withAttribute(Attributes.MAX_VELOCITY, 10*gameModel.baseVelocity)
			.withAttribute(Attributes.MAX_ACCELERATION, 100*gameModel.baseAcceleration)
			.withAttribute(Attributes.PROJECTILE_COLOR, 0x43E214)
			.withAttribute(Attributes.PROJECTILE_MAX_VELOCITY, 200*gameModel.baseVelocity)
			.withAttribute(Attributes.CHARACTER_TYPE, CharacterTypes.PLAYER)
			.withAttribute(Attributes.HP, 500)
			.withAttribute(Attributes.SCORE, 0)
			.withAttribute(Attributes.DEATH_MSG_TYPE, Messages.PLAYER_DEATH)
			.withState(States.ALIVE)
			.withComponent(new PlayerMovementComponent(Attributes.DYNAMICS, gameModel))
			.withComponent(new PlayerWeaponComponent())
			.withParent(scene.stage)
			.build();
	}

	addEnemy(scene: ECSA.Scene, gameModel: GameModel, position: ECSA.Vector) {
		let enemy = new ECSA.Graphics(Names.ENEMY);
		enemy.beginFill(0xE56987);
		enemy.drawPolygon([-10, -10, -10, 10, 15, 0]);
		enemy.endFill();
		gameModel.addEnemy(enemy)

		new ECSA.Builder(scene)
			.scale(Factory.globalScale)
			.localPos(position.x, position.y)
			// .asSprite(this.createTexture(model.getSpriteInfo(Names.PADDLE)), Names.PADDLE)
			.withAttribute(Attributes.ATTACK_FREQUENCY, gameModel.baseAttackFrequency*1/4)
			.withAttribute(Attributes.MAX_VELOCITY, gameModel.baseVelocity)
			.withAttribute(Attributes.MAX_ACCELERATION, gameModel.baseAcceleration)
			.withAttribute(Attributes.CHARACTER_TYPE, CharacterTypes.ENEMY)
			.withAttribute(Attributes.HP, 2)
			.withAttribute(Attributes.PROJECTILE_MAX_VELOCITY, 2*gameModel.baseVelocity)
			.withAttribute(Attributes.SCORE, 1)
			.withAttribute(Attributes.DEATH_MSG_TYPE, Messages.DEATH)
			.withState(States.ALIVE)
			.withComponent(new EnemyMovementComponent(Attributes.DYNAMICS, gameModel))
			.withComponent(new EnemyWeaponComponent())
			.withParent(scene.stage)
			.buildInto(enemy);
	}

	removeCharacter(character: ECSA.Container, gameModel: GameModel) {
		let type: CharacterTypes = character.getAttribute(Attributes.CHARACTER_TYPE)

		switch(type) {
			case CharacterTypes.ENEMY: {
				gameModel.removeEnemy(character.id)
				character.remove()
				let currScore: number = gameModel.player.getAttribute(Attributes.SCORE)
				let killScore: number = character.getAttribute(Attributes.SCORE)
				gameModel.player.assignAttribute(Attributes.SCORE, currScore + killScore)
				break
			}
			case CharacterTypes.PLAYER: {
				character.remove()
				break
			}
		}
	}

	addUI(scene: ECSA.Scene, gameModel: GameModel) {
		// Spawnpoint locations
		for(let [start, end] of gameModel.spawnpoints) {
			let spawnpoint = new ECSA.Graphics("spawnpoints");
			spawnpoint.beginFill(0xE56987);
			spawnpoint.drawRect(start.x, start.y, end.x - start.x, end.y - start.y)
			spawnpoint.endFill();

			new ECSA.Builder(scene)
				.withParent(scene.stage)
				.buildInto(spawnpoint)
		}

		// UI Wave initializer
		let uiWaveTextStyle = new PIXI.TextStyle({ fill: '#FFFFFF', fontSize: 55, fontStyle: "italic", fontWeight: "bold" })
		new ECSA.Builder(scene)
			.relativePos(0.5, 0.5)
			.anchor(0.5, 0.5)
			.withComponent(new WaveTextVisibilityComponent())
			.withComponent(new ECSA.GenericComponent('waveTextUpdater')
				.doOnMessage(Messages.NEW_WAVE, (cmp: ECSA.Component, msg: ECSA.Message) => {
					cmp.owner.asText().text = `Wave ${gameModel.waveNum}`
				})
			)
			.withParent(scene.stage)
			.asText('text', `Wave ${gameModel.waveNum + 1}`, uiWaveTextStyle)
			.build()
		
		// Score & HP
		new ECSA.Builder(scene)
			.localPos(WIDTH*1/6, WALLS_SIZE/2)
			.anchor(0.5)
			.withParent(scene.stage)
			.withComponent(new ECSA.GenericComponent('scoreHP')
				.doOnUpdate((cmp, delta, absolute) => {
					let score = `Score: ${gameModel.player.getAttribute(Attributes.SCORE)}`
					let hp = `HP left: ${gameModel.player.getAttribute(Attributes.HP)}`
					cmp.owner.asText().text = `${hp}\n${score}`
				})
			)
			.asText('text', "tst", new PIXI.TextStyle({ fill: '#FFFFFF', fontSize: 10 }))
			.build();

		// Game over
		let uiGameOverTextStyle = new PIXI.TextStyle({ fill: '#FFFFFF', fontSize: 80, fontStyle: "italic", fontWeight: "bold" })
		new ECSA.Builder(scene)
			.relativePos(0.5, 0.5)
			.anchor(0.5, 0.5)
			.withComponent(
				new ECSA.ChainComponent()
					.execute((cmp) => {cmp.owner.visible = false})
					.waitForMessage(Messages.PLAYER_DEATH)
					.execute((cmp) => {cmp.owner.visible = true})
					.waitTime(1500)
					.addComponentAndWait(new FinalScoreScreenComponent())
			)
			.withParent(scene.stage)
			.asText('gameOver', `Game over`, uiGameOverTextStyle)
			.build()

	}

	addProjectile(character: ECSA.Container, gameModel: GameModel) {
		let color: number = character.getAttribute(Attributes.PROJECTILE_COLOR)
		var velocity: number = character.getAttribute(Attributes.PROJECTILE_MAX_VELOCITY)
		velocity = (velocity != null) ? velocity : gameModel.baseVelocity
		let projectile = new ECSA.Graphics(Names.PROJECTILE);
		projectile.beginFill((color != null) ? color : 0xFFFFED);
		projectile.drawRect(0, 0, 10, 5)
		projectile.endFill();

		gameModel.addProjectile(projectile)

		new ECSA.Builder(character.scene)
			.localPos(character.x, character.y)
			.anchor(0.5)
			.withAttribute(Attributes.MAX_VELOCITY, velocity)
			.withAttribute(Attributes.MAX_ACCELERATION, velocity)
			.withAttribute(Attributes.PROJECTILE_OWNER_TYPE, character.getAttribute(Attributes.CHARACTER_TYPE))
			.withComponent(new ProjectileMovementComponent(Attributes.DYNAMICS, gameModel, character.rotation))
			.withState(States.ALIVE)
			.withParent(character.scene.stage)
			.buildInto(projectile)
	}

	private createTexture(spriteFrame: SpriteFrame): PIXI.Texture {
		let texture = new PIXI.Texture(this.spriteSheet);
		let dimensions: SpriteDimensions = spriteFrame.frame
		texture.frame = new PIXI.Rectangle(dimensions.x, dimensions.y, dimensions.w, dimensions.h);
		return texture;
	}
}