import * as ECSA from '../../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { Messages } from '../constants';
import { checkTime } from '../utils/functions';

/**
 * UI component that checks for new wave requests and shows a new wave text.
 */
export class WaveCountdownComponent extends ECSA.Component{
	protected waveStartedTime: number = -1000

	onInit() {
		super.onInit()
		this.subscribe(Messages.NEW_WAVE)
		this.owner.alpha = 0.25
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === Messages.NEW_WAVE) {
			this.owner.visible = true
			this.waveStartedTime = -1
		}
	}

	onUpdate(delta: number, absoluteTime: number) {
		if(this.waveStartedTime <= 0) {
			this.waveStartedTime = absoluteTime
		}

		if(this.owner.visible) {
			if(checkTime(this.waveStartedTime, absoluteTime, 0.5)) {
				// Hide text roughly after 1 s
				this.owner.visible = false
				this.waveStartedTime = absoluteTime
			}
		}
	}
}