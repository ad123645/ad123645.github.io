export interface CatalogNode {
  code: string;
  name: string;
  slug: string;
  level: number;
  parentCode?: string;
  note?: string;
  children?: CatalogNode[];
}

const makeSlug = (code: string) =>
  code
    .toLowerCase()
    .replace(/[\[\]()（）]/g, '')
    .replace(/\//g, '-')
    .replace(/[^a-z0-9.-]+/g, '-')
    .replace(/-{2,}/g, '-')
    .replace(/^-|-$/g, '');

const leaf = (
  code: string,
  name: string,
  level: number,
  parentCode: string,
  note?: string,
): CatalogNode => ({
  code,
  name,
  slug: makeSlug(code),
  level,
  parentCode,
  ...(note ? { note } : {}),
});

const branch = (
  code: string,
  name: string,
  level: number,
  parentCode: string | undefined,
  children: CatalogNode[],
  note?: string,
): CatalogNode => ({
  code,
  name,
  slug: makeSlug(code),
  level,
  ...(parentCode ? { parentCode } : {}),
  ...(note ? { note } : {}),
  children,
});

const createCollectedWorksBranch = (
  rootCode: string,
  title: string,
  periods: { code: string; name: string; note: string }[],
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
    branch(singleCode, '单行著作', 3, rootCode, periods.map((item) => leaf(item.code, item.name, 4, singleCode, item.note)), `按写作阶段或历史时期细分${subject}的单篇著作，方便顺着时间线观察思想展开。`),
    leaf(letterCode, '书信集、日记、函电、谈话', 3, rootCode, `收录书信、谈话、日记和函电等材料，更能看到${subject}在具体情境中的思考与回应。`),
    leaf(poetryCode, '诗词', 3, rootCode, `收录诗词、韵文或带有文学表达色彩的文本，适合从语言风格与情感线索切入。`),
    leaf(manuscriptCode, '手迹', 3, rootCode, `收录手稿、题词、墨迹及其影印本，更接近文本生成时的原始面貌。`),
    leaf(topicCode, '专题汇编', 3, rootCode, `将${subject}按某一主题重新编排，适合围绕一个问题集中查阅。`),
    leaf(quoteCode, '语录', 3, rootCode, `收录便于摘引和快速浏览的语录式材料，适合查找常被引用的表述。`),
  ]);
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

const A_BRANCH = branch('A', '马克思主义、列宁主义、毛泽东思想、邓小平理论', 1, undefined, [

  createCollectedWorksBranch('A1', '马克思、恩格斯著作', [
    { code: 'A121', name: '马克思主义形成时期（1848年以前）', note: '收录1848年以前写作的单篇著作，可用来追踪马克思主义形成前夜的理论积累。' },
    { code: 'A122', name: '革命风暴的高潮与低落时期（1848～1863年）', note: '收录1848至1863年间的单篇著作，适合把握革命风暴前后的理论应答。' },
    { code: 'A123', name: '第一国际和巴黎公社时期（1864～1872年）', note: '收录第一国际与巴黎公社时期的单篇著作，适合观察理论与工人运动实践的交织。' },
    { code: 'A124', name: '马克思主义广泛传播和各国建立社会主义政党时期（1873～1889年6月）', note: '收录1873至1889年6月间的单篇著作，适合考察马克思主义走向广泛传播的阶段。' },
    { code: 'A125', name: '第二国际时期（1889年7月～1895年）', note: '收录第二国际时期的单篇著作，适合顺着晚期脉络阅读理论传播与争论。' },
  ]),
  createCollectedWorksBranch('A2', '列宁著作', [
    { code: 'A221', name: '俄国社会民主工党形成和布尔什维克派出现时期（1904年以前）', note: '收录1904年以前的单篇著作，适合阅读列宁早期建党与革命组织思路。' },
    { code: 'A222', name: '第一次俄国革命时期（1905～1907年）', note: '收录1905至1907年的单篇著作，适合把握第一次俄国革命中的策略与判断。' },
    { code: 'A223', name: '斯托雷平反动时期和布尔什维克形成独立政党时期（1908～1912年3月）', note: '收录1908至1912年3月的单篇著作，适合观察布尔什维克独立成形的理论准备。' },
    { code: 'A224', name: '第一次世界大战以前工人运动的高涨及大战时期（1912年4月～1916年）', note: '收录1912年4月至1916年的单篇著作，适合对照大战前后的工人运动与帝国主义批判。' },
    { code: 'A225', name: '第二次俄国革命和社会主义革命时期（1917年）', note: '收录1917年的单篇著作，适合集中阅读革命关键年份的理论与实践判断。' },
    { code: 'A226', name: '帝国主义武装干涉和国内战争时期（1918～1920年）', note: '收录1918至1920年的单篇著作，适合把握战时治理、国家建设与斗争策略。' },
    { code: 'A227', name: '国民经济恢复时期（1921～1924年）', note: '收录1921至1924年的单篇著作，适合阅读恢复经济与过渡阶段的理论思考。' },
  ]),
  createCollectedWorksBranch('A3', '斯大林著作', [
    { code: 'A321', name: '十月社会主义革命及其以前（1917年及其以前）', note: '收录1917年及以前的单篇著作，适合把握斯大林在革命前后的早期论述。' },
    { code: 'A322', name: '帝国主义武装干涉和国内战争时期（1918～1920年）', note: '收录1918至1920年的单篇著作，适合考察国内战争语境下的组织与斗争思路。' },
    { code: 'A323', name: '国民经济恢复时期（1921～1925年）', note: '收录1921至1925年的单篇著作，适合阅读恢复经济与国家建设问题。' },
    { code: 'A324', name: '为实现国家工业化而斗争时期（1926～1929年）', note: '收录1926至1929年的单篇著作，适合把握工业化推进中的理论表述。' },
    { code: 'A325', name: '为实现农业集体化而斗争时期（1930～1934年）', note: '收录1930至1934年的单篇著作，适合查找农业集体化阶段的相关论述。' },
    { code: 'A326', name: '社会主义建设时期（1935～1941年5月）', note: '收录1935年至1941年5月的单篇著作，适合阅读战前社会主义建设问题。' },
    { code: 'A327', name: '苏联卫国战争时期（1941年6月～1945年）', note: '收录卫国战争时期的单篇著作，适合顺着战争背景把握动员与战略表述。' },
    { code: 'A328', name: '战后恢复和发展社会主义经济时期（1946～1953年）', note: '收录1946至1953年的单篇著作，适合观察战后恢复与经济发展阶段。' },
  ]),
  createCollectedWorksBranch('A4', '毛泽东著作', [
    { code: 'A421', name: '第一次国内革命战争以前（1924年以前）', note: '收录1924年以前的单篇著作，适合阅读毛泽东早期思想与社会观察。' },
    { code: 'A422', name: '第一次国内革命战争时期（1924～1927年7月）', note: '收录1924至1927年7月的单篇著作，适合把握第一次国内革命战争时期的论述。' },
    { code: 'A423', name: '第二次国内革命战争时期（1927年8月～1937年6月）', note: '收录1927年8月至1937年6月的单篇著作，适合阅读革命根据地时期的重要文本。' },
    { code: 'A424', name: '抗日战争时期（1937年7月～1945年8月）', note: '收录抗日战争时期的单篇著作，适合顺着统一战线与战争实践阅读相关论述。' },
    { code: 'A425', name: '第三次国内革命战争时期（1945年9月～1949年9月）', note: '收录1945年9月至1949年9月的单篇著作，适合理解解放战争阶段的判断与部署。' },
    { code: 'A426', name: '社会主义革命和社会主义建设时期（1949年10月～1976年）', note: '收录新中国成立后至1976年的单篇著作，适合阅读社会主义革命与建设阶段的文本。' },
  ]),
  branch('A49', '邓小平著作', 2, 'A', [
    leaf('A491', '选集、文集', 3, 'A49', '收录邓小平著作的综合性选集与文集，适合从整体脉络把握其重要表述。'),
    leaf('A499', '选读', 3, 'A49', '收录邓小平著作的导读性选读本，适合从重点篇章进入。'),
    leaf('A492', '单行著作', 3, 'A49', '收录邓小平单篇或单册著作，适合按具体题目查找原文。'),
    leaf('A493', '书信集、日记、函电、谈话', 3, 'A49', '收录书信、谈话、函电等材料，更贴近实际语境中的表述与判断。'),
    leaf('A495', '手迹', 3, 'A49', '收录手稿、题词与相关影印材料，适合做史料性查阅。'),
    leaf('A496', '专题汇编', 3, 'A49', '围绕具体主题汇编邓小平著作，适合按问题集中查阅。'),
    leaf('A498', '语录', 3, 'A49', '收录便于摘引的语录式材料，适合快速检索常用表述。'),
  ]),
  branch('A5', '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平著作汇编', 2, 'A', [
    branch('A56', '专题汇编', 3, 'A5', [
      leaf('A561', '论马克思主义、列宁主义', 4, 'A56', '把相关著作按马克思主义、列宁主义主题重组，适合按理论总纲集中阅读。'),
      leaf('A562', '论共产主义运动、共产党、青年团', 4, 'A56', '围绕共产主义运动、政党与青年团问题汇编材料，适合按组织与运动主题查阅。'),
      leaf('A563', '论哲学', 4, 'A56', '围绕哲学问题编成的汇编，适合集中阅读世界观、方法论与辩证法议题。'),
      leaf('A564', '论社会、政治、法律', 4, 'A56', '围绕社会结构、政治问题和法律议题编成的汇编，适合按社会政治主题查阅。'),
      leaf('A565', '论军事', 4, 'A56', '围绕战争、军队和军事建设问题编成的汇编，适合集中阅读军事主题。'),
      leaf('A566', '论经济', 4, 'A56', '围绕经济理论、经济建设与经济问题编成的汇编，适合按经济主题检索。'),
      leaf('A567', '论文化、教育、体育', 4, 'A56', '围绕文化、教育与体育问题编成的汇编，适合按文教主题集中阅读。'),
      leaf('A568', '论语言、文字', 4, 'A56', '围绕语言文字问题编成的汇编，适合检索相关论述。'),
      leaf('A5691', '论文艺', 4, 'A56', '围绕文艺问题编成的汇编，适合查找文学艺术方面的相关表述。'),
      leaf('A5692', '论历史、地理', 4, 'A56', '围绕历史与地理问题编成的汇编，适合查找相关论述。'),
      leaf('A5693', '论科学、技术', 4, 'A56', '围绕科学技术问题编成的汇编，适合做专题阅读。'),
      leaf('A5694', '论医药、卫生', 4, 'A56', '围绕医药卫生问题编成的汇编，适合检索相关主题。'),
      leaf('A5695', '论农业技术', 4, 'A56', '围绕农业技术问题编成的汇编，适合按农业专题集中查阅。'),
      leaf('A5696', '论工业、交通', 4, 'A56', '围绕工业与交通问题编成的汇编，适合按工业和运输主题阅读。'),
    ], '将多位作者关于同一主题的著作重新组合，适合从问题意识而非人物顺序进入。'),
    leaf('A58', '语录', 3, 'A5', '收录多位作者综合性的语录材料，适合快速对照不同人物的表述。'),
  ]),
  branch('A7', '马克思、恩格斯、列宁、斯大林、毛泽东、邓小平生平和传记', 2, 'A', [
    createBiographyBranch('A71', '马克思'),
    createBiographyBranch('A72', '恩格斯'),
    createBiographyBranch('A73', '列宁'),
    createBiographyBranch('A74', '斯大林'),
    createBiographyBranch('A75', '毛泽东'),
    createBiographyBranch('A76', '邓小平'),
  ], '这一分支按人物展开生平、传记与纪念资料，适合沿人物线索进入A类文献。'),
  branch('A8', '马克思主义、列宁主义、毛泽东思想、邓小平理论的学习和研究', 2, 'A', [
    branch('A81', '马克思主义的学习和研究', 3, 'A8', [
      branch('A811', '马克思、恩格斯著作的学习和研究', 4, 'A81', [
        leaf('A811.1', '选集、文集', 5, 'A811', '收录关于马克思、恩格斯选集和文集的导读、研究与学习材料，适合从整理本入门。'),
        leaf('A811.2', '单行著作', 5, 'A811', '收录围绕马克思、恩格斯单篇或单册著作的学习材料，适合按具体文本深入阅读。'),
        leaf('A811.3', '书信集、日记、函电、谈话', 5, 'A811', '收录围绕书信、谈话与函电材料的学习研究，适合从史料层面理解思想形成。'),
        leaf('A811.4', '诗词', 5, 'A811', '收录对相关诗词文本的学习研究，适合从语言与修辞角度切入。'),
        leaf('A811.5', '手迹', 5, 'A811', '收录围绕手稿与手迹的学习研究，适合作为版本与史料性阅读的补充。'),
        leaf('A811.6', '专题汇编', 5, 'A811', '将学习研究材料按专题重组，适合围绕某个问题集中查阅。'),
        leaf('A811.8', '语录', 5, 'A811', '收录便于摘引的学习材料与语录式整理，适合快速检索观点。'),
      ], '围绕原著本身的学习与研究，适合从文本层面进入马克思主义的形成过程。'),
      leaf('A813', '书目、索引', 4, 'A81', '收录马克思主义学习研究相关的书目、索引与检索工具，适合作为入门与查找入口。'),
    ], '对马克思主义理论及其发展史的学习研究归入此类，也适合做概览性阅读。'),
    branch('A82', '列宁主义的学习和研究', 3, 'A8', [
      branch('A821', '列宁著作的学习和研究', 4, 'A82', [
        leaf('A821.1', '选集、文集', 5, 'A821', '围绕列宁选集、文集的学习研究材料，适合从整理本进入列宁主义。'),
        leaf('A821.2', '单行著作', 5, 'A821', '围绕列宁单篇著作的学习研究材料，适合按具体文本深入。'),
        leaf('A821.3', '书信集、日记、函电、谈话', 5, 'A821', '围绕列宁书信、函电和谈话的学习研究，适合从历史场景理解其判断。'),
        leaf('A821.5', '手迹', 5, 'A821', '围绕手稿、手迹的学习研究，适合作为史料阅读的补充。'),
        leaf('A821.6', '专题汇编', 5, 'A821', '将列宁著作学习材料按专题重组，适合围绕某个问题集中查阅。'),
        leaf('A821.8', '语录', 5, 'A821', '收录列宁相关语录式学习材料，适合快速摘引与检索。'),
      ], '围绕列宁原著的学习研究材料归入此类，适合沿文本把握列宁主义。'),
      leaf('A823', '书目、索引', 4, 'A82', '收录列宁主义学习研究的书目与索引工具，适合搭建检索路径。'),
    ], '对列宁主义理论及其发展问题的学习研究归入此类。'),
    branch('A83', '斯大林思想的学习和研究', 3, 'A8', [
      branch('A831', '斯大林著作的学习和研究', 4, 'A83', [
        leaf('A831.1', '选集、文集', 5, 'A831', '围绕斯大林选集、文集的学习研究材料，适合从整理本进入。'),
        leaf('A831.2', '单行著作', 5, 'A831', '围绕斯大林单篇著作的学习研究材料，适合按文本逐篇阅读。'),
        leaf('A831.3', '书信集、日记、函电、谈话', 5, 'A831', '围绕斯大林书信、函电与谈话的学习研究，适合从语境理解相关论述。'),
        leaf('A831.5', '手迹', 5, 'A831', '围绕斯大林手稿手迹的学习研究，适合作为史料补充。'),
        leaf('A831.6', '专题汇编', 5, 'A831', '将斯大林著作学习材料按专题汇编，适合问题导向地集中查阅。'),
        leaf('A831.8', '语录', 5, 'A831', '收录斯大林相关语录式学习材料，适合快速检索观点。'),
      ], '围绕斯大林原著的学习研究材料归入此类。'),
      leaf('A833', '书目、索引', 4, 'A83', '收录斯大林思想学习研究的书目与索引，适合建立基础检索入口。'),
    ], '对斯大林思想的学习研究归入此类。'),
    branch('A84', '毛泽东思想的学习和研究', 3, 'A8', [
      branch('A841', '毛泽东著作的学习和研究', 4, 'A84', [
        leaf('A841.1', '选集、文集', 5, 'A841', '围绕毛泽东选集、文集的学习研究材料，适合从经典整理本进入。'),
        leaf('A841.2', '单行著作', 5, 'A841', '围绕毛泽东单篇著作的学习研究材料，适合按具体文本细读。'),
        leaf('A841.3', '书信集、日记、函电、谈话', 5, 'A841', '围绕书信、谈话和函电的学习研究，适合补足文本背后的历史情境。'),
        leaf('A841.4', '诗词', 5, 'A841', '围绕毛泽东诗词的学习研究材料，适合从文学语言与政治表达的交叉处阅读。'),
        leaf('A841.5', '手迹', 5, 'A841', '围绕手稿和手迹的学习研究材料，适合作为版本、史料与传播研究的入口。'),
        leaf('A841.6', '专题汇编', 5, 'A841', '将毛泽东著作学习材料按专题重组，适合围绕某一问题集中查阅。'),
        leaf('A841.8', '语录', 5, 'A841', '收录毛泽东著作相关的语录式学习材料，适合快速摘引与检索。'),
      ], '围绕毛泽东原著的学习与研究材料归入此类。'),
      leaf('A843', '书目、索引', 4, 'A84', '收录毛泽东思想学习研究的书目与索引，适合作为查找与入门工具。'),
    ], '对毛泽东思想的学习研究归入此类。'),
    branch('A849', '邓小平理论的学习和研究', 3, 'A8', [
      branch('A849.1', '邓小平著作的学习和研究', 4, 'A849', [
        leaf('A849.11', '选集、文集', 5, 'A849.1', '围绕邓小平选集、文集的学习研究材料，适合从整理本进入邓小平理论。'),
        leaf('A849.12', '单行著作', 5, 'A849.1', '围绕邓小平单篇著作的学习研究材料，适合按具体文本细读。'),
        leaf('A849.13', '书信集、日记、函电、谈话', 5, 'A849.1', '围绕书信、函电和谈话的学习研究材料，适合从历史语境理解相关论述。'),
        leaf('A849.15', '手迹', 5, 'A849.1', '围绕手迹和手稿的学习研究材料，适合作为史料性补充阅读。'),
        leaf('A849.16', '专题汇编', 5, 'A849.1', '将邓小平著作学习材料按专题重组，适合围绕某一问题集中阅读。'),
        leaf('A849.18', '书目、索引', 5, 'A849.1', '收录邓小平著作学习研究的书目与索引，适合快速建立检索路径。'),
      ], '围绕邓小平原著的学习研究材料归入此类。'),
      leaf('A85', '著作汇编的学习和研究', 4, 'A849', '围绕多位作者著作汇编本身的学习与研究归入此类，适合研究汇编体系与编排逻辑。'),
    ], '对邓小平理论的学习研究归入此类。'),
  ], 'A8 收拢关于原著学习、思想发展史与研究工具的文献，是从原著进入研究的总入口。'),
], 'A 类是全馆最靠前的一排书架，收拢经典著作、传记与学习研究材料，适合顺着人物、文体或研究脉络进入。');

export const catalogRoots: CatalogNode[] = [
  A_BRANCH,
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

const flattenCatalogNodes = (nodes: CatalogNode[]): CatalogNode[] =>
  nodes.flatMap((node) => [node, ...(node.children ? flattenCatalogNodes(node.children) : [])]);

export const flatCatalogNodes = flattenCatalogNodes(catalogRoots);

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

export function getDescendantCatalogCodes(code?: string | null): string[] {
  const node = getCatalogNodeByCode(code);
  if (!node) return [];
  return [node.code, ...(node.children ? node.children.flatMap((child) => getDescendantCatalogCodes(child.code)) : [])];
}

export function getTopLevelCatalogCode(code?: string | null) {
  return getCatalogPath(code)[0]?.code;
}

export function isCatalogDescendant(targetCode: string, ancestorCode: string) {
  return getCatalogPath(targetCode).some((node) => node.code === ancestorCode);
}
