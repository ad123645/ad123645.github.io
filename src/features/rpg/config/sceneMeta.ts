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
    description: '图书馆现在更像前室与阅览桌，借由导览牌、地面引导与门前过渡，把你安静地送往里面的藏书室。',
    highlights: ['藏书室门', '总目录卡柜', '馆藏导览牌', '阅览桌'],
  },
  stacks: {
    label: 'Stacks room',
    mood: '分类与索引',
    description: '藏书室把大类书架按分区排开，并用更清楚的通道、索引台与字母架签把路线梳理得更顺。',
    highlights: ['人文文史区', '社会综合区', '自然技术区', '总目录索引台'],
  },
  gameRoom: {
    label: 'Game room',
    mood: '实验与试玩',
    description: '游戏室保留互动实验气质，但继续沿用整站的纸面与木质系统。',
    highlights: ['游戏目录牌', '试玩桌', '墙上海报', '演示机'],
  },
} as const;

export type SceneMetaKey = keyof typeof SCENE_META;
