import { TILE_SIZE } from '@/features/rpg/config/constants';
import type { SceneDefinition } from '@/types/rpg';

export const libraryScene: SceneDefinition = {
  id: 'library',
  name: '图书馆',
  width: 18 * TILE_SIZE,
  height: 12 * TILE_SIZE,
  tileSize: TILE_SIZE,
  baseTile: 'library',
  spawnPoints: {
    entry: { x: 8 * TILE_SIZE, y: 9 * TILE_SIZE },
    fromBlog: { x: 3 * TILE_SIZE, y: 9 * TILE_SIZE },
  },
  decorations: [
    { id: 'reading-rug', name: '阅览地毯', type: 'decoration', x: 6 * TILE_SIZE, y: 4 * TILE_SIZE, w: 5 * TILE_SIZE, h: 3 * TILE_SIZE, color: '#d7cdb8' },
  ],
  obstacles: [
    { id: 'left-wall', name: '左墙', type: 'obstacle', x: 0, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#85705f' },
    { id: 'right-wall', name: '右墙', type: 'obstacle', x: 17 * TILE_SIZE, y: 0, w: TILE_SIZE, h: 12 * TILE_SIZE, color: '#85705f' },
    { id: 'top-wall', name: '上墙', type: 'obstacle', x: 0, y: 0, w: 18 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    { id: 'bottom-left', name: '下墙左', type: 'obstacle', x: 0, y: 11 * TILE_SIZE, w: 7 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    { id: 'bottom-right', name: '下墙右', type: 'obstacle', x: 9 * TILE_SIZE, y: 11 * TILE_SIZE, w: 9 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    { id: 'shelf-left', name: '书架左', type: 'obstacle', x: 2 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 6 * TILE_SIZE, color: '#987a61' },
    { id: 'shelf-right', name: '书架右', type: 'obstacle', x: 14 * TILE_SIZE, y: 2 * TILE_SIZE, w: 2 * TILE_SIZE, h: 6 * TILE_SIZE, color: '#987a61' },
    { id: 'table', name: '阅览桌', type: 'obstacle', x: 7 * TILE_SIZE, y: 5 * TILE_SIZE, w: 4 * TILE_SIZE, h: 2 * TILE_SIZE, color: '#aa8a6d' }
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
      action: { kind: 'scene', toSceneId: 'hall', spawnId: 'fromLibrary' }
    },
    {
      id: 'catalog-board',
      name: '文章目录牌',
      type: 'interactable',
      x: 4.5 * TILE_SIZE,
      y: 2 * TILE_SIZE,
      w: TILE_SIZE,
      h: 1.2 * TILE_SIZE,
      color: '#c2aa8d',
      prompt: 'E 浏览博客',
      action: { kind: 'route', to: '/blog' }
    },
    {
      id: 'shelf-note',
      name: '书架便签',
      type: 'interactable',
      x: 12.5 * TILE_SIZE,
      y: 2 * TILE_SIZE,
      w: TILE_SIZE,
      h: 1.2 * TILE_SIZE,
      color: '#d5c4ad',
      prompt: 'E 查看说明',
      action: { kind: 'dialog', dialogId: 'libraryShelf' }
    }
  ]
};
