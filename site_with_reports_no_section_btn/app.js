
// === Rapports de projets à télécharger ===
const REPORTS_MAP = {
  'SAE21': 'SAÉ 21_rapport_JUILLET_OLIVER.pdf',
  'SAE12': 'JUILLET_Etienne_sae12_compte-rendu2-4.pdf',
  'SAE13': 'Juillet_Etienne-SAE13-Rapport.pdf',
  'PHOTO_ATB': 'Thales05_SAE15_Rapport (6).pdf',
  'POTO ATB': 'Thales05_SAE15_Rapport (6).pdf'
};
/* =========================
   Portfolio — JS responsive & accessible
   ========================= */

// Tabs actifs au scroll
const tabs = document.querySelectorAll('.tab');
const secIds = ['accueil','projets','competences','contact'];
const secs = secIds.map(id=>document.getElementById(id));
const io = new IntersectionObserver((entries)=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      tabs.forEach(t=>t.classList.toggle('active', t.getAttribute('href') === '#' + e.target.id));
      document.body.dataset.current = e.target.id;
    }
  });
}, {rootMargin: '-35% 0px -55% 0px'});
secs.forEach(s=> s && io.observe(s));
// Valeur par défaut pour le bouton 'remonter section précédente'
if(!document.body.dataset.current){ document.body.dataset.current = secIds[0]; }

// Défilement doux (respecte reduced motion)
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
function smoothScrollTo(el){
  if(!el) return;
  el.scrollIntoView({behavior: prefersReduced ? 'auto' : 'smooth', block:'start'});
}

document.querySelectorAll('a[href^="#"]').forEach(a=>{
  a.addEventListener('click', (e)=>{
    const id = a.getAttribute('href').slice(1);
    const el = document.getElementById(id);
    if(el){ e.preventDefault(); smoothScrollTo(el); }
  });
});

// Boutons flottants
const btnTop = document.getElementById('btn-top');
const btnUpOne = document.getElementById('btn-up-one');
btnTop?.addEventListener('click', ()=> window.scrollTo({top:0,behavior: prefersReduced ? 'auto' : 'smooth'}));
btnUpOne?.addEventListener('click', ()=>{
  const current = document.body.dataset.current;
  const idx = secIds.indexOf(current);
  if(idx>0){ smoothScrollTo(document.getElementById(secIds[idx-1])); }
});

// Modale projets (verrouille le scroll en ouverture)
const modal = document.getElementById('project-modal');
const modalTitle = document.getElementById('modal-title');
const modalImg = document.getElementById('modal-img');
const modalDesc = document.getElementById('modal-desc');
const modalClose = document.getElementById('modal-close');
const modalActions = document.getElementById('modal-actions');
let lastFocused = null;

function openModalFrom(card){
  // Injecter bouton rapport si disponible
  const titleText = (card.querySelector('h3')?.textContent || '').trim();
  const key = titleText.toUpperCase();
  if (modalActions){
    modalActions.innerHTML = '';
    const reportPath = REPORTS_MAP[key];
    if(reportPath){
      const a = document.createElement('a');
      a.className = 'cv';
      a.href = reportPath;
      a.setAttribute('download','');
      a.textContent = 'TÉLÉCHARGER LE RAPPORT';
      a.target = '_blank';
      modalActions.appendChild(a);
    }
  }

  lastFocused = card;
  modalTitle.textContent = card.dataset.title || card.querySelector('h3')?.textContent || 'Projet';
  if(card.dataset.img){ modalImg.src = card.dataset.img; modalImg.alt = card.querySelector('img')?.alt || ''; }
  modalDesc.textContent = card.dataset.long || '';
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.documentElement.style.overflow='hidden';
  modalClose?.focus();
}
function closeModal(){
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.documentElement.style.overflow='';
  if(lastFocused) lastFocused.focus();
}

document.getElementById('projects-grid')?.addEventListener('click', (e)=>{
  const card = e.target.closest('.project');
  if(card) openModalFrom(card);
});
document.getElementById('projects-grid')?.addEventListener('keydown', (e)=>{
  if((e.key==='Enter' || e.key===' ') && e.target.classList.contains('project')){
    e.preventDefault();
    openModalFrom(e.target);
  }
});
modal?.addEventListener('click', (e)=>{ if(e.target === modal) closeModal(); });
modalClose?.addEventListener('click', closeModal);
window.addEventListener('keydown', (e)=>{ if(e.key==='Escape' && modal?.classList.contains('open')) closeModal(); });

// Année dynamique
document.getElementById('y').textContent = new Date().getFullYear();


// === Visionneuse plein écran — ouverture sur clic de #modal-img ===
(function(){
  const modalImgEl = document.getElementById('modal-img');
  const viewerEl = document.getElementById('img-viewer');
  const viewerImgEl = document.getElementById('iv-img');
  const viewerCloseBtn = document.getElementById('iv-close');

  if(!viewerEl || !viewerImgEl) return;

  function openImageViewer(src, alt=''){
    viewerImgEl.src = src;
    viewerImgEl.alt = alt || '';
    viewerEl.classList.add('open');
    viewerEl.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow='hidden';
    document.body.style.overflow='hidden';
  }
  function closeImageViewer(){
    viewerEl.classList.remove('open');
    viewerEl.setAttribute('aria-hidden', 'true');
    document.documentElement.style.overflow='';
    document.body.style.overflow='';
    viewerImgEl.src='';
  }

  // Délégation sûre: si l'image est réassignée plus tard, on écoute sur le document
  document.addEventListener('click', (e)=>{
    const t = e.target;
    if(t && t.id === 'modal-img' && t.tagName === 'IMG' && t.src){
      openImageViewer(t.src, t.alt);
    }
  });

  viewerEl.addEventListener('click', (e)=>{
    if(e.target === viewerEl || e.target === viewerImgEl){ closeImageViewer(); }
  });
  viewerCloseBtn.addEventListener('click', closeImageViewer);
  window.addEventListener('keydown', (e)=>{
    if(e.key === 'Escape' && viewerEl.classList.contains('open')) closeImageViewer();
  });
})();

