import { PLAYER_SIZE } from '@/features/rpg/config/constants';
import type { Facing, Rect } from '@/types/rpg';

export interface PlayerState {
  x: number;
  y: number;
  facing: Facing;
}

export function createPlayer(x: number, y: number): PlayerState {
  return {
    x,
    y,
    facing: 'down',
  };
}

export function getPlayerRect(player: PlayerState): Rect {
  return {
    x: player.x,
    y: player.y,
    w: PLAYER_SIZE,
    h: PLAYER_SIZE,
  };
}
