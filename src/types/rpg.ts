export type Facing = 'up' | 'down' | 'left' | 'right';

export interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface SpawnPoint {
  x: number;
  y: number;
}

export type InteractableAction =
  | { kind: 'scene'; toSceneId: string; spawnId?: string }
  | { kind: 'route'; to: string }
  | { kind: 'dialog'; dialogId: string };

export interface SceneObjectBase {
  id: string;
  name: string;
  x: number;
  y: number;
  w: number;
  h: number;
  sprite?: string;
}

export interface DecorationObject extends SceneObjectBase {
  type: 'decoration';
  color?: string;
}

export interface ObstacleObject extends SceneObjectBase {
  type: 'obstacle';
  color?: string;
  hitbox?: Rect;
}

export interface InteractableObject extends SceneObjectBase {
  type: 'interactable';
  color?: string;
  prompt: string;
  action: InteractableAction;
  hitbox?: Rect;
  interactbox?: Rect;
}

export interface SceneDefinition {
  id: string;
  name: string;
  width: number;
  height: number;
  tileSize: number;
  baseTile: string;
  spawnPoints: Record<string, SpawnPoint>;
  decorations: DecorationObject[];
  obstacles: ObstacleObject[];
  interactables: InteractableObject[];
}
