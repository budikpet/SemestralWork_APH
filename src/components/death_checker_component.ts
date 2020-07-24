import * as ECSA from '../../libs/pixi-component';
import { Messages, Attributes } from '../constants';
import { ProjectileCollisionMsg } from './collision_manager_component';
import { GameModel } from '../game_model';

export class DeathCheckerComponent extends ECSA.Component {
	protected gameModel: GameModel;
	i: number = 0;

	constructor(gameModel: GameModel) {
		super();
		this.gameModel = gameModel
	}

	onInit() {
		super.onInit()
		this.subscribe(Messages.PROJECTILE_COLLISION)
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === Messages.PROJECTILE_COLLISION) {
			this.handleProjectileCollision(msg.data)
		}
	}

	protected handleProjectileCollision(collisionMsg: ProjectileCollisionMsg) {			
		let currHp: number = collisionMsg.character.getAttribute(Attributes.HP)

		if(currHp - 1 <= 0) {
			// Character died
		} else {
			// Character damaged
			collisionMsg.character.assignAttribute(Attributes.HP, currHp - 1)
		}

		// Destroy projectile
		this.gameModel.projectiles.delete(collisionMsg.projectile.id)
		collisionMsg.projectile.remove()
	}
} 