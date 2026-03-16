import { catalogRoots } from '@/data/catalog/clc';
import { TILE_SIZE } from '@/features/rpg/config/constants';
import type { InteractableObject, ObstacleObject, SceneDefinition } from '@/types/rpg';

const rootShelves = catalogRoots.map((node) => ({
  code: node.code,
  name: node.name,
  slug: node.slug,
}));

const shelfColumns = [2.1, 6.8, 11.5, 16.2];
const shelfRows = [2.1, 4.25, 6.4, 8.55, 10.7, 12.85];
const shelfWidth = 1.6 * TILE_SIZE;
const shelfHeight = 0.92 * TILE_SIZE;
const signHeight = 0.34 * TILE_SIZE;

const indexStandPosition = {
  x: shelfColumns[3] * TILE_SIZE,
  y: shelfRows[5] * TILE_SIZE,
};

const generatedShelves: ObstacleObject[] = [];
const generatedSigns: InteractableObject[] = [];

rootShelves.forEach((item, index) => {
  const column = index % shelfColumns.length;
  const row = Math.floor(index / shelfColumns.length);
  const x = shelfColumns[column] * TILE_SIZE;
  const y = shelfRows[row] * TILE_SIZE;

  generatedShelves.push({
    id: `shelf-${item.code.toLowerCase()}`,
    name: `${item.code} 书架`,
    type: 'obstacle',
    x,
    y,
    w: shelfWidth,
    h: shelfHeight,
    color: '#9a7b63',
  });

  generatedSigns.push({
    id: `catalog-${item.code.toLowerCase()}`,
    name: `${item.code} ${item.name}`,
    type: 'interactable',
    x: x + 0.08 * TILE_SIZE,
    y: y + shelfHeight + 0.14 * TILE_SIZE,
    w: shelfWidth - 0.16 * TILE_SIZE,
    h: signHeight,
    color: '#d8c5aa',
    prompt: `E 打开 ${item.code} 书架`,
    action: { kind: 'route', to: `/catalog/${item.slug}` },
    hitbox: { x: 0, y: 0, w: 0, h: 0 },
    interactbox: {
      x: x + 0.02 * TILE_SIZE,
      y: y + shelfHeight - 0.02 * TILE_SIZE,
      w: shelfWidth - 0.04 * TILE_SIZE,
      h: 0.88 * TILE_SIZE,
    },
  });
});

export const stacksScene: SceneDefinition = {
  id: 'stacks',
  name: '藏书室',
  width: 22 * TILE_SIZE,
  height: 16 * TILE_SIZE,
  tileSize: TILE_SIZE,
  baseTile: 'library',
  spawnPoints: {
    entry: { x: 10.4 * TILE_SIZE, y: 13.4 * TILE_SIZE },
  },
  decorations: [
    {
      id: 'center-rug',
      name: '中轴地毯',
      type: 'decoration',
      x: 8.3 * TILE_SIZE,
      y: 3.1 * TILE_SIZE,
      w: 5.4 * TILE_SIZE,
      h: 8.8 * TILE_SIZE,
      color: '#d7cdb8',
    },
    {
      id: 'catalog-lantern-left',
      name: '灯影左',
      type: 'decoration',
      x: 8.8 * TILE_SIZE,
      y: 3.5 * TILE_SIZE,
      w: 1.1 * TILE_SIZE,
      h: 1.1 * TILE_SIZE,
      color: 'rgba(255,255,255,0.12)',
    },
    {
      id: 'catalog-lantern-right',
      name: '灯影右',
      type: 'decoration',
      x: 12.1 * TILE_SIZE,
      y: 3.5 * TILE_SIZE,
      w: 1.1 * TILE_SIZE,
      h: 1.1 * TILE_SIZE,
      color: 'rgba(255,255,255,0.12)',
    },
    {
      id: 'catalog-strip-top',
      name: '上层引导线',
      type: 'decoration',
      x: 1.8 * TILE_SIZE,
      y: 1.7 * TILE_SIZE,
      w: 18.4 * TILE_SIZE,
      h: 0.08 * TILE_SIZE,
      color: 'rgba(126, 104, 86, 0.14)',
    },
    {
      id: 'catalog-strip-bottom',
      name: '下层引导线',
      type: 'decoration',
      x: 1.8 * TILE_SIZE,
      y: 14.2 * TILE_SIZE,
      w: 18.4 * TILE_SIZE,
      h: 0.08 * TILE_SIZE,
      color: 'rgba(126, 104, 86, 0.14)',
    },
    {
      id: 'index-stand-shadow',
      name: '索引台灯影',
      type: 'decoration',
      x: indexStandPosition.x + 0.04 * TILE_SIZE,
      y: indexStandPosition.y - 0.08 * TILE_SIZE,
      w: shelfWidth - 0.08 * TILE_SIZE,
      h: shelfHeight + 0.14 * TILE_SIZE,
      color: 'rgba(255,255,255,0.08)',
    },
  ],
  obstacles: [
    { id: 'left-wall', name: '左墙', type: 'obstacle', x: 0, y: 0, w: TILE_SIZE, h: 16 * TILE_SIZE, color: '#85705f' },
    { id: 'right-wall', name: '右墙', type: 'obstacle', x: 21 * TILE_SIZE, y: 0, w: TILE_SIZE, h: 16 * TILE_SIZE, color: '#85705f' },
    { id: 'top-wall', name: '上墙', type: 'obstacle', x: 0, y: 0, w: 22 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    { id: 'bottom-left', name: '下墙左', type: 'obstacle', x: 0, y: 15 * TILE_SIZE, w: 9 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    { id: 'bottom-right', name: '下墙右', type: 'obstacle', x: 13 * TILE_SIZE, y: 15 * TILE_SIZE, w: 9 * TILE_SIZE, h: TILE_SIZE, color: '#85705f' },
    {
      id: 'catalog-index-stand',
      name: '目录索引台',
      type: 'obstacle',
      x: indexStandPosition.x,
      y: indexStandPosition.y,
      w: shelfWidth,
      h: shelfHeight,
      color: '#7e8d84',
    },
    ...generatedShelves,
  ],
  interactables: [
    {
      id: 'back-to-library',
      name: '返回图书馆',
      type: 'interactable',
      x: 9 * TILE_SIZE,
      y: 15 * TILE_SIZE,
      w: 4 * TILE_SIZE,
      h: TILE_SIZE,
      color: '#6f7f72',
      prompt: 'E 返回图书馆',
      action: { kind: 'scene', toSceneId: 'library', spawnId: 'fromStacks' },
    },
    {
      id: 'catalog-overview',
      name: '总目录索引台',
      type: 'interactable',
      x: indexStandPosition.x + 0.12 * TILE_SIZE,
      y: indexStandPosition.y + shelfHeight + 0.14 * TILE_SIZE,
      w: shelfWidth - 0.24 * TILE_SIZE,
      h: signHeight,
      color: '#d9c7b0',
      prompt: 'E 打开完整馆藏目录',
      action: { kind: 'route', to: '/catalog' },
      hitbox: { x: 0, y: 0, w: 0, h: 0 },
      interactbox: {
        x: indexStandPosition.x + 0.02 * TILE_SIZE,
        y: indexStandPosition.y + shelfHeight - 0.04 * TILE_SIZE,
        w: shelfWidth - 0.04 * TILE_SIZE,
        h: 0.92 * TILE_SIZE,
      },
    },
    ...generatedSigns,
  ],
};
