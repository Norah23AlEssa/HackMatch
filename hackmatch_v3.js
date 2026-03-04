'use strict';
/* ── STATE ── */
const state = {
  lang: 'en',
  modalOpen: false,
  mobileMenuOpen: false,
  countersAnimated: false,
  breakdownAnimated: false,
  users: [],
  currentUser: null,
  activeChat: null,
  messages: {},
  githubConnected: false,
  githubUsername: '',
  theme: 'light',
};

/* ── HELPERS ── */
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

/* ── DASHBOARD DATA ── */
const DASHBOARD_DATA = {
  matches: [
    { name: 'LEAP 2026 Hackathon 🇸🇦', match: '96%', successRate: '78%', deadline: { en: 'Feb 9–12, 2026', ar: '9–12 فبراير 2026' }, prize: '🏆 SAR 200,000', format: { en: '📍 Riyadh', ar: '📍 الرياض' }, tags: ['AI', 'ML', 'Vision 2030'], url: 'https://www.leap.sa' },
    { name: 'GITEX Future Hack 🇦🇪', match: '89%', successRate: '71%', deadline: { en: 'Oct 13–17, 2026', ar: '13–17 أكتوبر 2026' }, prize: '🏆 $75,000', format: { en: '📍 Dubai', ar: '📍 دبي' }, tags: ['Fintech', 'AI', 'Open'], url: 'https://www.gitex.com' },
    { name: 'MIT Hacking Medicine ✈️', match: '83%', successRate: '69%', deadline: { en: 'Mar 14–16, 2026', ar: '14–16 مارس 2026' }, prize: '🏆 $35,000', format: { en: '📍 Boston, USA', ar: '📍 بوسطن، أمريكا' }, tags: ['HealthTech', 'AI', 'Abroad'], url: 'https://hackingmedicine.mit.edu' },
  ],
  gcc: [
    { name: 'LEAP 2026 Hackathon 🇸🇦', match: '96%', successRate: '78%', deadline: { en: 'Feb 9–12, 2026', ar: '9–12 فبراير 2026' }, prize: '🏆 SAR 200,000', format: { en: '📍 Riyadh', ar: '📍 الرياض' }, tags: ['AI', 'ML'], url: 'https://www.leap.sa' },
    { name: 'Vision 2030 Challenge 🇸🇦', match: '91%', successRate: '65%', deadline: { en: 'Apr 5–7, 2026', ar: '5–7 أبريل 2026' }, prize: '🏆 SAR 500,000', format: { en: '📍 NEOM', ar: '📍 نيوم' }, tags: ['SmartCity', 'IoT'], url: 'https://www.vision2030.gov.sa' },
    { name: 'Qatar Robohack 2026 🇶🇦', match: '85%', successRate: '73%', deadline: { en: 'Feb 22–24, 2026', ar: '22–24 فبراير 2026' }, prize: '🏆 QAR 50,000', format: { en: '📍 Doha', ar: '📍 الدوحة' }, tags: ['Robotics', 'AI'], url: '#' },
  ],
  abroad: [
    { name: 'HackTheNorth 2026 🇨🇦', match: '85%', successRate: '74%', deadline: { en: 'Sep 4–6, 2026', ar: '4–6 سبتمبر 2026' }, prize: '🏆 $50,000+', format: { en: '📍 Waterloo, Canada', ar: '📍 ووترلو، كندا' }, tags: ['Open', 'AI', 'Abroad'], url: 'https://hackthenorth.com' },
    { name: 'TechCrunch Disrupt 🇺🇸', match: '82%', successRate: '62%', deadline: { en: 'Oct 26–28, 2026', ar: '26–28 أكتوبر 2026' }, prize: '🏆 $60,000', format: { en: '📍 San Francisco', ar: '📍 سان فرانسيسكو' }, tags: ['Startup', 'AI', 'Web3'], url: 'https://techcrunch.com/events/tc-disrupt-2026' },
    { name: 'NASA Space Apps 🌐', match: '79%', successRate: '81%', deadline: { en: 'Oct 3–5, 2026', ar: '3–5 أكتوبر 2026' }, prize: '🏆 Global Recognition', format: { en: '🌐 Virtual + Local Hubs', ar: '🌐 افتراضي + مراكز محلية' }, tags: ['Space', 'Data'], url: 'https://www.spaceappschallenge.org' },
  ],
  expiring: [
    { name: 'Hajj Tech Hackathon 🇸🇦', match: '84%', successRate: '72%', deadline: { en: 'Closing Soon ⚠️', ar: 'إغلاق قريب ⚠️' }, prize: '🏆 SAR 100,000', format: { en: '📍 Makkah Region', ar: '📍 منطقة مكة' }, tags: ['SmartCity', 'IoT'], url: '#' },
    { name: 'Bahrain FinTech Bay Hack 🇧🇭', match: '82%', successRate: '70%', deadline: { en: 'Apr 14 ⚠️', ar: '14 أبريل ⚠️' }, prize: '🏆 $20,000', format: { en: '📍 Manama', ar: '📍 المنامة' }, tags: ['Fintech', 'Blockchain'], url: '#' },
    { name: 'Kuwait Digital Hack 🇰🇼', match: '78%', successRate: '55%', deadline: { en: 'Mar 1 ⚠️', ar: '1 مارس ⚠️' }, prize: '🏆 KWD 15,000', format: { en: '📍 Kuwait City', ar: '📍 مدينة الكويت' }, tags: ['GovTech', 'Data'], url: '#' },
  ],
  saved: [
    { name: 'Abu Dhabi AI Hackathon 🇦🇪', match: '87%', successRate: '68%', deadline: { en: 'Mar 20–22, 2026', ar: '20–22 مارس 2026' }, prize: '🏆 AED 250,000', format: { en: '📍 ADNEC', ar: '📍 أبوظبي' }, tags: ['AI', 'ML'], url: 'https://www.adgm.com' },
    { name: 'Junction Berlin 2026 🇩🇪', match: '76%', successRate: '57%', deadline: { en: 'Apr 17–19, 2026', ar: '17–19 أبريل 2026' }, prize: '🏆 €25,000', format: { en: '📍 Berlin, Germany', ar: '📍 برلين، ألمانيا' }, tags: ['CleanTech', 'Hardware'], url: 'https://www.junction2024.com' },
    { name: 'QSTP Tech Hackathon 🇶🇦', match: '79%', successRate: '66%', deadline: { en: 'Nov 3–5, 2026', ar: '3–5 نوفمبر 2026' }, prize: '🏆 QAR 30,000', format: { en: '📍 Doha', ar: '📍 الدوحة' }, tags: ['Tech', 'Open'], url: '#' },
  ],
};

/* ── SIMULATED USERS for partner matching ── */
const PLATFORM_USERS = [
  { id: 1, name: 'Reem Al-Zahrani', role: 'ML Engineer · KAUST', avatar: '👩‍🔬', skills: ['Python', 'ML/AI', 'Data Science', 'Arabic NLP'], match: 94, location: 'Jeddah 🇸🇦', arabic: false, bio: 'Specializing in computer vision and Arabic NLP systems for Vision 2030 projects.' },
  { id: 2, name: 'Tariq Al-Balushi', role: 'Backend Dev · Sultan Qaboos Uni', avatar: '👨‍💻', skills: ['Node.js', 'Cloud/AWS', 'Python', 'Cybersecurity'], match: 89, location: 'Muscat 🇴🇲', arabic: false, bio: 'Cloud architecture expert with 6 hackathon wins across the GCC.' },
  { id: 3, name: 'Mariam Al-Dosari', role: 'UX Designer · QU', avatar: '👩‍🎨', skills: ['Figma', 'React', 'EdTech', 'Smart Cities'], match: 86, location: 'Doha 🇶🇦', arabic: false, bio: 'Design-thinking enthusiast bridging user experience and cutting-edge tech.' },
  { id: 4, name: 'يوسف المطيري', role: 'مطور بيانات · جامعة الملك عبدالله', avatar: '🧑‍💼', skills: ['Python', 'Data Science', 'ML/AI', 'FinTech'], match: 82, location: 'الرياض 🇸🇦', arabic: true, bio: 'متخصص في تحليل البيانات وتطوير حلول الذكاء الاصطناعي لقطاع المال والأعمال.' },
  { id: 5, name: 'نور الشمري', role: 'مطورة بلوكتشين · الجامعة الأمريكية', avatar: '👩‍💻', skills: ['Blockchain', 'Cybersecurity', 'FinTech', 'Web3'], match: 78, location: 'الكويت 🇰🇼', arabic: true, bio: 'رائدة في تقنية البلوكتشين والمدفوعات الرقمية، فازت 3 مرات في هاكاثونات الخليج.' },
];

/* ── SKILL BOOSTER RESOURCES ── */
const RESOURCES = [
  { title: 'fast.ai — Practical Deep Learning', desc: 'World-class free course on ML/AI by fast.ai — used by professionals worldwide.', url: 'https://www.fast.ai', logo: '🤖', badge: 'free', filter: 'ai' },
  { title: 'DeepLearning.AI Specialization', desc: 'Andrew Ng\'s complete deep learning curriculum on Coursera — industry standard.', url: 'https://www.deeplearning.ai', logo: '🧠', badge: 'paid', filter: 'ai' },
  { title: 'Hugging Face — NLP & LLMs', desc: 'Free NLP and large language model tutorials. Perfect for Arabic NLP work.', url: 'https://huggingface.co/learn', logo: '🤗', badge: 'free', filter: 'ai' },
  { title: 'The Odin Project — Web Dev', desc: 'Comprehensive free full-stack curriculum covering HTML, CSS, JS, React, and Node.', url: 'https://www.theodinproject.com', logo: '⚔️', badge: 'free', filter: 'web' },
  { title: 'Frontend Masters', desc: 'Expert-led courses on React, TypeScript, CSS, and modern web architecture.', url: 'https://frontendmasters.com', logo: '💻', badge: 'paid', filter: 'web' },
  { title: 'Scrimba — Interactive Coding', desc: 'Interactive React, JavaScript, and web dev courses with a unique code-along format.', url: 'https://scrimba.com', logo: '🎯', badge: 'free', filter: 'web' },
  { title: 'Kaggle — Data Science Practice', desc: 'Free datasets, notebooks, and competitions to sharpen your data science skills.', url: 'https://www.kaggle.com', logo: '📊', badge: 'free', filter: 'data' },
  { title: 'DataCamp — Data Science Paths', desc: 'Structured data science and analytics courses with hands-on coding exercises.', url: 'https://www.datacamp.com', logo: '📈', badge: 'paid', filter: 'data' },
  { title: 'Mode Analytics — SQL for DS', desc: 'Free SQL tutorial designed specifically for data science and analytics workflows.', url: 'https://mode.com/sql-tutorial', logo: '🗄️', badge: 'free', filter: 'data' },
  { title: 'Google UX Design Certificate', desc: 'Google\'s professional UX design program on Coursera — portfolio-focused.', url: 'https://grow.google/certificates/ux-design', logo: '🎨', badge: 'paid', filter: 'design' },
  { title: 'Figma Learn — Design Basics', desc: 'Official Figma tutorials to master the industry standard design tool.', url: 'https://help.figma.com/hc/en-us/categories/360002051613', logo: '🖌️', badge: 'free', filter: 'design' },
  { title: 'Refactoring UI — Design Book', desc: 'Practical design advice for developers. Learn to make great UIs quickly.', url: 'https://www.refactoringui.com', logo: '✨', badge: 'paid', filter: 'design' },
  { title: 'YC Startup School — Pitching', desc: 'Y Combinator\'s free course on pitching, storytelling, and presenting ideas.', url: 'https://www.ycombinator.com/library', logo: '🚀', badge: 'free', filter: 'pitch' },
  { title: 'TED Masterclass — Public Speaking', desc: 'TED\'s official public speaking course — transform how you present ideas.', url: 'https://masterclass.ted.com', logo: '🎤', badge: 'paid', filter: 'pitch' },
  { title: 'Pitch Deck Examples — Slidebean', desc: 'Study 100+ real startup pitch decks that raised millions. Learn what works.', url: 'https://slidebean.com/pitch-deck-examples', logo: '📋', badge: 'free', filter: 'pitch' },
];

/* ── THEME TOGGLE ── */
function initTheme() {
  const btn = $('#theme-toggle');
  btn?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
    state.theme = isDark ? 'light' : 'dark';
  });
}

/* ── LANGUAGE ── */
function setLang(lang) {
  state.lang = lang;
  const html = document.documentElement;
  html.setAttribute('lang', lang);
  html.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
  $('#btn-en').classList.toggle('active', lang === 'en');
  $('#btn-ar').classList.toggle('active', lang === 'ar');
  $$('[data-en]').forEach(el => {
    const text = el.getAttribute('data-' + lang);
    if (!text) return;
    if (el.tagName === 'INPUT') el.placeholder = text;
    else el.innerHTML = text;
  });
  const activeTab = $('.dash-tab.active');
  if (activeTab) renderDashCards(activeTab.dataset.tab);
}
window.setLang = setLang;

/* ── AUTH MODAL ── */
function openModal(e, mode = 'signin') {
  if (e) e.preventDefault();
  if (state.currentUser) {
    // If logged in, scroll to user section
    const us = $('#user-section');
    if (us) { const navH = $('#main-nav')?.offsetHeight||80; window.scrollTo({top:us.getBoundingClientRect().top+window.scrollY-navH-16,behavior:'smooth'}); }
    return;
  }
  state.modalOpen = true;
  $('#auth-modal').classList.add('open');
  document.body.style.overflow = 'hidden';
  switchAuthTab(mode);
  setTimeout(() => { const f = mode==='signin'?$('#signin-email'):$('#signup-name'); f?.focus(); }, 300);
}
window.openModal = openModal;

function closeModal() {
  state.modalOpen = false;
  $('#auth-modal').classList.remove('open');
  document.body.style.overflow = '';
  clearErrors();
}

function switchAuthTab(mode) {
  $$('.auth-tab').forEach(t => t.classList.remove('active'));
  $$('.auth-form').forEach(f => f.classList.remove('active'));
  $('#tab-' + mode)?.classList.add('active');
  $('#form-' + mode)?.classList.add('active');
  clearErrors();
}
window.switchAuthTab = switchAuthTab;

function clearErrors() { $$('.modal-error').forEach(e => e.classList.remove('show')); $$('.modal-input').forEach(i => i.style.borderColor=''); }
function showError(id, msg) { const el = $('#'+id); if(!el)return; el.textContent=msg; el.classList.add('show'); }
function validateEmail(e) { return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim()); }

function initModal() {
  const overlay = $('#auth-modal');
  $('#modal-close')?.addEventListener('click', closeModal);
  overlay?.addEventListener('click', e => { if(e.target===overlay) closeModal(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape'&&state.modalOpen) closeModal(); });

  ['google-btn','google-btn-signup'].forEach(id => {
    $('#'+id)?.addEventListener('click', () => {
      // Simulate Google OAuth — In production this would redirect to Google
      const name = 'Google User';
      const email = 'google@example.com';
      let user = state.users.find(u=>u.email===email);
      if (!user) { user = {name, email, password:''}; state.users.push(user); }
      state.currentUser = user;
      showToast('✓ Signed in with Google!', 'success');
      closeModal();
      updateNavForLoggedIn(user);
    });
  });

  $('#github-btn')?.addEventListener('click', () => {
    // Simulate GitHub OAuth
    const name = 'GitHub User';
    const email = 'github@example.com';
    let user = state.users.find(u=>u.email===email);
    if (!user) { user = {name, email, password:''}; state.users.push(user); }
    state.currentUser = user;
    showToast('✓ Signed in with GitHub!', 'success');
    closeModal();
    updateNavForLoggedIn(user);
    // Auto-connect github
    setTimeout(()=>{ state.githubConnected=true; state.githubUsername='@'+name.toLowerCase().replace(' ','_'); },500);
  });

  // Sign In
  $('#signin-submit')?.addEventListener('click', () => {
    clearErrors();
    const email = $('#signin-email')?.value?.trim();
    const pass = $('#signin-password')?.value;
    let valid = true;
    if (!validateEmail(email)) { showError('signin-email-err','Please enter a valid email.'); valid=false; }
    if (!pass||pass.length<6) { showError('signin-pass-err','Password must be at least 6 characters.'); valid=false; }
    if (!valid) return;
    const user = state.users.find(u=>u.email===email&&u.password===pass);
    if (!user) { showError('signin-email-err','No account found with these credentials. Try creating one.'); return; }
    state.currentUser = user;
    showToast(`Welcome back, ${user.name}! ✓`, 'success');
    closeModal();
    updateNavForLoggedIn(user);
  });

  // Sign Up
  $('#signup-submit')?.addEventListener('click', () => {
    clearErrors();
    const name = $('#signup-name')?.value?.trim();
    const email = $('#signup-email')?.value?.trim();
    const pass = $('#signup-password')?.value;
    let valid = true;
    if (!name) { showError('signup-name-err','Please enter your name.'); valid=false; }
    if (!validateEmail(email)) { showError('signup-email-err','Please enter a valid email.'); valid=false; }
    if (!pass||pass.length<6) { showError('signup-pass-err','Password must be at least 6 characters.'); valid=false; }
    if (!valid) return;
    if (state.users.find(u=>u.email===email)) { showError('signup-email-err','Email already registered. Sign in instead.'); return; }
    const newUser = {name, email, password:pass};
    state.users.push(newUser);
    state.currentUser = newUser;
    // Auto-fill settings with user name
    syncUserToSettings(newUser);
    showToast(`Account created! Welcome, ${name} ✓`, 'success');
    closeModal();
    updateNavForLoggedIn(newUser);
  });
}

function updateNavForLoggedIn(user) {
  const signinBtn = $('#nav-signin');
  const getStartedBtn = $('#nav-getstarted');
  if (signinBtn) {
    signinBtn.innerHTML = `<span class="nav-user-avatar">${user.name.charAt(0).toUpperCase()}</span>`;
    signinBtn.style.border = 'none';
    signinBtn.style.padding = '0';
    signinBtn.style.background = 'transparent';
    signinBtn.onclick = (e) => { e.preventDefault(); openUserDashboardPopup(); };
  }
  if (getStartedBtn) {
    getStartedBtn.textContent = 'My Dashboard →';
    getStartedBtn.href = '#';
    getStartedBtn.onclick = (e) => { e.preventDefault(); openUserDashboardPopup(); };
  }
  // Update profile name display
  syncProfileName(user.name);
  syncUserToSettings(user);
  // Update progress avatar
  const progressName = $('#progress-user-name');
  if (progressName) progressName.textContent = user.name;
  // Render popup content
  renderUserDashboardPopup();
}

function syncUserToSettings(user) {
  const parts = (user.name||'').split(' ');
  const el_first = $('#s-firstname');
  const el_last = $('#s-lastname');
  const el_email = $('#s-email');
  const el_user = $('#s-username');
  if (el_first) el_first.value = parts[0]||'';
  if (el_last) el_last.value = parts.slice(1).join(' ')||'';
  if (el_email) el_email.value = user.email||'';
  if (el_user) el_user.value = (user.name||'').toLowerCase().replace(/\s+/g,'_');
}

/* ── PROFILE NAME SYNC ── */
function syncProfileName(val) {
  const disp = $('#profile-name-display');
  if (disp) disp.textContent = val && val.trim() ? val.trim() : 'Your Name';
  const pn = $('#profile-name');
  if (pn && val) pn.value = val;
}
window.syncProfileName = syncProfileName;

/* ── NOTIF BAR ── */
function initNotifBar() {
  const bar = $('#notif-bar'), closeBtn = $('#notif-close');
  closeBtn?.addEventListener('click', () => {
    bar.style.maxHeight = bar.offsetHeight+'px';
    requestAnimationFrame(()=>{bar.style.transition='max-height .3s,opacity .3s';bar.style.maxHeight='0';bar.style.overflow='hidden';bar.style.opacity='0';});
    setTimeout(()=>bar.remove(), 320);
  });
}

/* ── NAV ── */
function initNav() {
  const nav=$('#main-nav'),hamburger=$('#hamburger'),navLinks=$('#nav-links');
  let ticking=false;
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{nav.classList.toggle('scrolled',window.scrollY>50);ticking=false;});ticking=true;}});
  hamburger?.addEventListener('click',()=>{state.mobileMenuOpen=!state.mobileMenuOpen;hamburger.classList.toggle('open',state.mobileMenuOpen);navLinks.classList.toggle('mobile-open',state.mobileMenuOpen);document.body.style.overflow=state.mobileMenuOpen?'hidden':'';});
  $$('.nav-links a').forEach(link=>{link.addEventListener('click',()=>{state.mobileMenuOpen=false;hamburger?.classList.remove('open');navLinks?.classList.remove('mobile-open');document.body.style.overflow='';});});
}

/* ── SCROLL ANIMATIONS ── */
function initScrollAnimations() {
  const observer = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        if(!state.countersAnimated&&entry.target.closest('#hero')){state.countersAnimated=true;animateCounters();}
      }
    });
  },{threshold:0.12});
  $$('.fade-up').forEach(el=>observer.observe(el));
}

/* ── COUNTER ANIMATION ── */
function animateCounters() {
  $$('[data-count]').forEach(el=>{
    const target=parseInt(el.dataset.count,10),suffix=el.dataset.suffix||'',duration=1600,start=performance.now();
    function update(now){const elapsed=now-start,progress=Math.min(elapsed/duration,1),eased=1-Math.pow(1-progress,3),value=Math.round(eased*target);if(target>=10000)el.textContent=(value/1000).toFixed(value>=1000?0:1)+'K+';else el.textContent=value+suffix+(suffix?'+':'');if(progress<1)requestAnimationFrame(update);}
    requestAnimationFrame(update);
  });
}

/* ── BREAKDOWN BARS ── */
function animateBreakdownBars() { $$('.bdown-bar').forEach((bar,i)=>{const pct=parseInt(bar.dataset.pct,10);setTimeout(()=>{bar.style.width=pct+'%';},i*120);}); }

/* ── VISION 2030 BARS ── */
function animateVisionBars() {
  $$('.vision-progress-fill[data-w]').forEach((bar,i)=>{
    setTimeout(()=>{bar.style.width=bar.dataset.w+'%';},i*150);
  });
}

/* ── DASHBOARD ── */
function renderDashCards(tabKey) {
  currentDashTab = tabKey || currentDashTab;
  const container = $('#dash-cards');
  if (!container) return;
  const data = DASHBOARD_DATA[currentDashTab]||DASHBOARD_DATA.matches;
  const lang = state.lang;
  const occupation = $('#dash-occupation-filter')?.value || 'all';
  const diffLabels = {beginner:'🟢 Beginner', intermediate:'🟡 Intermediate', advanced:'🔴 Advanced'};

  container.style.opacity='0';container.style.transform='translateY(8px)';
  setTimeout(()=>{
    container.innerHTML = data.map((card,i)=>{
      const diff = card.difficulty || ['beginner','intermediate','advanced'][i%3];
      if (currentDifficulty!=='all' && diff!==currentDifficulty) return '';
      return `
      <div class="dash-event-card">
        <div class="dash-card-header">
          <div class="dash-event-name">${card.name}</div>
          <div style="display:flex;gap:6px;align-items:center;flex-shrink:0;">
            <span class="difficulty-badge ${diff}">${diffLabels[diff]||diff}</span>
            <div class="dash-match">${card.match} Match</div>
          </div>
        </div>
        <div class="dash-meta">
          <div class="dash-meta-item">📅 ${card.deadline[lang]||card.deadline.en}</div>
          <div class="dash-meta-item">${card.prize}</div>
          <div class="dash-meta-item">${card.format[lang]||card.format.en}</div>
        </div>
        <div class="dash-tags">${card.tags.map(t=>`<span class="dash-tag">${t}</span>`).join('')}</div>
        <span class="dash-success-rate">✓ ${card.successRate} success rate for matched profiles</span>
        <div style="display:flex;gap:8px;margin-top:10px;">
          <button class="dash-register" style="flex:1;" onclick="window.open('${card.url||'#'}','_blank')">
            ${lang==='ar'?'سجل الآن ←':'Apply Now →'}
          </button>
          <button onclick="saveHackathon('${card.name}')" title="Save hackathon" style="padding:9px 12px;border:1px solid rgba(184,150,90,.35);border-radius:8px;background:transparent;color:var(--caramel);font-size:14px;cursor:pointer;transition:all .25s;flex-shrink:0;" onmouseover="this.style.background='var(--caramel)';this.style.color='white'" onmouseout="this.style.background='transparent';this.style.color='var(--caramel)'">🔖</button>
          <button onclick="addToCalendar('${card.name}','2026-02-09','2026-02-12','GCC')" title="Add to Google Calendar" style="padding:9px 12px;border:1px solid rgba(184,150,90,.35);border-radius:8px;background:transparent;color:var(--caramel);font-size:14px;cursor:pointer;transition:all .25s;flex-shrink:0;" onmouseover="this.style.background='rgba(184,150,90,.2)'" onmouseout="this.style.background='transparent'">📅</button>
        </div>
      </div>
    `}).join('');
    container.style.transition='opacity .3s,transform .3s';container.style.opacity='1';container.style.transform='translateY(0)';
  },160);
}

function initDashTabs() {
  renderDashCards('matches');
  $$('.dash-tab').forEach(tab=>{
    tab.addEventListener('click',function(){
      $$('.dash-tab').forEach(t=>t.classList.remove('active'));
      this.classList.add('active');
      currentDashTab = this.dataset.tab;
      renderDashCards(this.dataset.tab);
    });
  });
}

/* ── SKILL CHIPS ── */
function initSkillChips() {
  $$('.skill-chip').forEach(chip=>{
    chip.addEventListener('click',function(){this.classList.toggle('selected');updateProfilePreview();});
  });
}

function updateProfilePreview() {
  const selected=$$('#skills-cloud .skill-chip.selected').map(el=>el.textContent.trim());
  const interests=$$('#interests-cloud .skill-chip.selected').map(el=>el.textContent.trim());
  const all=[...selected,...interests];
  const pc=$('.skill-pills');
  if(pc&&all.length>0) pc.innerHTML=all.slice(0,5).map(s=>`<span class="skill-pill">${s}</span>`).join('');
}

/* ── FIND MY MATCHES ── */
function handleFindMatches(e) {
  e.preventDefault();
  const selected=$$('#skills-cloud .skill-chip.selected');
  const interests=$$('#interests-cloud .skill-chip.selected');
  if(selected.length===0&&interests.length===0){showToast('Please select at least one skill or interest first','error');return;}
  const dashboard=$('#dashboard');
  if(dashboard){const navH=$('#main-nav')?.offsetHeight||80;window.scrollTo({top:dashboard.getBoundingClientRect().top+window.scrollY-navH-16,behavior:'smooth'});}
  showToast('🎯 Matches updated based on your profile!','success');
}
window.handleFindMatches = handleFindMatches;

/* ── PARTNER MATCHING ── */
function findPartners() {
  const btn = $('#find-partners-btn');
  const results = $('#partner-results');
  if (!btn||!results) return;
  btn.innerHTML = '<span class="ai-spinner"></span> Analyzing profiles...';
  btn.disabled = true;
  setTimeout(()=>{
    btn.innerHTML = '✨ Analyze My Profile &amp; Find Partners';
    btn.disabled = false;
    results.style.display='flex';
    results.innerHTML = PLATFORM_USERS.map(u=>`
      <div class="partner-card" id="pcard-${u.id}" dir="${u.arabic?'rtl':'ltr'}">
        <div class="partner-card-header">
          <div class="partner-avatar">${u.avatar}</div>
          <div>
            <div class="partner-name">${u.name}</div>
            <div class="partner-role">${u.role} · ${u.location}</div>
          </div>
          <div class="partner-match-pct">${u.match}% match</div>
        </div>
        <div style="font-size:12px;color:var(--text-soft);margin-bottom:10px;font-style:italic;line-height:1.5;">${u.bio}</div>
        <div class="partner-skills">${u.skills.map(s=>`<span class="partner-skill-tag">${s}</span>`).join('')}</div>
        <button class="partner-connect-btn" onclick="openChat(${u.id})" style="margin-top:10px;">💬 ${u.arabic ? 'تواصل معي' : 'Message ' + u.name.split(' ')[0]}</button>
      </div>
    `).join('');
    showToast('🤝 Found '+PLATFORM_USERS.length+' compatible partners!','success');
  }, 1800);
}
window.findPartners = findPartners;

function openChat(userId) {
  const user = PLATFORM_USERS.find(u=>u.id===userId);
  if (!user) return;
  state.activeChat = userId;
  if (!state.messages[userId]) {
    if (user.arabic) {
      state.messages[userId] = [
        {from:'them', text:`السلام عليكم! رأيت أننا تطابقنا في HackMatch. مهاراتك في ${user.skills[0]} رائعة!`, time:'10:23'},
        {from:'them', text:'هل أنت مهتم بالتعاون في هاكاثون LEAP 2026؟', time:'10:24'},
      ];
    } else {
      state.messages[userId] = [
        {from:'them', text:`Hey! I saw we matched on HackMatch. Love your skill set in ${user.skills[0]}!`, time:'10:23'},
        {from:'them', text:'Would you be interested in teaming up for LEAP 2026?', time:'10:24'},
      ];
    }
  }
  renderChat(user);
}
window.openChat = openChat;

function renderChat(user) {
  const noChat=$('#msg-no-chat'), header=$('#msg-header'), thread=$('#msg-thread'), inputWrap=$('#msg-input-wrap');
  if(!noChat||!header||!thread||!inputWrap) return;
  noChat.style.display='none';
  header.style.display='flex';
  thread.style.display='flex';
  inputWrap.style.display='flex';
  $('#msg-header-avatar').textContent=user.avatar;
  $('#msg-header-name').textContent=user.name;
  thread.innerHTML=state.messages[user.id].map(m=>`
    <div style="display:flex;flex-direction:column;align-items:${m.from==='me'?'flex-end':'flex-start'}">
      <div class="msg-bubble ${m.from}">${m.text}</div>
      <div class="msg-time" style="${m.from==='me'?'text-align:right':'text-align:left'}">${m.time}</div>
    </div>
  `).join('');
  thread.scrollTop=thread.scrollHeight;
  $('#msg-input')?.focus();
}

function sendMsg() {
  const input=$('#msg-input');
  if(!input||!input.value.trim()||!state.activeChat) return;
  const text=input.value.trim();
  const now=new Date();
  const time=now.getHours().toString().padStart(2,'0')+':'+now.getMinutes().toString().padStart(2,'0');
  if(!state.messages[state.activeChat]) state.messages[state.activeChat]=[];
  state.messages[state.activeChat].push({from:'me',text,time});
  input.value='';
  const user=PLATFORM_USERS.find(u=>u.id===state.activeChat);
  if(user) renderChat(user);
  // Simulate reply
  setTimeout(()=>{
    const arReplies=['رائع! متحمس للعمل معك 🚀','أنا معك! ما هو تركيزك الرئيسي؟','ممتاز! هل نبدأ بتخطيط المشروع؟','جاهز 100%! لقد كنت أستعد لهذا الهاكاثون.','هل نحدد موعداً للتحضير المشترك؟'];
    const enReplies=['That sounds amazing! Let\'s do it 🚀','I\'m in! What\'s your main skill focus?','Great — should we start a shared workspace?','100%! I\'ve been preparing for this hackathon for months.','Let\'s schedule a call to plan our approach?'];
    const replies=user?.arabic ? arReplies : enReplies;
    const reply=replies[Math.floor(Math.random()*replies.length)];
    state.messages[state.activeChat].push({from:'them',text:reply,time:new Date().getHours().toString().padStart(2,'0')+':'+new Date().getMinutes().toString().padStart(2,'0')});
    if(user) renderChat(user);
  }, 1200+Math.random()*600);
}
window.sendMsg = sendMsg;

/* ── USER SECTION TABS ── */
function switchUserTab(tab) {
  $$('.user-tab-btn').forEach(b=>{b.classList.toggle('active',b.dataset.utab===tab);});
  $$('.user-tab-content').forEach(c=>{c.classList.toggle('active',c.id==='utab-'+tab);});
}
window.switchUserTab = switchUserTab;

/* ── SETTINGS ── */
function selectOccupation(btn) {
  $$('.occupation-btn').forEach(b=>b.classList.remove('selected'));
  btn.classList.add('selected');
}
window.selectOccupation = selectOccupation;

document.addEventListener('change',e=>{
  if(e.target.id==='occ-filter-toggle'){
    const lbl=$('#occ-filter-label');
    if(lbl) lbl.textContent=e.target.checked?'Yes — filter hackathons by my occupation':'No — show all hackathons';
  }
});

function saveSettings() {
  const first=$('#s-firstname')?.value?.trim();
  const last=$('#s-lastname')?.value?.trim();
  const email=$('#s-email')?.value?.trim();
  if (first||last) {
    const fullName=[first,last].filter(Boolean).join(' ');
    if(state.currentUser){state.currentUser.name=fullName;state.currentUser.email=email||state.currentUser.email;}
    syncProfileName(fullName);
    const progressName=$('#progress-user-name');
    if(progressName) progressName.textContent=fullName;
    updateNavForLoggedIn(state.currentUser||{name:fullName,email:email||''});
  }
  showToast('✅ Settings saved successfully!','success');
}
window.saveSettings = saveSettings;

function changePassword() {
  const cur=$('#s-current-pass')?.value;
  const nw=$('#s-new-pass')?.value;
  const conf=$('#s-confirm-pass')?.value;
  if(!cur){showToast('Please enter your current password','error');return;}
  if(!nw||nw.length<8){showToast('New password must be at least 8 characters','error');return;}
  if(nw!==conf){showToast('New passwords do not match','error');return;}
  // In production: call API to update password
  if($('#s-current-pass')) $('#s-current-pass').value='';
  if($('#s-new-pass')) $('#s-new-pass').value='';
  if($('#s-confirm-pass')) $('#s-confirm-pass').value='';
  showToast('🔒 Password updated successfully!','success');
}
window.changePassword = changePassword;

function toggle2FA(chk) {
  showToast(chk.checked?'🛡️ 2FA enabled — check your authenticator app':'2FA disabled','success');
}
window.toggle2FA = toggle2FA;

/* ── PROGRESS / AI ANALYSIS ── */
function runAIAnalysis() {
  const btn=document.querySelector('.ai-analysis-btn');
  if(!btn) return;
  const orig=btn.innerHTML;
  btn.innerHTML='<span class="ai-spinner"></span> Analyzing...';
  btn.disabled=true;
  const container=$('#ai-analysis-container');
  if(container){container.style.opacity='.4';container.style.transition='opacity .3s';}
  setTimeout(()=>{
    btn.innerHTML=orig;btn.disabled=false;
    if(container){container.style.opacity='1';}
    showToast('🤖 AI analysis updated!','success');
  },2200);
}
window.runAIAnalysis = runAIAnalysis;

/* ── SKILL BOOSTER ── */
function filterResources(filter, btn) {
  $$('.skill-filter-tab').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  renderResources(filter);
}
window.filterResources = filterResources;

function renderResources(filter='all') {
  const list=$('#resources-list');
  if(!list) return;
  const filtered=filter==='all'?RESOURCES:RESOURCES.filter(r=>r.filter===filter);
  list.innerHTML=filtered.map(r=>`
    <a class="resource-card" href="${r.url}" target="_blank" rel="noopener">
      <div class="resource-logo" style="background:var(--parchment);">${r.logo}</div>
      <div style="flex:1;">
        <div class="resource-name">${r.title}</div>
        <div class="resource-desc">${r.desc}</div>
        <span class="resource-badge ${r.badge}">${r.badge==='free'?'✓ Free':'Premium'}</span>
      </div>
      <div class="resource-arrow">↗</div>
    </a>
  `).join('');
}

/* ── GITHUB CONNECT ── */
function connectGitHub() {
  const btn=document.querySelector('.btn-github');
  if(!btn) return;
  const orig=btn.innerHTML;
  btn.innerHTML='<span class="ai-spinner" style="border-color:rgba(255,255,255,.3);border-top-color:white;"></span> Connecting to GitHub...';
  btn.disabled=true;
  // In production: redirect to https://github.com/login/oauth/authorize?...
  setTimeout(()=>{
    btn.innerHTML=orig;btn.disabled=false;
    state.githubConnected=true;
    const username=state.currentUser?'@'+(state.currentUser.name||'user').toLowerCase().replace(/\s+/g,'_'):'@hackmatch_user';
    state.githubUsername=username;
    $('#gh-username').textContent=username;
    $('#github-not-connected').style.display='none';
    $('#github-connected').style.display='block';
    showToast('🐙 GitHub connected successfully! Match score boosted +24%','success');
  }, 1800);
}
window.connectGitHub = connectGitHub;

function disconnectGitHub() {
  state.githubConnected=false;
  $('#github-not-connected').style.display='block';
  $('#github-connected').style.display='none';
  showToast('GitHub disconnected.','');
}
window.disconnectGitHub = disconnectGitHub;

/* ── TOAST ── */
let toastTimer=null;
function showToast(msg,type='',duration=3500) {
  const toast=$('#toast');if(!toast)return;
  toast.textContent=msg;toast.className='toast show'+(type?' '+type:'');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>{toast.className='toast';},duration);
}
window.showToast=showToast;

/* ── SMOOTH SCROLL ── */
function initSmoothScroll() {
  $$('a[href^="#"]').forEach(link=>{
    link.addEventListener('click',e=>{
      const href=link.getAttribute('href');if(href==='#')return;
      const target=$(href);if(!target)return;
      e.preventDefault();const navH=$('#main-nav')?.offsetHeight||80;
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-navH-16,behavior:'smooth'});
    });
  });
}

/* ── ACTIVE NAV HIGHLIGHT ── */
function initActiveNavHighlight() {
  const sections=$$('section[id]'),navLinks=$$('.nav-links a[href^="#"]');
  const observer=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){const id=entry.target.id;navLinks.forEach(link=>{link.style.color=link.getAttribute('href')===`#${id}`?'var(--caramel)':'';}); }
    });
  },{threshold:0.4});
  sections.forEach(sec=>observer.observe(sec));
}

/* ── STYLE SELECTS ── */
function styleSelects() {
  $$('.form-select').forEach(sel=>{
    sel.style.backgroundImage=`url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8'%3E%3Cpath d='M1 1l5 5 5-5' stroke='%23B8965A' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E")`;
    sel.style.backgroundRepeat='no-repeat';sel.style.backgroundPosition='right 14px center';sel.style.paddingRight='38px';
  });
}

/* ── PARALLAX HERO ── */
function initHeroParallax() {
  const heroBg=$('.hero-bg');
  if(!heroBg||window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  let ticking=false;
  window.addEventListener('scroll',()=>{if(!ticking){requestAnimationFrame(()=>{heroBg.style.transform=`translateY(${window.scrollY*0.3}px)`;ticking=false;});ticking=true;}});
}

/* ── BREAKDOWN OBSERVER ── */
function initBreakdownObserver() {
  const panel=$('.match-breakdown-panel');if(!panel) return;
  const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting&&!state.breakdownAnimated){state.breakdownAnimated=true;animateBreakdownBars();obs.disconnect();}});},{threshold:0.3});
  obs.observe(panel);
}

/* ── VISION BARS OBSERVER ── */
function initVisionBarsObserver() {
  const section=$('#vision2030');if(!section) return;
  const obs=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){animateVisionBars();obs.disconnect();}});},{threshold:0.2});
  obs.observe(section);
}

/* ── USER DASHBOARD POPUP ── */
const USER_DASHBOARD_HTML = `
  <div class="user-tab-content active" id="popup-utab-settings">
    <h3 style="font-family:'Playfair Display',serif;font-size:22px;font-weight:700;color:var(--dark-brown);margin-bottom:24px;">⚙️ Account Settings</h3>
    <div class="settings-section">
      <div class="settings-section-title">👤 Profile Information</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:14px;">
        <div class="settings-row"><div class="settings-label">Username</div><input class="settings-input" id="s-username" type="text" placeholder="hackmatch_user"/></div>
        <div class="settings-row"><div class="settings-label">Email</div><input class="settings-input" id="s-email" type="email" placeholder="you@example.com"/></div>
        <div class="settings-row"><div class="settings-label">First Name</div><input class="settings-input" id="s-firstname" type="text" placeholder="Ahmed"/></div>
        <div class="settings-row"><div class="settings-label">Last Name</div><input class="settings-input" id="s-lastname" type="text" placeholder="Al-Rashid"/></div>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">💼 Occupation</div>
      <div class="occupation-grid">
        <button class="occupation-btn selected" data-occ="student" onclick="selectOccupation(this)">🎓 Student</button>
        <button class="occupation-btn" data-occ="developer" onclick="selectOccupation(this)">👩‍💻 Developer</button>
        <button class="occupation-btn" data-occ="designer" onclick="selectOccupation(this)">🎨 Designer</button>
        <button class="occupation-btn" data-occ="datascientist" onclick="selectOccupation(this)">📊 Data Scientist</button>
      </div>
      <div style="margin-top:16px;">
        <label class="filter-toggle"><div class="toggle-switch"><input type="checkbox" id="occ-filter-toggle" checked/><div class="toggle-slider"></div></div><span class="toggle-label" id="occ-filter-label">Yes — filter hackathons by my occupation</span></label>
      </div>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">🔒 Change Password</div>
      <div class="settings-row"><div class="settings-label">Current Password</div><input class="settings-input" id="s-current-pass" type="password" placeholder="••••••••"/></div>
      <div class="settings-row"><div class="settings-label">New Password</div><input class="settings-input" id="s-new-pass" type="password" placeholder="Minimum 8 characters"/></div>
      <div class="settings-row"><div class="settings-label">Confirm New Password</div><input class="settings-input" id="s-confirm-pass" type="password" placeholder="Repeat new password"/></div>
      <button class="btn-settings-save" onclick="changePassword()" style="background:#C0392B;">Update Password</button>
    </div>
    <div class="settings-section">
      <div class="settings-section-title">🛡️ Security</div>
      <div class="twofa-row"><div><div class="twofa-label">Two-Factor Authentication (2FA)</div><div class="twofa-desc">Add an extra layer of security via authenticator app</div></div><label class="toggle-switch"><input type="checkbox" id="twofa-toggle" onchange="toggle2FA(this)"/><div class="toggle-slider"></div></label></div>
    </div>
    <button class="btn-settings-save" onclick="saveSettings()">💾 Save All Settings</button>
  </div>
  <div class="user-tab-content" id="popup-utab-progress">
    <div class="progress-header">
      <div class="progress-avatar" id="progress-avatar">🧑‍💻</div>
      <div class="progress-user-info"><div class="progress-user-name" id="progress-user-name">Your Profile</div><div class="progress-user-sub">GCC Hackathon Participant · 2026 Season</div></div>
      <button class="ai-analysis-btn" onclick="runAIAnalysis()"><span>🤖</span> Run AI Analysis</button>
    </div>
    <div class="progress-stats-grid">
      <div class="progress-stat-card"><div class="progress-stat-num">7</div><div class="progress-stat-label">Hackathons Joined</div></div>
      <div class="progress-stat-card"><div class="progress-stat-num">3</div><div class="progress-stat-label">Prizes Won</div></div>
      <div class="progress-stat-card"><div class="progress-stat-num">43%</div><div class="progress-stat-label">Win Rate</div></div>
      <div class="progress-stat-card"><div class="progress-stat-num">92%</div><div class="progress-stat-label">Avg Match Score</div></div>
    </div>
    <div id="ai-analysis-container">
      <div class="ai-feedback-box"><div class="ai-feedback-title">✅ Where You Excel</div><div class="ai-feedback-item"><div class="ai-feedback-dot good"></div><span>Strong frontend engineering (React, Tailwind) — consistently in top 10% of matched events</span></div><div class="ai-feedback-item"><div class="ai-feedback-dot good"></div><span>Exceptional at rapid prototyping — your MVPs consistently impress judges in under 24h</span></div><div class="ai-feedback-item"><div class="ai-feedback-dot good"></div><span>GCC market knowledge gives you an edge in Saudi/UAE specific challenges</span></div></div>
      <div class="ai-feedback-box"><div class="ai-feedback-title">🔧 Areas to Improve</div><div class="ai-feedback-item"><div class="ai-feedback-dot improve"></div><span>Backend skills need strengthening — teams with full-stack depth score 18% higher on average</span></div><div class="ai-feedback-item"><div class="ai-feedback-dot improve"></div><span>Presentation delivery: judges report strong ideas but weak final pitches</span></div></div>
      <div class="ai-feedback-box"><div class="ai-feedback-title">💡 AI Recommendations</div><div class="ai-feedback-item"><div class="ai-feedback-dot tip"></div><span>Focus on Vision 2030 aligned themes — your location score is 98%, leverage it in AI/Smart City tracks</span></div><div class="ai-feedback-item"><div class="ai-feedback-dot tip"></div><span>Target LEAP 2026 &amp; GITEX — your profile scores 96% and 89% match respectively</span></div></div>
    </div>
  </div>
  <div class="user-tab-content" id="popup-utab-skillbooster">
    <div class="skillbooster-header"><div class="skillbooster-icon">⚡</div><div><div class="skillbooster-title">Skill Booster AI</div><div class="skillbooster-sub">Curated learning resources to help you level up and win more hackathons</div></div></div>
    <div class="skill-filter-tabs" id="skill-filter-tabs">
      <button class="skill-filter-tab active" data-filter="all" onclick="filterResources('all',this)">All Skills</button>
      <button class="skill-filter-tab" data-filter="ai" onclick="filterResources('ai',this)">AI / ML</button>
      <button class="skill-filter-tab" data-filter="web" onclick="filterResources('web',this)">Web Dev</button>
      <button class="skill-filter-tab" data-filter="data" onclick="filterResources('data',this)">Data Science</button>
      <button class="skill-filter-tab" data-filter="design" onclick="filterResources('design',this)">Design</button>
      <button class="skill-filter-tab" data-filter="pitch" onclick="filterResources('pitch',this)">Pitching</button>
    </div>
    <div id="resources-list"></div>
  </div>
  <div class="user-tab-content" id="popup-utab-github">
    <div id="github-not-connected"><div class="github-connect-panel"><span class="github-icon-big">🐙</span><h3 class="github-connect-title">Connect Your GitHub</h3><p class="github-connect-desc">Link your GitHub account to boost your match score by up to 24%.</p><button class="btn-github" onclick="connectGitHub()"><svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z"/></svg>Connect with GitHub</button><div class="github-features"><div class="github-feature-item"><div class="github-feature-icon">📊</div><div class="github-feature-title">Auto-Import Skills</div><div class="github-feature-desc">Your repos reveal your real tech stack automatically</div></div><div class="github-feature-item"><div class="github-feature-icon">🎯</div><div class="github-feature-title">Boost Match Score</div><div class="github-feature-desc">GitHub-verified profiles get up to 24% higher match scores</div></div><div class="github-feature-item"><div class="github-feature-icon">🏆</div><div class="github-feature-title">Portfolio Link</div><div class="github-feature-desc">Judges can view your work directly</div></div></div></div></div>
    <div id="github-connected" style="display:none;"><div class="github-connected-panel"><div class="github-connected-header"><div class="github-connected-avatar">🐙</div><div><div class="github-connected-name" id="gh-username">@hackmatch_user</div><div class="github-connected-sub">✅ GitHub Connected Successfully</div></div><button onclick="disconnectGitHub()" style="margin-left:auto;padding:7px 16px;border:1px solid var(--red-err);border-radius:8px;background:transparent;color:var(--red-err);font-size:12px;cursor:pointer;">Disconnect</button></div><div class="github-stats-grid"><div class="github-stat"><div class="github-stat-num">47</div><div class="github-stat-label">Repositories</div></div><div class="github-stat"><div class="github-stat-num">1.2K</div><div class="github-stat-label">Contributions</div></div><div class="github-stat"><div class="github-stat-num">8</div><div class="github-stat-label">Languages</div></div><div class="github-stat"><div class="github-stat-num">+24%</div><div class="github-stat-label">Match Boost</div></div></div></div></div>
  </div>
`;

function renderUserDashboardPopup() {
  const panel = $('#popup-user-panel');
  if (!panel) return;
  panel.innerHTML = USER_DASHBOARD_HTML;
  renderResources('all');
  if (state.currentUser) syncUserToSettings(state.currentUser);
}

function openUserDashboardPopup() {
  if (!state.currentUser) { openModal(null,'signin'); return; }
  renderUserDashboardPopup();
  $('#user-dashboard-popup').classList.add('open');
  document.body.style.overflow = 'hidden';
}
window.openUserDashboardPopup = openUserDashboardPopup;

function closeUserDashboardPopup() {
  $('#user-dashboard-popup').classList.remove('open');
  document.body.style.overflow = '';
}
window.closeUserDashboardPopup = closeUserDashboardPopup;

// Override switchUserTab to work in popup context
function switchUserTab(tab) {
  $$('.user-tab-btn').forEach(b=>{b.classList.toggle('active',b.dataset.utab===tab);});
  // Support both popup and old-style tab content
  $$('[id^="popup-utab-"],[id^="utab-"]').forEach(c=>{
    c.classList.toggle('active', c.id==='popup-utab-'+tab || c.id==='utab-'+tab);
  });
  // Auth-gate: progress and skillbooster require login
  if ((tab==='progress'||tab==='skillbooster') && !state.currentUser) {
    const activePanel = $('#popup-utab-'+tab) || $('#utab-'+tab);
    if (activePanel) {
      activePanel.innerHTML = `<div style="text-align:center;padding:60px 32px;">
        <div style="font-size:48px;margin-bottom:16px;">🔐</div>
        <h3 style="font-family:'Playfair Display',serif;font-size:22px;color:var(--dark-brown);margin-bottom:10px;">Sign In to Unlock</h3>
        <p style="color:var(--text-soft);font-size:14px;margin-bottom:24px;">Create a free account to access your ${tab==='progress'?'progress tracker':'Skill Booster AI'} and personalized insights.</p>
        <button class="btn-primary" onclick="closeUserDashboardPopup();openModal(null,'signin')" style="padding:12px 28px;font-size:15px;border-radius:30px;justify-content:center;">Sign In / Sign Up →</button>
      </div>`;
    }
  }
}
window.switchUserTab = switchUserTab;

/* ── SAVE HACKATHONS ── */
const savedHackathons = [];

function saveHackathon(name) {
  if (!state.currentUser) { showToast('Please sign in to save hackathons','error'); return; }
  if (savedHackathons.find(h=>h.name===name)) { showToast('Already saved!',''); return; }
  savedHackathons.push({name, savedAt: new Date().toLocaleDateString()});
  updateSaveCount();
  showToast(`🔖 "${name.substring(0,30)}..." saved!`,'success');
}
window.saveHackathon = saveHackathon;

function updateSaveCount() {
  const cnt = $('#save-count');
  if (cnt) cnt.textContent = savedHackathons.length;
}

function openSavedPopup() {
  if (!state.currentUser) { openModal(null,'signin'); return; }
  if (savedHackathons.length===0) { showToast('No saved hackathons yet. Click 🔖 on any card!',''); return; }
  // Show in dashboard saved tab
  const dashTab = $$('.dash-tab').find(t=>t.dataset.tab==='saved');
  if (dashTab) { dashTab.click(); }
  const dash = $('#dashboard');
  if (dash) { const navH=$('#main-nav')?.offsetHeight||80; window.scrollTo({top:dash.getBoundingClientRect().top+window.scrollY-navH-16,behavior:'smooth'}); }
}
window.openSavedPopup = openSavedPopup;

/* ── DIFFICULTY FILTER ── */
let currentDifficulty = 'all';
let currentDashTab = 'matches';

function setDifficulty(btn, diff) {
  $$('.diff-btn').forEach(b=>{
    b.style.background = b===btn ? 'var(--caramel)' : 'transparent';
    b.style.color = b===btn ? '#fff' : 'rgba(245,240,232,.6)';
  });
  currentDifficulty = diff;
  renderDashCards(currentDashTab);
}
window.setDifficulty = setDifficulty;

/* ── SURVIVAL GUIDE ── */
function generateSurvivalGuide() {
  const btn = $('#prepare-btn');
  const output = $('#survival-output');
  if (!btn||!output) return;
  btn.innerHTML = '<span class="ai-spinner" style="border-color:rgba(255,255,255,.3);border-top-color:#fff;"></span> Generating your guide...';
  btn.disabled = true;
  setTimeout(()=>{
    btn.innerHTML = '🚀 Prepare Me';
    btn.disabled = false;
    output.classList.add('visible');
    output.style.display = 'block';
    showToast('🛡️ Your Hackathon Survival Guide is ready!','success');
  }, 1600);
}
window.generateSurvivalGuide = generateSurvivalGuide;

/* ── CALENDAR SYNC ── */
function addToCalendar(title, startDate, endDate, location) {
  const formatDate = d => d.replace(/-/g,'');
  const start = formatDate(startDate) + 'T080000Z';
  const end = formatDate(endDate) + 'T200000Z';
  const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${start}/${end}&location=${encodeURIComponent(location)}&details=${encodeURIComponent('HackMatch AI — Find more at hackmatch.ai')}`;
  window.open(url, '_blank');
  showToast(`📅 Opening Google Calendar for "${title}"...`,'success');
}
window.addToCalendar = addToCalendar;

function addAllToCalendar() {
  const events = [
    {title:'LEAP 2026 Hackathon', start:'2026-02-09', end:'2026-02-12', loc:'Riyadh, Saudi Arabia'},
    {title:'She Builds GCC Edition', start:'2026-03-08', end:'2026-03-09', loc:'Riyadh, Saudi Arabia'},
    {title:'GITEX Future Hack 2026', start:'2026-10-13', end:'2026-10-17', loc:'Dubai, UAE'},
    {title:'Women Techmakers Hackathon', start:'2026-04-18', end:'2026-04-19', loc:'Virtual'},
  ];
  // Open first one
  addToCalendar(events[0].title, events[0].start, events[0].end, events[0].loc);
  showToast('📅 Syncing your saved hackathons to Google Calendar...','success');
}
window.addAllToCalendar = addAllToCalendar;

/* ── INIT ── */
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNotifBar();
  initNav();
  initModal();
  initDashTabs();
  initSkillChips();
  initScrollAnimations();
  initSmoothScroll();
  initActiveNavHighlight();
  initHeroParallax();
  initBreakdownObserver();
  initVisionBarsObserver();
  styleSelects();
  renderResources('all');

  // User dashboard popup overlay close
  const udp = $('#user-dashboard-popup');
  udp?.addEventListener('click', e => { if(e.target===udp) closeUserDashboardPopup(); });
  document.addEventListener('keydown', e => { if(e.key==='Escape') { closeUserDashboardPopup(); } });

  $$('[data-count]').forEach(()=>{
    if(!state.countersAnimated){state.countersAnimated=true;setTimeout(animateCounters,600);}
  });

  $$('#hero .fade-up').forEach(el=>setTimeout(()=>el.classList.add('visible'),100));

  // Occupation filter toggle label init
  const occToggle=$('#occ-filter-toggle');
  const occLabel=$('#occ-filter-label');
  if(occToggle&&occLabel) occLabel.textContent=occToggle.checked?'Yes — filter hackathons by my occupation':'No — show all hackathons';

  console.log('%c HackMatch AI 2026 v2.0 — GCC Edition loaded ✓', 'color:#B8965A; font-weight:700; font-size:14px;');
});

window.addEventListener('resize',()=>{
  if(window.innerWidth>900&&state.mobileMenuOpen){state.mobileMenuOpen=false;$('#hamburger')?.classList.remove('open');$('#nav-links')?.classList.remove('mobile-open');document.body.style.overflow='';}
});