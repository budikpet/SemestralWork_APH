import DynamicsComponent from "./utils/dynamics_component";
import { Path, PathContext, SteeringMath } from '../libs/pixi-math';
import * as ECSA from '../libs/pixi-component';
import { Attributes } from "./constants";



/**
 * Base class for all steering components
 */
abstract class RotationComponent extends ECSA.Component {
	math = new SteeringMath();
	lastTarget: ECSA.Vector = new ECSA.Vector(0, 0)

	onUpdate(delta: number, absolute: number) {
		// change rotation based on the target
		let force = this.calcForce(delta)

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

export class PlayerRotationComponent extends RotationComponent {
	_inputComponent: ECSA.KeyInputComponent
	mousePos: ECSA.Vector = new ECSA.Vector(0, 0)

	onInit() {
		super.onInit()
		this.subscribe(ECSA.PointerMessages.POINTER_OVER)
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === ECSA.PointerMessages.POINTER_OVER) {
			let mousePos = msg.data.mousePos
			this.mousePos = new ECSA.Vector(mousePos.posX, mousePos.posY)
		}
	}

	protected calcForce(delta: number): ECSA.Vector {
		let ownerPos = new ECSA.Vector(this.owner.position.x, this.owner.position.y)
		let force = this.math.seek(this.mousePos, ownerPos, new ECSA.Vector(0, 0), 10000, 1)

		return force
	}

}