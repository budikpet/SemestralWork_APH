export interface SpriteAnimation {

}

export interface SpriteDimensions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface SpriteFrame {
	frame: SpriteDimensions
	rotated: boolean
	trimmed: boolean
}

export interface SpriteData {
	frames: {[key: string]: SpriteFrame}
	animations: {[key: string]: SpriteAnimation}
}