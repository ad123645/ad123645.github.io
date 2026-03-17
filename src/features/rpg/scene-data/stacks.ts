import { catalogRoots } from '@/data/catalog/clc';
import { TILE_SIZE } from '@/features/rpg/config/constants';
import type { DecorationObject, InteractableObject, ObstacleObject, SceneDefinition } from '@/types/rpg';

type RootShelf = {
  code: string;
  name: string;
  slug: string;
};

type ShelfPlacement = {
  code: string;
  x: number;
  y: number;
  tone: string;
};

const rootByCode = new Map<string, RootShelf>(
  catalogRoots.map((node) => [node.code, { code: node.code, name: node.name, slug: node.slug }])
);

const shelfWidth = 1.72 * TILE_SIZE;
const shelfHeight = 1.14 * TILE_SIZE;
const signHeight = 0.34 * TILE_SIZE;

const humanitiesCols = [2.0, 4.7];
const socialCols = [8.0, 10.7];
const scienceCols = [14.0, 16.5, 19.0];
const humanitiesRows = [2.0, 4.2, 6.4];
const socialRows = [2.0, 4.2, 6.4];
const scienceRows = [2.0, 4.2, 6.4, 8.6];

const humanitiesCodes = ['A', 'B', 'H', 'I', 'J', 'K'];
const socialCodes = ['C', 'D', 'E', 'F', 'G', 'Z'];
const sciencePlacements: ShelfPlacement[] = [
  { code: 'N', x: scienceCols[0] * TILE_SIZE, y: scienceRows[0] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'O', x: scienceCols[1] * TILE_SIZE, y: scienceRows[0] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'P', x: scienceCols[2] * TILE_SIZE, y: scienceRows[0] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'Q', x: scienceCols[0] * TILE_SIZE, y: scienceRows[1] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'R', x: scienceCols[1] * TILE_SIZE, y: scienceRows[1] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'S', x: scienceCols[2] * TILE_SIZE, y: scienceRows[1] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'T', x: scienceCols[0] * TILE_SIZE, y: scienceRows[2] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'V', x: scienceCols[1] * TILE_SIZE, y: scienceRows[2] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'U', x: scienceCols[2] * TILE_SIZE, y: scienceRows[2] * TILE_SIZE, tone: '#8a7a66' },
  { code: 'X', x: scienceCols[2] * TILE_SIZE, y: scienceRows[3] * TILE_SIZE, tone: '#8a7a66' },
];

function placeCodes(codes: string[], cols: number[], rows: number[], tone: string) {
  return codes.map((code, index) => ({
    code,
    x: cols[index % cols.length] * TILE_SIZE,
    y: rows[Math.floor(index / cols.length)] * TILE_SIZE,
    tone,
  } satisfies ShelfPlacement));
}

const placements = [
  ...placeCodes(humanitiesCodes, humanitiesCols, humanitiesRows, '#967660'),
  ...placeCodes(socialCodes, socialCols, socialRows, '#9b7f67'),
  ...sciencePlacements,
];

const indexStandPosition = {
  x: 18.4 * TILE_SIZE,
  y: 10.8 * TILE_SIZE,
};

const generatedShelves: ObstacleObject[] = [];
const generatedSigns: InteractableObject[] = [];

placements.forEach((placement) => {
  const item = rootByCode.get(placement.code);
  if (!item) return;

  generatedShelves.push({
    id: `shelf-${item.code.toLowerCase()}`,
    name: `${item.code} 书架`,
    type: 'obstacle',
    x: placement.x,
    y: placement.y,
    w: shelfWidth,
    h: shelfHeight,
    color: placement.tone,
  });

  generatedSigns.push({
    id: `catalog-${item.code.toLowerCase()}`,
    name: `${item.code} ${item.name}`,
    type: 'interactable',
    x: placement.x + 0.12 * TILE_SIZE,
    y: placement.y + shelfHeight + 0.14 * TILE_SIZE,
    w: shelfWidth - 0.24 * TILE_SIZE,
    h: signHeight,
    color: '#d8c5aa',
    prompt: `E 打开 ${item.code} 书架`,
    action: { kind: 'route', to: `/catalog/${item.slug}` },
    hitbox: { x: 0, y: 0, w: 0, h: 0 },
    interactbox: {
      x: placement.x + 0.02 * TILE_SIZE,
      y: placement.y + shelfHeight - 0.04 * TILE_SIZE,
      w: shelfWidth - 0.04 * TILE_SIZE,
      h: 0.94 * TILE_SIZE,
    },
  });
});

const zoneDecorations: DecorationObject[] = [
  {
    id: 'humanities-zone-wash',
    name: '思想人文区光带',
    type: 'decoration',
    x: 1.45 * TILE_SIZE,
    y: 1.55 * TILE_SIZE,
    w: 5.2 * TILE_SIZE,
    h: 8.1 * TILE_SIZE,
    color: 'rgba(164, 128, 99, 0.06)',
  },
  {
    id: 'social-zone-wash',
    name: '社会综合区光带',
    type: 'decoration',
    x: 7.35 * TILE_SIZE,
    y: 1.55 * TILE_SIZE,
    w: 5.15 * TILE_SIZE,
    h: 8.1 * TILE_SIZE,
    color: 'rgba(149, 126, 101, 0.055)',
  },
  {
    id: 'science-zone-wash',
    name: '科学工程区光带',
    type: 'decoration',
    x: 13.2 * TILE_SIZE,
    y: 1.55 * TILE_SIZE,
    w: 7.15 * TILE_SIZE,
    h: 11.2 * TILE_SIZE,
    color: 'rgba(118, 132, 120, 0.06)',
  },
  {
    id: 'humanities-zone-banner',
    name: '思想 / 人文区',
    type: 'decoration',
    x: 1.7 * TILE_SIZE,
    y: 1.05 * TILE_SIZE,
    w: 4.7 * TILE_SIZE,
    h: 0.48 * TILE_SIZE,
    color: '#dbcbb5',
  },
  {
    id: 'social-zone-banner',
    name: '社会 / 综合区',
    type: 'decoration',
    x: 7.55 * TILE_SIZE,
    y: 1.05 * TILE_SIZE,
    w: 4.75 * TILE_SIZE,
    h: 0.48 * TILE_SIZE,
    color: '#dbcbb5',
  },
  {
    id: 'science-zone-banner',
    name: '科学 / 工程区',
    type: 'decoration',
    x: 13.4 * TILE_SIZE,
    y: 1.05 * TILE_SIZE,
    w: 6.4 * TILE_SIZE,
    h: 0.48 * TILE_SIZE,
    color: '#d3cab8',
  },
  {
    id: 'center-rug',
    name: '中轴地毯',
    type: 'decoration',
    x: 8.55 * TILE_SIZE,
    y: 2.95 * TILE_SIZE,
    w: 5.3 * TILE_SIZE,
    h: 8.9 * TILE_SIZE,
    color: '#d7cdb8',
  },
  {
    id: 'catalog-lantern-left',
    name: '灯影左',
    type: 'decoration',
    x: 8.95 * TILE_SIZE,
    y: 3.4 * TILE_SIZE,
    w: 1.1 * TILE_SIZE,
    h: 1.1 * TILE_SIZE,
    color: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'catalog-lantern-right',
    name: '灯影右',
    type: 'decoration',
    x: 12.25 * TILE_SIZE,
    y: 3.4 * TILE_SIZE,
    w: 1.1 * TILE_SIZE,
    h: 1.1 * TILE_SIZE,
    color: 'rgba(255,255,255,0.12)',
  },
  {
    id: 'catalog-strip-top',
    name: '上层引导线',
    type: 'decoration',
    x: 1.9 * TILE_SIZE,
    y: 1.8 * TILE_SIZE,
    w: 18.0 * TILE_SIZE,
    h: 0.08 * TILE_SIZE,
    color: 'rgba(126, 104, 86, 0.14)',
  },
  {
    id: 'catalog-strip-bottom',
    name: '下层引导线',
    type: 'decoration',
    x: 1.9 * TILE_SIZE,
    y: 14.2 * TILE_SIZE,
    w: 18.0 * TILE_SIZE,
    h: 0.08 * TILE_SIZE,
    color: 'rgba(126, 104, 86, 0.14)',
  },
  {
    id: 'entry-axis-runner',
    name: '入室导引带',
    type: 'decoration',
    x: 10.15 * TILE_SIZE,
    y: 11.75 * TILE_SIZE,
    w: 1.7 * TILE_SIZE,
    h: 2.15 * TILE_SIZE,
    color: 'rgba(111, 127, 114, 0.13)',
  },
  {
    id: 'consult-note',
    name: '查阅台说明',
    type: 'decoration',
    x: 10.35 * TILE_SIZE,
    y: 5.55 * TILE_SIZE,
    w: 2.25 * TILE_SIZE,
    h: 0.42 * TILE_SIZE,
    color: '#dcccb6',
  },
  {
    id: 'index-stand-guide-glow',
    name: '索引台导引光晕',
    type: 'decoration',
    x: indexStandPosition.x - 0.18 * TILE_SIZE,
    y: indexStandPosition.y - 0.22 * TILE_SIZE,
    w: shelfWidth + 0.36 * TILE_SIZE,
    h: shelfHeight + 0.34 * TILE_SIZE,
    color: 'rgba(115, 131, 122, 0.12)',
  },
  {
    id: 'top-left-soft-glow',
    name: '上部灯影左',
    type: 'decoration',
    x: 2.5 * TILE_SIZE,
    y: 1.55 * TILE_SIZE,
    w: 1.4 * TILE_SIZE,
    h: 1.05 * TILE_SIZE,
    color: 'rgba(255,255,255,0.08)',
  },
  {
    id: 'top-right-soft-glow',
    name: '上部灯影右',
    type: 'decoration',
    x: 18.15 * TILE_SIZE,
    y: 1.55 * TILE_SIZE,
    w: 1.4 * TILE_SIZE,
    h: 1.05 * TILE_SIZE,
    color: 'rgba(255,255,255,0.08)',
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
];

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
  decorations: zoneDecorations,
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
      color: '#73837a',
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
      x: indexStandPosition.x,
      y: indexStandPosition.y,
      w: shelfWidth,
      h: shelfHeight,
      color: '#73837a',
      prompt: 'E 打开完整馆藏目录',
      action: { kind: 'route', to: '/catalog' },
      hitbox: { x: 0, y: 0, w: 0, h: 0 },
      interactbox: {
        x: indexStandPosition.x - 0.04 * TILE_SIZE,
        y: indexStandPosition.y - 0.04 * TILE_SIZE,
        w: shelfWidth + 0.08 * TILE_SIZE,
        h: shelfHeight + 0.9 * TILE_SIZE,
      },
    },
    ...generatedSigns,
  ],
};
