import type { Rect, ObstacleObject, InteractableObject } from '@/types/rpg';

export function intersects(a: Rect, b: Rect) {
  return (
    a.x < b.x + b.w &&
    a.x + a.w > b.x &&
    a.y < b.y + b.h &&
    a.y + a.h > b.y
  );
}

export function objectRect(
  object: ObstacleObject | InteractableObject
): Rect {
  return object.hitbox ?? {
    x: object.x,
    y: object.y,
    w: object.w,
    h: object.h,
  };
}

export function isBlocked(
  nextRect: Rect,
  sceneWidth: number,
  sceneHeight: number,
  obstacles: ObstacleObject[],
  interactables: InteractableObject[]
) {
  if (
    nextRect.x < 0 ||
    nextRect.y < 0 ||
    nextRect.x + nextRect.w > sceneWidth ||
    nextRect.y + nextRect.h > sceneHeight
  ) {
    return true;
  }

  return [...obstacles, ...interactables].some((item) =>
    intersects(nextRect, objectRect(item))
  );
}
