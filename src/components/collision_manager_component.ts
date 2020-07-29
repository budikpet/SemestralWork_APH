import * as ECSA from '../../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { GameModel } from '../game_model';
import { Messages, Attributes, CharacterTypes, Names } from '../constants';

export class WallCollisionMsg {
	public gameObject: ECSA.Container
	public wall: ECSA.Container

	constructor(gameObject, wall) {
		this.gameObject = gameObject
		this.wall = wall
	}
}

export class ProjectileCollisionMsg {
	public character: ECSA.Container
	public projectile: ECSA.Container

	constructor(character, projectile) {
		this.character = character
		this.projectile = projectile
	}
}

/**
 * Checks collisions of all objects in the game.
 */
export class CollisionManagerComponent extends ECSA.Component {
	protected gameModel: GameModel;

	onInit() {
		super.onInit()
		this.gameModel = this.scene.getGlobalAttribute(Names.GAME_MODEL)
	}

	onUpdate() {
		this.checkPlayerCollisions()
		this.checkProjectileCollisions()
		this.checkEnemyCollisions()
	}

	protected checkProjectileCollisions() {
		for(let [, projectile] of this.gameModel.projectiles) {
			// Projectile-character collision
			let projectileOwnerType: CharacterTypes = projectile.getAttribute(Attributes.PROJECTILE_OWNER_TYPE)
			if(projectileOwnerType === CharacterTypes.ENEMY) {
				// Projectile-player collision
				if (this.testIntersection(projectile.getBounds(), this.gameModel.player.getBounds())) {
					let data = new ProjectileCollisionMsg(this.gameModel.player, projectile)
					this.sendMessage(Messages.PROJECTILE_COLLISION, data)

				}
			} else if(projectileOwnerType === CharacterTypes.PLAYER) {
				// Projectile-enemy collision
				for(let [, enemy] of this.gameModel.enemies) {
					if (this.testIntersection(projectile.getBounds(), enemy.getBounds())) {
						let data = new ProjectileCollisionMsg(enemy, projectile)
						this.sendMessage(Messages.PROJECTILE_COLLISION, data)
					}
				}
			}		

			// Projectile-wall collision
			for(let wall of this.gameModel.walls) {
				if (this.testIntersection(projectile.getBounds(), wall.getBounds())) {
					let data = new WallCollisionMsg(projectile, wall)
					this.sendMessage(Messages.WALL_COLLISION, data)
				}
			}
		}
	}

	protected checkEnemyCollisions() {
		// Enemy-wall collision
		for(let [,enemy] of this.gameModel.enemies) {
			for(let wall of this.gameModel.walls) {
				if (this.testIntersection(enemy.getBounds(), wall.getBounds())) {
					let data = new WallCollisionMsg(enemy, wall)
					this.sendMessage(Messages.WALL_COLLISION, data)
				}
			}
		}
	}

	protected checkPlayerCollisions() {
		// Player-wall collision
		let player = this.gameModel.player

		for(let wall of this.gameModel.walls) {
			if (this.testIntersection(player.getBounds(), wall.getBounds())) {
				let data = new WallCollisionMsg(player, wall)
				this.sendMessage(Messages.WALL_COLLISION, data)
			}
		}
	}

	/**
	 * Checks intersection of two rectangles via AABB theorem
	 */
	private testIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): boolean {
		let intersectionX = this.testHorizIntersection(boundsA, boundsB);
		let intersectionY = this.testVertIntersection(boundsA, boundsB);

		if (intersectionX > 0 && intersectionY > 0) {
			return true;
		}
		return false;
	}

	/**
	 * Checks horizontal intersection
	 */
	private testHorizIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
		return Math.min(boundsA.right, boundsB.right) - Math.max(boundsA.left, boundsB.left);
	}

	/**
	 * Checks vertical intersection
	 */
	private testVertIntersection(boundsA: PIXI.Rectangle, boundsB: PIXI.Rectangle): number {
		return Math.min(boundsA.bottom, boundsB.bottom) - Math.max(boundsA.top, boundsB.top);
	}

}