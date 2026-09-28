import { TAG_LABELS, filterExhibits, findPageMatches, findSnippet } from './search.mjs';

const translations = {
  zh: {
    title: 'THS 82 · 图表速查',
    description: '中英对照检索香港《主题性住户统计调查第82号报告书》的30项图表及主要数字，页码以英文版为准。',
    eyebrow: '政府统计处 · 主题性住户统计调查',
    brand: '图表速查',
    reportTopic: '资讯科技使用情况和普及程度',
    surveyPeriod: '2024 年 4—8 月',
    indexOverline: '图表索引',
    indexTitle: '找到那张表，回到原文',
    searchLabel: '搜索图表、页码或数字',
    searchPlaceholder: '表号、关键词或数据：Table 3.10 / 流动支付 / 65.6',
    shortcutTitle: '按 Ctrl 或 Command 加 K 搜索',
    filtersLabel: '筛选图表',
    sectionLabel: '章节',
    sectionAria: '按章节筛选',
    allSections: '全部章节',
    subsectionLabel: '小标题',
    subsectionAria: '按报告小标题筛选',
    allSubsections: '全部小标题',
    typeLabel: '形式',
    typeAria: '按图表形式筛选',
    allTypes: '全部形式',
    table: '表格',
    chart: '图表',
    unnumberedTable: '未编号表',
    keyFigures: '主要数字',
    matchingPreviews: '匹配图表编号 / Matching exhibits',
    exhibitPages: n => `共 ${n} 页`,
    previewEmpty: '没有符合当前筛选条件的图表。',
    topicLabel: '按统计内容筛选（多选取交集）',
    topicAria: '按主题筛选',
    allTopics: '全部主题',
    unitLabel: '对象',
    unitAria: '按统计对象筛选',
    allUnits: '全部对象',
    household: '住户',
    person10: '10 岁及以上',
    person15: '15 岁及以上',
    loading: '加载图表中…',
    clearFilters: '清除筛选',
    detailAria: '选中的图表详情',
    detailLoading: '正在整理报告中的图表…',
    sourceLabel: '资料来源：',
    sourceNote: '中英文图表标题依照官方报告，页码以英文版为准。重点和解读提示为整理说明，未编号内容的索引标识由本站添加。',
    section1: '1 · 主要数字',
    section2: '2 · 互联网和个人电脑在住户中的普及程度',
    section3: '3 · 个人使用资讯科技的情况',
    section4: '4 · 详细统计数字',
    section6: '6 · 注释',
    itemCount: n => `${n} 项`,
    resultCount: (shown, total) => `显示 ${shown} / ${total} 项`,
    queryCount: (shown, pages) => `${shown} 项图表匹配${pages ? ` · ${pages} 个原报告页` : ''}`,
    pageRef: label => `第 ${label} 页`,
    pageHit: page => `报告第 ${page} 页 ↗`,
    pageResults: '报告全文命中的页面',
    viewItem: '查看',
    noResults: '没有找到匹配的图表',
    noResultsHint: '试试表号（如 3.10）、更短的关键词，或清除筛选条件。',
    previewTitle: '英文报告页面预览',
    prevPage: '上一页',
    nextPage: '下一页',
    previewProgress: (page, start, end) => `第 ${page} 页${end > start ? ` / ${start}–${end} 页` : ''}`,
    previewImage: page => `原报告第 ${page} 页`,
    openPdfPage: page => `打开原报告第 ${page} 页的 PDF`,
    previewHint: '页码以英文版为准；请在 PDF 中放大读取细小数字。',
    openThisPage: '打开这一页的 PDF ↗',
    openReport: ref => `打开英文报告${ref}`,
    copyCitation: '复制图表引用',
    keyPointLabel: '这张图表的重点 / Key point',
    roleLabel: '在报告中的作用 / Role in the report',
    variables: '变量与口径 / Variables and definitions',
    unitField: '统计对象 / Population',
    outcomeField: '结果变量 / Measures',
    groupingField: '分组与时间 / Grouping / time',
    denominatorField: '分母与统计表达 / Denominator',
    caution: '解读时注意 / Interpretation note',
    keyFiguresNote: '“Key figures 1–4” 是本索引为未编号块添加的标识；报告原文不编号。',
    periodsNote: '“Survey periods” 在报告中未编号。',
    reportPage: page => `原报告第 ${page} 页`,
    reportPageBadge: '报告页面',
    reportPageSubline: q => q ? `在报告正文中检索到“${q}”` : '查看报告原文',
    related: '本页相关图表',
    reportExcerpt: '报告文字片段（英文）：',
    noSelection: '暂时没有匹配项',
    noSelectionHint: '清除部分条件后，可以重新查看对应的图表和原报告页。',
    citationCopied: '图表引用已复制',
    citationFailed: '无法自动复制，请使用浏览器复制。',
    loadFailed: '无法载入索引',
    loadFailedTitle: '报告索引暂时无法载入',
    loadFailedHint: '请刷新此页面重试。',
    pdfFallback: '原报告 PDF 可通过页面资源继续打开。'
  },
  en: {
    title: 'THS 82 · Evidence Finder',
    description: 'Search 30 tables, charts and key figures in Hong Kong Thematic Household Survey Report No. 82 in English or Chinese, with direct links to source pages.',
    eyebrow: 'C&SD · THEMATIC HOUSEHOLD SURVEY',
    brand: 'Evidence Finder',
    reportTopic: 'Information Technology Usage and Penetration',
    surveyPeriod: 'April–August 2024',
    indexOverline: 'EVIDENCE INDEX',
    indexTitle: 'Find the table. Check the source.',
    searchLabel: 'Search figures, pages or numbers',
    searchPlaceholder: 'Table number, topic or figure: Table 3.10 / mobile payments / 65.6',
    shortcutTitle: 'Press Ctrl or Command plus K to search',
    filtersLabel: 'Filter tables and charts',
    sectionLabel: 'Section',
    sectionAria: 'Filter by section',
    allSections: 'All sections',
    subsectionLabel: 'Subsection',
    subsectionAria: 'Filter by report subsection',
    allSubsections: 'All subsections',
    typeLabel: 'Format',
    typeAria: 'Filter by format',
    allTypes: 'All formats',
    table: 'Table',
    chart: 'Chart',
    unnumberedTable: 'Unnumbered table',
    keyFigures: 'Key figures',
    matchingPreviews: 'Matching exhibits',
    exhibitPages: n => `${n} pages`,
    previewEmpty: 'No exhibits match the current filters.',
    topicLabel: 'Evidence filters (multi-select · matches all)',
    topicAria: 'Filter by topic',
    allTopics: 'All topics',
    unitLabel: 'Population',
    unitAria: 'Filter by population',
    allUnits: 'All populations',
    household: 'Households',
    person10: 'Aged 10 and over',
    person15: 'Aged 15 and over',
    loading: 'Loading exhibits…',
    clearFilters: 'Clear filters',
    detailAria: 'Selected exhibit details',
    detailLoading: 'Loading report exhibits…',
    sourceLabel: 'Source: ',
    sourceNote: 'Titles follow the official English and Chinese reports; page references use the English PDF. Key points, interpretation notes and labels for unnumbered blocks are editorial.',
    section1: '1 · Key Figures',
    section2: '2 · Internet and PC Penetration in Households',
    section3: '3 · Usage of IT by Individuals',
    section4: '4 · Detailed Statistics',
    section6: '6 · Explanatory Notes',
    itemCount: n => `${n} items`,
    resultCount: (shown, total) => `Showing ${shown} of ${total} items`,
    queryCount: (shown, pages) => `${shown} exhibits match${pages ? ` · ${pages} report pages` : ''}`,
    pageRef: label => `p. ${label}`,
    pageHit: page => `Report page ${page} ↗`,
    pageResults: 'MATCHES IN THE REPORT',
    viewItem: 'View',
    noResults: 'No matching tables or charts',
    noResultsHint: 'Try a table number (such as 3.10), a shorter keyword, or clear the filters.',
    previewTitle: 'SOURCE PAGE PREVIEW',
    prevPage: 'Previous page',
    nextPage: 'Next page',
    previewProgress: (page, start, end) => `Page ${page}${end > start ? ` / pp. ${start}–${end}` : ''}`,
    previewImage: page => `Report page ${page}`,
    openPdfPage: page => `Open report page ${page} in the PDF`,
    previewHint: 'Use the PDF to zoom in and read small numbers.',
    openThisPage: 'Open this page in the PDF ↗',
    openReport: ref => `Open the report, ${ref}`,
    copyCitation: 'Copy exhibit citation',
    keyPointLabel: 'KEY POINT',
    roleLabel: 'Role in the report',
    variables: 'Variables and definitions',
    unitField: 'POPULATION / UNIT',
    outcomeField: 'MEASURES',
    groupingField: 'GROUPING / TIME',
    denominatorField: 'DENOMINATOR',
    caution: 'INTERPRETATION NOTE',
    keyFiguresNote: '“Key figures 1–4” are index labels for unnumbered blocks; the report does not number them.',
    periodsNote: '“Survey periods” is unnumbered in the report.',
    reportPage: page => `Report page ${page}`,
    reportPageBadge: 'REPORT PAGE',
    reportPageSubline: q => q ? `Text in the report matching “${q}”` : 'View the original report page',
    related: 'Exhibits on this page',
    reportExcerpt: 'REPORT EXCERPT:',
    noSelection: 'No results at the moment',
    noSelectionHint: 'Clear some filters to view exhibits and their source pages.',
    citationCopied: 'Exhibit citation copied',
    citationFailed: 'Could not copy automatically; please copy it in your browser.',
    loadFailed: 'Could not load the index',
    loadFailedTitle: 'The report index is temporarily unavailable',
    loadFailedHint: 'Please refresh this page.',
    pdfFallback: 'The report PDF is still available in the page assets.'
  }
};

const sectionKeys = {
  '1. Key Figures': 'section1',
  '2. Internet and Personal Computer Penetration in Households': 'section2',
  '3. Usage of Information Technology by Individuals': 'section3',
  '4. Detailed Statistics': 'section4',
  '6. Explanatory Notes': 'section6'
};
const $ = selector => document.querySelector(selector);
const el = {
  gallery: $('#preview-gallery'), previewCount: $('#preview-count'), previews: $('#matching-previews'),
  search: $('#search-input'), form: $('#search-form'), results: $('#results'),
  resultCount: $('#result-count'), totalCount: $('#total-count'), detail: $('#detail-content'),
  section: $('#section-filter'), subsection: $('#subsection-filter'), type: $('#type-filter'), topic: $('#topic-filter'),
  reset: $('#reset-filters'), toast: $('#toast'), detailPanel: $('#detail-panel')
};
let language = 'zh';
try { if (localStorage.getItem('ths82-language') === 'en') language = 'en'; } catch {}
const t = (key, ...args) => {
  const value = translations[language][key];
  return typeof value === 'function' ? value(...args) : value;
};
const escapeHTML = value => String(value ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const slug = id => String(id).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const pdfLink = page => `./report.pdf#page=${page}`;
const imageLink = page => `./pages/page-${String(page).padStart(2, '0')}.jpg`;
const pageRef = item => t('pageRef', item.pageLabel);
const sectionName = section => sectionKeys[section] ? t(sectionKeys[section]) : section;
const titleFor = item => item.title;
const fieldFor = (item, key) => language === 'zh' ? item[`${key}Zh`] : item[key];
const tagLabel = tag => language === 'zh' ? TAG_LABELS[tag] : tag;
const kindLabel = item => item.kind === 'Chart' ? t('chart') : item.kind === 'Table' ? t('table') : item.id.startsWith('Key figures') ? t('keyFigures') : t('unnumberedTable');
let items = [], pages = [], shown = [], pageHits = [], active = {kind: 'item', id: null}, previewPage = 1, toastTimeout;

function translateStatic() {
  document.documentElement.lang = language === 'zh' ? 'zh-Hans' : 'en';
  document.title = t('title');
  $('meta[name="description"]').content = t('description');
  document.querySelectorAll('[data-i18n]').forEach(node => { node.textContent = t(node.dataset.i18n); });
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => { node.placeholder = t(node.dataset.i18nPlaceholder); });
  document.querySelectorAll('[data-i18n-aria-label]').forEach(node => { node.setAttribute('aria-label', t(node.dataset.i18nAriaLabel)); });
  document.querySelectorAll('[data-i18n-title]').forEach(node => { node.title = t(node.dataset.i18nTitle); });
  document.querySelectorAll('[data-language]').forEach(button => {
    button.setAttribute('aria-pressed', String(button.dataset.language === language));
  });
  for (const option of el.section.options) if (option.value !== 'all') option.textContent = sectionName(option.value);
  fillSubsections();
  renderTopics();
  if (items.length) el.totalCount.textContent = t('itemCount', items.length);
}
function setLanguage(next) {
  if (!translations[next] || next === language) return;
  language = next;
  try { localStorage.setItem('ths82-language', next); } catch {}
  translateStatic();
  if (!items.length) return;
  renderResults();
  if (active.kind === 'item') renderDetail(items.find(item => item.id === active.id));
  else if (active.kind === 'page') renderPageDetail(active.page);
  else renderNoSelection();
}
const selectedTopics = new Set();
function fillSubsections() {
  const current = el.subsection.value;
  el.subsection.replaceChildren(new Option(t('allSubsections'), 'all'));
  const seen = new Set();
  for (const item of items) {
    if (el.section.value !== 'all' && item.section !== el.section.value) continue;
    if (seen.has(item.subsection)) continue;
    seen.add(item.subsection);
    const prefix = el.section.value === 'all' ? `${item.section.match(/^\d+/)?.[0] || ''} · ` : '';
    el.subsection.add(new Option(prefix + (language === 'zh' ? item.subsectionTitleZh : item.subsectionTitle), item.subsection));
  }
  el.subsection.value = seen.has(current) ? current : 'all';
}
function renderTopics() {
  const groups = [["1. 统计对象与适用范围 / Population", "1. Population and scope", ["Households", "Individuals", "Persons aged 10+", "Persons aged 15+", "Households with Internet", "Households with PC", "Households with PC online", "Internet users", "PC owners", "Smartphone owners"]], ["2. 核心指标 / Measures", "2. Core measures", ["With Internet access at home", "With PC at home", "With PC at home connected to the Internet", "Had used the Internet", "Had knowledge of using PC", "Had used PC", "Had a smartphone", "Had a mobile phone (including smartphone and non-smartphone)", "Had made online purchases for personal matters", "Had used mobile payments", "Had carried out security measures for PCs"]], ["3. 细项与条件追问 / Details", "3. Details and conditional follow-ups", ["Devices connected to the Internet at home", "Web devices used for Internet access", "Type of PC at home", "Number of PCs at home", "Number of smartphones owned", "Internet purposes", "Type of security measures", "PC connection via fixed broadband", "Reason without fixed broadband"]], ["4. 社会人口分组 / Breakdown", "4. Socio-demographic breakdown", ["Age", "Sex", "Education", "Economic activity status", "Monthly household income", "Housing"]]];
  const chip = tag => `<button type="button" class="topic-chip" data-topic="${escapeHTML(tag)}" aria-pressed="${selectedTopics.has(tag)}">${escapeHTML(tagLabel(tag))}</button>`;
  el.topic.innerHTML = `<button type="button" class="topic-chip" data-topic="all" aria-pressed="${selectedTopics.size === 0}">${escapeHTML(t('allTopics'))}</button>` + groups.map(([zh,en,tags]) => `<div class="topic-group" role="group" aria-label="${language === 'zh' ? zh : en}"><span class="topic-group-title">${language === 'zh' ? zh : en}</span>${tags.filter(tag => items.some(item => item.tags.includes(tag))).map(chip).join('')}</div>`).join('');
}
function filters() {
  return {query: el.search.value.trim(), section: el.section.value, subsection: el.subsection.value, type: el.type.value, topics: [...selectedTopics]};
}
function filtersActive() {
  const f = filters();
  return Boolean(f.query) || f.section !== 'all' || f.subsection !== 'all' || f.type !== 'all' || f.topics.length > 0;
}
function fillOptions() {
  for (const section of new Set(items.map(item => item.section))) el.section.add(new Option(sectionName(section), section));
  fillSubsections();
  renderTopics();
  el.totalCount.textContent = t('itemCount', items.length);
}
function message(value) {
  clearTimeout(toastTimeout);
  el.toast.textContent = value;
  el.toast.classList.add('show');
  toastTimeout = setTimeout(() => el.toast.classList.remove('show'), 2200);
}
function updateHash(hash) {
  if (location.hash !== `#${hash}`) history.replaceState(null, '', `#${hash}`);
}
function chooseItem(id, clicked = false) {
  const found = items.find(item => item.id === id);
  if (!found) return;
  active = {kind: 'item', id};
  previewPage = found.page;
  updateHash(slug(id));
  markSelected();
  renderDetail(found);
  if (clicked && matchMedia('(max-width: 800px)').matches) el.detailPanel.scrollIntoView({behavior: 'smooth', block: 'start'});
}
function choosePage(page, clicked = false) {
  active = {kind: 'page', page};
  previewPage = page;
  updateHash(`page-${page}`);
  markSelected();
  renderPageDetail(page);
  if (clicked && matchMedia('(max-width: 800px)').matches) el.detailPanel.scrollIntoView({behavior: 'smooth', block: 'start'});
}
function markSelected() {
  [...el.results.querySelectorAll('[data-id]'), ...el.gallery.querySelectorAll('[data-id]')].forEach(node => {
    const selected = active.kind === 'item' && node.dataset.id === active.id;
    node.classList.toggle('active', selected);
    node.setAttribute('aria-pressed', String(selected));
  });
  el.results.querySelectorAll('[data-page]').forEach(node => {
    const selected = active.kind === 'page' && Number(node.dataset.page) === active.page;
    node.classList.toggle('active', selected);
    node.setAttribute('aria-pressed', String(selected));
  });
}
function highlight(value, term) {
  const content = String(value ?? ''), needle = String(term ?? '').toLowerCase();
  const at = content.toLowerCase().indexOf(needle);
  if (!needle || at < 0) return escapeHTML(content);
  return escapeHTML(content.slice(0, at)) + '<mark>' + escapeHTML(content.slice(at, at + needle.length)) + '</mark>' + escapeHTML(content.slice(at + needle.length));
}
function itemCard(item) {
  const isChart = item.kind === 'Chart', tags = item.tags.slice(0, 3), title = titleFor(item);
  return `<button type="button" class="item-card" data-id="${escapeHTML(item.id)}" aria-pressed="false" aria-label="${escapeHTML(t('viewItem'))} ${escapeHTML(item.id)}${language === 'zh' ? '，' : ', '}${escapeHTML(title)}">
    <span class="card-top"><span class="card-id ${isChart ? 'chart' : ''}">${escapeHTML(item.id)}</span><span class="page-chip">${escapeHTML(pageRef(item))}</span></span>
    <span class="card-title" lang="en">${escapeHTML(title)}</span>
    <span class="card-summary">${escapeHTML(fieldFor(item, 'keyPoint'))}</span>
    <span class="card-footer"><span class="micro-tag">${kindLabel(item)}</span>${tags.map(tag => `<span class="micro-tag">${escapeHTML(tagLabel(tag))}</span>`).join('')}</span>
  </button>`;
}
function renderMatchingPreviews() {
  el.previewCount.textContent = String(shown.length);
  el.gallery.innerHTML = shown.map(item => `<button type="button" class="exhibit-preview" data-id="${escapeHTML(item.id)}" aria-pressed="false">${escapeHTML(item.id)}</button>`).join('') || `<p class="preview-empty">${t('previewEmpty')}</p>`;
}
function pageCard(page) {
  return `<button type="button" class="page-hit" data-page="${page.page}" aria-pressed="false">
    <strong>${escapeHTML(t('pageHit', page.page))}</strong><span>${highlight(page.snippet, filters().query)}</span>
  </button>`;
}
function renderResults() {
  const f = filters();
  shown = filterExhibits(items, f);
  pageHits = (f.query && f.section === 'all' && f.subsection === 'all' && f.type === 'all' && f.topics.length === 0) ? findPageMatches(pages, f.query, 8) : [];
  el.resultCount.textContent = f.query ? t('queryCount', shown.length, pageHits.length) : t('resultCount', shown.length, items.length);
  el.reset.hidden = !filtersActive();
  renderMatchingPreviews();
  const cards = shown.map(itemCard).join('');
  const pdfPages = pageHits.length ? `<div class="page-results-title">${t('pageResults')}</div>${pageHits.map(pageCard).join('')}` : '';
  el.results.innerHTML = cards + pdfPages || `<div class="empty-state"><strong>${t('noResults')}</strong><p>${t('noResultsHint')}</p></div>`;
  if (active.kind === 'item' && !shown.some(item => item.id === active.id)) {
    if (shown.length) { active = {kind: 'item', id: shown[0].id}; previewPage = shown[0].page; renderDetail(shown[0]); updateHash(slug(active.id)); }
    else if (pageHits.length) { active = {kind: 'page', page: pageHits[0].page}; previewPage = active.page; renderPageDetail(active.page); updateHash(`page-${active.page}`); }
    else { active = {kind: 'none'}; renderNoSelection(); }
  } else if (active.kind === 'page' && !pageHits.some(page => page.page === active.page) && filtersActive()) {
    if (shown.length) { active = {kind: 'item', id: shown[0].id}; previewPage = shown[0].page; renderDetail(shown[0]); updateHash(slug(active.id)); }
    else { active = {kind: 'none'}; renderNoSelection(); }
  } else if (active.kind === 'none' && (shown.length || pageHits.length)) {
    if (shown.length) { active = {kind: 'item', id: shown[0].id}; previewPage = shown[0].page; renderDetail(shown[0]); updateHash(slug(active.id)); }
    else { active = {kind: 'page', page: pageHits[0].page}; previewPage = active.page; renderPageDetail(active.page); updateHash(`page-${active.page}`); }
  }
  markSelected();
}
function sourcePreview(start, end) {
  const canPrev = previewPage > start, canNext = previewPage < end;
  return `<div class="source-box"><div class="source-head"><strong>${t('previewTitle')}</strong><div class="source-controls">
    <button type="button" data-move="-1" ${canPrev ? '' : 'disabled'} aria-label="${t('prevPage')}">‹</button><span>${escapeHTML(t('previewProgress', previewPage, start, end))}</span><button type="button" data-move="1" ${canNext ? '' : 'disabled'} aria-label="${t('nextPage')}">›</button>
  </div></div><a class="preview-link" href="${pdfLink(previewPage)}" target="_blank" rel="noopener" aria-label="${escapeHTML(t('openPdfPage', previewPage))}"><img src="${imageLink(previewPage)}" alt="${escapeHTML(t('previewImage', previewPage))}" loading="lazy"></a>
  <div class="source-foot"><span>${t('previewHint')}</span><a href="${pdfLink(previewPage)}" target="_blank" rel="noopener">${t('openThisPage')}</a></div></div>`;
}
function parallelText(chinese, english, englishFirst = false) {
  if (language === 'en') return `<p lang="en">${escapeHTML(english)}</p>`;
  const zh = `<p class="parallel-zh" lang="zh-Hans">${escapeHTML(chinese)}</p>`;
  const en = `<p class="parallel-en" lang="en">${escapeHTML(english)}</p>`;
  return `<div class="parallel-copy">${englishFirst ? en + zh : zh + en}</div>`;
}
function renderDetail(item) {
  if (!item) return;
  const labelKey = item.id.startsWith('Key figures') ? 'keyFiguresNote' : item.id === 'Survey periods' ? 'periodsNote' : null;
  const cautionZh = item.cautionZh + (labelKey ? ' ' + translations.zh[labelKey] : '');
  const cautionEn = item.caution + (labelKey ? ' ' + translations.en[labelKey] : '');
  const translatedTitle = language === 'zh' ? `<p class="detail-title-translation" lang="zh-Hans">${escapeHTML(item.titleZh)}</p>` : '';
  el.detail.innerHTML = `<div class="detail-kicker"><span class="id-badge ${item.kind === 'Chart' ? 'chart' : ''}">${escapeHTML(item.id)}</span><span class="source-page-number">${escapeHTML(pageRef(item))} · ${kindLabel(item)}</span></div>
    <h2 class="detail-title" lang="en">${escapeHTML(item.title)}</h2>${translatedTitle}<p class="detail-subline"><span>${escapeHTML(sectionName(item.section))}</span><span class="dot">·</span><span>${escapeHTML(language === 'zh' ? item.subsectionTitleZh : item.subsectionTitle)}</span><span class="dot">·</span><span>${escapeHTML(fieldFor(item, 'unit'))}</span></p>
    <div class="action-row"><a class="action primary" href="${pdfLink(item.page)}" target="_blank" rel="noopener">${escapeHTML(t('openReport', pageRef(item)))}<span class="arrow">↗</span></a><button type="button" class="action secondary" id="copy-citation" data-id="${escapeHTML(item.id)}">${t('copyCitation')}</button></div>
    <div class="note-card"><h3>${t('keyPointLabel')}</h3>${parallelText(item.keyPointZh, item.keyPoint)}</div>
    <section aria-labelledby="report-role-title"><h3 id="report-role-title" class="detail-section-title">${t('roleLabel')}</h3><div class="field">${parallelText(item.roleZh, item.role, true)}</div></section>
    <h3 class="detail-section-title">${t('variables')}</h3><div class="field-grid">
      <div class="field"><span class="label">${t('unitField')}</span>${parallelText(item.unitZh, item.unit, true)}</div>
      <div class="field"><span class="label">${t('outcomeField')}</span>${parallelText(item.outcomeZh, item.outcome, true)}</div>
      <div class="field"><span class="label">${t('groupingField')}</span>${parallelText(item.groupingZh, item.grouping, true)}</div>
      <div class="field"><span class="label">${t('denominatorField')}</span>${parallelText(item.denominatorZh, item.denominator, true)}</div>
    </div><div class="caution-box"><strong>${t('caution')}</strong>${parallelText(cautionZh, cautionEn)}</div>
    ${sourcePreview(item.page, item.pageEnd)}`;
}
function renderPageDetail(pageNum) {
  const page = pages.find(entry => entry.page === pageNum), q = filters().query;
  const related = items.filter(item => item.page <= pageNum && item.pageEnd >= pageNum);
  const snippet = page ? findSnippet(page.text, q, 250) : '';
  el.detail.innerHTML = `<div class="detail-kicker"><span class="id-badge">${t('reportPageBadge')}</span><span class="source-page-number">${escapeHTML(t('pageRef', pageNum))} / ${pages.length}</span></div>
    <h2 class="detail-title">${escapeHTML(t('reportPage', pageNum))}</h2><p class="detail-subline">${escapeHTML(t('reportPageSubline', q))}</p>
    <div class="action-row"><a class="action primary" href="${pdfLink(pageNum)}" target="_blank" rel="noopener">${escapeHTML(t('openPdfPage', pageNum))}<span class="arrow">↗</span></a></div>
    ${related.length ? `<h3 class="detail-section-title">${t('related')}</h3><div class="related-items">${related.map(item => `<button type="button" data-related="${escapeHTML(item.id)}">${escapeHTML(item.id)}</button>`).join('')}</div>` : ''}
    <div class="page-match"><strong>${t('reportExcerpt')}</strong><br>${highlight(snippet, q)}</div>${sourcePreview(pageNum, pageNum)}`;
}
function renderNoSelection() {
  el.detail.innerHTML = `<div class="empty-state"><strong>${t('noSelection')}</strong><p>${t('noSelectionHint')}</p></div>`;
}
function initializeHash() {
  const hash = decodeURIComponent(location.hash.slice(1));
  if (hash.startsWith('page-')) {
    const page = Number(hash.slice(5));
    if (page >= 1 && page <= pages.length) { active = {kind: 'page', page}; previewPage = page; renderPageDetail(page); return; }
  }
  const selected = items.find(item => slug(item.id) === hash) || items[0];
  active = {kind: 'item', id: selected.id};
  previewPage = selected.page;
  renderDetail(selected);
}
function wireEvents() {
  try { el.previews.open = localStorage.getItem('ths82-previews-open') !== 'false'; } catch {}
  el.previews.addEventListener('toggle', () => {
    try { localStorage.setItem('ths82-previews-open', String(el.previews.open)); } catch {}
  });
  el.gallery.addEventListener('click', event => {
    const card = event.target.closest('[data-id]');
    if (card) chooseItem(card.dataset.id, true);
  });
  el.form.addEventListener('submit', event => event.preventDefault());
  el.search.addEventListener('input', renderResults);
  el.section.addEventListener('change', () => { fillSubsections(); renderResults(); });
  [el.subsection, el.type].forEach(control => control.addEventListener('change', renderResults));
  el.topic.addEventListener('click', event => {
    const button = event.target.closest('[data-topic]');
    if (!button) return;
    const topic = button.dataset.topic;
    if (topic === 'all') selectedTopics.clear();
    else if (selectedTopics.has(topic)) selectedTopics.delete(topic);
    else selectedTopics.add(topic);
    renderTopics();
    el.topic.querySelector(`[data-topic="${topic}"]`)?.focus();
    renderResults();
  });
  el.reset.addEventListener('click', () => {
    selectedTopics.clear();
    renderTopics();
    el.search.value = '';
    [el.section, el.subsection, el.type].forEach(control => { control.value = 'all'; });
    fillSubsections();
    renderResults();
    el.search.focus();
  });
  document.querySelector('.language-switch').addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (button) setLanguage(button.dataset.language);
  });
  el.results.addEventListener('click', event => {
    const card = event.target.closest('[data-id]'), page = event.target.closest('[data-page]');
    if (card) chooseItem(card.dataset.id, true);
    else if (page) choosePage(Number(page.dataset.page), true);
  });
  el.detail.addEventListener('click', async event => {
    const related = event.target.closest('[data-related]');
    if (related) { chooseItem(related.dataset.related, true); return; }
    const move = event.target.closest('[data-move]');
    if (move) {
      const by = Number(move.dataset.move), selected = items.find(item => item.id === active.id);
      const first = active.kind === 'item' && selected ? selected.page : active.page;
      const last = active.kind === 'item' && selected ? selected.pageEnd : active.page;
      previewPage = Math.max(first, Math.min(last, previewPage + by));
      if (active.kind === 'item') renderDetail(selected);
      else renderPageDetail(active.page);
      return;
    }
    const copy = event.target.closest('#copy-citation');
    if (copy) {
      const item = items.find(entry => entry.id === copy.dataset.id);
      if (!item) return;
      const reference = item.kind === 'Unnumbered table' ? `${item.title}, p. ${item.pageLabel}` : `${item.id}, p. ${item.pageLabel}`;
      const citation = `Census and Statistics Department, Thematic Household Survey Report No. 82 (2025), ${reference}.`;
      try { await navigator.clipboard.writeText(citation); message(t('citationCopied')); }
      catch { message(t('citationFailed')); }
    }
  });
  document.addEventListener('keydown', event => {
    if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); el.search.focus(); el.search.select(); }
    if (event.key === 'Escape' && document.activeElement === el.search) { el.search.value = ''; renderResults(); el.search.blur(); }
  });
  window.addEventListener('hashchange', () => {
    const hash = decodeURIComponent(location.hash.slice(1)), item = items.find(entry => slug(entry.id) === hash);
    if (item) chooseItem(item.id);
    else if (/^page-\d+$/.test(hash)) choosePage(Number(hash.slice(5)));
  });
}
async function start() {
  translateStatic();
  try {
    const [catalogue, pdfPages] = await Promise.all([
      fetch('./catalog.json').then(response => { if (!response.ok) throw Error('Catalog unavailable'); return response.json(); }),
      fetch('./pages.json').then(response => { if (!response.ok) throw Error('Page index unavailable'); return response.json(); })
    ]);
    items = catalogue;
    pages = pdfPages;
    fillOptions();
    wireEvents();
    initializeHash();
    renderResults();
  } catch (error) {
    el.resultCount.textContent = t('loadFailed');
    el.results.innerHTML = `<div class="empty-state"><strong>${t('loadFailedTitle')}</strong><p>${t('loadFailedHint')}</p></div>`;
    el.detail.innerHTML = `<div class="loading-card">${t('pdfFallback')}</div>`;
    console.error(error);
  }
}
start();
