import * as ECSA from '../libs/pixi-component';
import { WIDTH, WALLS_SIZE, HEIGHT } from './constants';


export class GameModel {
	/// Static
	baseVelocity: number = 100
	baseAcceleration: number = this.baseVelocity/10
	baseAttackFrequency: number = 1
	baseNumOfEnemies: number = 7
	///
	
	gameSpeed: number = 10

	protected _player: ECSA.Container

	protected _walls: Array<ECSA.Container>

	// Map of all enemies <ID, EnemyObject>
	protected _enemies: Map<number, ECSA.Container> = new Map()
	protected _enemiesCnt: number = 0

	// Map of all projectiles <ID, EnemyObject>
	protected _projectiles: Map<number, ECSA.Container> = new Map()

	protected _spawnpoints: ECSA.Vector[] = [
		new ECSA.Vector(WIDTH/2, WALLS_SIZE*3/4),			// top
		new ECSA.Vector(WIDTH - WALLS_SIZE*3/4, HEIGHT/2),	// right
		new ECSA.Vector(WIDTH/2, HEIGHT - WALLS_SIZE*3/4),	// bottom
		new ECSA.Vector(WALLS_SIZE*3/4, HEIGHT/2),			// left
	]

	public get player(): ECSA.Container {
		return this._player
	}

	public set player(player: ECSA.Container) {
		this._player = player
	}

	public get walls(): Array<ECSA.Container> {
		return this._walls
	}

	public get projectiles(): Map<number, ECSA.Container> {
		return this._projectiles
	}

	public get spawnpoints(): ECSA.Vector[] {
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