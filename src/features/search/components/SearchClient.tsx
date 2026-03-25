import './search-client.css';
import { useEffect, useMemo, useState } from 'react';
import type { SearchItem, SearchItemType } from '@/features/search/helpers/buildSearchIndex';

type FilterType = 'all' | SearchItemType;

interface Props {
  items: SearchItem[];
  initialQuery?: string;
}

const FILTERS: { label: string; value: FilterType }[] = [
  { label: '全部', value: 'all' },
  { label: '文章', value: 'post' },
  { label: '书架', value: 'shelf' },
  { label: '馆藏', value: 'catalog' },
  { label: '标签', value: 'tag' },
  { label: '页面', value: 'page' },
  { label: '游戏', value: 'game' },
];

function normalizeText(value: string) {
  return value.toLowerCase().trim();
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function highlightText(value: string, query: string) {
  const q = normalizeText(query);
  if (!q) return value;
  const parts = value.split(new RegExp(`(${escapeRegExp(q)})`, 'ig'));
  return parts.map((part, index) => (
    part.toLowerCase() === q ? <mark key={`${part}-${index}`}>{part}</mark> : part
  ));
}

function buildSnippet(item: SearchItem, query: string) {
  const body = (item.body || '').replace(/\s+/g, ' ').trim();
  if (!body) return null;
  const normalizedBody = body.toLowerCase();
  const q = normalizeText(query);
  const index = q ? normalizedBody.indexOf(q) : -1;
  if (index < 0) return body.slice(0, 88) + (body.length > 88 ? '…' : '');
  const start = Math.max(0, index - 28);
  const end = Math.min(body.length, index + q.length + 42);
  const prefix = start > 0 ? '…' : '';
  const suffix = end < body.length ? '…' : '';
  return `${prefix}${body.slice(start, end)}${suffix}`;
}

function scoreItem(item: SearchItem, query: string) {
  const q = normalizeText(query);
  if (!q) return item.type === 'post' ? 12 : item.type === 'shelf' ? 10 : 8;

  const title = item.title.toLowerCase();
  const meta = item.meta.toLowerCase();
  const keywords = item.keywords.toLowerCase();
  const body = (item.body || '').toLowerCase();

  let score = 0;

  if (title === q) score += 200;
  if (title.startsWith(q)) score += 120;
  if (title.includes(q)) score += 80;
  if (keywords.includes(q)) score += 55;
  if (meta.includes(q)) score += 35;
  if (body.includes(q)) score += 20;

  const queryTerms = q.split(/\s+/).filter(Boolean);
  for (const term of queryTerms) {
    if (title.includes(term)) score += 18;
    if (keywords.includes(term)) score += 12;
    if (meta.includes(term)) score += 8;
    if (body.includes(term)) score += 4;
  }

  return score;
}

const GROUP_LABELS: Record<SearchItemType, string> = {
  post: '文章',
  shelf: '专题书架',
  catalog: '馆藏目录',
  tag: '标签',
  page: '页面',
  game: '游戏',
};

export default function SearchClient({ items, initialQuery = '' }: Props) {
  const [query, setQuery] = useState(initialQuery);
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (query) {
      params.set('q', query);
    } else {
      params.delete('q');
    }
    params.delete('focus');
    const next = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ''}`;
    window.history.replaceState({}, '', next);
  }, [query]);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('focus') === '1') {
      const input = document.querySelector('[data-search-input]');
      if (input instanceof HTMLInputElement) input.focus();
    }
  }, []);

  const matched = useMemo(() => {
    return items
      .map((item) => ({ item, score: scoreItem(item, query) }))
      .filter(({ item, score }) => score > 0 && (activeFilter === 'all' || item.type === activeFilter))
      .sort((a, b) => b.score - a.score || a.item.title.localeCompare(b.item.title, 'zh-CN'))
      .slice(0, 1500)
      .map(({ item }) => item);
  }, [activeFilter, items, query]);

  const grouped = useMemo(() => {
    const map = new Map<SearchItemType, SearchItem[]>();
    for (const item of matched) {
      const bucket = map.get(item.type) ?? [];
      bucket.push(item);
      map.set(item.type, bucket);
    }
    return map;
  }, [matched]);

  const quickQueries = ['TP', 'G2', '图书馆', '建站', '阅读'];
  const stateText = !query && activeFilter === 'all'
    ? '输入关键词或分类号开始搜索。'
    : `找到 ${matched.length} 条结果 · 当前范围：${activeFilter === 'all' ? '全部' : FILTERS.find((item) => item.value === activeFilter)?.label || activeFilter}`;

  return (
    <>
      <section className="search-shell">
        <div className="search-panel card-surface">
          <div className="search-head">
            <label className="search-label" htmlFor="site-search">站内搜索</label>
            <p className="search-note">可以搜索文章、分类、标签、页面、游戏条目和专题书架。目前最多支持显示1500条搜索结果。桌面端可按 <kbd>⌘/Ctrl + K</kbd> 或 <kbd>/</kbd>。</p>
          </div>

          <div className="search-box-row">
            <input
              id="site-search"
              data-search-input
              type="search"
              placeholder="试试 TP、Astro、图书馆、建站……"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
            <button type="button" className="pill-link clear-btn" onClick={() => setQuery('')}>清空</button>
          </div>

          <div className="filter-row" aria-label="检索范围">
            {FILTERS.map((filter) => (
              <button
                key={filter.value}
                type="button"
                className={`filter-chip${activeFilter === filter.value ? ' is-active' : ''}`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="quick-row">
            {quickQueries.map((item) => (
              <button key={item} type="button" className="quick-chip" onClick={() => setQuery(item)}>{item}</button>
            ))}
          </div>
        </div>

        <aside className="search-side card-surface">
          <p className="side-title">搜索建议</p>
          <ul>
            <li>输入分类号，比如 <code>TP</code>、<code>G2</code></li>
            <li>输入关键词，比如 <code>Astro</code>、<code>图书馆</code></li>
            <li>输入专题名，比如 <code>建站与整理</code></li>
          </ul>
        </aside>
      </section>

      <section className="result-panel card-surface">
        <div className="result-head">
          <p className="result-title">检索结果</p>
          <p className="result-state">{stateText}</p>
        </div>
        <div className="result-groups">
          {matched.length ? Array.from(grouped.entries()).map(([type, entries]) => (
            <section key={type} className="result-group-block">
              <div className="result-group-head">
                <strong>{GROUP_LABELS[type]}</strong>
                <span>{entries.length}</span>
              </div>
              <div className="result-list">
                {entries.map((item) => {
                  const snippet = buildSnippet(item, query);
                  return (
                    <a key={`${item.type}:${item.href}:${item.title}`} className="result-card" href={item.href}>
                      <div className="result-card-head">
                        <span className="result-group">{item.group}</span>
                        <strong>{highlightText(item.title, query)}</strong>
                      </div>
                      <p>{highlightText(item.meta, query)}</p>
                      {snippet ? <span className="result-snippet">{highlightText(snippet, query)}</span> : null}
                    </a>
                  );
                })}
              </div>
            </section>
          )) : (
            <div className="empty-state">
              <p>没有找到结果。</p>
              <span>换个关键词、分类号或标签再试试。</span>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
