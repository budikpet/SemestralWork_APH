import * as ECSA from '../libs/pixi-component';
import { Factory } from './factory';
import { WIDTH, HEIGHT } from './constants';
import { GameModel } from './game_model';

// TODO rename your game
class SpaceShooter {
	engine: ECSA.GameLoop;

	constructor() {
		this.engine = new ECSA.GameLoop();
		let canvas = (document.getElementById('gameCanvas') as HTMLCanvasElement);

		// init the game loop
		this.engine.init(canvas, WIDTH, HEIGHT, 1, // width, height, resolution
			{
				flagsSearchEnabled: false, // searching by flags feature
				statesSearchEnabled: false, // searching by states feature
				tagsSearchEnabled: false, // searching by tags feature
				namesSearchEnabled: true, // searching by names feature
				notifyAttributeChanges: false, // will send message if attributes change
				notifyStateChanges: false, // will send message if states change
				notifyFlagChanges: false, // will send message if flags change
				notifyTagChanges: false, // will send message if tags change
				debugEnabled: false // debugging window
			}, true); // resize to screen

		this.engine.app.loader
			.reset()
			//.add(myFile, 'myFileUrl') load your assets here
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		let factory = new Factory();
		let gameModel = new GameModel()
		factory.initializeLevel(this.engine.scene, gameModel)
	}
}

// this will create a new instance as soon as this file is loaded
export default new SpaceShooter();