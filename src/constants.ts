export enum Messages {
	CREATE_PROJECTILE = "create_projectile"
}

export enum Assets {
}

export enum Attributes {
	PLAYER = "player",
	FACTORY = "factory",
	GAME_MODEL = "gameModel"
}

// height of the scene will be set to 25 units for the purpose of better calculations
export const SCENE_HEIGHT = 25;

// native height of the game canvas. If bigger, it will be resized accordingly
export const SPRITES_RESOLUTION_HEIGHT = 400;

// native speed of the game
export const GAME_SPEED = 1;