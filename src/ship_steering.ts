import DynamicsComponent from "./utils/dynamics_component";
import { Path, PathContext, SteeringMath } from '../libs/pixi-math';
import * as ECSA from '../libs/pixi-component';



/**
 * Base class for all steering components
 */
abstract class SteeringComponent extends DynamicsComponent {
	math = new SteeringMath();
	brakesActive: Boolean = false

	onUpdate(delta: number, absolute: number) {

		// update dynamics and set new position
		let force = this.calcForce(delta);
		if (force == null || (force.magnitude() === 0 && this.dynamics.velocity.magnitude() === 0)) {
			return;
		}

		this.dynamics.acceleration = force.limit(100);
		this.dynamics.velocity = this.dynamics.velocity.limit(1000);
		super.onUpdate(delta, absolute);

		if(this.brakesActive) {
			let c = 0.5
			let counterDynamics = new ECSA.Vector(c*Math.sign(this.dynamics.velocity.x), c*Math.sign(this.dynamics.velocity.y))
			this.dynamics.velocity = this.dynamics.velocity.subtract(counterDynamics)
			if(Math.abs(this.dynamics.velocity.x) < c && Math.abs(this.dynamics.velocity.y) < c) {
				this.dynamics.velocity = new ECSA.Vector(0, 0)
				return
			}
		}

		// change rotation based on the velocity
		let currentAngle = Math.atan2(this.dynamics.velocity.y, this.dynamics.velocity.x);
		let currentRotation = this.owner.rotation;
		let desiredRotation = currentAngle;
		if (((desiredRotation + 2 * Math.PI) - currentRotation) < (currentRotation - desiredRotation)) {
			// rotation from 270° to 360° looks better than back to 0°
			desiredRotation += 2 * Math.PI;
		}

		let rotated = Math.abs(currentRotation - desiredRotation) < 0.1;
		if (!rotated) {
			this.owner.rotation = currentRotation + Math.sign(desiredRotation - currentRotation) * 0.2;
		}
	}

	standsStill(): boolean {
		return this.dynamics.velocity.magnitude() === 0
	}

	protected abstract calcForce(delta: number): ECSA.Vector;
}

export class PlayerSteeringComponent extends SteeringComponent {
	_inputComponent: ECSA.KeyInputComponent

	onInit() {
		super.onInit()
	}

	protected calcForce(delta: number): ECSA.Vector {
		var force: ECSA.Vector = new ECSA.Vector(0, 0)

		if(this._inputComponent == null) {
			this._inputComponent = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(ECSA.KeyInputComponent.name);
		}

		// Brakes, if toggled then the ship will eventually stop
		if(this._inputComponent.isKeyPressed(ECSA.Keys.KEY_B)) {
			this.brakesActive = true
		}

		// Acceleration
		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_UP)) {
			force = force.add(new ECSA.Vector(0, -100))
			this.brakesActive = false
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_DOWN)) {
			force = force.add(new ECSA.Vector(0, 100))
			this.brakesActive = false
		}

		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_LEFT)) {
			force = force.add(new ECSA.Vector(-100, 0))
			this.brakesActive = false
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_RIGHT)) {
			force = force.add(new ECSA.Vector(100, 0))
			this.brakesActive = false
		}

		// Rotation only
		if(this.standsStill()) {
			if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_Q)) {
				this.owner.rotation = this.getNewRotation(-1)
			} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_E)) {
				this.owner.rotation = this.getNewRotation(1)
			}
		}

		// console.log(this.owner.rotation*180/Math.PI)
		return force
	}

	/// Returns new degree for on-the-spot rotation
	getNewRotation(degrees: number): number {
		let currentRotation = this.owner.rotation
		let desiredRotation = this.owner.rotation + degrees
		return (currentRotation + Math.sign(desiredRotation - currentRotation) * 0.02*2.5) % (2*Math.PI)
	}

}