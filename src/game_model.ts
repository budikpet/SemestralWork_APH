import * as ECSA from '../libs/pixi-component';
import * as PIXI from 'pixi.js';
import { WIDTH, WALLS_SIZE, HEIGHT, DOOR_WIDTH as DOOR_LONG_SIDE, DOOR_HEIGHT as DOOR_SHORT_SIDE } from './constants';

type Door = [PIXI.Point, PIXI.Point]

export class GameModel {
	/// Static
	baseVelocity: number = 50
	baseAcceleration: number = this.baseVelocity/10
	baseAttackFrequency: number = 1
	baseNumOfEnemies: number = 7
	///
	
	gameSpeed: number = 10
	bestScore: number = 0
	protected _waveNum: number = 0

	protected _player: ECSA.Container
	protected _walls: Array<ECSA.Container>

	// Map of all enemies <ID, EnemyObject>
	protected _enemies: Map<number, ECSA.Container> = new Map()
	protected _enemiesCnt: number = 0

	// Map of all projectiles <ID, EnemyObject>
	protected _projectiles: Map<number, ECSA.Container> = new Map()
	protected _spawnpoints: Door[]

	constructor() {
		let topDoorStart = new PIXI.Point(WIDTH/2 - DOOR_LONG_SIDE/2, WALLS_SIZE/2 - DOOR_SHORT_SIDE/2)
		let rightDoorStart = new PIXI.Point(WIDTH - WALLS_SIZE/2 - DOOR_SHORT_SIDE/2, HEIGHT/2 - DOOR_LONG_SIDE/2)
		let bottomDoorStart = new PIXI.Point(WIDTH/2 - DOOR_LONG_SIDE/2, HEIGHT - WALLS_SIZE/2 - DOOR_SHORT_SIDE/2)
		let leftDoorStart = new PIXI.Point(WALLS_SIZE/2 - DOOR_SHORT_SIDE/2, HEIGHT/2 - DOOR_LONG_SIDE/2)

		this._spawnpoints = [
			[topDoorStart, new PIXI.Point(topDoorStart.x + DOOR_LONG_SIDE, topDoorStart.y + DOOR_SHORT_SIDE)],
			[rightDoorStart, new PIXI.Point(rightDoorStart.x + DOOR_SHORT_SIDE, rightDoorStart.y + DOOR_LONG_SIDE)],
			[bottomDoorStart, new PIXI.Point(bottomDoorStart.x + DOOR_LONG_SIDE, bottomDoorStart.y + DOOR_SHORT_SIDE)],
			[leftDoorStart, new PIXI.Point(leftDoorStart.x + DOOR_SHORT_SIDE, leftDoorStart.y + DOOR_LONG_SIDE)]
		]
	}

	public clear() {
		this._waveNum = 0
		this._player = null
		this._walls = null
		this._enemies.clear()
		this._enemiesCnt = 0
		this._projectiles.clear()
	}

	/// Getters/Setters

	public get player(): ECSA.Container {
		return this._player
	}

	public set player(player: ECSA.Container) {
		this._player = player
	}

	public get waveNum(): number {
		return this._waveNum
	}

	public set waveNum(waveNum: number) {
		this._waveNum = waveNum
	}

	public get walls(): Array<ECSA.Container> {
		return this._walls
	}

	public get projectiles(): Map<number, ECSA.Container> {
		return this._projectiles
	}

	public get spawnpoints(): Door[] {
		return this._spawnpoints
	}

	public get enemies(): Map<number, ECSA.Container> {
		return this._enemies
	}

	public get enemiesCnt(): number {
		return this._enemiesCnt
	}

	public set walls(walls: Array<ECSA.Container>) {
		this._walls = walls
	}

	public addEnemy(enemy: ECSA.Container) {
		this._enemiesCnt++
		this._enemies.set(enemy.id, enemy)
	}

	public removeEnemy(id: number) {
		this._enemiesCnt--
		this._enemies.delete(id)
	}

	public addProjectile(projectile: ECSA.Container) {
		this._projectiles.set(projectile.id, projectile)
	}

	public removeProjectile(id: number) {
		this._projectiles.delete(id)
	}
}