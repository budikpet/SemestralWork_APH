import * as ECSA from '../../libs/pixi-component';
import { Messages, Attributes, CharacterTypes } from '../constants';
import { ProjectileCollisionMsg } from './collision_manager_component';
import { GameModel } from '../game_model';
import { DeathAnimation } from './animations_components';
import { Factory } from '../factory';

export class DeathMessage {
	id: number
	characterType: CharacterTypes

	constructor(character: ECSA.Container) {
		this.id = character.id
		this.characterType = character.getAttribute(Attributes.CHARACTER_TYPE)
	}
}

export class DeathCheckerComponent extends ECSA.Component {
	protected gameModel: GameModel;
	protected factory: Factory;

	onInit() {
		super.onInit()
		this.subscribe(Messages.PROJECTILE_COLLISION)

		this.gameModel = this.scene.getGlobalAttribute(Attributes.GAME_MODEL)
		this.factory = this.scene.getGlobalAttribute(Attributes.FACTORY)
	}

	onMessage(msg: ECSA.Message) {
		if (msg.action === Messages.PROJECTILE_COLLISION) {
			this.handleProjectileCollision(msg.data)
		}
	}

	protected handleProjectileCollision(collisionMsg: ProjectileCollisionMsg) {
		let currHp: number = collisionMsg.character.getAttribute(Attributes.HP)

		if (currHp - 1 <= 0) {
			// Character died
			this.prepareDeathAnim(collisionMsg.character)
		} else {
			// Character damaged
			collisionMsg.character.assignAttribute(Attributes.HP, currHp - 1)
		}

		// Destroy projectile
		this.gameModel.projectiles.delete(collisionMsg.projectile.id)
		collisionMsg.projectile.remove()
	}

	protected prepareDeathAnim(character: ECSA.Container) {
		this.sendMessage(Messages.DEATH, new DeathMessage(character))
		
		character.addComponent(
			new ECSA.ChainComponent()
				.addComponentAndWait(new DeathAnimation())
				.execute((cmp) => {
					this.factory.removeCharacter(character, this.gameModel)
				})
		)
	}
} 