export interface Animation {

}

export interface Dimensions {
	x: number;
	y: number;
	w: number;
	h: number;
}

export interface Frame {
	frameDimensions: Dimensions
	rotated: boolean
	trimmed: boolean
}

export default interface SpriteData {
	frames: {[key: string]: Frame}
	animations: {[key: string]: Animation}
}