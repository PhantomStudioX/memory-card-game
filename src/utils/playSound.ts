// app/utils/playSound.ts
import { Audio } from 'expo-av';

let flipSound: Audio.Sound | null = null;
let matchSound: Audio.Sound | null = null;

export const loadSounds = async () => {
  const flip = await Audio.Sound.createAsync(
    require('../../assets/sounds/flip.mp3')
  );
  const match = await Audio.Sound.createAsync(
    require('../../assets/sounds/match.mp3')
  );
  flipSound = flip.sound;
  matchSound = match.sound;
};

export const playFlipSound = async () => {
  if (flipSound) {
    try {
      await flipSound.replayAsync();
    } catch (e) {
      console.warn('Flip sound failed', e);
    }
  }
};

export const playMatchSound = async () => {
  if (matchSound) {
    try {
      await matchSound.replayAsync();
    } catch (e) {
      console.warn('Match sound failed', e);
    }
  }
};