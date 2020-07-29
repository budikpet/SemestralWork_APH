import * as ECSA from '../libs/pixi-component';
import { Factory } from './factory';
import { WIDTH, HEIGHT, Assets } from './constants';
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
			.add(Assets.SPRITES, './assets/spaceShooter/graphics/spritesheet.json')
			.add(Assets.SPRITESHEET, './assets/spaceShooter/graphics/spritesheet.png')
			.add(Assets.SOUND_DEATH, './assets/spaceShooter/sounds/death.mp3')
			.add(Assets.SOUND_FIRE, './assets/spaceShooter/sounds/fire.mp3')
			.add(Assets.SOUND_HIT, './assets/spaceShooter/sounds/hit.mp3')
			.add(Assets.SOUND_NEW_WAVE, './assets/spaceShooter/sounds/new_wave.mp3')
			.load(() => this.onAssetsLoaded());
	}

	onAssetsLoaded() {
		// init the scene and run your game
		let resources = this.engine.app.loader.resources;
		let factory = new Factory(resources[Assets.SPRITES].data);
		let gameModel = new GameModel()
		factory.initializeLevel(this.engine.scene, gameModel)
	}
}

// this will create a new instance as soon as this file is loaded
export default new SpaceShooter();