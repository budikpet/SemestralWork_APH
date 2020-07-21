export enum Messages {
	CREATE_PROJECTILE = "create_projectile"
}

export enum Assets {
}

export enum Attributes {
	WALL_TOP = "wallTop",
	WALL_BOTTOM = "wallBottom",
	WALL_LEFT = "wallLeft",
	WALL_RIGHT = "wallRight",

	PLAYER = "player",
	FACTORY = "factory",
	GAME_MODEL = "gameModel"
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