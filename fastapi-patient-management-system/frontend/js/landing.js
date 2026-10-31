// Landing page: BMI calculator + live stats from the API (if reachable)
function calc(){
  const h=parseFloat($('#cH').value),w=parseFloat($('#cW').value),r=$('#res');
  if(!(h>0&&w>0)){r.innerHTML='<span style="color:var(--muted)">Enter height and weight to see your BMI.</span>';return}
  const b=bmiOf(h,w),v=verdictOf(b);
  r.innerHTML=`<b class="${v}">${b.toFixed(2)}</b><span class="badge ${v}">${v}</span>`;
}
['#cH','#cW'].forEach(s=>$(s).addEventListener('input',calc));
calc();

(async()=>{
  try{
    const r=await fetch('/view');if(!r.ok)return;
    const d=Object.values(await r.json());
    $('#liveCount').textContent=d.length;
    $('#liveAvg').textContent=d.length?(d.reduce((s,p)=>s+bmiOf(p.height,p.weight),0)/d.length).toFixed(1):'–';
  }catch(_){}
})();
