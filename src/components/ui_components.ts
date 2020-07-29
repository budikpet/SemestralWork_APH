import * as ECSA from '../../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { Messages, Attributes } from '../constants';
import { checkTime } from '../utils/functions';
import { GameModel } from '../game_model';
import { Factory } from '../factory';

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

export class FinalScoreScreen extends ECSA.Component {
	protected factory: Factory
	protected gameModel: GameModel
	protected inputCmp: ECSA.KeyInputComponent

	onInit() {
		super.onInit()
		this.gameModel = this.scene.getGlobalAttribute(Attributes.GAME_MODEL)
		this.factory = this.scene.getGlobalAttribute(Attributes.FACTORY)

		let score: number = this.gameModel.player.getAttribute(Attributes.SCORE)
		if(this.gameModel.bestScore < score) {
			this.gameModel.bestScore = score
		}
		
		// Prepare final score screen
		let owner: ECSA.Text = this.owner.asText()
		let scoreStr = `Score: ${score}`
		let bestScoreStr = `Best score: ${this.gameModel.bestScore}`
		let continueStr = "Press E to continue."
		owner.text = `${scoreStr}\n${bestScoreStr}\n\n${continueStr}`
		owner.style.fontSize = 40

		this.inputCmp = this.scene.stage.findComponentByName<ECSA.KeyInputComponent>(ECSA.KeyInputComponent.name);
	}

	onUpdate(delta: number, absoluteTime: number) {
		if (this.inputCmp.isKeyPressed(ECSA.Keys.KEY_E)) {
			this.finish()
		}
	}

	onFinish() {
		// Reset the game
		this.owner.asText().text = "Resetting the game..."
		
		this.scene.invokeWithDelay(3000, () => {
			this.factory.resetGame(this.scene)
		})
	}
}