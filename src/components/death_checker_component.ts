import * as ECSA from '../../libs/pixi-component';
import { Messages, Attributes, CharacterTypes, States, Names } from '../constants';
import { ProjectileCollisionMsg } from './collision_manager_component';
import { GameModel } from '../game_model';
import { DeathAnimation } from './animations_components';
import { Factory } from '../factory';
import { State } from 'pixi.js';

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

		this.gameModel = this.scene.getGlobalAttribute(Names.GAME_MODEL)
		this.factory = this.scene.getGlobalAttribute(Names.FACTORY)
	}

	onMessage(msg: ECSA.Message) {
		if (msg.action === Messages.PROJECTILE_COLLISION) {
			this.handleProjectileCollision(msg.data)
		}
	}

	protected handleProjectileCollision(collisionMsg: ProjectileCollisionMsg) {
		if(collisionMsg.projectile.stateId === States.DEAD || collisionMsg.character.stateId === States.DEAD) {
			return
		}

		// Destroy projectile
		collisionMsg.projectile.stateId = States.DEAD
		this.gameModel.projectiles.delete(collisionMsg.projectile.id)
		collisionMsg.projectile.remove()
		
		let currHp: number = collisionMsg.character.getAttribute(Attributes.HP)
		collisionMsg.character.assignAttribute(Attributes.HP, currHp - 1)
		if (currHp - 1 <= 0) {
			// Character died
			collisionMsg.character.stateId = States.DEAD
			this.prepareDeathAnim(collisionMsg.character)
		}
	}

	protected prepareDeathAnim(character: ECSA.Container) {
		var deathMsgKey: string = character.getAttribute(Attributes.DEATH_MSG_TYPE)
		this.sendMessage(deathMsgKey, new DeathMessage(character))
		
		character.addComponent(
			new ECSA.ChainComponent()
				.addComponentAndWait(new DeathAnimation())
				.execute((cmp) => {
					this.factory.removeCharacter(character, this.gameModel)
				})
		)
	}
} 