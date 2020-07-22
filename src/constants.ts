export enum Messages {
	CREATE_PROJECTILE = "create_projectile",

	WALL_COLLISION = "wall_collision",

}

export enum Assets {
}

export enum Attributes {
	MAX_VELOCITY = "velocity",
	MAX_ACCELERATION = "acceleration",
	ATTACK_FREQUENCY = "attackFrequency",

	WALL_TOP = "wallTop",
	WALL_BOTTOM = "wallBottom",
	WALL_LEFT = "wallLeft",
	WALL_RIGHT = "wallRight",
	WALL_REPULSIVE_FORCE = "wallRepulsiveForce",

	PLAYER = "player",
	PLAYER_MOVEMENT = "playerMovement",

	FACTORY = "factory",
	GAME_MODEL = "gameModel",

	PROJECTILE = "projectile",
	PROJECTILE_MOVEMENT = "projectileMovement"
}

export enum States {
	ALIVE = "alive",
	DEAD = "dead"
}

export const WALLS_SIZE = 25
export var WIDTH = 800
export var HEIGHT = 600

// height of the scene will be set to 25 units for the purpose of better calculations
export const SCENE_HEIGHT = 25;

// native height of the game canvas. If bigger, it will be resized accordingly
export const SPRITES_RESOLUTION_HEIGHT = 400;

// native speed of the game
export const GAME_SPEED = 1;