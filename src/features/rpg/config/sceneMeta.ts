export const SCENE_META = {
  hall: {
    label: 'Front hall',
    mood: '接待与分流',
    description: '大厅负责把访客安静地送往图书馆、游戏室与关于页。',
    highlights: ['图书馆门', '游戏室门', '档案台'],
  },
  library: {
    label: 'Library room',
    mood: '阅读与归档',
    description: '图书馆连接博客正文、目录牌与书架便签，强调内容优先。',
    highlights: ['目录牌', '阅览桌', '书架便签'],
  },
  gameRoom: {
    label: 'Game room',
    mood: '实验与试玩',
    description: '游戏室保留互动实验气质，但继续沿用整站的纸面与木质系统。',
    highlights: ['游戏目录牌', '试玩桌', '墙上海报'],
  },
} as const;

export type SceneMetaKey = keyof typeof SCENE_META;
