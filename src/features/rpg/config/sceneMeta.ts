export const SCENE_META = {
  hall: {
    label: 'Front hall',
    mood: '接待与分流',
    description: '大厅负责把访客安静地送往图书馆、游戏室、关于页与总目录。',
    highlights: ['图书馆门', '游戏室门', '档案台', '总目录牌'],
  },
  library: {
    label: 'Library room',
    mood: '阅览与过渡',
    description: '图书馆现在更像前室与阅览桌，真正的分类书架被收进里面的藏书室。',
    highlights: ['藏书室门', '总目录卡柜', '阅览桌', '归还车'],
  },
  stacks: {
    label: 'Stacks room',
    mood: '分类与索引',
    description: '藏书室里摆着整套大分类书架。你可以沿着书架直接进入对应馆藏分区。',
    highlights: ['A-Z 总类书架', '总目录索引台', '回到图书馆的门'],
  },
  gameRoom: {
    label: 'Game room',
    mood: '实验与试玩',
    description: '游戏室保留互动实验气质，但继续沿用整站的纸面与木质系统。',
    highlights: ['游戏目录牌', '试玩桌', '墙上海报', '演示机'],
  },
} as const;

export type SceneMetaKey = keyof typeof SCENE_META;
