import * as ECSA from '../../libs/pixi-component';
import { Factory } from '../factory';
import { Attribute } from 'pixi.js';
import { Attributes, Messages, Names } from '../constants';
import { GameModel } from '../game_model';
import { checkTime, randomFromInterval } from '../utils/functions';

export class WaveManagerComponent extends ECSA.Component {
	protected factory: Factory
	protected gameModel: GameModel;

	protected enemiesAddedCurrWave: number = 0;
	protected enemiesToAddCurrWave: number = 0;
	protected enemyAddingFrequency: number = 1;	// x-times per second
	protected lastTimeEnemyAdded: number = -1

	onInit() {
		super.onInit()
		this.frequency = 50
		this.factory = this.scene.getGlobalAttribute(Names.FACTORY)
		this.gameModel = this.scene.getGlobalAttribute(Names.GAME_MODEL)

		// Start first wave
		this.startNewWave()
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
					let spawnIndex = randomFromInterval(0, this.gameModel.spawnpoints.length - 1)
					let door = this.gameModel.spawnpoints[spawnIndex]
					let ranX = randomFromInterval(door[0].x, door[1].x)
					let ranY = randomFromInterval(door[0].y, door[1].y)
					this.factory.addEnemy(this.scene, this.gameModel, new ECSA.Vector(ranX, ranY))
				}
			}
		} else if(this.gameModel.enemiesCnt <= 0) {
			// Player destroyed all enemies of the current wave, request a new one
			this.startNewWave()
			this.sendMessage(Messages.NEW_WAVE)
		}
	}

	protected startNewWave() {
		this.gameModel.waveNum++
		this.enemiesAddedCurrWave = 0
		this.enemiesToAddCurrWave = this.gameModel.baseNumOfEnemies + 2*this.gameModel.waveNum
	}
}