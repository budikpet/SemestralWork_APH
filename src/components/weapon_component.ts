import DynamicsComponent from "../utils/dynamics_component";
import { Path, PathContext, SteeringMath } from '../../libs/pixi-math';
import * as ECSA from '../../libs/pixi-component';
import { Attributes, Assets, Messages } from "../constants";
import { Factory } from "../factory";
import { GameModel } from "../game_model";
import { checkTime } from "../utils/functions";
import Dynamics from "../utils/dynamics";
import { ArmatureDisplayData } from "../../libs/dragonbones/model/display-data";



/**
 * Base class for all weapon handling components. Handles rotation of the character and weapon fireing.
 */
abstract class WeaponComponent extends ECSA.Component {
	protected math = new SteeringMath();
	protected lastTarget: ECSA.Vector = new ECSA.Vector(0, 0)
	protected factory: Factory;
	protected gameModel: GameModel;
	protected shouldFire: boolean = false;
	protected lastShot: number = -1000;
	protected attackFrequency: number;

	onInit() {
		super.onInit()
		this.subscribe(Messages.DEATH)
		this.factory = this.scene.getGlobalAttribute<Factory>(Attributes.FACTORY)
		this.gameModel = this.scene.getGlobalAttribute<GameModel>(Attributes.GAME_MODEL)

		this.attackFrequency = this.owner.getAttribute(Attributes.ATTACK_FREQUENCY)

		if(this.attackFrequency == null) {
			this.attackFrequency = this.gameModel.baseAttackFrequency
		}
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === Messages.DEATH) {
			this.finish()
		}
	}

	onUpdate(delta: number, absolute: number) {
		// change rotation based on the target
		let force = this.calcForce(delta)

		var desiredRotation = Math.atan2(force.y, force.x);
		this.owner.rotation = desiredRotation

		if(this.shouldFire) {
			this.tryFire(absolute)
		}
	}

	private _useGradualRotation(force: ECSA.Vector) {
		var desiredRotation = Math.atan2(force.y, force.x);
		let currentRotation = this.owner.rotation;

		let currQuadrat = this.getQuadrat(this.lastTarget)
		let newQuadrat = this.getQuadrat(force)

		// Rotation change
		let sign = 0
		if(currQuadrat === 4 && newQuadrat === 1) {
			if(desiredRotation > 0) {
				sign = 1
			}
		} else if(currQuadrat === 1 && newQuadrat === 4) {
			if(desiredRotation < 0) {
				sign = -1
			}
		} else {
			// If we stay in a quadrat or go between other quadrats then both current and desired rotation should be positive/negative
			if(currentRotation < 0 && desiredRotation > 0) {
				desiredRotation -= 2*Math.PI
			} else if(currentRotation > 0 && desiredRotation < 0) {
				desiredRotation += 2* Math.PI
			}
			sign = Math.sign(desiredRotation - currentRotation)
		}

		// console.log("Curr/desired ", currentRotation,"/",desiredRotation, " for sign (",sign, ") and currQ/newQ: (",currQuadrat, "/", newQuadrat,")")

		let rotated = Math.abs(currentRotation - desiredRotation) < 0.1;
		if (!rotated) {
			this.owner.rotation = (currentRotation + sign * 0.1) % (2*Math.PI);
		}
	}

	// Returns a quadrat number of a unit circle
	protected getQuadrat(vector: ECSA.Vector): number {
		if(vector.x > 0 && vector.y > 0) {
			// Bottom right
			return 1
		} else if(vector.x < 0 && vector.y >= 0) {
			// Bottom left
			return 2
		} else if(vector.x < 0 && vector.y < 0) {
			// Top left
			return 3
		} else {
			// Top right
			return 4
		}
	}

	protected tryFire(absoluteTime: number) {
		if (checkTime(this.lastShot, absoluteTime, this.attackFrequency)) {
			this.lastShot = absoluteTime;
			this.factory.addProjectile(this.owner, this.gameModel)
			return true;
		} else {
			return false;
		}
	}

	protected abstract calcForce(delta: number): ECSA.Vector;
}

export class EnemyWeaponComponent extends WeaponComponent {
	i: number;

	protected calcForce(delta: number): ECSA.Vector {
		let targetDynamics: Dynamics = this.gameModel.player.getAttribute(Attributes.DYNAMICS)

		let targetPos = new ECSA.Vector(this.gameModel.player.position.x, this.gameModel.player.position.y)
		let ownerPos = new ECSA.Vector(this.owner.position.x, this.owner.position.y)
		let ownerMaxVelocity: number = this.owner.getAttribute(Attributes.MAX_VELOCITY)
		let force = this.math.seek(targetPos, ownerPos, new ECSA.Vector(0, 0), 10000, 1)

		this.shouldFire = true

		return force
	}
}

export class PlayerWeaponComponent extends WeaponComponent {
	_inputComponent: ECSA.KeyInputComponent
	mousePos: ECSA.Vector = new ECSA.Vector(0, 0)

	onInit() {
		super.onInit()
		this.subscribe(ECSA.PointerMessages.POINTER_OVER)
		this.subscribe(ECSA.PointerMessages.POINTER_DOWN)
		this.subscribe(ECSA.PointerMessages.POINTER_RELEASE)
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === ECSA.PointerMessages.POINTER_OVER) {
			let mousePos = msg.data.mousePos
			this.mousePos = new ECSA.Vector(mousePos.posX, mousePos.posY)
		}

		if(msg.action === ECSA.PointerMessages.POINTER_DOWN) {
			this.shouldFire = true
		}

		if(msg.action === ECSA.PointerMessages.POINTER_RELEASE) {
			this.shouldFire = false
		}
	}

	protected calcForce(delta: number): ECSA.Vector {
		let ownerMaxVelocity: number = this.owner.getAttribute(Attributes.MAX_VELOCITY)
		let ownerPos = new ECSA.Vector(this.owner.position.x, this.owner.position.y)
		let force = this.math.seek(this.mousePos, ownerPos, new ECSA.Vector(0, 0), ownerMaxVelocity, 1)

		return force
	}

}