const dialog=document.querySelector('#changelog-dialog');
const opener=document.querySelector('#changelog-open');
const closer=document.querySelector('#changelog-close');
let unlocked=false;
const form=document.querySelector('#changelog-unlock');
const password=document.querySelector('#changelog-password');
const error=document.querySelector('#changelog-error');
const entries=[
 ['2026-09-29 03:39','将五个具体上网目的筛选合并为上网主要目的，具体类别仍可在图表内容中查看。','Consolidated the five Internet-purpose filters into Major purpose of using the Internet; detailed categories remain in the exhibits.'],
 ['2026-09-29','细分核心指标与条件追问，移除入息中位数筛选，明确住户每月入息，修正15岁及以上资料的标签，并补全五类上网目的。','Refined measures and conditional follow-ups, removed the median-income filter, clarified monthly household income, corrected age-scope tags and included all five Internet-purpose categories.'],
 ['2026-09-27','新增报告小标题筛选，章节改变时自动更新小标题选项，并在图表详情显示所属小标题。','Added report subsection filtering, with options that follow the chosen section and a subsection label in each exhibit detail.'],
 ['2026-09-27','按统计对象、研究内容、具体追问和比较维度重组筛选，并核对30项图表的适用人群。','Reorganised filters by population, measure, follow-up and breakdown; checked the eligible population for all 30 exhibits.'],
 ['2026-09-26 00:39','更新记录增加查看密码入口。','Added a password prompt before viewing the changelog.'],
 ['2026-09-26 00:25','统一编号框与图表卡片的左右边距；编号区域自动增高，展开时完整显示所有匹配编号。','Aligned the IDs panel with exhibit cards; the expanded panel now grows to show every matching ID without internal scrolling.'],
 ['2026-09-26 00:15','移除时间与调查筛选组；版本切换改为更新记录，保留所有图表内容。','Removed the time and survey filters; replaced version switching with a changelog. All exhibits remain available.'],
 ['2026-09-26 00:08','压缩顶部栏、搜索框和筛选区，为图表列表留出更多空间。','Compacted the header, search and filters to leave more space for exhibits.'],
 ['2026-09-25 23:43','补充经济活动身分、上网目的、性别等标签，并区分两类网上购物指标。','Added economic activity status, Internet purposes, sex and other filters; distinguished the two online-purchase indicators.'],
 ['2026-09-25 23:10','匹配结果区域仅显示可点击的图表编号，支持展开与收起。','Added a collapsible area of clickable matching exhibit IDs.'],
 ['2026-09-25 22:45','多主题筛选改为交集：图表必须符合全部所选主题。','Changed multiple-topic filtering to match all selected topics.'],
 ['2026-09-25','加入 Role in the report；完善中英对照，页码以英文报告为准。','Added Role in the report and refined bilingual content, using English report page numbers.']
];
function render(){const zh=document.documentElement.lang.startsWith('zh');const title=zh?'更新记录':'Changelog';opener.textContent='🔒 '+title;form.hidden=unlocked;document.querySelector('#changelog-password-label').textContent=zh?'请输入查看密码':'Enter the viewing password';document.querySelector('#changelog-submit').textContent=zh?'解锁':'Unlock';document.querySelector('#changelog-entries').hidden=!unlocked;document.querySelector('#changelog-title').textContent=title;closer.setAttribute('aria-label',zh?'关闭':'Close');document.querySelector('#changelog-entries').replaceChildren(...(unlocked?entries:[]).map(([date,cn,en])=>{const section=document.createElement('section');section.className='changelog-entry';const time=document.createElement('time');time.textContent=date+' (UTC+8)';time.dateTime=date.replace(' ','T')+(date.includes(' ')?':00+08:00':'');const p=document.createElement('p');p.textContent=zh?cn:en;section.append(time,p);return section;}));}
render();new MutationObserver(render).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
opener.addEventListener('click',()=>{unlocked=false;password.value='';error.textContent='';password.removeAttribute('aria-invalid');render();dialog.showModal();password.focus();});
form.addEventListener('submit',event=>{event.preventDefault();if(password.value==='0000'){unlocked=true;password.value='';error.textContent='';render();closer.focus();}else{error.textContent=document.documentElement.lang.startsWith('zh')?'密码不正确，请重试。':'Incorrect password. Please try again.';password.setAttribute('aria-invalid','true');password.select();}});
closer.addEventListener('click',()=>dialog.close());
dialog.addEventListener('click',event=>{const r=dialog.getBoundingClientRect();if(event.target===dialog&&(event.clientX<r.left||event.clientX>r.right||event.clientY<r.top||event.clientY>r.bottom))dialog.close();});
dialog.addEventListener('close',()=>{unlocked=false;password.value='';error.textContent='';render();opener.focus();});
