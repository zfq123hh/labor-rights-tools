import { mkdirSync, writeFileSync, rmSync, copyFileSync } from 'node:fs';
import path from 'node:path';

const outDir = 'dist';
const repoName = 'labor-rights-tools';
const siteUrl = process.env.SITE_URL || `https://zfq123hh.github.io/${repoName}`;
const basePath = process.env.BASE_PATH || `/${repoName}`;
const email = 'fuquanz617@gmail.com';

const cities = [
  ['beijing','北京'],['shanghai','上海'],['guangzhou','广州'],['shenzhen','深圳'],['hangzhou','杭州'],['nanjing','南京'],['suzhou','苏州'],['chengdu','成都'],['chongqing','重庆'],['wuhan','武汉'],['xian','西安'],['tianjin','天津'],['qingdao','青岛'],['ningbo','宁波'],['xiamen','厦门'],['fuzhou','福州'],['jinan','济南'],['zhengzhou','郑州'],['changsha','长沙'],['hefei','合肥'],['kunming','昆明'],['nanchang','南昌'],['shenyang','沈阳'],['dalian','大连'],['changchun','长春'],['harbin','哈尔滨'],['shijiazhuang','石家庄'],['taiyuan','太原'],['huhehaote','呼和浩特'],['lanzhou','兰州'],['yinchuan','银川'],['xining','西宁'],['urumqi','乌鲁木齐'],['haikou','海口'],['sanya','三亚'],['dongguan','东莞'],['foshan','佛山'],['zhuhai','珠海'],['zhongshan','中山'],['huizhou','惠州'],['wuxi','无锡'],['changzhou','常州'],['nantong','南通'],['xuzhou','徐州'],['jiaxing','嘉兴'],['shaoxing','绍兴'],['wenzhou','温州'],['jinhua','金华'],['quanzhou','泉州'],['yantai','烟台'],['weifang','潍坊'],['luoyang','洛阳'],['nantong','南通'],['guilin','桂林'],['nanning','南宁'],['guiyang','贵阳'],['mianyang','绵阳'],['foshan','佛山'],['baoding','保定'],['langfang','廊坊'],['tangshan','唐山'],['qinhuangdao','秦皇岛'],['lhasa','拉萨'],['dali','大理'],['yichang','宜昌'],['xiangyang','襄阳'],['liuzhou','柳州'],['wuhu','芜湖'],['maanshan','马鞍山'],['taizhou-zj','台州'],['taizhou-js','泰州'],['yangzhou','扬州'],['zhenjiang','镇江'],['yancheng','盐城'],['huaian','淮安'],['lianyungang','连云港'],['suqian','宿迁'],['huzhou','湖州'],['quzhou','衢州'],['lishui','丽水']
];
const uniqueCities = Array.from(new Map(cities.map(c=>[c[0],c])).values());

const tools = {
  severance: {
    slug: 'severance',
    name: '离职补偿N+1计算器',
    short: '离职补偿',
    title: '离职补偿N+1计算器｜经济补偿金、代通知金、违法解除赔偿估算',
    desc: '输入月工资、工作年限、当地月平均工资等，估算经济补偿金N、代通知金+1、违法解除2N参考金额。',
    keywords: ['离职补偿N+1怎么算','经济补偿金计算器','违法解除赔偿2N','代通知金计算']
  },
  overtime: {
    slug: 'overtime-pay',
    name: '加班费计算器', short: '加班费',
    title: '加班费计算器｜工作日150%、休息日200%、法定节假日300%估算',
    desc: '按月工资、计薪天数、日薪/小时工资估算工作日、休息日、法定节假日加班费。',
    keywords: ['加班费怎么算','周末加班费计算器','法定节假日三倍工资','小时工资计算']
  },
  annual: {
    slug: 'annual-leave',
    name: '年假工资计算器', short: '年假工资',
    title: '未休年假工资计算器｜应休年假天数、未休年假补偿估算',
    desc: '根据累计工作年限、已休年假和月工资，估算未休年假工资补偿参考金额。',
    keywords: ['未休年假工资怎么算','年假天数计算器','年休假补偿','年假工资300%']
  },
  sick: {
    slug: 'sick-pay',
    name: '病假工资计算器', short: '病假工资',
    title: '病假工资计算器｜病假期间工资、医疗期工资估算',
    desc: '按月工资、病假天数和支付比例，估算病假期间工资参考金额。各地规则差异较大，请以本地规定为准。',
    keywords: ['病假工资怎么算','医疗期工资计算器','病假扣工资合法吗','病假工资比例']
  }
};

function esc(s='') { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
function url(p='') { const clean = p.startsWith('/') ? p : `/${p}`; return `${basePath}${clean}`.replace(/\/\/$/, '/'); }
function absUrl(p='') { const clean = p.startsWith('/') ? p : `/${p}`; return `${siteUrl}${clean}`.replace(/\/\/$/, '/'); }
function write(rel, html) { const file = path.join(outDir, rel, 'index.html'); mkdirSync(path.dirname(file), {recursive:true}); writeFileSync(file, html, 'utf8'); }
function asset(rel, content) { const file = path.join(outDir, rel); mkdirSync(path.dirname(file), {recursive:true}); writeFileSync(file, content, 'utf8'); }

const css = `
:root{--bg:#f7f8fb;--card:#fff;--text:#111827;--muted:#667085;--line:#e5e7eb;--brand:#175cd3;--accent:#f59e0b;--ok:#067647;--danger:#b42318}*{box-sizing:border-box}body{margin:0;font-family:-apple-system,BlinkMacSystemFont,"Segoe UI","PingFang SC","Microsoft YaHei",Arial,sans-serif;background:var(--bg);color:var(--text);line-height:1.7}.wrap{max-width:1120px;margin:0 auto;padding:0 18px}header{background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:10}nav{display:flex;justify-content:space-between;align-items:center;min-height:64px;gap:18px}.brand{font-weight:800;color:var(--text);text-decoration:none;font-size:20px}.nav a{color:#344054;text-decoration:none;margin-left:16px}.hero{padding:56px 0 32px;background:linear-gradient(135deg,#eef4ff,#fff7ed)}h1{font-size:42px;line-height:1.15;margin:0 0 16px}h2{font-size:28px;margin:34px 0 14px}h3{font-size:20px;margin:22px 0 8px}.lead{font-size:19px;color:#475467;max-width:820px}.grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:16px}.card{background:var(--card);border:1px solid var(--line);border-radius:18px;padding:20px;box-shadow:0 8px 22px rgba(16,24,40,.04)}.card a{text-decoration:none;color:var(--brand);font-weight:700}.pill{display:inline-block;background:#e0eaff;color:#1849a9;padding:4px 10px;border-radius:999px;font-size:13px;margin:3px}.btn{display:inline-block;background:var(--brand);color:white!important;text-decoration:none;padding:11px 16px;border-radius:999px;font-weight:750;margin:8px 8px 8px 0}.btn.secondary{background:#fff;color:var(--brand)!important;border:1px solid #b2ccff}.calc{display:grid;grid-template-columns:1fr 1fr;gap:18px;align-items:start}.form label{display:block;font-weight:700;margin:12px 0 5px}.form input,.form select,.form textarea{width:100%;border:1px solid #d0d5dd;border-radius:12px;padding:11px;font-size:16px;background:#fff}.result{background:#101828;color:white;border-radius:18px;padding:20px;position:sticky;top:84px}.result strong{font-size:32px;color:#fef08a}.note{font-size:14px;color:#667085}.warn{border-left:5px solid var(--accent);background:#fffaeb;padding:12px;border-radius:12px}.danger{border-left:5px solid var(--danger);background:#fef3f2;padding:12px;border-radius:12px}.table{width:100%;border-collapse:collapse;background:#fff;border-radius:16px;overflow:hidden}.table th,.table td{border-bottom:1px solid var(--line);padding:11px;text-align:left}.footer{margin-top:48px;padding:28px 0;color:#667085;border-top:1px solid var(--line)}.small{font-size:13px;color:#667085}.kpi{font-size:30px;font-weight:800}.breadcrumbs{font-size:14px;color:#667085;margin:14px 0}.list a{display:block;padding:8px 0;color:var(--brand);text-decoration:none}@media(max-width:760px){h1{font-size:32px}.calc{grid-template-columns:1fr}.result{position:static}.nav a{margin-left:8px;font-size:14px}}
`;

const appjs = `
function yuan(n){ if(!isFinite(n)) return '¥0'; return '¥' + Math.max(0,n).toLocaleString('zh-CN',{maximumFractionDigits:2}); }
function num(id){ return parseFloat(document.getElementById(id)?.value||'0')||0; }
function set(id, v){ const el=document.getElementById(id); if(el) el.textContent=v; }
function calcSeverance(){ const wage=num('wage'), years=num('years'), avg=num('avg'), notice=document.getElementById('notice')?.value==='yes'; const cap=avg>0?avg*3:Infinity; const base=Math.min(wage,cap); const n=Math.max(0,years); const comp=base*n; const noticePay=notice?wage:0; const illegal=comp*2; set('r1', yuan(comp)); set('r2', yuan(noticePay)); set('r3', yuan(comp+noticePay)); set('r4', yuan(illegal)); }
function calcOvertime(){ const wage=num('wage'), workday=num('workday'), rest=num('rest'), holiday=num('holiday'), days=num('days')||21.75; const day=wage/days; const hour=day/8; const total=hour*workday*1.5 + hour*rest*2 + hour*holiday*3; set('r1', yuan(day)); set('r2', yuan(hour)); set('r3', yuan(total)); }
function legalAnnualDays(totalYears){ if(totalYears<1) return 0; if(totalYears<10) return 5; if(totalYears<20) return 10; return 15; }
function calcAnnual(){ const wage=num('wage'), totalYears=num('totalYears'), used=num('used'), days=num('days')||21.75; const annual=legalAnnualDays(totalYears); const unused=Math.max(0, annual-used); const day=wage/days; const pay=day*unused*2; set('r1', annual+' 天'); set('r2', unused+' 天'); set('r3', yuan(pay)); }
function calcSick(){ const wage=num('wage'), sickDays=num('sickDays'), ratio=num('ratio')/100, days=num('days')||21.75; const day=wage/days; const pay=day*sickDays*ratio; set('r1', yuan(day)); set('r2', yuan(pay)); }
document.addEventListener('input',()=>{ if(document.body.dataset.tool==='severance') calcSeverance(); if(document.body.dataset.tool==='overtime') calcOvertime(); if(document.body.dataset.tool==='annual') calcAnnual(); if(document.body.dataset.tool==='sick') calcSick(); });
document.addEventListener('DOMContentLoaded',()=>{ calcSeverance(); calcOvertime(); calcAnnual(); calcSick(); });
`;

function layout({title, desc, body, tool}) {
  const schema = {"@context":"https://schema.org","@type":"WebSite",name:'劳动权益计算器',url:siteUrl,description:'劳动权益、离职补偿、加班费、年假工资、病假工资在线估算工具'};
  return `<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${esc(title)}</title><meta name="description" content="${esc(desc)}"><link rel="stylesheet" href="${url('/assets/style.css')}"><script type="application/ld+json">${JSON.stringify(schema)}</script></head><body data-tool="${tool||''}"><header><div class="wrap"><nav><a class="brand" href="${url('/')}">劳动权益计算器</a><div class="nav"><a href="${url('/tools/')}">工具</a><a href="${url('/cities/')}">城市</a><a href="${url('/templates/')}">模板包</a><a href="${url('/guides/labor-arbitration-evidence-checklist/')}">证据清单</a><a href="${url('/sponsor/')}">合作变现</a><a href="${url('/contact/')}">联系</a></div></nav></div></header>${body}<footer class="footer"><div class="wrap"><p>© ${new Date().getFullYear()} 劳动权益计算器｜个人估算参考，不构成法律意见。</p><p><a href="${url('/privacy/')}">隐私</a> · <a href="${url('/terms/')}">条款</a> · <a href="${url('/contact/')}">联系/合作</a></p></div></footer><script src="${url('/assets/app.js')}"></script></body></html>`;
}

function toolCards(){return Object.values(tools).map(t=>`<div class="card"><h3>${t.name}</h3><p>${t.desc}</p><p>${t.keywords.map(k=>`<span class="pill">${k}</span>`).join('')}</p><a class="btn secondary" href="${url(`/tools/${t.slug}/`)}">打开工具</a></div>`).join('');}
function cityLinks(toolKey){ const t=tools[toolKey]; return uniqueCities.map(([slug,name])=>`<a href="${url(`/cities/${slug}/${t.slug}/`)}">${name}${t.short}怎么算</a>`).join(''); }

function home(){
  return layout({title:'劳动权益计算器｜离职补偿N+1、加班费、年假工资、病假工资在线估算', desc:'提供离职补偿N+1、经济补偿金、加班费、未休年假工资、病假工资在线估算工具，覆盖重点城市长尾查询。', body:`<section class="hero"><div class="wrap"><h1>把劳动权益问题变成可计算的金额</h1><p class="lead">离职补偿、N+1、违法解除2N、加班费、未休年假、病假工资，一页输入，立即得到保守估算。适合员工自查、HR初算、律师/咨询机构获客。</p><a class="btn" href="${url('/tools/severance/')}">先算离职补偿</a><a class="btn secondary" href="${url('/templates/')}">查看模板包清单</a><a class="btn secondary" href="${url('/guides/labor-arbitration-evidence-checklist/')}">查看仲裁证据清单</a><a class="btn secondary" href="${url('/sponsor/')}">查看合作变现入口</a></div></section><main class="wrap"><h2>核心工具</h2><div class="grid">${toolCards()}</div><h2>为什么这个站可以变现</h2><div class="grid"><div class="card"><div class="kpi">高痛点</div><p>离职、裁员、欠加班费是强需求，用户搜索时已经有明确金额焦虑。</p></div><div class="card"><div class="kpi">高客单</div><p>劳动纠纷咨询、律师线索、企业HR合规服务，比普通广告点击更值钱。</p></div><div class="card"><div class="kpi">可扩展</div><p>城市 × 场景 × 问法可持续生成SEO页，不需要主动拉人。</p></div></div><h2>重点城市入口</h2><div class="card list">${uniqueCities.slice(0,36).map(([s,n])=>`<a href="${url(`/cities/${s}/severance/`)}">${n}离职补偿N+1计算器</a>`).join('')}</div></main>`});
}

function toolsIndex(){ return layout({title:'劳动权益工具大全｜离职补偿、加班费、年假工资、病假工资', desc:'劳动权益相关在线计算器列表。', body:`<main class="wrap"><div class="breadcrumbs"><a href="${url('/')}">首页</a> / 工具</div><h1>劳动权益工具大全</h1><p class="lead">先用保守口径估算金额，再决定是否咨询专业人士。</p><div class="grid">${toolCards()}</div></main>`}); }

function calcBlock(toolKey){
 if(toolKey==='severance') return `<section class="calc"><div class="card form"><label>月工资/解除前平均月工资（元）</label><input id="wage" type="number" value="12000"><label>工作年限N（年，可填小数，如 3.5）</label><input id="years" type="number" step="0.5" value="3"><label>当地职工月平均工资（可选，用于3倍封顶）</label><input id="avg" type="number" value="10000"><label>是否估算代通知金 +1</label><select id="notice"><option value="yes">是，估算N+1</option><option value="no">否，只算N</option></select></div><div class="result"><p>经济补偿金 N</p><strong id="r1">¥0</strong><p>代通知金 +1</p><strong id="r2">¥0</strong><p>N+1合计参考</p><strong id="r3">¥0</strong><p>违法解除 2N 参考</p><strong id="r4">¥0</strong></div></section>`;
 if(toolKey==='overtime') return `<section class="calc"><div class="card form"><label>月工资（元）</label><input id="wage" type="number" value="12000"><label>月计薪天数</label><input id="days" type="number" value="21.75"><label>工作日加班小时</label><input id="workday" type="number" value="10"><label>休息日加班小时</label><input id="rest" type="number" value="8"><label>法定节假日加班小时</label><input id="holiday" type="number" value="0"></div><div class="result"><p>日工资参考</p><strong id="r1">¥0</strong><p>小时工资参考</p><strong id="r2">¥0</strong><p>加班费合计</p><strong id="r3">¥0</strong></div></section>`;
 if(toolKey==='annual') return `<section class="calc"><div class="card form"><label>月工资（元）</label><input id="wage" type="number" value="12000"><label>累计工作年限（年）</label><input id="totalYears" type="number" value="6"><label>当年已休年假天数</label><input id="used" type="number" value="0"><label>月计薪天数</label><input id="days" type="number" value="21.75"></div><div class="result"><p>应休年假</p><strong id="r1">0天</strong><p>未休天数</p><strong id="r2">0天</strong><p>未休年假额外补偿参考</p><strong id="r3">¥0</strong></div></section>`;
 return `<section class="calc"><div class="card form"><label>月工资（元）</label><input id="wage" type="number" value="12000"><label>病假天数</label><input id="sickDays" type="number" value="5"><label>支付比例（%）</label><input id="ratio" type="number" value="80"><label>月计薪天数</label><input id="days" type="number" value="21.75"></div><div class="result"><p>日工资参考</p><strong id="r1">¥0</strong><p>病假工资参考</p><strong id="r2">¥0</strong></div></section>`;
}

function toolPage(toolKey, city){
 const t = tools[toolKey]; const cityText = city ? `${city[1]}` : '';
 const title = city ? `${city[1]}${t.title}` : t.title;
 const desc = city ? `${city[1]}${t.desc}` : t.desc;
 const cityPara = city ? `<p class="warn">${city[1]}本地实际口径可能受最低工资、当地平均工资、地方规定、合同约定和证据影响。本页只做${city[1]}用户的个人估算参考。</p>` : '';
 const related = Object.entries(tools).filter(([k])=>k!==toolKey).map(([k,ot])=>`<a href="${url(city?`/cities/${city[0]}/${ot.slug}/`:`/tools/${ot.slug}/`)}">${cityText}${ot.name}</a>`).join('');
 const citySection = !city ? `<h2>按城市查看${t.short}</h2><div class="card list">${cityLinks(toolKey)}</div>` : '';
 const body = `<main class="wrap"><div class="breadcrumbs"><a href="${url('/')}">首页</a> / <a href="${url('/tools/')}">工具</a> / ${esc(cityText+t.name)}</div><h1>${esc(cityText+t.name)}</h1><p class="lead">${esc(desc)}</p>${cityPara}${calcBlock(toolKey)}<h2>计算口径说明</h2><div class="card"><ul><li>本工具采用常见公开规则做个人估算，不替代仲裁、诉讼、税务或律师意见。</li><li>离职补偿中的“N”通常和工作年限相关；“+1”通常指未提前通知时的代通知金；违法解除可能涉及2N口径。</li><li>加班费、年假、病假工资会受考勤、合同、规章制度、地方规定和证据影响。</li></ul></div><h2>下一步怎么把金额变成可主张材料</h2><div class="grid"><div class="card"><h3>1. 留存证据</h3><p>劳动合同、工资流水、社保记录、考勤、加班审批、聊天记录、解除通知。</p></div><div class="card"><h3>2. 明确诉求</h3><p>把经济补偿、代通知金、加班费、未休年假、工资差额分别列清。</p></div><div class="card"><h3>3. 找专业人士复核</h3><p>如果金额较大，建议让律师/劳动仲裁咨询机构结合证据复核。</p></div></div><h2>相关工具</h2><div class="card list">${related}</div>${citySection}<div class="danger"><b>免责声明：</b>本页只做个人估算参考，不构成法律意见；具体结果以当地法规、仲裁/法院认定和专业人士意见为准。</div></main>`;
 return layout({title, desc, body, tool: toolKey});
}

function citiesIndex(){ return layout({title:'城市劳动权益计算器｜各城市离职补偿、加班费、年假工资', desc:'按城市查看离职补偿N+1、加班费、年假工资、病假工资估算。', body:`<main class="wrap"><div class="breadcrumbs"><a href="${url('/')}">首页</a> / 城市</div><h1>按城市查看劳动权益计算器</h1><p class="lead">城市页用于覆盖“城市 + 劳动权益 + 计算器”长尾搜索。</p><div class="grid">${uniqueCities.map(([s,n])=>`<div class="card"><h3>${n}</h3><p><a href="${url(`/cities/${s}/severance/`)}">离职补偿</a> · <a href="${url(`/cities/${s}/overtime-pay/`)}">加班费</a> · <a href="${url(`/cities/${s}/annual-leave/`)}">年假</a> · <a href="${url(`/cities/${s}/sick-pay/`)}">病假工资</a></p></div>`).join('')}</div></main>`}); }
function simplePage(slug,title,desc,html){ write(slug, layout({title,desc,body:`<main class="wrap"><h1>${title}</h1>${html}</main>`})); }

rmSync(outDir,{recursive:true,force:true}); mkdirSync(outDir,{recursive:true});
asset('assets/style.css', css); asset('assets/app.js', appjs); asset('.nojekyll','');
write('', home()); write('tools', toolsIndex()); write('cities', citiesIndex());
for (const [key,t] of Object.entries(tools)) write(`tools/${t.slug}`, toolPage(key));
for (const city of uniqueCities) for (const [key,t] of Object.entries(tools)) write(`cities/${city[0]}/${t.slug}`, toolPage(key, city));
simplePage('guides/labor-arbitration-evidence-checklist','劳动仲裁证据清单｜离职补偿、加班费、年假工资维权材料整理','劳动仲裁前需要准备哪些证据？按劳动合同、工资流水、社保、考勤、加班、解除通知和沟通记录整理材料，适合离职补偿、加班费、未休年假自查。',`<p class="lead">把计算器结果转成可复核材料：先确认诉求金额，再按证据类型整理原件、截图和时间线，减少咨询律师或申请仲裁时的遗漏。</p><div class="grid"><div class="card"><h3>1. 身份与劳动关系</h3><p>劳动合同、入职登记、工牌/门禁、工作邮箱、社保缴费记录、个税记录、工资条或银行流水。</p></div><div class="card"><h3>2. 工资与工时</h3><p>工资流水、工资结构说明、考勤记录、排班表、加班审批、调休记录、绩效/提成规则。</p></div><div class="card"><h3>3. 解除或争议事实</h3><p>解除通知、协商记录、聊天记录、录音要点、离职证明、工作交接文件、公司规章制度。</p></div></div><h2>按诉求拆分证据</h2><div class="card list"><a href="${url('/tools/severance/')}">离职补偿N+1：工作年限、解除原因、平均工资</a><a href="${url('/tools/overtime-pay/')}">加班费：考勤、加班安排、未调休证明</a><a href="${url('/tools/annual-leave/')}">未休年假：累计工龄、已休天数、工资基数</a><a href="${url('/tools/sick-pay/')}">病假工资：病假材料、工资基数、公司支付比例</a></div><h2>7步整理时间线</h2><div class="card"><ol><li>列出入职、续签、调岗、调薪、离职/解除日期。</li><li>用计算器估算每项诉求金额，并单独保存截图或记录参数。</li><li>把证据按“劳动关系、工资、工时、解除事实、沟通记录”分文件夹。</li><li>给每份证据命名日期和来源，例如“2026-05工资流水-银行导出”。</li><li>截图保留完整聊天对象、时间、上下文，不只截单句话。</li><li>金额较大时，带着清单向律师/劳动仲裁咨询机构复核。</li><li>仅提交必要材料，身份证号、银行卡等敏感信息先做脱敏备份。</li></ol></div><h2>模板包入口</h2><p>需要把本清单变成表格，可进入模板包页面查看“证据清单、加班台账、年假台账、离职补偿测算表”。</p><p><a class="btn" href="${url('/templates/')}">查看劳动权益模板包</a><a class="btn secondary" href="mailto:${email}?subject=劳动仲裁证据清单模板候补">申请证据清单模板候补</a></p><div class="danger"><b>免责声明：</b>本页仅用于材料整理和自查，不构成法律意见；具体证据采信和金额认定以当地法规、仲裁/法院及专业人士意见为准。</div>`);
simplePage('templates','劳动权益模板包｜证据清单、加班台账、年假台账、离职补偿测算表','劳动权益计算器配套模板包清单，适合个人维权自查、HR合规台账和律师咨询前材料整理。',`<p class="lead">把计算结果转成可复核材料：先按模板整理证据、金额和时间线，再决定是否咨询律师或劳动仲裁机构。</p><div class="grid"><div class="card"><h3>个人维权材料包</h3><p>包含劳动合同/工资流水/社保/考勤/解除通知证据清单、仲裁请求金额拆分表、沟通记录整理表。</p><p><span class="pill">离职补偿</span><span class="pill">加班费</span><span class="pill">未休年假</span></p></div><div class="card"><h3>HR合规台账包</h3><p>包含加班审批台账、调休记录、年假余额台账、病假工资核算记录，便于企业做低风险自查。</p><p><span class="pill">HR合规</span><span class="pill">台账</span><span class="pill">复核</span></p></div><div class="card"><h3>咨询前准备清单</h3><p>面向律师/咨询机构线索转化：用户先补齐关键事实，减少无效沟通，提高付费咨询转化率。</p><p><span class="pill">律师线索</span><span class="pill">咨询转化</span></p></div></div><h2>适合搜索的问题</h2><div class="card list"><a href="${url('/guides/labor-arbitration-evidence-checklist/')}">劳动仲裁证据清单怎么整理</a><a href="${url('/tools/severance/')}">离职补偿N+1证据清单</a><a href="${url('/tools/overtime-pay/')}">加班费计算表模板</a><a href="${url('/tools/annual-leave/')}">未休年假台账模板</a><a href="${url('/tools/sick-pay/')}">病假工资核算模板</a></div><h2>获取方式</h2><p>当前先开放候补和合作咨询，不收集敏感个人信息。需要模板包、赞助或联合线索页，请邮件说明城市、角色和使用场景。</p><p><a class="btn" href="mailto:${email}?subject=劳动权益模板包候补">申请模板包候补：${email}</a><a class="btn secondary" href="${url('/sponsor/')}">查看合作模式</a></p><div class="danger"><b>提示：</b>模板只用于材料整理和金额复核，不构成法律意见。</div>`);
simplePage('sponsor','合作变现｜律师线索、企业合规、模板包赞助','劳动权益计算器合作变现入口。',`<p class="lead">本站目标是通过劳动权益长尾搜索获取高意向用户，再用合作广告、律师/咨询线索、企业HR合规工具包和模板包变现。</p><div class="grid"><div class="card"><h3>律师/咨询合作</h3><p>适合劳动争议律师、劳动仲裁咨询、企业合规顾问获取高意向咨询线索。</p></div><div class="card"><h3>企业HR工具包</h3><p>可扩展为裁员测算、加班合规、年假台账、病假工资台账等付费模板。</p></div><div class="card"><h3>广告/赞助位</h3><p>城市页、工具页可投放合规服务入口。早期按月低价测试，后期按线索价值定价。</p></div></div><p><a class="btn" href="mailto:${email}?subject=劳动权益计算器合作">联系合作：${email}</a></p>`);
simplePage('contact','联系/合作','劳动权益计算器联系合作方式。',`<p>合作、赞助、纠错、模板包销售入口开通，请邮件联系：</p><p><a class="btn" href="mailto:${email}">${email}</a></p>`);
simplePage('privacy','隐私政策','隐私政策。',`<p>本站目前为静态工具站，计算过程在浏览器本地完成，不主动收集身份证号、手机号、工资流水等敏感信息。若通过邮件联系，邮件内容由用户主动提供。</p>`);
simplePage('terms','使用条款与免责声明','使用条款与免责声明。',`<p>本站所有计算结果仅供个人估算参考，不构成法律、税务、仲裁或诉讼意见。具体金额需结合劳动合同、工资记录、考勤证据、当地规定和专业人士意见判断。</p>`);

const urls = [];
urls.push('/'); urls.push('/tools/'); urls.push('/cities/'); urls.push('/guides/labor-arbitration-evidence-checklist/'); urls.push('/templates/'); urls.push('/sponsor/'); urls.push('/contact/'); urls.push('/privacy/'); urls.push('/terms/');
for (const t of Object.values(tools)) urls.push(`/tools/${t.slug}/`);
for (const city of uniqueCities) for (const t of Object.values(tools)) urls.push(`/cities/${city[0]}/${t.slug}/`);
asset('sitemap.xml', `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.map(u=>`  <url><loc>${absUrl(u)}</loc></url>`).join('\n')}\n</urlset>`);
asset('robots.txt', `User-agent: *\nAllow: /\nSitemap: ${absUrl('/sitemap.xml')}\n`);
asset('page-manifest.json', JSON.stringify({siteUrl, basePath, pages: urls.length, cities: uniqueCities.length, tools: Object.keys(tools).length, generatedAt: new Date().toISOString()}, null, 2));
console.log(`Built ${urls.length} pages to ${outDir}`);
