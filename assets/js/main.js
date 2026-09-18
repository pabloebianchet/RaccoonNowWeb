// ── PARTNERS TRACK ─────────────────────────────────────
const PARTNERS=[
  {slug:'amazonaws',label:'AWS'},
  {slug:'googlecloud',label:'Google Cloud'},
  {slug:'microsoftazure',label:'Azure'},
  {slug:'openai',label:'OpenAI'},
  {slug:'anthropic',label:'Claude'},
  {slug:'chatgpt',label:'ChatGPT'},
  {slug:'n8n',label:'n8n'},
  {slug:'make',label:'Make'},
  {slug:'huggingface',label:'HuggingFace'},
  {slug:'zapier',label:'Zapier'},
  {slug:'firebase',label:'Firebase'},
  {slug:'supabase',label:'Supabase'},
  {slug:'docker',label:'Docker'},
  {slug:'react',label:'React'},
  {slug:'python',label:'Python'},
  {slug:'langchain',label:'LangChain'},
];
function buildPartnerTrack(id){
  const t=document.getElementById(id);
  if(!t)return;
  const all=[...PARTNERS,...PARTNERS];
  all.forEach(p=>{
    const d=document.createElement('div');
    d.className='p-badge';
    d.innerHTML=`<img src="https://cdn.simpleicons.org/${p.slug}/ffffff" width="24" height="24" alt="${p.label}" loading="lazy"/>${p.label}`;
    t.appendChild(d);
  });
}
buildPartnerTrack('pt1');

// ── FAQ ACCORDION ──────────────────────────────────────
document.querySelectorAll('.acc-item').forEach(div=>{
  const head=div.querySelector('.acc-head'),body=div.querySelector('.acc-body'),inner=div.querySelector('.acc-body-inner');
  head.addEventListener('click',()=>{
    const isOpen=div.classList.contains('open');
    document.querySelectorAll('.acc-item.open').forEach(el=>{el.classList.remove('open');el.querySelector('.acc-body').style.maxHeight='0';});
    if(!isOpen){div.classList.add('open');body.style.maxHeight=inner.scrollHeight+'px';}
  });
});

// ── TESTIMONIALS ──────────────────────────────────────
const tt=document.getElementById('testiTrack');
const td=document.getElementById('testiDots');
let tIdx=0;
if(tt&&td&&window.TESTI){
  window.TESTI.forEach((t,i)=>{
    const s=document.createElement('div');s.className='testi-slide';
    s.innerHTML=`<div class="testi-card"><div class="testi-q" aria-hidden="true">"</div><div class="testi-stars">★★★★★</div><p class="testi-text">"${t.text}"</p><div class="testi-author"><div class="testi-av" aria-hidden="true">${t.init}</div><div><div class="testi-name">${t.name}</div><div class="testi-role">${t.role}</div></div></div></div>`;
    tt.appendChild(s);
    const d=document.createElement('div');d.className='tnav-dot'+(i===0?' on':'');
    d.addEventListener('click',()=>goT(i));td.appendChild(d);
  });
  function goT(i){
    const n=window.TESTI.length;
    tIdx=((i%n)+n)%n;
    tt.style.transform=`translateX(${-tIdx*100}%)`;
    td.querySelectorAll('.tnav-dot').forEach((d,j)=>d.classList.toggle('on',j===tIdx));
  }
  document.getElementById('tPrev').addEventListener('click',()=>goT(tIdx-1));
  document.getElementById('tNext').addEventListener('click',()=>goT(tIdx+1));
  setInterval(()=>goT(tIdx+1),6000);
}

// ── NAV ───────────────────────────────────────────────
const navEl=document.getElementById('nav');
window.addEventListener('scroll',()=>navEl.classList.toggle('stuck',window.scrollY>40),{passive:true});
document.getElementById('burger').addEventListener('click',()=>document.getElementById('navLinks').classList.toggle('open'));
document.querySelectorAll('#navLinks a').forEach(a=>a.addEventListener('click',()=>document.getElementById('navLinks').classList.remove('open')));

// ── COUNTER ANIMATION ─────────────────────────────────
function animateCounter(el){
  const target=+el.dataset.target;
  const suffix=el.dataset.suffix||'+';
  const dur=1800,step=16;
  let current=0;
  const inc=target/(dur/step);
  const t=setInterval(()=>{
    current=Math.min(current+inc,target);
    el.textContent=Math.floor(current)+suffix;
    if(current>=target)clearInterval(t);
  },step);
}
const counterObs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){animateCounter(e.target);counterObs.unobserve(e.target);}});
},{threshold:.5});
document.querySelectorAll('.hstat-n').forEach(el=>counterObs.observe(el));

// ── SCROLL REVEAL ─────────────────────────────────────
const ro=new IntersectionObserver(entries=>{
  entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');ro.unobserve(e.target);}});
},{threshold:.08});
document.querySelectorAll('.rv,.rv2,.rv3,.rv-l').forEach(el=>ro.observe(el));

// ── CARD TILT ─────────────────────────────────────────
document.querySelectorAll('.office-card,.why-card,.svc-card').forEach(card=>{
  card.addEventListener('mousemove',e=>{
    const r=card.getBoundingClientRect();
    const x=(e.clientX-r.left-r.width/2)/(r.width/2);
    const y=(e.clientY-r.top-r.height/2)/(r.height/2);
    card.style.transform=`perspective(800px) rotateY(${x*8}deg) rotateX(${-y*8}deg) translateY(-6px)`;
  });
  card.addEventListener('mouseleave',()=>{card.style.transform='';});
});

// ── BLOG PAGINATION ────────────────────────────────────
(function(){
  const grid=document.querySelector('.blog-grid');
  const pager=document.getElementById('blogPager');
  if(!grid||!pager)return;
  const PAGE_SIZE=6;
  const cards=Array.from(grid.children);
  const pages=Math.ceil(cards.length/PAGE_SIZE);
  if(pages<=1)return;
  let current=1;
  function render(){
    cards.forEach((card,i)=>{
      card.style.display=(i>=(current-1)*PAGE_SIZE && i<current*PAGE_SIZE)?'':'none';
    });
    pager.innerHTML='';
    const mk=(label,page,disabled,active)=>{
      const b=document.createElement('button');
      b.className='blog-pager-btn'+(active?' active':'');
      b.textContent=label;
      b.disabled=!!disabled;
      b.addEventListener('click',()=>{current=page;render();grid.scrollIntoView({behavior:'smooth',block:'start'});});
      return b;
    };
    pager.appendChild(mk('←',Math.max(1,current-1),current===1));
    for(let p=1;p<=pages;p++) pager.appendChild(mk(String(p),p,false,p===current));
    pager.appendChild(mk('→',Math.min(pages,current+1),current===pages));
  }
  render();
})();
