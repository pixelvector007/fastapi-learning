// Shared: theme toggle + helpers
(function(){
  const saved=(()=>{try{return localStorage.getItem('theme')}catch(_){return null}})();
  const prefersDark=matchMedia('(prefers-color-scheme: dark)').matches;
  document.documentElement.dataset.theme=saved||(prefersDark?'dark':'light');
})();
const $=s=>document.querySelector(s);
const bmiOf=(h,w)=>Math.round(w/(h*h)*100)/100;
const verdictOf=b=>b<18.5?'Underweight':b<25?'Normal':b<30?'Overweight':'Obese';
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
function toast(m){const t=$('#toast');if(!t)return;t.textContent=m;t.classList.add('show');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('show'),2600)}
document.addEventListener('DOMContentLoaded',()=>{
  const b=$('#themeBtn');
  if(b){
    const sync=()=>b.textContent=document.documentElement.dataset.theme==='dark'?'☀':'☾';
    sync();
    b.onclick=()=>{
      const n=document.documentElement.dataset.theme==='dark'?'light':'dark';
      document.documentElement.dataset.theme=n;
      try{localStorage.setItem('theme',n)}catch(_){}
      sync();
    };
  }
  const y=$('#year');if(y)y.textContent=new Date().getFullYear();
});
