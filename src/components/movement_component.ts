import DynamicsComponent from "../utils/dynamics_component";
import { Path, PathContext, SteeringMath } from '../../libs/pixi-math';
import * as ECSA from '../../libs/pixi-component';
import { Attributes, Messages } from "../constants";
import { GameModel } from "../game_model";
import { WallCollisionMsg } from "./collision_manager_component";



/**
 * Base class for all movements components.
 */
abstract class MovementComponent extends DynamicsComponent {
	protected math = new SteeringMath();
	protected gameModel: GameModel
	protected maxVelocity: number
	protected maxAcceleration: number

	constructor(attrName: string, gameModel: GameModel) {
		super(attrName, gameModel.gameSpeed);
		this.gameModel = gameModel
	}

	onInit() {
		super.onInit()
		this.subscribe(Messages.WALL_COLLISION)

		this.maxVelocity = this.owner.getAttribute(Attributes.MAX_VELOCITY)
		this.maxAcceleration = this.owner.getAttribute(Attributes.MAX_ACCELERATION)

		if(this.maxVelocity === null) {
			this.maxVelocity = this.gameModel.baseVelocity
		}

		if(this.maxAcceleration === null) {
			this.maxAcceleration = this.gameModel.baseAcceleration
		}
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === Messages.WALL_COLLISION) {
			this.onWallCollision(msg)
		}
	}

	onUpdate(delta: number, absolute: number) {

		// update dynamics and set new position
		let force = this.calcForce(delta);
		if (force == null || force.magnitude() === 0) {
			this.dynamics.velocity = new ECSA.Vector(0, 0)
			return;
		}

		this.dynamics.acceleration = force.limit(this.maxAcceleration);
		this.dynamics.velocity = this.dynamics.velocity.limit(this.maxVelocity);
		super.onUpdate(delta, absolute);
	}

	protected onWallCollision(msg: ECSA.Message) {
		let collisionMsg: WallCollisionMsg = msg.data
		if(collisionMsg.character.id === this.owner.id) {
			let repulsiveForce: ECSA.Vector = collisionMsg.wall.getAttribute(Attributes.WALL_REPULSIVE_FORCE)
			this.dynamics.velocity = this.dynamics.velocity.add(repulsiveForce.multiply(10))
			this.dynamics.acceleration = this.dynamics.acceleration.add(repulsiveForce.multiply(10))
		}
	}

	// Returns true if the ship doesn't move
	standsStill(): boolean {
		return this.dynamics.velocity.magnitude() === 0
	}

	protected abstract calcForce(delta: number): ECSA.Vector;
}

/**
 * Implements player movement.
 */
export class PlayerMovementComponent extends MovementComponent {
	_inputComponent: ECSA.KeyInputComponent
	mousePos: ECSA.Vector = new ECSA.Vector(0, 0)

	acceleration: number = 10

	protected calcForce(delta: number): ECSA.Vector {
		if(this._inputComponent == null) {
			this._inputComponent = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(ECSA.KeyInputComponent.name);
		}

		let force = new ECSA.Vector(0, 0)

		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_W)) {
			force = force.add(new ECSA.Vector(0, -this.acceleration))
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_S)) {
			force = force.add(new ECSA.Vector(0, this.acceleration))
		}

		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_A)) {
			force = force.add(new ECSA.Vector(-this.acceleration, 0))
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_D)) {
			force = force.add(new ECSA.Vector(this.acceleration, 0))
		}

		return force
	}

}

export class ProjectileMovementComponent extends MovementComponent {
	initialRotation: number;
	directionVect: ECSA.Vector;

	constructor(attrName: string, gameModel: GameModel, initialRotation: number) {
		super(attrName, gameModel);
		this.initialRotation = initialRotation
	}

	onInit() {
		this.owner.rotation = this.initialRotation

		let pos = this.owner.position
		let velX = pos.x + Math.cos(this.initialRotation)
		let velY = pos.y + Math.sin(this.initialRotation)
		this.directionVect = new ECSA.Vector(velX, velY).multiply(10)
	}

	protected onWallCollision(msg: ECSA.Message) {
		// Remove projectile
	}

	protected calcForce(delta: number): ECSA.Vector {
		
		return this.directionVect
	}

}