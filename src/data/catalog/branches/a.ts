import type { CatalogNode } from '../core';
import { branch, leaf, makeSlug, rebuildCatalogHierarchy } from '../core';

const TOPIC_SPLITS = [
  { suffix: '1', name: '论马克思主义、列宁主义', note: '这一层收录围绕马克思主义、列宁主义总论展开的专题汇编，适合从理论总纲进入。' },
  { suffix: '2', name: '论共产主义运动、共产党、青年团', note: '这一层集中摆放关于共产主义运动、政党与青年团问题的专题材料，适合从组织和运动线索进入。' },
  { suffix: '3', name: '论哲学', note: '这一层收录围绕哲学问题编成的专题材料，适合从世界观和方法论入口进入。' },
  { suffix: '4', name: '论社会、政治、法律', note: '这一层聚拢社会、政治、法律问题的专题汇编，适合按现实问题集中查阅。' },
  { suffix: '5', name: '论军事', note: '这一层收录围绕战争、军队与战略问题整理的专题材料。' },
  { suffix: '6', name: '论经济', note: '这一层把经济理论、经济建设与经济工作问题的专题材料放在一起。' },
  { suffix: '7', name: '论文化、教育、体育', note: '这一层收录文化、教育、体育问题的专题汇编，适合按文教主题集中阅读。' },
  { suffix: '8', name: '论语言、文字', note: '这一层集中摆放语言文字问题的专题汇编。' },
  { suffix: '91', name: '论文艺', note: '这一层收录文学艺术问题的专题汇编，适合从文艺观与文化表达切入。' },
  { suffix: '92', name: '论历史、地理', note: '这一层集中摆放历史、地理问题的专题汇编。' },
  { suffix: '93', name: '论科学、技术', note: '这一层收录科学技术问题的专题汇编，适合查找相关技术与科学论述。' },
  { suffix: '94', name: '论医药、卫生', note: '这一层集中摆放医药卫生问题的专题汇编。' },
  { suffix: '95', name: '论农业技术', note: '这一层收录农业技术问题的专题汇编。' },
  { suffix: '96', name: '论工业、交通', note: '这一层集中摆放工业和交通问题的专题汇编。' },
] as const;

const createTopicBranch = (
  code: string,
  title: string,
  parentCode: string,
  note: string,
  mode: 'plain' | 'dotted' = 'plain',
) => {
  const joinCode = (suffix: string) =>
    mode === 'dotted' ? `${code}.${suffix}` : `${code}${suffix}`;
  const extendedParentCode = joinCode('9');

  return branch(
    code,
    title,
    3,
    parentCode,
    [
      ...TOPIC_SPLITS.filter((item) => !item.suffix.startsWith('9')).map((item) =>
        leaf(
          joinCode(item.suffix),
          item.name,
          4,
          code,
          item.note,
        ),
      ),
      branch(
        extendedParentCode,
        '延伸专题',
        4,
        code,
        TOPIC_SPLITS.filter((item) => item.suffix.startsWith('9')).map((item) =>
          leaf(
            joinCode(item.suffix),
            item.name,
            5,
            extendedParentCode,
            item.note,
          ),
        ),
        '这一层把文艺、历史地理、科学技术、医药卫生、农业技术、工业交通等延伸专题再单独拎出来，方便在更细一层里继续翻找。',
      ),
    ],
    note,
  );
};

const cloneTree = (
  source: CatalogNode,
  sourcePrefix: string,
  targetPrefix: string,
  parentCode?: string,
): CatalogNode => {
  const clonedCode = source.code.replace(sourcePrefix, targetPrefix);
  const clonedChildren = source.children?.map((child) =>
    cloneTree(child, sourcePrefix, targetPrefix, clonedCode),
  );

  return {
    code: clonedCode,
    name: source.name,
    slug: makeSlug(clonedCode),
    level: source.level,
    ...(parentCode ? { parentCode } : {}),
    ...(source.note ? { note: source.note } : {}),
    ...(clonedChildren?.length ? { children: clonedChildren } : {}),
  };
};

const A1_SINGLE_WORK_PERIODS = [
  leaf('A121', '马克思主义形成时期（1848年以前）', 4, 'A12', '收录1848年以前写作的单篇著作，可用来追踪马克思主义形成前夜的理论积累。'),
  leaf('A122', '革命风暴的高涨与低落时期（1848～1863年）', 4, 'A12', '收录1848至1863年间的单篇著作，适合把握革命风暴前后的理论应答。'),
  leaf('A123', '第一国际和巴黎公社时期（1864～1872年）', 4, 'A12', '收录第一国际与巴黎公社时期的单篇著作，适合观察理论与工人运动实践的交织。'),
  leaf('A124', '马克思主义广泛传播和各国建立社会主义政党时期（1873～1889年6月）', 4, 'A12', '收录1873至1889年6月间的单篇著作，适合考察马克思主义走向广泛传播的阶段。'),
  leaf('A125', '第二国际时期（1889年7月～1895年）', 4, 'A12', '收录第二国际时期的单篇著作，适合顺着晚期脉络阅读理论传播与争论。'),
] as const;

const A2_SINGLE_WORK_PERIODS = [
  branch('A221', '俄国社会民主工党形成和布尔什维克派出现时期（1904年以前）', 4, 'A22', [
    leaf('A221.1', '1899年以前', 5, 'A221', '收录1899年以前的相关著作，适合阅读列宁早期思想与组织探索。'),
    leaf('A221.2', '1900～1904年', 5, 'A221', '收录1900至1904年的相关著作，适合把握布尔什维克派出现前后的理论准备。'),
  ], '这一层把1904年以前再细分成更具体的时间段，便于顺着列宁早期脉络阅读。'),
  leaf('A222', '第一次俄国革命时期（1905～1907年）', 4, 'A22', '收录1905至1907年的单篇著作，适合把握第一次俄国革命中的策略与判断。'),
  leaf('A223', '斯托雷平反动时期和布尔什维克形成独立政党时期（1908～1912年3月）', 4, 'A22', '收录1908至1912年3月的单篇著作，适合观察布尔什维克独立成形的理论准备。'),
  leaf('A224', '第一次世界大战以前工人运动的高涨及大战时期（1912年4月～1916年）', 4, 'A22', '收录1912年4月至1916年的单篇著作，适合对照大战前后的工人运动与帝国主义批判。'),
  leaf('A225', '第二次俄国革命和社会主义革命时期（1917年）', 4, 'A22', '收录1917年的单篇著作，适合集中阅读革命关键年份的理论与实践判断。'),
  leaf('A226', '帝国主义武装干涉和国内战争时期（1918～1920年）', 4, 'A22', '收录1918至1920年的单篇著作，适合把握战时治理、国家建设与斗争策略。'),
  leaf('A227', '国民经济恢复时期（1921～1924年）', 4, 'A22', '收录1921至1924年的单篇著作，适合阅读恢复经济与过渡阶段的理论思考。'),
] as const;

const A3_SINGLE_WORK_PERIODS = [
  leaf('A321', '十月社会主义革命及其以前（1917年及其以前）', 4, 'A32', '收录1917年及以前的单篇著作，适合把握斯大林在革命前后的早期论述。'),
  leaf('A322', '帝国主义武装干涉和国内战争时期（1918～1920年）', 4, 'A32', '收录1918至1920年的单篇著作，适合考察国内战争语境下的组织与斗争思路。'),
  leaf('A323', '国民经济恢复时期（1921～1925年）', 4, 'A32', '收录1921至1925年的单篇著作，适合阅读恢复经济与国家建设问题。'),
  leaf('A324', '为实现国家工业化而斗争时期（1926～1929年）', 4, 'A32', '收录1926至1929年的单篇著作，适合把握工业化推进中的理论表述。'),
  leaf('A325', '为实现农业集体化而斗争时期（1930～1934年）', 4, 'A32', '收录1930至1934年的单篇著作，适合查找农业集体化阶段的相关论述。'),
  leaf('A326', '社会主义建设时期（1935～1941年5月）', 4, 'A32', '收录1935年至1941年5月的单篇著作，适合阅读战前社会主义建设问题。'),
  leaf('A327', '苏联卫国战争时期（1941年6月～1945年）', 4, 'A32', '收录卫国战争时期的单篇著作，适合顺着战争背景把握动员与战略表述。'),
  leaf('A328', '战后恢复和发展社会主义经济时期（1946～1953年）', 4, 'A32', '收录1946至1953年的单篇著作，适合观察战后恢复与经济发展阶段。'),
] as const;

const A4_SINGLE_WORK_PERIODS = [
  leaf('A421', '第一次国内革命战争以前（1924年以前）', 4, 'A42', '收录1924年以前的单篇著作，适合阅读毛泽东早期思想与社会观察。'),
  leaf('A422', '第一次国内革命战争时期（1924～1927年7月）', 4, 'A42', '收录1924至1927年7月的单篇著作，适合把握第一次国内革命战争时期的论述。'),
  leaf('A423', '第二次国内革命战争时期（1927年8月～1937年6月）', 4, 'A42', '收录1927年8月至1937年6月的单篇著作，适合阅读革命根据地时期的重要文本。'),
  leaf('A424', '抗日战争时期（1937年7月～1945年8月）', 4, 'A42', '收录抗日战争时期的单篇著作，适合顺着统一战线与战争实践阅读相关论述。'),
  leaf('A425', '第三次国内革命战争时期（1945年9月～1949年9月）', 4, 'A42', '收录1945年9月至1949年9月的单篇著作，适合理解解放战争阶段的判断与部署。'),
  leaf('A426', '社会主义革命和社会主义建设时期（1949年10月～1976年）', 4, 'A42', '收录新中国成立后至1976年的单篇著作，适合阅读社会主义革命与建设阶段的文本。'),
] as const;

const createCollectedWorksBranch = (
  rootCode: string,
  title: string,
  periods: CatalogNode[],
) => {
  const subject = title.replace('著作', '');
  const volumeCode = `${rootCode}1`;
  const singleCode = `${rootCode}2`;
  const selectedCode = `${rootCode}19`;
  const letterCode = `${rootCode}3`;
  const poetryCode = `${rootCode}4`;
  const manuscriptCode = `${rootCode}5`;
  const topicCode = `${rootCode}6`;
  const quoteCode = `${rootCode}8`;

  return branch(rootCode, title, 2, 'A', [
    leaf(volumeCode, '选集、文集', 3, rootCode, `收录${subject}的综合性选集、文集与成套整理本，适合从整体结构进入其著述世界。`),
    leaf(selectedCode, '选读', 3, rootCode, `收录面向导读、普及或学习场景编成的选读本，适合从重点篇章进入${subject}。`),
    branch(singleCode, '单行著作', 3, rootCode, periods.map((item) => cloneTree(item, item.code, item.code, singleCode)), `按写作阶段或历史时期细分${subject}的单篇著作，方便顺着时间线观察思想展开。`),
    leaf(letterCode, '书信集、日记、函电、谈话', 3, rootCode, `收录书信、谈话、日记和函电等材料，更能看到${subject}在具体情境中的思考与回应。`),
    ...(rootCode === 'A1' || rootCode === 'A4' ? [leaf(poetryCode, '诗词', 3, rootCode, `收录诗词、韵文或带有文学表达色彩的文本，适合从语言风格与情感线索切入。`)] : []),
    leaf(manuscriptCode, '手迹', 3, rootCode, `收录手稿、题词、墨迹及其影印本，更接近文本生成时的原始面貌。`),
    createTopicBranch(topicCode, '专题汇编', rootCode, `将${subject}按某一主题重新编排，适合围绕一个问题集中查阅。`),
    leaf(quoteCode, '语录', 3, rootCode, `收录便于摘引和快速浏览的语录式材料，适合查找常被引用的表述。`),
  ]);
};

const createStudyOriginalWorksBranch = (
  code: string,
  title: string,
  sourceSingleWorkNode: CatalogNode,
  options?: {
    includePoetry?: boolean;
    includeBibliographyCode?: string;
  },
) => {
  const includePoetry = options?.includePoetry ?? false;
  const bibliographyCode = options?.includeBibliographyCode;
  return branch(code, title, 3, 'A8', [
    branch(`${code}1`, title.replace('思想的', '').replace('理论的', '').replace('主义的', '').replace('的', '').includes('著作')
      ? title
      : title.replace('的学习和研究', '著作的学习和研究'), 4, code, [
      leaf(`${code}1.1`, '选集、文集', 5, `${code}1`, '围绕整理本、选集和文集展开的学习研究材料，适合从较稳定的文本入口切入。'),
      branch(`${code}1.2`, '单行著作', 5, `${code}1`, sourceSingleWorkNode.children?.map((child) => cloneTree(child, sourceSingleWorkNode.code, `${code}1.2`, `${code}1.2`)) ?? [], '把单篇原著的学习研究材料按原著的时间或阶段继续细分，适合顺着文本脉络深入阅读。'),
      leaf(`${code}1.3`, '书信集、日记、函电、谈话', 5, `${code}1`, '围绕书信、谈话、函电等材料展开的学习研究，适合从历史语境理解相关论述。'),
      ...(includePoetry ? [leaf(`${code}1.4`, '诗词', 5, `${code}1`, '围绕诗词与文学表达展开的学习研究材料，适合从语言与修辞角度切入。')] : []),
      leaf(`${code}1.5`, '手迹', 5, `${code}1`, '围绕手稿、手迹及其史料价值展开的学习研究材料。'),
      createTopicBranch(`${code}1.6`, '专题汇编', `${code}1`, '将学习研究材料按问题重组，适合围绕某一主题集中查阅。'),
      leaf(`${code}1.8`, '语录', 5, `${code}1`, '收录语录式整理与导读材料，适合快速摘引和建立印象。'),
    ], `这一层围绕原著本身的学习与研究展开，适合从文本层面进入${title.replace('的学习和研究', '')}。`),
    ...(bibliographyCode ? [leaf(bibliographyCode, '书目、索引', 4, code, '收录书目、索引和检索工具，适合作为查找与入门的辅助抽屉。')] : []),
  ], `这一层把${title.replace('的学习和研究', '')}相关的学习研究材料集中摆在一起，适合做系统性阅读。`);
};

const createBiographyBranch = (code: string, personName: string) =>
  branch(code, personName, 2, 'A7', [
    leaf(`${code}1`, '传记', 3, code, `收录围绕${personName}撰写的完整传记，适合从生平、思想与历史位置整体理解其人物形象。`),
    leaf(`${code}2`, '生平事迹、回忆录', 3, code, `收录${personName}的生平事迹、回忆和相关见闻记录，更贴近其活动现场与时代氛围。`),
    leaf(`${code}3`, '年谱、年表', 3, code, `按时间顺序编排${personName}的重要活动、著述与历史节点，适合快速检索年份与事件。`),
    leaf(`${code}4`, '纪念文集', 3, code, `收录围绕${personName}的纪念文集、纪念论文和专题纪念材料。`),
    leaf(`${code}5`, '阐述、研究', 3, code, `收录关于${personName}思想、方法、历史作用及其研究的论著，适合深入理解其影响。`),
    leaf(`${code}6`, '肖像、照片、画传、像章', 3, code, `收录肖像、照片、画传与相关视觉资料，适合从图像线索认识${personName}。`),
    leaf(`${code}7`, '纪念地、故居、遗物', 3, code, `收录与${personName}相关的纪念地、故居、遗物及陈列介绍，适合做人物史料补充。`),
  ]);

export const A_BRANCH = rebuildCatalogHierarchy(branch('A', '马克思主义、列宁主义、毛泽东思想、邓小平理论', 1, undefined, [
  createCollectedWorksBranch('A1', '马克思、恩格斯著作', [...A1_SINGLE_WORK_PERIODS]),
  createCollectedWorksBranch('A2', '列宁著作', [...A2_SINGLE_WORK_PERIODS]),
  createCollectedWorksBranch('A3', '斯大林著作', [...A3_SINGLE_WORK_PERIODS]),
  createCollectedWorksBranch('A4', '毛泽东著作', [...A4_SINGLE_WORK_PERIODS]),
  branch('A49', '邓小平著作', 2, 'A', [
    leaf('A491', '选集、文集', 3, 'A49', '收录邓小平著作的综合性选集与文集，适合从整体脉络把握其重要表述。'),
    leaf('A491.9', '选读', 4, 'A491', '收录邓小平著作的导读性选读本，适合从重点篇章进入。'),
    leaf('A492', '单行著作', 3, 'A49', '收录邓小平单篇或单册著作，适合按具体题目查找原文。'),
    leaf('A493', '书信集、日记、函电、谈话', 3, 'A49', '收录书信、谈话、函电等材料，更贴近实际语境中的表述与判断。'),
    leaf('A495', '手迹', 3, 'A49', '收录手稿、题词与相关影印材料，适合做史料性查阅。'),
    createTopicBranch('A496', '专题汇编', 'A49', '围绕具体主题汇编邓小平著作，适合按问题集中查阅。', 'dotted'),
    leaf('A498', '语录', 3, 'A49', '收录便于摘引的语录式材料，适合快速检索常用表述。'),
  ]),
  branch('A5', '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平著作汇编', 2, 'A', [
    createTopicBranch('A56', '专题汇编', 'A5', '将多位作者关于同一主题的著作重新组合，适合从问题意识而非人物顺序进入。'),
    leaf('A58', '语录', 3, 'A5', '收录多位作者综合性的语录材料，适合快速对照不同人物的表述。'),
  ]),
  branch('A7', '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平生平和传记', 2, 'A', [
    createBiographyBranch('A71', '马克思'),
    createBiographyBranch('A72', '恩格斯'),
    createBiographyBranch('A73', '列宁'),
    createBiographyBranch('A74', '斯大林'),
    createBiographyBranch('A75', '毛泽东'),
    createBiographyBranch('A76', '邓小平'),
  ], '这一分支按人物展开生平、传记与纪念资料，适合沿人物线索进入 A 类文献。'),
  branch('A8', '马克思主义、列宁主义、毛泽东思想、邓小平理论的学习和研究', 2, 'A', [
    createStudyOriginalWorksBranch('A81', '马克思主义的学习和研究', branch('A12', '单行著作', 3, 'A1', [...A1_SINGLE_WORK_PERIODS], ''), { includePoetry: true, includeBibliographyCode: 'A813' }),
    createStudyOriginalWorksBranch('A82', '列宁主义的学习和研究', branch('A22', '单行著作', 3, 'A2', [...A2_SINGLE_WORK_PERIODS], ''), { includeBibliographyCode: 'A823' }),
    createStudyOriginalWorksBranch('A83', '斯大林思想的学习和研究', branch('A32', '单行著作', 3, 'A3', [...A3_SINGLE_WORK_PERIODS], ''), { includeBibliographyCode: 'A833' }),
    createStudyOriginalWorksBranch('A84', '毛泽东思想的学习和研究', branch('A42', '单行著作', 3, 'A4', [...A4_SINGLE_WORK_PERIODS], ''), { includePoetry: true, includeBibliographyCode: 'A843' }),
    branch('A849', '邓小平理论的学习和研究', 3, 'A8', [
      branch('A849.1', '邓小平著作的学习和研究', 4, 'A849', [
        leaf('A849.11', '选集、文集', 5, 'A849.1', '围绕邓小平选集、文集的学习研究材料，适合从整理本进入邓小平理论。'),
        leaf('A849.12', '单行著作', 5, 'A849.1', '围绕邓小平单篇著作的学习研究材料，适合按具体文本细读。'),
        leaf('A849.13', '书信集、日记、函电、谈话', 5, 'A849.1', '围绕书信、函电和谈话的学习研究材料，适合从历史语境理解相关论述。'),
        leaf('A849.15', '手迹', 5, 'A849.1', '围绕手迹和手稿的学习研究材料，适合作为史料性补充阅读。'),
        createTopicBranch('A849.16', '专题汇编', 'A849.1', '将邓小平著作学习材料按专题重组，适合围绕某一问题集中阅读。'),
        leaf('A849.18', '语录', 5, 'A849.1', '收录邓小平著作学习研究中的语录式整理材料，适合快速摘引与检索。'),
      ], '围绕邓小平原著的学习研究材料归入此类。'),
      leaf('A849.3', '书目、索引', 4, 'A849', '收录邓小平理论学习研究相关的书目和索引工具，适合作为查找入口。'),
    ], '对邓小平理论的学习研究归入此类。'),
    branch('A85', '著作汇编的学习和研究', 3, 'A8', [
      branch('A851', '专题汇编的学习和研究', 4, 'A85', [
        createTopicBranch('A851.6', '专题汇编', 'A851', '将著作汇编的学习研究材料按问题继续分组，适合围绕某一专题集中查阅。'),
      ], '围绕多位作者著作汇编本身的学习研究归入此层，更适合研究汇编体系与编排逻辑。'),
      leaf('A853', '书目、索引', 4, 'A85', '收录著作汇编学习研究的书目与索引，是查找相关研究材料的入口。'),
    ], '围绕多位作者著作汇编本身的学习与研究归入此类。'),
  ], 'A8 收拢关于原著学习、思想发展史与研究工具的文献，是从原著进入研究的总入口。'),
], 'A 类是全馆最靠前的一排书架，收拢经典著作、传记与学习研究材料，适合顺着人物、文体或研究脉络进入。'));
