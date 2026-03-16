import { scenes } from '@/features/rpg/scenes';

export function getScene(sceneId: string) {
  return scenes[sceneId as keyof typeof scenes];
}
