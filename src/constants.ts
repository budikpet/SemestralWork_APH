export enum Messages {
	CREATE_PROJECTILE = "create_projectile",

	WALL_COLLISION = "wall_collision",
	PROJECTILE_COLLISION = "projectile_collision",

	DEATH = "death",
	NEW_WAVE = "newWave"

}

export enum Assets {
}

export enum Attributes {
	MAX_VELOCITY = "velocity",
	MAX_ACCELERATION = "acceleration",
	ATTACK_FREQUENCY = "attackFrequency",
	DYNAMICS = "dynamics",
	CHARACTER_TYPE = "characterType",
	HP = "healthPoints",							// How many projectiles can a character take
	SCORE = "score",
	
	WALL_TOP = "wallTop",
	WALL_BOTTOM = "wallBottom",
	WALL_LEFT = "wallLeft",
	WALL_RIGHT = "wallRight",
	WALL_REPULSIVE_FORCE = "wallRepulsiveForce",

	PLAYER = "player",
	ENEMY = "enemy",

	FACTORY = "factory",
	GAME_MODEL = "gameModel",

	PROJECTILE = "projectile",
	PROJECTILE_OWNER_TYPE = "projectileOwnerType",
	PROJECTILE_COLOR = "projectileColor",
	PROJECTILE_MAX_VELOCITY = "projectileMaxVelocity"
}

export enum States {
	ALIVE = 0,
	DEAD = 1
}

export enum CharacterTypes {
	PLAYER,
	ENEMY,
	NEUTRAL
}

export const WALLS_SIZE = 50
export const DOOR_WIDTH = 50
export const DOOR_HEIGHT = WALLS_SIZE / 2
export var WIDTH = 800
export var HEIGHT = 600

// height of the scene will be set to 25 units for the purpose of better calculations
export const SCENE_HEIGHT = 25;

// native height of the game canvas. If bigger, it will be resized accordingly
export const SPRITES_RESOLUTION_HEIGHT = 400;

// native speed of the game
export const GAME_SPEED = 1;