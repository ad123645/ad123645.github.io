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


export function findNearestOpenPosition(
  position: { x: number; y: number },
  playerSize: number,
  sceneWidth: number,
  sceneHeight: number,
  obstacles: ObstacleObject[],
  interactables: InteractableObject[]
) {
  const initialRect: Rect = {
    x: position.x,
    y: position.y,
    w: playerSize,
    h: playerSize,
  };

  if (!isBlocked(initialRect, sceneWidth, sceneHeight, obstacles, interactables)) {
    return position;
  }

  const step = 8;
  const maxRadius = 96;

  for (let radius = step; radius <= maxRadius; radius += step) {
    const candidates = [
      { x: position.x, y: position.y + radius },
      { x: position.x, y: position.y - radius },
      { x: position.x - radius, y: position.y },
      { x: position.x + radius, y: position.y },
      { x: position.x - radius, y: position.y + radius },
      { x: position.x + radius, y: position.y + radius },
      { x: position.x - radius, y: position.y - radius },
      { x: position.x + radius, y: position.y - radius },
    ];

    const safe = candidates.find((candidate) =>
      !isBlocked(
        {
          x: candidate.x,
          y: candidate.y,
          w: playerSize,
          h: playerSize,
        },
        sceneWidth,
        sceneHeight,
        obstacles,
        interactables
      )
    );

    if (safe) {
      return safe;
    }
  }

  return position;
}
