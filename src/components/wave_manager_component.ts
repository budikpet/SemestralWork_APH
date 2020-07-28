import * as ECSA from '../../libs/pixi-component';
import { Factory } from '../factory';
import { Attribute } from 'pixi.js';
import { Attributes, Messages } from '../constants';
import { GameModel } from '../game_model';
import { checkTime, randomFromInterval } from '../utils/functions';

export class WaveManagerComponent extends ECSA.Component {
	protected waveNum: number = 0
	protected factory: Factory
	protected gameModel: GameModel;

	protected enemiesAddedCurrWave: number = 0;
	protected enemiesToAddCurrWave: number = 0;
	protected enemyAddingFrequency: number = 1;	// x-times per second
	protected lastTimeEnemyAdded: number = -1
	protected requestedNewWave: boolean = false

	onInit() {
		super.onInit()
		this.frequency = 50
		this.factory = this.scene.getGlobalAttribute(Attributes.FACTORY)
		this.gameModel = this.scene.getGlobalAttribute(Attributes.GAME_MODEL)

		this.subscribe(Messages.NEW_WAVE)
	}

	onMessage(msg: ECSA.Message) {
		if(msg.action === Messages.NEW_WAVE) {
			this.waveNum++
			this.requestedNewWave = false
			this.enemiesAddedCurrWave = 0
			this.enemiesToAddCurrWave = this.gameModel.baseNumOfEnemies + 2*this.waveNum
		}
	}

	onUpdate(delta: number, absoluteTime: number) {
		let remainingEnemies = this.enemiesToAddCurrWave - this.enemiesAddedCurrWave
		if(remainingEnemies != 0) {
			if(checkTime(this.lastTimeEnemyAdded, absoluteTime, this.enemyAddingFrequency)) {
				this.lastTimeEnemyAdded = absoluteTime

				// Spawn a batch of enemies
				var batchSize: number = randomFromInterval(1, remainingEnemies)
				batchSize = Math.min(remainingEnemies, batchSize)
				this.enemiesAddedCurrWave += batchSize

				for(let i = 0; i < batchSize; i++) {
					// let spawnIndex = randomFromInterval(0, this.gameModel.spawnpoints.length - 1)
					let spawnIndex = 0
					let pos = this.gameModel.spawnpoints[spawnIndex]
					this.factory.addEnemy(this.scene, this.gameModel, pos)
				}
			}
		} else if(this.gameModel.enemiesCnt <= 0) {
			if(!this.requestedNewWave) {
				// Player destroyed all enemies of the current wave, request a new one
				this.requestedNewWave = true
				this.sendMessage(Messages.REQUEST_NEW_WAVE)
			}
		}
	}
}