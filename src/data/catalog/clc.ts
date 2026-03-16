export interface CatalogNode {
  code: string;
  name: string;
  slug: string;
  level: 1 | 2;
  parentCode?: string;
  children?: CatalogNode[];
}

const makeSlug = (code: string) =>
  code
    .toLowerCase()
    .replace(/[\[\]()（）]/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

export const catalogRoots: CatalogNode[] = [
  { code: 'A', name: '马克思主义、列宁主义、毛泽东思想、邓小平理论', slug: makeSlug('A'), level: 1, children: [
    { code: 'A1', name: '马克思、恩格斯著作', slug: makeSlug('A1'), level: 2, parentCode: 'A' },
    { code: 'A2', name: '列宁著作', slug: makeSlug('A2'), level: 2, parentCode: 'A' },
    { code: 'A3', name: '斯大林著作', slug: makeSlug('A3'), level: 2, parentCode: 'A' },
    { code: 'A4', name: '毛泽东著作', slug: makeSlug('A4'), level: 2, parentCode: 'A' },
    { code: 'A49', name: '邓小平著作', slug: makeSlug('A49'), level: 2, parentCode: 'A' },
    { code: 'A5', name: '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平著作汇编', slug: makeSlug('A5'), level: 2, parentCode: 'A' },
    { code: 'A7', name: '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平生平和传记', slug: makeSlug('A7'), level: 2, parentCode: 'A' },
    { code: 'A8', name: '马克思主义、列宁主义、毛泽东思想、邓小平理论的学习和研究', slug: makeSlug('A8'), level: 2, parentCode: 'A' },
  ] },
  { code: 'B', name: '哲学、宗教', slug: makeSlug('B'), level: 1, children: [
    { code: 'B0', name: '哲学理论', slug: makeSlug('B0'), level: 2, parentCode: 'B' },
    { code: 'B1', name: '世界哲学', slug: makeSlug('B1'), level: 2, parentCode: 'B' },
    { code: 'B2', name: '中国哲学', slug: makeSlug('B2'), level: 2, parentCode: 'B' },
    { code: 'B3', name: '亚洲哲学', slug: makeSlug('B3'), level: 2, parentCode: 'B' },
    { code: 'B4', name: '非洲哲学', slug: makeSlug('B4'), level: 2, parentCode: 'B' },
    { code: 'B5', name: '欧洲哲学', slug: makeSlug('B5'), level: 2, parentCode: 'B' },
    { code: 'B6', name: '大洋洲哲学', slug: makeSlug('B6'), level: 2, parentCode: 'B' },
    { code: 'B7', name: '美洲哲学', slug: makeSlug('B7'), level: 2, parentCode: 'B' },
    { code: 'B80', name: '思维科学', slug: makeSlug('B80'), level: 2, parentCode: 'B' },
    { code: 'B81', name: '逻辑学（论理学）', slug: makeSlug('B81'), level: 2, parentCode: 'B' },
    { code: 'B82', name: '伦理学（道德哲学）', slug: makeSlug('B82'), level: 2, parentCode: 'B' },
    { code: 'B83', name: '美学', slug: makeSlug('B83'), level: 2, parentCode: 'B' },
    { code: 'B84', name: '心理学', slug: makeSlug('B84'), level: 2, parentCode: 'B' },
    { code: 'B9', name: '宗教', slug: makeSlug('B9'), level: 2, parentCode: 'B' },
  ] },
  { code: 'C', name: '社会科学总论', slug: makeSlug('C'), level: 1, children: [
    { code: 'C0', name: '社会科学理论与方法论', slug: makeSlug('C0'), level: 2, parentCode: 'C' },
    { code: 'C1', name: '社会科学概况、现状、进展', slug: makeSlug('C1'), level: 2, parentCode: 'C' },
    { code: 'C2', name: '社会科学机构、团体、会议', slug: makeSlug('C2'), level: 2, parentCode: 'C' },
    { code: 'C3', name: '社会科学研究方法', slug: makeSlug('C3'), level: 2, parentCode: 'C' },
    { code: 'C4', name: '社会科学教育与普及', slug: makeSlug('C4'), level: 2, parentCode: 'C' },
    { code: 'C5', name: '社会科学丛书、文集、连续性出版物', slug: makeSlug('C5'), level: 2, parentCode: 'C' },
    { code: 'C6', name: '社会科学参考工具书', slug: makeSlug('C6'), level: 2, parentCode: 'C' },
    { code: '[C7]', name: '社会科学文献检索工具书', slug: makeSlug('[C7]'), level: 2, parentCode: 'C' },
    { code: 'C79', name: '非书资料、视听资料', slug: makeSlug('C79'), level: 2, parentCode: 'C' },
    { code: 'C8', name: '统计学', slug: makeSlug('C8'), level: 2, parentCode: 'C' },
    { code: 'C91', name: '社会学', slug: makeSlug('C91'), level: 2, parentCode: 'C' },
    { code: 'C92', name: '人口学', slug: makeSlug('C92'), level: 2, parentCode: 'C' },
    { code: 'C93', name: '管理学', slug: makeSlug('C93'), level: 2, parentCode: 'C' },
    { code: '[C94]', name: '系统科学', slug: makeSlug('[C94]'), level: 2, parentCode: 'C' },
    { code: 'C95', name: '民族学、文化人类学', slug: makeSlug('C95'), level: 2, parentCode: 'C' },
    { code: 'C96', name: '人才学', slug: makeSlug('C96'), level: 2, parentCode: 'C' },
    { code: 'C97', name: '劳动科学', slug: makeSlug('C97'), level: 2, parentCode: 'C' },
  ] },
  { code: 'D', name: '政治、法律', slug: makeSlug('D'), level: 1, children: [
    { code: 'D0', name: '政治学、政治理论', slug: makeSlug('D0'), level: 2, parentCode: 'D' },
    { code: 'D1', name: '国际共产主义运动', slug: makeSlug('D1'), level: 2, parentCode: 'D' },
    { code: 'D2', name: '中国共产党', slug: makeSlug('D2'), level: 2, parentCode: 'D' },
    { code: 'D33/37', name: '各国共产党', slug: makeSlug('D33/37'), level: 2, parentCode: 'D' },
    { code: 'D4', name: '工人、农民、青年、妇女运动与组织', slug: makeSlug('D4'), level: 2, parentCode: 'D' },
    { code: 'D5', name: '世界政治', slug: makeSlug('D5'), level: 2, parentCode: 'D' },
    { code: 'D6', name: '中国政治', slug: makeSlug('D6'), level: 2, parentCode: 'D' },
    { code: 'D73/77', name: '各国政治', slug: makeSlug('D73/77'), level: 2, parentCode: 'D' },
    { code: 'D8', name: '外交、国际关系', slug: makeSlug('D8'), level: 2, parentCode: 'D' },
    { code: 'D9', name: '法律', slug: makeSlug('D9'), level: 2, parentCode: 'D' },
  ] },
  { code: 'E', name: '军事', slug: makeSlug('E'), level: 1, children: [
    { code: 'E0', name: '军事理论', slug: makeSlug('E0'), level: 2, parentCode: 'E' },
    { code: 'E1', name: '世界军事', slug: makeSlug('E1'), level: 2, parentCode: 'E' },
    { code: 'E2', name: '中国军事', slug: makeSlug('E2'), level: 2, parentCode: 'E' },
    { code: 'E3/7', name: '各国军事', slug: makeSlug('E3/7'), level: 2, parentCode: 'E' },
    { code: 'E8', name: '战略学、战役学、战术学', slug: makeSlug('E8'), level: 2, parentCode: 'E' },
    { code: 'E9', name: '军事技术', slug: makeSlug('E9'), level: 2, parentCode: 'E' },
    { code: 'E99', name: '军事地形学、军事地理学', slug: makeSlug('E99'), level: 2, parentCode: 'E' },
  ] },
  { code: 'F', name: '经济', slug: makeSlug('F'), level: 1, children: [
    { code: 'F0', name: '经济学', slug: makeSlug('F0'), level: 2, parentCode: 'F' },
    { code: 'F1', name: '世界各国经济概况、经济史、经济地理', slug: makeSlug('F1'), level: 2, parentCode: 'F' },
    { code: 'F2', name: '经济管理', slug: makeSlug('F2'), level: 2, parentCode: 'F' },
    { code: 'F3', name: '农业经济', slug: makeSlug('F3'), level: 2, parentCode: 'F' },
    { code: 'F4', name: '工业经济', slug: makeSlug('F4'), level: 2, parentCode: 'F' },
    { code: 'F49', name: '信息产业经济', slug: makeSlug('F49'), level: 2, parentCode: 'F' },
    { code: 'F5', name: '交通运输经济', slug: makeSlug('F5'), level: 2, parentCode: 'F' },
    { code: 'F59', name: '旅游经济', slug: makeSlug('F59'), level: 2, parentCode: 'F' },
    { code: 'F6', name: '邮电通信经济', slug: makeSlug('F6'), level: 2, parentCode: 'F' },
    { code: 'F7', name: '贸易经济', slug: makeSlug('F7'), level: 2, parentCode: 'F' },
    { code: 'F8', name: '财政、金融', slug: makeSlug('F8'), level: 2, parentCode: 'F' },
  ] },
  { code: 'G', name: '文化、科学、教育、体育', slug: makeSlug('G'), level: 1, children: [
    { code: 'G0', name: '文化理论', slug: makeSlug('G0'), level: 2, parentCode: 'G' },
    { code: 'G1', name: '世界各国文化与文化事业', slug: makeSlug('G1'), level: 2, parentCode: 'G' },
    { code: 'G2', name: '信息与知识传播', slug: makeSlug('G2'), level: 2, parentCode: 'G' },
    { code: 'G3', name: '科学、科学研究', slug: makeSlug('G3'), level: 2, parentCode: 'G' },
    { code: 'G4', name: '教育', slug: makeSlug('G4'), level: 2, parentCode: 'G' },
    { code: 'G8', name: '体育', slug: makeSlug('G8'), level: 2, parentCode: 'G' },
  ] },
  { code: 'H', name: '语言、文字', slug: makeSlug('H'), level: 1, children: [
    { code: 'H0', name: '语言学', slug: makeSlug('H0'), level: 2, parentCode: 'H' },
    { code: 'H1', name: '汉语', slug: makeSlug('H1'), level: 2, parentCode: 'H' },
    { code: 'H2', name: '中国少数民族语言', slug: makeSlug('H2'), level: 2, parentCode: 'H' },
    { code: 'H3', name: '常用外国语', slug: makeSlug('H3'), level: 2, parentCode: 'H' },
    { code: 'H4', name: '汉藏语系', slug: makeSlug('H4'), level: 2, parentCode: 'H' },
    { code: 'H5', name: '阿尔泰语系（突厥-蒙古-通古斯语系）', slug: makeSlug('H5'), level: 2, parentCode: 'H' },
    { code: 'H61', name: '南亚语系（澳斯特罗-亚细亚语系）', slug: makeSlug('H61'), level: 2, parentCode: 'H' },
    { code: 'H62', name: '南印语系（达罗毗荼语系、德拉维达语系）', slug: makeSlug('H62'), level: 2, parentCode: 'H' },
    { code: 'H63', name: '南岛语系（马来-玻里尼西亚语系）', slug: makeSlug('H63'), level: 2, parentCode: 'H' },
    { code: 'H64', name: '东北亚诸语言', slug: makeSlug('H64'), level: 2, parentCode: 'H' },
    { code: 'H65', name: '高加索语系（伊比利亚-高加索语系）', slug: makeSlug('H65'), level: 2, parentCode: 'H' },
    { code: 'H66', name: '乌拉尔语系（芬兰-乌戈尔语系）', slug: makeSlug('H66'), level: 2, parentCode: 'H' },
    { code: 'H67', name: '闪-含语系（阿非罗-亚细亚语系）', slug: makeSlug('H67'), level: 2, parentCode: 'H' },
    { code: 'H7', name: '印欧语系', slug: makeSlug('H7'), level: 2, parentCode: 'H' },
    { code: 'H81', name: '非洲诸语言', slug: makeSlug('H81'), level: 2, parentCode: 'H' },
    { code: 'H83', name: '美洲诸语言', slug: makeSlug('H83'), level: 2, parentCode: 'H' },
    { code: 'H84', name: '大洋洲诸语言', slug: makeSlug('H84'), level: 2, parentCode: 'H' },
    { code: 'H9', name: '国际辅助语', slug: makeSlug('H9'), level: 2, parentCode: 'H' },
  ] },
  { code: 'I', name: '文学', slug: makeSlug('I'), level: 1, children: [
    { code: 'I0', name: '文学理论', slug: makeSlug('I0'), level: 2, parentCode: 'I' },
    { code: 'I1', name: '世界文学', slug: makeSlug('I1'), level: 2, parentCode: 'I' },
    { code: 'I2', name: '中国文学', slug: makeSlug('I2'), level: 2, parentCode: 'I' },
    { code: 'I3/7', name: '各国文学', slug: makeSlug('I3/7'), level: 2, parentCode: 'I' },
  ] },
  { code: 'J', name: '艺术', slug: makeSlug('J'), level: 1, children: [
    { code: 'J0', name: '艺术理论', slug: makeSlug('J0'), level: 2, parentCode: 'J' },
    { code: 'J1', name: '世界各国艺术概况', slug: makeSlug('J1'), level: 2, parentCode: 'J' },
    { code: 'J19', name: '专题艺术与现代边缘艺术', slug: makeSlug('J19'), level: 2, parentCode: 'J' },
    { code: 'J2', name: '绘画', slug: makeSlug('J2'), level: 2, parentCode: 'J' },
    { code: 'J29', name: '书法、篆刻', slug: makeSlug('J29'), level: 2, parentCode: 'J' },
    { code: 'J3', name: '雕塑', slug: makeSlug('J3'), level: 2, parentCode: 'J' },
    { code: 'J4', name: '摄影艺术', slug: makeSlug('J4'), level: 2, parentCode: 'J' },
    { code: 'J5', name: '工艺美术', slug: makeSlug('J5'), level: 2, parentCode: 'J' },
    { code: '[J59]', name: '建筑艺术', slug: makeSlug('[J59]'), level: 2, parentCode: 'J' },
    { code: 'J6', name: '音乐', slug: makeSlug('J6'), level: 2, parentCode: 'J' },
    { code: 'J7', name: '舞蹈', slug: makeSlug('J7'), level: 2, parentCode: 'J' },
    { code: 'J8', name: '戏剧、曲艺、杂技艺术', slug: makeSlug('J8'), level: 2, parentCode: 'J' },
    { code: 'J9', name: '电影、电视艺术', slug: makeSlug('J9'), level: 2, parentCode: 'J' },
  ] },
  { code: 'K', name: '历史、地理', slug: makeSlug('K'), level: 1, children: [
    { code: 'K0', name: '史学理论', slug: makeSlug('K0'), level: 2, parentCode: 'K' },
    { code: 'K1', name: '世界史', slug: makeSlug('K1'), level: 2, parentCode: 'K' },
    { code: 'K2', name: '中国史', slug: makeSlug('K2'), level: 2, parentCode: 'K' },
    { code: 'K3', name: '亚洲史', slug: makeSlug('K3'), level: 2, parentCode: 'K' },
    { code: 'K4', name: '非洲史', slug: makeSlug('K4'), level: 2, parentCode: 'K' },
    { code: 'K5', name: '欧洲史', slug: makeSlug('K5'), level: 2, parentCode: 'K' },
    { code: 'K6', name: '大洋洲史', slug: makeSlug('K6'), level: 2, parentCode: 'K' },
    { code: 'K7', name: '美洲史', slug: makeSlug('K7'), level: 2, parentCode: 'K' },
    { code: 'K81', name: '传记', slug: makeSlug('K81'), level: 2, parentCode: 'K' },
    { code: 'K85', name: '文物考古', slug: makeSlug('K85'), level: 2, parentCode: 'K' },
    { code: 'K89', name: '风俗习惯', slug: makeSlug('K89'), level: 2, parentCode: 'K' },
    { code: 'K9', name: '地理', slug: makeSlug('K9'), level: 2, parentCode: 'K' },
  ] },
  { code: 'N', name: '自然科学总论', slug: makeSlug('N'), level: 1, children: [
    { code: 'N0', name: '自然科学理论与方法论', slug: makeSlug('N0'), level: 2, parentCode: 'N' },
    { code: 'N1', name: '自然科学概况、现状、进展', slug: makeSlug('N1'), level: 2, parentCode: 'N' },
    { code: 'N2', name: '自然科学机构、团体、会议', slug: makeSlug('N2'), level: 2, parentCode: 'N' },
    { code: 'N3', name: '自然科学研究方法', slug: makeSlug('N3'), level: 2, parentCode: 'N' },
    { code: 'N4', name: '自然科学教育与普及', slug: makeSlug('N4'), level: 2, parentCode: 'N' },
    { code: 'N5', name: '自然科学丛书、文集、连续性出版物', slug: makeSlug('N5'), level: 2, parentCode: 'N' },
    { code: 'N6', name: '自然科学参考工具书', slug: makeSlug('N6'), level: 2, parentCode: 'N' },
    { code: '[N7]', name: '自然科学文献检索工具书', slug: makeSlug('[N7]'), level: 2, parentCode: 'N' },
    { code: 'N79', name: '非书资料、视听资料', slug: makeSlug('N79'), level: 2, parentCode: 'N' },
    { code: 'N8', name: '自然科学调查、考察', slug: makeSlug('N8'), level: 2, parentCode: 'N' },
    { code: 'N91', name: '自然研究、自然历史', slug: makeSlug('N91'), level: 2, parentCode: 'N' },
    { code: 'N93', name: '非线性科学', slug: makeSlug('N93'), level: 2, parentCode: 'N' },
    { code: 'N94', name: '系统科学', slug: makeSlug('N94'), level: 2, parentCode: 'N' },
    { code: '[N99]', name: '情报学、情报工作', slug: makeSlug('[N99]'), level: 2, parentCode: 'N' },
  ] },
  { code: 'O', name: '数理科学和化学', slug: makeSlug('O'), level: 1, children: [
    { code: 'O1', name: '数学', slug: makeSlug('O1'), level: 2, parentCode: 'O' },
    { code: 'O3', name: '力学', slug: makeSlug('O3'), level: 2, parentCode: 'O' },
    { code: 'O4', name: '物理学', slug: makeSlug('O4'), level: 2, parentCode: 'O' },
    { code: 'O6', name: '化学', slug: makeSlug('O6'), level: 2, parentCode: 'O' },
    { code: 'O7', name: '晶体学', slug: makeSlug('O7'), level: 2, parentCode: 'O' },
  ] },
  { code: 'P', name: '天文学、地球科学', slug: makeSlug('P'), level: 1, children: [
    { code: 'P1', name: '天文学', slug: makeSlug('P1'), level: 2, parentCode: 'P' },
    { code: 'P2', name: '测绘学', slug: makeSlug('P2'), level: 2, parentCode: 'P' },
    { code: 'P3', name: '地球物理学', slug: makeSlug('P3'), level: 2, parentCode: 'P' },
    { code: 'P4', name: '大气科学（气象学）', slug: makeSlug('P4'), level: 2, parentCode: 'P' },
    { code: 'P5', name: '地质学', slug: makeSlug('P5'), level: 2, parentCode: 'P' },
    { code: 'P7', name: '海洋学', slug: makeSlug('P7'), level: 2, parentCode: 'P' },
    { code: 'P9', name: '自然地理学', slug: makeSlug('P9'), level: 2, parentCode: 'P' },
  ] },
  { code: 'Q', name: '生物科学', slug: makeSlug('Q'), level: 1, children: [
    { code: 'Q1', name: '普通生物学', slug: makeSlug('Q1'), level: 2, parentCode: 'Q' },
    { code: 'Q2', name: '细胞生物学', slug: makeSlug('Q2'), level: 2, parentCode: 'Q' },
    { code: 'Q3', name: '遗传学', slug: makeSlug('Q3'), level: 2, parentCode: 'Q' },
    { code: 'Q4', name: '生理学', slug: makeSlug('Q4'), level: 2, parentCode: 'Q' },
    { code: 'Q5', name: '生物化学', slug: makeSlug('Q5'), level: 2, parentCode: 'Q' },
    { code: 'Q6', name: '生物物理学', slug: makeSlug('Q6'), level: 2, parentCode: 'Q' },
    { code: 'Q7', name: '分子生物学', slug: makeSlug('Q7'), level: 2, parentCode: 'Q' },
    { code: 'Q81', name: '生物工程学（生物技术）', slug: makeSlug('Q81'), level: 2, parentCode: 'Q' },
    { code: '[Q89]', name: '环境生物学', slug: makeSlug('[Q89]'), level: 2, parentCode: 'Q' },
    { code: 'Q91', name: '古生物学', slug: makeSlug('Q91'), level: 2, parentCode: 'Q' },
    { code: 'Q93', name: '微生物学', slug: makeSlug('Q93'), level: 2, parentCode: 'Q' },
    { code: 'Q94', name: '植物学', slug: makeSlug('Q94'), level: 2, parentCode: 'Q' },
    { code: 'Q95', name: '动物学', slug: makeSlug('Q95'), level: 2, parentCode: 'Q' },
    { code: 'Q96', name: '昆虫学', slug: makeSlug('Q96'), level: 2, parentCode: 'Q' },
    { code: 'Q98', name: '人类学', slug: makeSlug('Q98'), level: 2, parentCode: 'Q' },
  ] },
  { code: 'R', name: '医药、卫生', slug: makeSlug('R'), level: 1, children: [
    { code: 'R1', name: '预防医学、卫生学', slug: makeSlug('R1'), level: 2, parentCode: 'R' },
    { code: 'R2', name: '中国医学', slug: makeSlug('R2'), level: 2, parentCode: 'R' },
    { code: 'R3', name: '基础医学', slug: makeSlug('R3'), level: 2, parentCode: 'R' },
    { code: 'R4', name: '临床医学', slug: makeSlug('R4'), level: 2, parentCode: 'R' },
    { code: 'R5', name: '内科学', slug: makeSlug('R5'), level: 2, parentCode: 'R' },
    { code: 'R6', name: '外科学', slug: makeSlug('R6'), level: 2, parentCode: 'R' },
    { code: 'R71', name: '妇产科学', slug: makeSlug('R71'), level: 2, parentCode: 'R' },
    { code: 'R72', name: '儿科学', slug: makeSlug('R72'), level: 2, parentCode: 'R' },
    { code: 'R73', name: '肿瘤学', slug: makeSlug('R73'), level: 2, parentCode: 'R' },
    { code: 'R74', name: '神经病学与精神病学', slug: makeSlug('R74'), level: 2, parentCode: 'R' },
    { code: 'R75', name: '皮肤病学与性病学', slug: makeSlug('R75'), level: 2, parentCode: 'R' },
    { code: 'R76', name: '耳鼻咽喉科学', slug: makeSlug('R76'), level: 2, parentCode: 'R' },
    { code: 'R77', name: '眼科学', slug: makeSlug('R77'), level: 2, parentCode: 'R' },
    { code: 'R78', name: '口腔科学', slug: makeSlug('R78'), level: 2, parentCode: 'R' },
    { code: 'R79', name: '外国民族医学', slug: makeSlug('R79'), level: 2, parentCode: 'R' },
    { code: 'R8', name: '特种医学', slug: makeSlug('R8'), level: 2, parentCode: 'R' },
    { code: 'R9', name: '药学', slug: makeSlug('R9'), level: 2, parentCode: 'R' },
  ] },
  { code: 'S', name: '农业科学', slug: makeSlug('S'), level: 1, children: [
    { code: 'S1', name: '农业基础科学', slug: makeSlug('S1'), level: 2, parentCode: 'S' },
    { code: 'S2', name: '农业工程', slug: makeSlug('S2'), level: 2, parentCode: 'S' },
    { code: 'S3', name: '农学（农艺学）', slug: makeSlug('S3'), level: 2, parentCode: 'S' },
    { code: 'S4', name: '植物保护', slug: makeSlug('S4'), level: 2, parentCode: 'S' },
    { code: 'S5', name: '农作物', slug: makeSlug('S5'), level: 2, parentCode: 'S' },
    { code: 'S6', name: '园艺', slug: makeSlug('S6'), level: 2, parentCode: 'S' },
    { code: 'S7', name: '林业', slug: makeSlug('S7'), level: 2, parentCode: 'S' },
    { code: 'S8', name: '畜牧、动物医学、狩猎、蚕、蜂', slug: makeSlug('S8'), level: 2, parentCode: 'S' },
    { code: 'S9', name: '水产、渔业', slug: makeSlug('S9'), level: 2, parentCode: 'S' },
  ] },
  { code: 'T', name: '工业技术', slug: makeSlug('T'), level: 1, children: [
    { code: 'TB', name: '一般工业技术', slug: makeSlug('TB'), level: 2, parentCode: 'T' },
    { code: 'TD', name: '矿业工程', slug: makeSlug('TD'), level: 2, parentCode: 'T' },
    { code: 'TE', name: '石油、天然气工业', slug: makeSlug('TE'), level: 2, parentCode: 'T' },
    { code: 'TF', name: '冶金工业', slug: makeSlug('TF'), level: 2, parentCode: 'T' },
    { code: 'TG', name: '金属学与金属工艺', slug: makeSlug('TG'), level: 2, parentCode: 'T' },
    { code: 'TH', name: '机械、仪表工业', slug: makeSlug('TH'), level: 2, parentCode: 'T' },
    { code: 'TJ', name: '武器工业', slug: makeSlug('TJ'), level: 2, parentCode: 'T' },
    { code: 'TK', name: '能源与动力工程', slug: makeSlug('TK'), level: 2, parentCode: 'T' },
    { code: 'TL', name: '原子能技术', slug: makeSlug('TL'), level: 2, parentCode: 'T' },
    { code: 'TM', name: '电工技术', slug: makeSlug('TM'), level: 2, parentCode: 'T' },
    { code: 'TN', name: '电子技术、通信技术', slug: makeSlug('TN'), level: 2, parentCode: 'T' },
    { code: 'TP', name: '自动化技术、计算机技术', slug: makeSlug('TP'), level: 2, parentCode: 'T' },
    { code: 'TQ', name: '化学工业', slug: makeSlug('TQ'), level: 2, parentCode: 'T' },
    { code: 'TS', name: '轻工业、手工业、生活服务业', slug: makeSlug('TS'), level: 2, parentCode: 'T' },
    { code: 'TU', name: '建筑科学', slug: makeSlug('TU'), level: 2, parentCode: 'T' },
    { code: 'TV', name: '水利工程', slug: makeSlug('TV'), level: 2, parentCode: 'T' },
  ] },
  { code: 'U', name: '交通运输', slug: makeSlug('U'), level: 1, children: [
    { code: 'U1', name: '综合运输', slug: makeSlug('U1'), level: 2, parentCode: 'U' },
    { code: 'U2', name: '铁路运输', slug: makeSlug('U2'), level: 2, parentCode: 'U' },
    { code: 'U4', name: '公路运输', slug: makeSlug('U4'), level: 2, parentCode: 'U' },
    { code: 'U6', name: '水路运输', slug: makeSlug('U6'), level: 2, parentCode: 'U' },
    { code: '[U8]', name: '航空运输', slug: makeSlug('[U8]'), level: 2, parentCode: 'U' },
  ] },
  { code: 'V', name: '航空、航天', slug: makeSlug('V'), level: 1, children: [
    { code: 'V1', name: '航空、航天技术的研究与探索', slug: makeSlug('V1'), level: 2, parentCode: 'V' },
    { code: 'V2', name: '航空', slug: makeSlug('V2'), level: 2, parentCode: 'V' },
    { code: 'V4', name: '航天（宇宙航行）', slug: makeSlug('V4'), level: 2, parentCode: 'V' },
    { code: '[V7]', name: '航空、航天医学', slug: makeSlug('[V7]'), level: 2, parentCode: 'V' },
  ] },
  { code: 'X', name: '环境科学、安全科学', slug: makeSlug('X'), level: 1, children: [
    { code: 'X1', name: '环境科学基础理论', slug: makeSlug('X1'), level: 2, parentCode: 'X' },
    { code: 'X2', name: '社会与环境', slug: makeSlug('X2'), level: 2, parentCode: 'X' },
    { code: 'X3', name: '环境保护管理', slug: makeSlug('X3'), level: 2, parentCode: 'X' },
    { code: 'X4', name: '灾害及其防治', slug: makeSlug('X4'), level: 2, parentCode: 'X' },
    { code: 'X5', name: '环境污染及其防治', slug: makeSlug('X5'), level: 2, parentCode: 'X' },
    { code: 'X7', name: '行业污染、废物处理与综合利用', slug: makeSlug('X7'), level: 2, parentCode: 'X' },
    { code: 'X8', name: '环境质量评价与环境监测', slug: makeSlug('X8'), level: 2, parentCode: 'X' },
    { code: 'X9', name: '安全科学', slug: makeSlug('X9'), level: 2, parentCode: 'X' },
  ] },
  { code: 'Z', name: '综合性图书', slug: makeSlug('Z'), level: 1, children: [
    { code: 'Z1', name: '丛书', slug: makeSlug('Z1'), level: 2, parentCode: 'Z' },
    { code: 'Z2', name: '百科全书、类书', slug: makeSlug('Z2'), level: 2, parentCode: 'Z' },
    { code: 'Z3', name: '辞典', slug: makeSlug('Z3'), level: 2, parentCode: 'Z' },
    { code: 'Z4', name: '论文集、全集、选集、杂著', slug: makeSlug('Z4'), level: 2, parentCode: 'Z' },
    { code: 'Z5', name: '年鉴、年刊', slug: makeSlug('Z5'), level: 2, parentCode: 'Z' },
    { code: 'Z6', name: '期刊、连续性出版物', slug: makeSlug('Z6'), level: 2, parentCode: 'Z' },
    { code: 'Z8', name: '图书报刊目录、文摘、索引', slug: makeSlug('Z8'), level: 2, parentCode: 'Z' },
  ] },
];

export const flatCatalogNodes = catalogRoots.flatMap((root) => [root, ...(root.children ?? [])]);

export const catalogByCode = new Map(flatCatalogNodes.map((node) => [node.code, node]));

export const catalogBySlug = new Map(flatCatalogNodes.map((node) => [node.slug, node]));

export function getCatalogNodeByCode(code?: string | null) {
  if (!code) return undefined;
  return catalogByCode.get(code);
}

export function getCatalogNodeBySlug(slug?: string | null) {
  if (!slug) return undefined;
  return catalogBySlug.get(slug);
}

export function getCatalogPath(code?: string | null) {
  const path: CatalogNode[] = [];
  if (!code) return path;
  let current = catalogByCode.get(code);
  while (current) {
    path.unshift(current);
    current = current.parentCode ? catalogByCode.get(current.parentCode) : undefined;
  }
  return path;
}

export function getCatalogChildren(code?: string | null) {
  const node = getCatalogNodeByCode(code);
  return node?.children ?? [];
}

export function getDescendantCatalogCodes(code?: string | null) {
  const node = getCatalogNodeByCode(code);
  if (!node) return [];
  return [node.code, ...(node.children?.map((child) => child.code) ?? [])];
}

export function getTopLevelCatalogCode(code?: string | null) {
  return getCatalogPath(code)[0]?.code;
}

export function isCatalogDescendant(targetCode: string, ancestorCode: string) {
  return getCatalogPath(targetCode).some((node) => node.code === ancestorCode);
}
