import DynamicsComponent from "./utils/dynamics_component";
import { Path, PathContext, SteeringMath } from '../libs/pixi-math';
import * as ECSA from '../libs/pixi-component';
import { Attributes } from "./constants";
import { GameModel } from "./game_model";



/**
 * Base class for all steering components
 */
abstract class SteeringComponent extends DynamicsComponent {
	protected math = new SteeringMath();
	protected model: GameModel

	constructor(attrName: string, model: GameModel) {
		super(attrName, model.gameSpeed);
		this.model = model
	}

	onUpdate(delta: number, absolute: number) {

		// update dynamics and set new position
		let force = this.calcForce(delta);
		if (force == null || force.magnitude() === 0) {
			this.dynamics.velocity = new ECSA.Vector(0, 0)
			return;
		}

		this.dynamics.acceleration = force.limit(this.model.maxCharacterAcceleration);
		this.dynamics.velocity = this.dynamics.velocity.limit(this.model.maxCharacterVelocity);
		super.onUpdate(delta, absolute);
	}

	// Returns true if the ship doesn't move
	standsStill(): boolean {
		return this.dynamics.velocity.magnitude() === 0
	}

	protected abstract calcForce(delta: number): ECSA.Vector;
}

export class PlayerSteeringComponent extends SteeringComponent {
	_inputComponent: ECSA.KeyInputComponent
	mousePos: ECSA.Vector = new ECSA.Vector(0, 0)

	acceleration: number = 10

	onInit() {
		super.onInit()
	}

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