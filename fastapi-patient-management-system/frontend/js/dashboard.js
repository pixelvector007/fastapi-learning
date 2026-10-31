const SAMPLE={"P001":{"name":"Ananya Verma","city":"Guwahati","age":28,"gender":"female","height":1.65,"weight":90},"P002":{"name":"Ravi Mehta","city":"Mumbai","age":35,"gender":"male","height":1.75,"weight":85},"P003":{"name":"Sneha Kulkarni","city":"Pune","age":22,"gender":"female","height":1.6,"weight":45},"P004":{"name":"Arjun Verma","city":"Mumbai","age":40,"gender":"male","height":1.8,"weight":90},"P005":{"name":"Neha Sinha","city":"Kolkata","age":30,"gender":"female","height":1.55,"weight":75},"P006":{"name":"Himanshu","city":"Agra","age":20,"gender":"male","height":1.72,"weight":50},"P007":{"name":"Saumya","city":"Pratapgarh","age":20,"gender":"male","height":1.72,"weight":60}};
let live=false,patients={},editing=null;
const KEY='patientcare_demo';
function persist(){try{localStorage.setItem(KEY,JSON.stringify(patients))}catch(_){}}

async function api(method,path,body){
  const r=await fetch(path,{method,headers:body?{'Content-Type':'application/json'}:{},body:body?JSON.stringify(body):undefined});
  const j=await r.json().catch(()=>({}));
  if(!r.ok){
    let d=j.detail;
    if(Array.isArray(d))d=d.map(e=>(e.loc||[]).slice(-1)[0]+': '+e.msg).join('; ');
    throw new Error(d||('Request failed ('+r.status+')'));
  }
  return j;
}
const store={
  load:async()=>live?api('GET','/view'):JSON.parse(JSON.stringify(patients)),
  async create(p){if(live)return api('POST','/create',p);if(patients[p.id])throw new Error('Patient already Exists');const{id,...rest}=p;patients[id]=rest;persist()},
  async update(id,p){if(live)return api('PUT','/edit/'+encodeURIComponent(id),p);patients[id]={...patients[id],...p};persist()},
  async remove(id){if(live)return api('DELETE','/delete/'+encodeURIComponent(id));delete patients[id];persist()}
};

function list(){
  const q=$('#q').value.trim().toLowerCase(),f=$('#filter').value,key=$('#sortBy').value,dir=$('#order').value==='desc'?-1:1;
  let rows=Object.entries(patients).map(([id,p])=>{const bmi=bmiOf(p.height,p.weight);return{id,...p,bmi,verdict:verdictOf(bmi)}});
  if(f)rows=rows.filter(r=>r.verdict===f);
  if(q)rows=rows.filter(r=>(r.id+r.name+r.city).toLowerCase().includes(q));
  rows.sort((a,b)=>{const x=a[key],y=b[key];return(typeof x==='string'?x.localeCompare(y,undefined,{numeric:true}):x-y)*dir});
  return rows;
}
function render(){
  const vals=Object.values(patients),all=vals.map(p=>verdictOf(bmiOf(p.height,p.weight))),n=all.length;
  const avg=n?(vals.reduce((s,p)=>s+bmiOf(p.height,p.weight),0)/n).toFixed(1):'–';
  const cnt=v=>all.filter(x=>x===v).length;
  const V=['Underweight','Normal','Overweight','Obese'];
  $('#stats').innerHTML=`<div class="stat"><b>${n}</b><span>Total patients</span></div><div class="stat"><b>${avg}</b><span>Average BMI</span></div>`+V.map(v=>`<div class="stat"><b class="${v}">${cnt(v)}</b><span>${v}</span></div>`).join('');
  const col={Underweight:'var(--under)',Normal:'var(--normal)',Overweight:'var(--over)',Obese:'var(--obese)'};
  $('#bar').innerHTML=n?V.map(v=>`<i style="width:${cnt(v)/n*100}%;background:${col[v]}"></i>`).join(''):'';
  const rows=list();
  $('#rows').innerHTML=rows.length?rows.map(r=>`<tr><td class="id">${esc(r.id)}</td><td class="name"><div class="who"><span class="av">${esc(r.name.split(" ").map(w=>w[0]).slice(0,2).join("").toUpperCase())}</span>${esc(r.name)}</div></td><td>${esc(r.city)}</td><td>${r.age}</td><td>${esc(r.gender)}</td><td>${r.height} m</td><td>${r.weight} kg</td><td>${r.bmi.toFixed(2)}</td><td><span class="badge ${r.verdict}">${r.verdict}</span></td><td><div class="acts"><button class="btn sm" data-edit="${esc(r.id)}">Edit</button><button class="btn sm danger" data-del="${esc(r.id)}">Delete</button></div></td></tr>`).join(''):'<tr><td colspan="10" class="empty">No patients match.</td></tr>';
}
async function refresh(){try{patients=await store.load();render()}catch(e){toast(e.message)}}

function preview(){const h=parseFloat($('#fH').value),w=parseFloat($('#fW').value);$('#prev').textContent=(h>0&&w>0)?`BMI ${bmiOf(h,w).toFixed(2)} · ${verdictOf(bmiOf(h,w))}`:''}
function openForm(id){
  editing=id||null;$('#err').textContent='';
  $('#dTitle').textContent=id?'Edit '+id:'New patient';
  const p=id?patients[id]:{name:'',city:'',age:'',gender:'male',height:'',weight:''};
  $('#fId').value=id||'';$('#fId').disabled=!!id;
  $('#fName').value=p.name;$('#fCity').value=p.city;$('#fAge').value=p.age;$('#fGender').value=p.gender;$('#fH').value=p.height;$('#fW').value=p.weight;
  preview();$('#dlg').showModal();
}
$('#f').addEventListener('input',preview);
$('#cancel').onclick=()=>$('#dlg').close();
$('#f').addEventListener('submit',async e=>{
  e.preventDefault();
  const body={name:$('#fName').value.trim(),city:$('#fCity').value.trim(),age:parseInt($('#fAge').value,10),gender:$('#fGender').value,height:parseFloat($('#fH').value),weight:parseFloat($('#fW').value)};
  const id=$('#fId').value.trim();
  if(!id&&!editing)return $('#err').textContent='ID is required (e.g. P008).';
  if(!body.name||!body.city||!(body.age>0&&body.age<120)||!(body.height>0)||!(body.weight>0))return $('#err').textContent='Fill every field with valid values (age 1–119).';
  try{
    if(editing){await store.update(editing,body);toast('Patient updated')}else{await store.create({id,...body});toast('Patient created')}
    $('#dlg').close();await refresh();
  }catch(er){$('#err').textContent=er.message}
});
$('#addBtn').onclick=()=>openForm();
$('#rows').addEventListener('click',async e=>{
  const ed=e.target.closest('[data-edit]'),dl=e.target.closest('[data-del]');
  if(ed)openForm(ed.dataset.edit);
  if(dl&&confirm('Delete patient '+dl.dataset.del+'?')){try{await store.remove(dl.dataset.del);toast('Patient deleted');await refresh()}catch(er){toast(er.message)}}
});
['#q','#sortBy','#order','#filter'].forEach(s=>$(s).addEventListener('input',render));

async function detect(){
  for(let i=0;i<2;i++){
    try{const c=new AbortController();const t=setTimeout(()=>c.abort(),2500);const r=await fetch('/health',{signal:c.signal});clearTimeout(t);const j=await r.json();if(r.ok&&j.status==='OK')return true}catch(_){}
  }
  return false;
}
$('#exportBtn').onclick=()=>{
  const rows=list();if(!rows.length)return toast('Nothing to export');
  const cols=['id','name','city','age','gender','height','weight','bmi','verdict'];
  const csv=[cols.join(',')].concat(rows.map(r=>cols.map(c=>'"'+String(r[c]).replace(/"/g,'""')+'"').join(','))).join('\n');
  const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download='patients.csv';a.click();URL.revokeObjectURL(a.href);
};
(async()=>{
  live=await detect();
  if(!live){
    try{patients=JSON.parse(localStorage.getItem(KEY))||null}catch(_){patients=null}
    if(!patients)patients=JSON.parse(JSON.stringify(SAMPLE));
  }
  $('#mode').classList.toggle('live',live);
  $('#modeText').textContent=live?'Connected to API':'Demo mode · saved in this browser';
  live?refresh():render();
})();
