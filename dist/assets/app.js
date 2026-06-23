
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
