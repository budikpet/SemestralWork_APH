import * as ECSA from '../libs/pixi-component';


export class GameModel {
	player: PlayerModel

	walls: Array<ECSA.Container>

	// Map of all enemies <ID, EnemyObject>
	enemies: Map<number, EnemyModel>	

	// Map of all projectiles <ID, EnemyObject>
	projectiles: Map<number, ECSA.Container>
}

export class PlayerModel {
	obj: ECSA.Container
	maxVelocity: Number
	attackSpeed: Number
}

export class EnemyModel {
	obj: ECSA.Container
	maxVelocity: Number
	attackSpeed: Number
}