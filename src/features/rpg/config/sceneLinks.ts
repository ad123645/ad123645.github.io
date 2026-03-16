export type SceneId = 'hall' | 'library' | 'stacks' | 'gameRoom';

export interface SceneLinkItem {
  id: string;
  sceneId: SceneId;
  title: string;
  subtitle: string;
  note: string;
  href: string;
  relatedInteractableIds?: string[];
}

export const SCENE_LINKS: Record<SceneId, SceneLinkItem[]> = {
  hall: [],
  library: [],
  stacks: [],
  gameRoom: [],
};

export function getSceneLinks(sceneId: SceneId) {
  return SCENE_LINKS[sceneId] ?? [];
}

export function getLinkedSceneCard() {
  return null;
}
