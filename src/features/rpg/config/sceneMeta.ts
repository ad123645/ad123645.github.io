export const SCENE_META = {
  hall: {
    label: '大厅',
    mood: '接待与分流',
    description: '大厅负责把人带去图书馆、游戏室、关于页和总目录。',
    highlights: ['图书馆门', '游戏室门', '档案台', '总目录牌'],
  },
  library: {
    label: '图书馆',
    mood: '阅览与过渡',
    description: '图书馆现在更像过渡区域，通过导览牌和阅览桌把你带去里面的藏书室。',
    highlights: ['藏书室门', '总目录卡柜', '馆藏导览牌', '阅览桌'],
  },
  stacks: {
    label: '藏书室',
    mood: '分类与索引',
    description: '藏书室把主要分类按区排开，并用更清楚的通道和索引台帮助你找方向。',
    highlights: ['人文文史区', '社会综合区', '自然技术区', '总目录索引台'],
  },
  gameRoom: {
    label: '游戏室',
    mood: '实验与试玩',
    description: '游戏室会放互动实验，不过整体风格还是和全站保持一致。',
    highlights: ['游戏目录牌', '试玩桌', '墙上海报', '演示机'],
  },
} as const;

export type SceneMetaKey = keyof typeof SCENE_META;
