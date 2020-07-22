import * as ECSA from '../../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { GameModel } from '../game_model';
import { Messages, Attributes } from '../constants';

export class WallCollisionMsg {
	public character: ECSA.Container
	public wall: ECSA.Container

	constructor(character, wall) {
		this.character = character
		this.wall = wall
	}
}

/**
 * Checks collisions of all objects in the game.
 */
export class CollisionManagerComponent extends ECSA.Component {
	protected gameModel: GameModel;

	constructor(gameModel: GameModel) {
		super()
		this.gameModel = gameModel
	}

	onUpdate() {
		this.checkPlayerCollisions()
		this.checkProjectileCollisions()
		this.checkEnemyCollisions()
	}

	protected checkProjectileCollisions() {
		// Projectile-character collision

		// Projectile-wall collision
	}

	protected checkEnemyCollisions() {
		// Enemy-wall collision
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