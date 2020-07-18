
import { Vector } from '../../libs/pixi-component';

/**
 * Storage for acceleration and velocity
 */
export default class Dynamics {
	acceleration: Vector;
	velocity: Vector;

	constructor(velocity: Vector = new Vector(0, 0), acceleration: Vector = new Vector(0, 0)) {
		this.velocity = velocity;
		this.acceleration = acceleration;
	}

	applyVelocity(delta: number, gameSpeed: number) {
		this.velocity = this.velocity.add(this.acceleration.multiply(delta * 0.001 * gameSpeed));
	}

	calcPositionChange(delta: number, gameSpeed: number): Vector {
		return this.velocity.multiply(delta * 0.001 * gameSpeed);
	}
}