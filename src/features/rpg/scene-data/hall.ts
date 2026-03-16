import { TILE_SIZE } from '@/features/rpg/config/constants';
import type { SceneDefinition } from '@/types/rpg';

export const hallScene: SceneDefinition = {
  id: 'hall',
  name: '大厅',
  width: 18 * TILE_SIZE,
  height: 12 * TILE_SIZE,
  tileSize: TILE_SIZE,
  baseTile: 'hall',
  spawnPoints: {
    start: { x: 2 * TILE_SIZE, y: 5 * TILE_SIZE },
    fromLibrary: { x: 4 * TILE_SIZE, y: 3.6 * TILE_SIZE },
    fromGameRoom: { x: 13 * TILE_SIZE, y: 3.6 * TILE_SIZE },
  },
  decorations: [
    { id: 'rug', name: '地毯', type: 'decoration', x: 6 * TILE_SIZE, y: 4 * TILE_SIZE, w: 6 * TILE_SIZE, h: 4 * TILE_SIZE, color: '#d8c8b0' },
    { id: 'desk-front', name: '档案台前沿', type: 'decoration', x: 7 * TILE_SIZE, y: 1.7 * TILE_SIZE, w: 4 * TILE_SIZE, h: 0.4 * TILE_SIZE, color: '#bb9d7f' },
  ],
  obstacles: [
    { id: 'left-wall', name: '左墙', type: 'obstacle', x: 0, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#8a715e' },
    { id: 'right-wall', name: '右墙', type: 'obstacle', x: 17 * TILE_SIZE, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#8a715e' },
    { id: 'top-left-wall', name: '上墙左', type: 'obstacle', x: 0, y: 0, w: 5 * TILE_SIZE, h: TILE_SIZE, color: '#8a715e' },
    { id: 'top-mid-wall', name: '上墙中', type: 'obstacle', x: 7 * TILE_SIZE, y: 0, w: 4 * TILE_SIZE, h: TILE_SIZE, color: '#8a715e' },
    { id: 'top-right-wall', name: '上墙右', type: 'obstacle', x: 13 * TILE_SIZE, y: 0, w: 5 * TILE_SIZE, h: TILE_SIZE, color: '#8a715e' },
    { id: 'bottom-wall', name: '下墙', type: 'obstacle', x: 0, y: 11 * TILE_SIZE, w: 18 * TILE_SIZE, h: TILE_SIZE, color: '#8a715e' },
    { id: 'archive-desk', name: '档案台', type: 'obstacle', x: 7 * TILE_SIZE, y: 1 * TILE_SIZE, w: 4 * TILE_SIZE, h: TILE_SIZE, color: '#9b8068' },
    { id: 'left-bench', name: '长椅', type: 'obstacle', x: 2 * TILE_SIZE, y: 8 * TILE_SIZE, w: 3 * TILE_SIZE, h: TILE_SIZE, color: '#9b8068' },
    { id: 'right-bench', name: '长椅', type: 'obstacle', x: 13 * TILE_SIZE, y: 8 * TILE_SIZE, w: 3 * TILE_SIZE, h: TILE_SIZE, color: '#9b8068' }
  ],
  interactables: [
    {
      id: 'library-door',
      name: '图书馆门',
      type: 'interactable',
      x: 5 * TILE_SIZE,
      y: 0,
      w: 2 * TILE_SIZE,
      h: TILE_SIZE,
      color: '#6f7f72',
      prompt: 'E 进入图书馆',
      action: { kind: 'scene', toSceneId: 'library', spawnId: 'entry' }
    },
    {
      id: 'game-door',
      name: '游戏室门',
      type: 'interactable',
      x: 11 * TILE_SIZE,
      y: 0,
      w: 2 * TILE_SIZE,
      h: TILE_SIZE,
      color: '#7a5c46',
      prompt: 'E 进入游戏室',
      action: { kind: 'scene', toSceneId: 'gameRoom', spawnId: 'entry' }
    },
    {
      id: 'archive-terminal',
      name: '档案台',
      type: 'interactable',
      x: 8.2 * TILE_SIZE,
      y: 2 * TILE_SIZE,
      w: 1.6 * TILE_SIZE,
      h: 0.8 * TILE_SIZE,
      color: '#b79c83',
      prompt: 'E 查看关于页',
      action: { kind: 'route', to: '/about' }
    }
  ]
};
