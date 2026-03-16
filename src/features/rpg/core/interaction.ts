import { INTERACTION_DISTANCE } from '@/features/rpg/config/constants';
import type {
  Facing,
  InteractableObject,
  Rect,
} from '@/types/rpg';
import { intersects } from '@/features/rpg/core/collision';

export function createInteractionProbe(
  playerRect: Rect,
  facing: Facing
): Rect {
  switch (facing) {
    case 'up':
      return {
        x: playerRect.x,
        y: playerRect.y - INTERACTION_DISTANCE,
        w: playerRect.w,
        h: playerRect.h + INTERACTION_DISTANCE,
      };
    case 'down':
      return {
        x: playerRect.x,
        y: playerRect.y,
        w: playerRect.w,
        h: playerRect.h + INTERACTION_DISTANCE,
      };
    case 'left':
      return {
        x: playerRect.x - INTERACTION_DISTANCE,
        y: playerRect.y,
        w: playerRect.w + INTERACTION_DISTANCE,
        h: playerRect.h,
      };
    case 'right':
      return {
        x: playerRect.x,
        y: playerRect.y,
        w: playerRect.w + INTERACTION_DISTANCE,
        h: playerRect.h,
      };
  }
}

export function getInteractableInFront(
  playerRect: Rect,
  facing: Facing,
  interactables: InteractableObject[]
) {
  const probe = createInteractionProbe(playerRect, facing);

  return (
    interactables.find((item) => {
      const interactbox = item.interactbox ?? {
        x: item.x,
        y: item.y,
        w: item.w,
        h: item.h,
      };

      return intersects(probe, interactbox);
    }) ?? null
  );
}
