import { CONTROLS } from '@/features/rpg/config/controls';
import type { Facing } from '@/types/rpg';

export function resolveMovement(keys: Set<string>) {
  let dx = 0;
  let dy = 0;
  let facing: Facing = 'down';

  if (CONTROLS.up.some((key) => keys.has(key))) {
    dy -= 1;
    facing = 'up';
  }
  if (CONTROLS.down.some((key) => keys.has(key))) {
    dy += 1;
    facing = 'down';
  }
  if (CONTROLS.left.some((key) => keys.has(key))) {
    dx -= 1;
    facing = 'left';
  }
  if (CONTROLS.right.some((key) => keys.has(key))) {
    dx += 1;
    facing = 'right';
  }

  if (dx !== 0 && dy !== 0) {
    const scale = Math.SQRT1_2;
    dx *= scale;
    dy *= scale;
  }

  return { dx, dy, facing };
}

export function isInteractKey(key: string) {
  return CONTROLS.interact.includes(key);
}
