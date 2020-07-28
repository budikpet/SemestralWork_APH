import * as ECSA from '../../libs/pixi-component';
import { Factory } from '../factory';
import { Attribute } from 'pixi.js';
import { Attributes, Messages } from '../constants';
import { GameModel } from '../game_model';
import { checkTime } from '../utils/functions';

export class WaveManagerComponent extends ECSA.Component {
	protected waveNum: number = 0
	protected factory: Factory
	protected gameModel: GameModel;

	protected enemiesAddedCurrWave: number = 0;
	protected enemiesToAddCurrWave: number = 0;
	protected enemyAddingFrequency: number = 1;	// x-times per second
	protected lastTimeEnemyAdded: number = -1

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
			this.enemiesAddedCurrWave = 0
			this.enemiesToAddCurrWave = this.gameModel.baseNumOfEnemies + 5*this.waveNum
		}
	}

	onUpdate(delta: number, absoluteTime: number) {
		let remainingEnemies = this.enemiesToAddCurrWave - this.enemiesAddedCurrWave
		if(remainingEnemies != 0) {
			if(checkTime(this.lastTimeEnemyAdded, absoluteTime, this.enemyAddingFrequency)) {
				this.lastTimeEnemyAdded = absoluteTime

				// Spawn a batch of enemies
				var batchSize: number = Math.floor(Math.random()*remainingEnemies + 1)
				batchSize = Math.min(remainingEnemies, batchSize)
				this.enemiesAddedCurrWave += batchSize

				for(let i = 0; i < batchSize; i++) {
					let pos = new ECSA.Vector(0, 0)
					this.factory.addEnemy(this.scene, this.gameModel, pos)
				}
			}
		}
	}
}