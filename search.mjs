export const TAG_LABELS = {
  "Individuals": "个人",
  "Households": "住户",
  "Persons aged 10+": "10岁及以上人士",
  "Persons aged 15+": "15岁及以上人士",
  "Households with Internet": "家中有接驳互联网的住户",
  "Households with PC": "家中有个人电脑的住户",
  "Households with PC online": "家中有个人电脑接驳互联网的住户",
  "Internet users": "曾使用互联网的10岁及以上人士",
  "PC owners": "拥有个人电脑的10岁及以上人士",
  "Smartphone owners": "拥有智能手机的10岁及以上人士",
  "With Internet access at home": "家中有接驳互联网",
  "With PC at home": "家中有个人电脑",
  "With PC at home connected to the Internet": "家中有个人电脑接驳互联网",
  "Had used the Internet": "曾使用互联网",
  "Had knowledge of using PC": "懂得使用个人电脑",
  "Had used PC": "曾使用个人电脑",
  "Had a smartphone": "拥有智能手机",
  "Had made online purchases for personal matters": "曾为个人事务进行网上购物",
  "Had used mobile payments": "曾使用流动支付",
  "Had carried out security measures for PCs": "曾为个人电脑执行保安措施",
  "Had a mobile phone (including smartphone and non-smartphone)": "拥有手提电话（包括智能及非智能手机）",
  "Devices connected to the Internet at home": "住户接驳互联网的设备",
  "Web devices used for Internet access": "个人上网设备",
  "Internet purposes": "上网主要目的",
  "Number of PCs at home": "家中个人电脑数目",
  "Type of PC at home": "家中个人电脑类别",
  "Number of smartphones owned": "个人拥有智能手机数目",
  "Type of security measures": "保安措施类型",
  "PC connection via fixed broadband": "电脑是否透过固网宽频接驳",
  "Reason without fixed broadband": "电脑未透过固网宽频接驳的原因",
  "Age": "年龄",
  "Sex": "性别",
  "Education": "教育程度",
  "Economic activity status": "经济活动身分",
  "Monthly household income": "住户每月入息",
  "Housing": "房屋类型",
  "Communication / interaction": "通讯／互动（上网目的）",
  "Online entertainment": "网上娱乐（上网目的）",
  "Information searching": "资讯查询（上网目的）",
  "Online purchases / finance transactions": "网上购物／处理金融交易（上网目的）",
  "Office / school / personal business and others": "办公室／学校／个人事务及其他（上网目的）"
};
const TAG_ALIASES = {
  'Mobile payments': '移动支付 流动支付 mobile payment',
  'Security': '安全措施 保安措施 资讯保安',
  'Income': '收入 入息',
  'Housing': '住房类型 房屋类型',
  'PC': '电脑 台式 笔电'
};

const matchable = (value) => String(value ?? '').normalize('NFKC').toLocaleLowerCase().replace(/[,，]/g,'').replace(/\s+/g,' ').trim();
const compact = (value) => matchable(value).replace(/\s+/g,'');
export const normalizeSearch = (value) => matchable(value);

export function populationKind(unit) {
  const s = matchable(unit);
  if (s.includes('household')) return 'household';
  if (s.includes('aged 15') || s.includes('15岁')) return 'person15';
  if (s.includes('aged 10') || s.includes('10岁')) return 'person10';
  return 'other';
}

export function scoreExhibit(item, term) {
  if (!term) return 1;
  const query = matchable(term.replace(/^[图表]\s*(?=\d)/,'').trim());
  if (!query) return 1;
  const numberedId = query.match(/^(?:(table|chart)\s*)?([1-6]\.\d{1,2})$/);
  if (numberedId) {
    const [whole, kind, number] = numberedId;
    const expected = kind ? `${kind} ${number}` : number;
    const found = matchable(item.id);
    return found === expected || (!kind && found.endsWith(` ${number}`)) ? 160 : 0;
  }
  const pieces = query.split(/\s+/).filter(Boolean);
  const id = matchable(item.id);
  const title = matchable(item.title + ' ' + item.titleZh);
  const points = matchable(item.keyPoint + ' ' + item.keyPointZh);
  const words = matchable([item.unit,item.unitZh,item.outcome,item.outcomeZh,item.grouping,item.groupingZh,item.denominator,item.denominatorZh,item.caution,item.cautionZh,item.role,item.roleZh,item.section,item.sectionZh,item.subsectionTitle,item.subsectionTitleZh,item.tags.join(' '),item.tags.map(t=>TAG_LABELS[t]).join(' '),item.tags.map(t=>TAG_ALIASES[t] || '').join(' ')].join(' '));
  const source = matchable(item.sourceText);
  const bundle = compact([id,title,points,words,source].join(' '));
  if (!pieces.every(p => bundle.includes(compact(p)))) return 0;
  let score = 2;
  if (id === query) score += 140;
  else if (id.includes(query)) score += 85;
  if (title.includes(query)) score += 60;
  if (points.includes(query)) score += 45;
  if (words.includes(query)) score += 24;
  if (source.includes(query) || compact(source).includes(compact(query))) score += 12;
  if (pieces.length > 1 && pieces.every(p => compact(id+' '+title+' '+points+' '+words).includes(compact(p)))) score += 16;
  return score;
}

export function filterExhibits(items, filters={}) {
  const {query='',section='all',subsection='all',type='all',topic='all',unit='all'} = filters;
  const topics = filters.topics ?? (topic === 'all' ? [] : [topic]);
  return items.map(item=>({item,score:scoreExhibit(item,query)}))
    .filter(({item,score}) => score>0
      && (section==='all' || item.section===section)
      && (subsection==='all' || item.subsection===subsection)
      && (type==='all' || item.kind===type)
      && (topics.length === 0 || topics.every(tag => item.tags.includes(tag)))
      && (unit==='all' || populationKind(item.unit)===unit))
    .sort((a,b)=>query ? b.score-a.score || a.item.number-b.item.number : a.item.number-b.item.number)
    .map(({item})=>item);
}

export function findSnippet(text, query, radius=118) {
  const raw=String(text??'');
  const normalized=matchable(query);
  if (!normalized) return raw.slice(0,radius*2);
  let where=raw.toLocaleLowerCase().indexOf(normalized);
  if (where<0) where=raw.toLocaleLowerCase().indexOf(normalized.replace(/\s/g,''));
  if (where<0) return raw.slice(0,radius*2);
  const left=Math.max(0,where-radius),right=Math.min(raw.length,where+normalized.length+radius);
  return (left?'… ':'')+raw.slice(left,right).trim()+(right<raw.length?' …':'');
}

export function findPageMatches(pages, query, max=10) {
  const q=matchable(query);
  if (q.length<2) return [];
  const exhibitId=q.match(/^(?:(table|chart)\s*)?([1-6]\.\d{1,2})$/);
  if(exhibitId){
    const [,kind,number]=exhibitId;
    const heading=new RegExp(`\\b${kind || '(?:Table|Chart)'}\\s*${number.replace('.','\\.')}\\s*:`, 'i');
    return pages.filter(page=>heading.test(page.text))
      .map(page=>({...page,snippet:findSnippet(page.text,`${kind || ''} ${number}`.trim()),rank:3})).slice(0,max);
  }
  const terms=q.split(/\s+/).filter(Boolean);
  return pages.map(page=>{
    const plain=matchable(page.text),squashed=compact(page.text);
    const ok=terms.every(t => plain.includes(t) || squashed.includes(compact(t)));
    return ok ? {...page,snippet:findSnippet(page.text,q),rank:plain.includes(q)?2:1} : null;
  }).filter(Boolean).sort((a,b)=>b.rank-a.rank||a.page-b.page).slice(0,max);
}
