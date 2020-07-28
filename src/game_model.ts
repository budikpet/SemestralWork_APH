import * as ECSA from '../libs/pixi-component';


export class GameModel {
	/// Static
	baseVelocity: number = 100
	baseAcceleration: number = this.baseVelocity/10
	baseAttackFrequency: number = 1
	baseNumOfEnemies: number = 10
	///
	
	gameSpeed: number = 10

	protected _player: ECSA.Container

	protected _walls: Array<ECSA.Container>

	// Map of all enemies <ID, EnemyObject>
	protected _enemies: Map<number, ECSA.Container> = new Map()

	// Map of all projectiles <ID, EnemyObject>
	protected _projectiles: Map<number, ECSA.Container> = new Map()

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

	public get enemies(): Map<number, ECSA.Container> {
		return this._enemies
	}

	public set walls(walls: Array<ECSA.Container>) {
		this._walls = walls
	}

	public addEnemy(enemy: ECSA.Container) {
		this._enemies.set(enemy.id, enemy)
	}

	public removeEnemy(id: number) {
		this._enemies.delete(id)
	}

	public addProjectile(projectile: ECSA.Container) {
		this._projectiles.set(projectile.id, projectile)
	}

	public removeProjectile(id: number) {
		this._projectiles.delete(id)
	}
}