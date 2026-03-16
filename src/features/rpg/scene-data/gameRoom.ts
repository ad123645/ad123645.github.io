import { TILE_SIZE } from '@/features/rpg/config/constants';
import type { SceneDefinition } from '@/types/rpg';

export const gameRoomScene: SceneDefinition = {
  id: 'gameRoom',
  name: '游戏室',
  width: 18 * TILE_SIZE,
  height: 12 * TILE_SIZE,
  tileSize: TILE_SIZE,
  baseTile: 'gameRoom',
  spawnPoints: {
    entry: { x: 8 * TILE_SIZE, y: 9 * TILE_SIZE },
  },
  decorations: [
    { id: 'mat', name: '地垫', type: 'decoration', x: 5 * TILE_SIZE, y: 6 * TILE_SIZE, w: 7 * TILE_SIZE, h: 2 * TILE_SIZE, color: '#d6c9ba' },
  ],
  obstacles: [
    { id: 'left-wall', name: '左墙', type: 'obstacle', x: 0, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#7f6a5a' },
    { id: 'right-wall', name: '右墙', type: 'obstacle', x: 17 * TILE_SIZE, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#7f6a5a' },
    { id: 'top-wall', name: '上墙', type: 'obstacle', x: 0, y: 0, w: 18 * TILE_SIZE, h: TILE_SIZE, color: '#7f6a5a' },
    { id: 'bottom-left', name: '下墙左', type: 'obstacle', x: 0, y: 11 * TILE_SIZE, w: 7 * TILE_SIZE, h: TILE_SIZE, color: '#7f6a5a' },
    { id: 'bottom-right', name: '下墙右', type: 'obstacle', x: 9 * TILE_SIZE, y: 11 * TILE_SIZE, w: 9 * TILE_SIZE, h: TILE_SIZE, color: '#7f6a5a' },
    { id: 'cabinet-left', name: '机柜左', type: 'obstacle', x: 3 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 4 * TILE_SIZE, color: '#987f6f' },
    { id: 'cabinet-right', name: '机柜右', type: 'obstacle', x: 13 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 4 * TILE_SIZE, color: '#987f6f' },
    { id: 'table', name: '试玩桌', type: 'obstacle', x: 7 * TILE_SIZE, y: 4 * TILE_SIZE, w: 4 * TILE_SIZE, h: 2 * TILE_SIZE, color: '#ac8f74' }
  ],
  interactables: [
    {
      id: 'back-door',
      name: '返回大厅',
      type: 'interactable',
      x: 7 * TILE_SIZE,
      y: 11 * TILE_SIZE,
      w: 2 * TILE_SIZE,
      h: TILE_SIZE,
      color: '#6f7f72',
      prompt: 'E 返回大厅',
      action: { kind: 'scene', toSceneId: 'hall', spawnId: 'fromGameRoom' }
    },
    {
      id: 'games-board',
      name: '游戏目录牌',
      type: 'interactable',
      x: 5 * TILE_SIZE,
      y: 2 * TILE_SIZE,
      w: TILE_SIZE,
      h: 1.2 * TILE_SIZE,
      color: '#c2aa8d',
      prompt: 'E 浏览游戏页',
      action: { kind: 'route', to: '/games' }
    },
    {
      id: 'poster',
      name: '墙上海报',
      type: 'interactable',
      x: 12 * TILE_SIZE,
      y: 2 * TILE_SIZE,
      w: TILE_SIZE,
      h: 1.2 * TILE_SIZE,
      color: '#d5c4ad',
      prompt: 'E 查看说明',
      action: { kind: 'dialog', dialogId: 'gamePoster' }
    }
  ]
};
