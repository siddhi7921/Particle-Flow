export enum ParticleTheme {
  DEFAULT = 'DEFAULT', // Blue/Purple network
  FIRE = 'FIRE', // Red/Orange generic
  GALAXY = 'GALAXY', // Saturn/Space styles
  NATURE = 'NATURE', // Green/Flowers
  LOVE = 'LOVE', // Pink/Hearts
}

export enum GestureCommand {
  NONE = 'NONE',
  SWITCH_FIRE = 'SWITCH_FIRE',
  SWITCH_GALAXY = 'SWITCH_GALAXY',
  SWITCH_NATURE = 'SWITCH_NATURE',
  SWITCH_LOVE = 'SWITCH_LOVE',
  RESET = 'RESET'
}

export interface ParticleConfig {
  color: string;
  size: number;
  speed: number;
  shape: 'circle' | 'square' | 'heart' | 'star';
  connectionDistance: number;
  friction: number;
  ease: number;
}

export interface VisionResponse {
  command: GestureCommand;
  confidence: number;
  reasoning: string;
}
