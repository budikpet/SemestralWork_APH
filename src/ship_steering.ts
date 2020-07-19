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

		let currQuadrat = this.getQuadrat(this.dynamics.velocity)
		this.dynamics.acceleration = force.limit(10);
		this.dynamics.velocity = this.dynamics.velocity.limit(100);
		super.onUpdate(delta, absolute);
		let newQuadrat = this.getQuadrat(this.dynamics.velocity)

		// Progresivelly stops the ship
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
		var desiredRotation = Math.atan2(this.dynamics.velocity.y, this.dynamics.velocity.x);
		let currentRotation = this.owner.rotation;

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

	// Returns true if the ship doesn't move
	standsStill(): boolean {
		return this.dynamics.velocity.magnitude() === 0
	}

	// Returns a quadrat number of a unit circle
	getQuadrat(vector: ECSA.Vector): number {
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

	protected abstract calcForce(delta: number): ECSA.Vector;
}

export class PlayerSteeringComponent extends SteeringComponent {
	_inputComponent: ECSA.KeyInputComponent

	onInit() {
		super.onInit()
		this.subscribe(ECSA.PointerMessages.POINTER_OVER)
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === ECSA.PointerMessages.POINTER_OVER) {
			let info = msg.data.mousePos
			console.log(info)
		}
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
		let accelerationSpeed = 10
		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_W)) {
			force = force.add(new ECSA.Vector(0, -accelerationSpeed))
			this.brakesActive = false
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_S)) {
			force = force.add(new ECSA.Vector(0, accelerationSpeed))
			this.brakesActive = false
		}

		if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_A)) {
			force = force.add(new ECSA.Vector(-accelerationSpeed, 0))
			this.brakesActive = false
		} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_D)) {
			force = force.add(new ECSA.Vector(accelerationSpeed, 0))
			this.brakesActive = false
		}

		// Rotation only
		if(this.standsStill()) {
			if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_Q)) {
				this.owner.rotation = this.getNewRotation(-1)
				console.log("Rad/Dg: ",this.owner.rotation," / ",this.owner.rotation*180/Math.PI)
			} else if (this._inputComponent.isKeyPressed(ECSA.Keys.KEY_E)) {
				this.owner.rotation = this.getNewRotation(1)
				console.log("Rad/Dg: ",this.owner.rotation," / ",this.owner.rotation*180/Math.PI)
			}
		}

		return force
	}

	/// Returns new degree for on-the-spot rotation
	getNewRotation(degrees: number): number {
		let currentRotation = this.owner.rotation
		let desiredRotation = this.owner.rotation + degrees
		return (currentRotation + Math.sign(desiredRotation - currentRotation) * 0.02*2.5) % (2*Math.PI)
	}

}