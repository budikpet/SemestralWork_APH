import * as ECSA from '../../libs/pixi-component';
import { Messages, Assets } from '../constants';
import PIXISound from 'pixi-sound';

export const soundComponent = () => new ECSA.GenericComponent('SoundComponent')
	.doOnMessage(Messages.NEW_WAVE, (cmp, msg) => PIXISound.play(Assets.SOUND_NEW_WAVE))
	.doOnMessage(Messages.PLAYER_DEATH, (cmp, msg) => PIXISound.play(Assets.SOUND_DEATH))
	.doOnMessage(Messages.PLAYER_SHOOT, (cmp, msg) => PIXISound.play(Assets.SOUND_FIRE))
