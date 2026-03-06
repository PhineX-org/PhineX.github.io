/**
 * PhineX Search Engine v2.0
 * Cross-page search with section navigation, word highlighting & glow effects
 */

(function () {
  'use strict';

  /* ═══════════════════════════════════════════════════════════════════════
     1.  SEARCH INDEX — all pages, all sections
  ═══════════════════════════════════════════════════════════════════════ */
  const CURRENT_PAGE = (function () {
    const p = window.location.pathname.split('/').pop() || 'index.html';
    return p === '' ? 'index.html' : p;
  })();

  const INDEX = [
    /* ── index.html ── */
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'Hero', sectionId: 'hero',
      text: 'Build The Future Of Web Tech. PhineX is a developer community where programmers collaborate, build projects, learn from each other, and launch the next generation of web technology. Join thousands of developers worldwide.',
      keywords: ['build', 'future', 'web', 'tech', 'developer', 'community', 'collaborate', 'projects', 'programmers', 'launch', 'join']
    },
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'News', sectionId: 'news',
      text: 'Latest PhineX News. Platform updates, community announcements, new feature releases, project spotlights, developer achievements, upcoming events, and changelog notes.',
      keywords: ['news', 'updates', 'announcements', 'releases', 'changelog', 'events', 'features', 'spotlight']
    },
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'Features', sectionId: 'features',
      text: 'PhineX platform features: real-time collaboration tools, code review system, project showcase, mentorship program, community forums, bug bounty rewards, deployment pipeline, and skill certification.',
      keywords: ['features', 'collaboration', 'code review', 'showcase', 'mentorship', 'forums', 'bug bounty', 'deployment', 'certification']
    },
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'Projects', sectionId: 'projects',
      text: 'PhineX open-source projects. Community-built applications, tools, libraries, and frameworks created by PhineX developers. Browse, fork, contribute, star projects and collaborate with the team.',
      keywords: ['projects', 'open-source', 'applications', 'tools', 'libraries', 'frameworks', 'fork', 'contribute', 'star']
    },
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'Stats', sectionId: 'stats',
      text: 'PhineX by the numbers: active developers, projects launched, lines of code, countries represented, bugs fixed, features shipped, community members, and growing every day.',
      keywords: ['stats', 'numbers', 'developers', 'projects', 'code', 'countries', 'community', 'members', 'growth']
    },
    {
      page: 'index.html', pageTitle: 'Home',
      section: 'Join PhineX', sectionId: 'join',
      text: 'Become a PhineX developer. Sign up to access all community features, join projects, earn rewards, and start building with the best developer community online.',
      keywords: ['join', 'sign up', 'register', 'access', 'earn', 'rewards', 'community', 'start']
    },

    /* ── hiring.html ── */
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Recruitment Hero', sectionId: 'hiring-hero',
      text: 'Join the PhineX developer team. We are looking for passionate programmers, designers, and innovators who want to shape the future of web technology alongside our growing team.',
      keywords: ['hiring', 'join team', 'recruitment', 'programmers', 'designers', 'innovators', 'careers', 'apply']
    },
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Step 1 – X-Academy', sectionId: 'step-academy',
      text: 'Step one: complete the X-Academy training program. Learn core development skills, pass assessments, and earn your foundation badge before advancing to the developer test.',
      keywords: ['x-academy', 'training', 'step 1', 'skills', 'assessment', 'badge', 'foundation', 'learn']
    },
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Step 2 – Developer Test', sectionId: 'step-test',
      text: 'Step two: pass the PhineX developer test. Prove your coding skills with a timed practical assessment covering algorithms, front-end, back-end, and problem solving.',
      keywords: ['developer test', 'coding test', 'step 2', 'algorithms', 'practical', 'assessment', 'front-end', 'back-end', 'problem solving']
    },
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Step 3 – Redeem Code', sectionId: 'step-redeem',
      text: 'Step three: redeem your exclusive PhineX invite code to activate your developer profile and unlock full platform access, premium tools, and community privileges.',
      keywords: ['redeem code', 'invite', 'step 3', 'activate', 'profile', 'unlock', 'premium', 'access', 'privileges']
    },
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Benefits', sectionId: 'benefits',
      text: 'PhineX developer benefits: competitive rewards, exclusive project credits, mentorship access, priority support, featured profile badge, early access to beta features, and networking opportunities.',
      keywords: ['benefits', 'rewards', 'credits', 'mentorship', 'support', 'badge', 'beta', 'networking', 'perks']
    },
    {
      page: 'hiring.html', pageTitle: 'Join Us',
      section: 'Terms & Conditions', sectionId: 'terms',
      text: 'PhineX recruitment terms and conditions. Eligibility requirements, code of conduct, intellectual property agreements, non-disclosure obligations, and developer responsibilities.',
      keywords: ['terms', 'conditions', 'eligibility', 'conduct', 'intellectual property', 'nda', 'responsibilities', 'rules']
    },

    /* ── x-academy.html ── */
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Academy Hero', sectionId: 'academy-hero',
      text: 'X-Academy — the PhineX training ground. Master web development through structured learning paths, real-world projects, and expert-led challenges. Level up your skills from beginner to professional.',
      keywords: ['x-academy', 'training', 'learning', 'web development', 'beginner', 'professional', 'skills', 'level up']
    },
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Student Track', sectionId: 'student-track',
      text: 'Student learning path: HTML, CSS, JavaScript fundamentals, responsive design, accessibility, Git version control, command line basics, and building your first portfolio project.',
      keywords: ['student', 'track', 'html', 'css', 'javascript', 'fundamentals', 'responsive', 'git', 'portfolio', 'beginner']
    },
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Developer Track', sectionId: 'developer-track',
      text: 'Developer learning path: advanced JavaScript, React, Node.js, REST APIs, databases, authentication, deployment, DevOps, Docker, CI/CD pipelines, and full-stack architecture.',
      keywords: ['developer', 'track', 'react', 'node.js', 'api', 'database', 'authentication', 'docker', 'devops', 'full-stack', 'cicd']
    },
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Curriculum', sectionId: 'curriculum',
      text: 'Full X-Academy curriculum covering frontend development, backend services, database management, cloud deployment, security principles, testing methodologies, and real-world project delivery.',
      keywords: ['curriculum', 'frontend', 'backend', 'cloud', 'security', 'testing', 'delivery', 'courses', 'modules']
    },
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Testimonials', sectionId: 'testimonials',
      text: 'Success stories from X-Academy graduates. Developers who completed the program, passed the developer test, joined PhineX teams, and launched their own projects through the platform.',
      keywords: ['testimonials', 'success', 'graduates', 'stories', 'reviews', 'feedback', 'alumni']
    },
    {
      page: 'x-academy.html', pageTitle: 'X-Academy',
      section: 'Enroll', sectionId: 'enroll',
      text: 'Enroll in X-Academy today. Choose your track, start learning at your own pace, complete assessments, earn badges, and work toward PhineX developer certification.',
      keywords: ['enroll', 'start', 'pace', 'badges', 'certification', 'register', 'sign up']
    },

    /* ── bugreport.html ── */
    {
      page: 'bugreport.html', pageTitle: 'Bug Report',
      section: 'Report Hero', sectionId: 'report-hero',
      text: 'Report a bug to PhineX. Help us improve the platform by submitting detailed bug reports. Every valid report is reviewed by our engineering team and rewards are issued for critical findings.',
      keywords: ['bug report', 'submit', 'report', 'engineering', 'rewards', 'platform', 'improve', 'issues']
    },
    {
      page: 'bugreport.html', pageTitle: 'Bug Report',
      section: 'Bug Submission Form', sectionId: 'bug-form',
      text: 'Bug submission form. Enter your name, email, bug title, description, steps to reproduce, expected vs actual behaviour, severity level, and attach screenshots or files.',
      keywords: ['form', 'submit', 'name', 'email', 'title', 'description', 'steps', 'reproduce', 'severity', 'screenshot', 'attachment']
    },
    {
      page: 'bugreport.html', pageTitle: 'Bug Report',
      section: 'Severity Levels', sectionId: 'severity',
      text: 'Bug severity classification: Critical — platform down or data loss. High — major feature broken. Medium — feature impaired with workaround. Low — minor cosmetic or UX issue.',
      keywords: ['severity', 'critical', 'high', 'medium', 'low', 'classification', 'priority', 'levels']
    },
    {
      page: 'bugreport.html', pageTitle: 'Bug Report',
      section: 'Recent Reports', sectionId: 'recent-reports',
      text: 'Recently submitted bug reports from the PhineX community. Browse open, in-progress, and resolved issues. Filter by severity, date, or component. Track your own submissions.',
      keywords: ['recent', 'reports', 'open', 'resolved', 'in-progress', 'filter', 'track', 'history']
    },

    /* ── redeemcode.html ── */
    {
      page: 'redeemcode.html', pageTitle: 'Redeem Code',
      section: 'Redeem Hero', sectionId: 'redeem-hero',
      text: 'Redeem your PhineX invite code. Enter your exclusive code to unlock developer access, activate premium features, and join the PhineX community as a verified developer.',
      keywords: ['redeem', 'invite code', 'unlock', 'activate', 'premium', 'verified', 'access', 'developer']
    },
    {
      page: 'redeemcode.html', pageTitle: 'Redeem Code',
      section: 'Code Input', sectionId: 'code-input',
      text: 'Enter your PhineX invite code in the redemption field. Codes are case-sensitive, 16 characters, and single-use. Contact support if your code is invalid or already used.',
      keywords: ['code input', 'enter', 'case-sensitive', 'single-use', 'invalid', 'support', 'field']
    },
    {
      page: 'redeemcode.html', pageTitle: 'Redeem Code',
      section: 'How to Get a Code', sectionId: 'get-code',
      text: 'How to get a PhineX invite code: complete X-Academy training, pass the developer test, get referred by an existing PhineX developer, or win a code in community events and contests.',
      keywords: ['get code', 'earn', 'how to', 'referred', 'events', 'contests', 'training', 'test']
    },
    {
      page: 'redeemcode.html', pageTitle: 'Redeem Code',
      section: 'Redemption Success', sectionId: 'success-overlay',
      text: 'Congratulations! Code redeemed successfully. Your developer profile is now active. You now have full access to PhineX projects, community forums, and developer tools.',
      keywords: ['success', 'congratulations', 'active', 'profile', 'activated', 'access granted']
    },

    /* ── settings.html ── */
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Settings Hero', sectionId: 'settings-hero',
      text: 'PhineX settings. Customise your experience with theme selection, language preferences, notification controls, privacy options, and developer tool configurations.',
      keywords: ['settings', 'customise', 'configure', 'preferences', 'options']
    },
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Theme Selector', sectionId: 'theme-selector',
      text: 'Choose your PhineX theme: Void Dark, Neon Green, Crimson Red, Ocean Blue, Solar Gold, and Arctic White. Each theme applies a distinct colour palette and visual style across the entire platform.',
      keywords: ['theme', 'dark mode', 'light mode', 'void', 'neon', 'crimson', 'ocean', 'solar', 'arctic', 'colour', 'palette', 'appearance']
    },
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Language', sectionId: 'language',
      text: 'Language settings: English, Arabic, French, Spanish, German, and Japanese. Change the platform language to display all interface text in your preferred language.',
      keywords: ['language', 'english', 'arabic', 'french', 'spanish', 'german', 'japanese', 'translation', 'localisation', 'locale']
    },
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Notifications', sectionId: 'notifications',
      text: 'Notification preferences: email notifications, push alerts, project updates, community mentions, badge achievements, security alerts, and weekly digest emails.',
      keywords: ['notifications', 'alerts', 'email', 'push', 'mentions', 'achievements', 'security', 'digest']
    },
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Privacy', sectionId: 'privacy',
      text: 'Privacy and security settings: profile visibility, data sharing controls, two-factor authentication, active sessions management, connected applications, and account deletion.',
      keywords: ['privacy', 'security', 'visibility', 'data', 'two-factor', '2fa', 'sessions', 'account', 'delete']
    },
    {
      page: 'settings.html', pageTitle: 'Settings',
      section: 'Developer Tools', sectionId: 'dev-tools',
      text: 'Developer tool settings: API key management, webhook configuration, access token generation, debug mode toggle, rate limit display, and third-party integrations.',
      keywords: ['developer tools', 'api key', 'webhook', 'token', 'debug', 'rate limit', 'integrations', 'api']
    },

    /* ── aboutus.html ── */
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Our Story', sectionId: 'story',
      text: 'The PhineX story. Founded by passionate developers who believed the web needed a truly collaborative community. From a small group of coders to a global platform for thousands of developers.',
      keywords: ['story', 'founded', 'history', 'origin', 'about', 'background', 'community']
    },
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Founder', sectionId: 'founder',
      text: 'PhineX founder profile. Meet the visionary behind the platform, their journey in web development, goals for the community, and the mission that drives PhineX forward.',
      keywords: ['founder', 'creator', 'visionary', 'leadership', 'team leader', 'profile']
    },
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Mission', sectionId: 'mission',
      text: 'PhineX mission: to democratise web development education and create a meritocratic community where every developer, regardless of background, can learn, build, and grow together.',
      keywords: ['mission', 'purpose', 'vision', 'goals', 'democratise', 'education', 'meritocratic', 'values', 'grow']
    },
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Core Values', sectionId: 'values',
      text: 'PhineX core values: transparency, innovation, collaboration, quality, inclusivity, continuous learning, respect, and community-first decision making in everything we do.',
      keywords: ['values', 'transparency', 'innovation', 'collaboration', 'quality', 'inclusivity', 'learning', 'respect', 'community']
    },
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Statistics', sectionId: 'about-stats',
      text: 'PhineX impact: number of active developers, projects shipped, countries reached, lines of code written, bugs reported and fixed, certifications awarded, and hours of learning completed.',
      keywords: ['statistics', 'numbers', 'impact', 'developers', 'projects', 'countries', 'certifications', 'achievements']
    },
    {
      page: 'aboutus.html', pageTitle: 'About Us',
      section: 'Connect With Us', sectionId: 'connect',
      text: 'Connect with PhineX on Discord, GitHub, Twitter/X, Instagram, LinkedIn, and YouTube. Join our community server, follow our repositories, and stay updated on the latest PhineX developments.',
      keywords: ['connect', 'social', 'discord', 'github', 'twitter', 'instagram', 'linkedin', 'youtube', 'follow', 'community server']
    },
  ];

  /* ═══════════════════════════════════════════════════════════════════════
     2.  SEARCH ALGORITHM
  ═══════════════════════════════════════════════════════════════════════ */
  function tokenize(str) {
    return str.toLowerCase().match(/\b[a-z0-9][a-z0-9'-]{1,}\b/g) || [];
  }

  function scoreEntry(entry, queryTokens) {
    const haystack = (entry.text + ' ' + entry.section + ' ' + (entry.keywords || []).join(' ')).toLowerCase();
    let score = 0;
    const matchedWords = new Set();

    queryTokens.forEach(token => {
      // Exact word match
      const exactRe = new RegExp('\\b' + escRe(token) + '\\b');
      if (exactRe.test(haystack)) {
        score += 10;
        matchedWords.add(token);
      } else if (haystack.includes(token)) {
        score += 5;
        matchedWords.add(token);
      }
      // Section name match (higher weight)
      if (entry.section.toLowerCase().includes(token)) score += 8;
      // Page title match
      if (entry.pageTitle.toLowerCase().includes(token)) score += 4;
    });

    return { score, matchedWords: [...matchedWords] };
  }

  function search(rawQuery) {
    if (!rawQuery || rawQuery.trim().length < 1) return [];
    const tokens = tokenize(rawQuery);
    if (!tokens.length) return [];

    const results = [];
    INDEX.forEach(entry => {
      const { score, matchedWords } = scoreEntry(entry, tokens);
      if (score > 0) {
        results.push({ ...entry, score, matchedWords, rawQuery });
      }
    });

    // Sort: current page first, then by score descending
    results.sort((a, b) => {
      const aHome = a.page === CURRENT_PAGE ? 1 : 0;
      const bHome = b.page === CURRENT_PAGE ? 1 : 0;
      if (aHome !== bHome) return bHome - aHome;
      return b.score - a.score;
    });

    return results.slice(0, 30);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     3.  NAVIGATION & HIGHLIGHTING
  ═══════════════════════════════════════════════════════════════════════ */
  function navigateToResult(result) {
    const word = result.rawQuery;
    if (result.page === CURRENT_PAGE) {
      closeSearch();
      setTimeout(() => {
        scrollToSection(result.sectionId);
        setTimeout(() => highlightWord(word, result.sectionId), 600);
      }, 200);
    } else {
      const url = `${result.page}?pxs_q=${encodeURIComponent(word)}&pxs_s=${encodeURIComponent(result.sectionId)}`;
      window.location.href = url;
    }
  }

  function scrollToSection(sectionId) {
    // Try id first, then data-section, then name
    let el = document.getElementById(sectionId)
      || document.querySelector(`[data-section="${sectionId}"]`)
      || document.querySelector(`[name="${sectionId}"]`);

    // Fallback: fuzzy heading match
    if (!el) {
      const allHeadings = document.querySelectorAll('h1,h2,h3,h4');
      const id = sectionId.replace(/-/g, ' ').toLowerCase();
      allHeadings.forEach(h => {
        if (!el && h.textContent.trim().toLowerCase().includes(id)) el = h;
      });
    }

    if (el) {
      const offset = 80;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  }

  function highlightWord(word, sectionId) {
    // Find container
    let container = document.getElementById(sectionId)
      || document.querySelector(`[data-section="${sectionId}"]`)
      || document.body;

    // Expand container to parent section if needed
    if (container && container.children.length < 2) {
      container = container.closest('section') || container.parentElement || document.body;
    }

    // Use Mark.js if available
    if (typeof Mark !== 'undefined') {
      const instance = new Mark(container);
      instance.unmark({
        done: () => {
          instance.mark(word, {
            className: 'pxs-glow-mark',
            separateWordSearch: true,
            accuracy: 'partially',
            done: () => {
              setTimeout(() => {
                // Fade out
                document.querySelectorAll('.pxs-glow-mark').forEach(el => {
                  el.style.transition = 'all 1.5s ease';
                  el.style.boxShadow = 'none';
                  el.style.background = 'transparent';
                  el.style.color = 'inherit';
                });
                setTimeout(() => instance.unmark(), 1500);
              }, 9000);
            }
          });
          // Scroll to first mark
          const first = container.querySelector('.pxs-glow-mark');
          if (first) {
            const top = first.getBoundingClientRect().top + window.scrollY - 100;
            window.scrollTo({ top, behavior: 'smooth' });
          }
        }
      });
    } else {
      // Fallback: manual text replacement
      fallbackHighlight(container, word);
    }
  }

  function fallbackHighlight(container, word) {
    if (!word) return;
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    const nodes = [];
    let node;
    while ((node = walker.nextNode())) nodes.push(node);
    const re = new RegExp('(' + escRe(word) + ')', 'gi');
    nodes.forEach(n => {
      if (!re.test(n.textContent)) return;
      const span = document.createElement('span');
      span.innerHTML = n.textContent.replace(re, '<mark class="pxs-glow-mark">$1</mark>');
      n.parentNode.replaceChild(span, n);
    });
    setTimeout(() => {
      document.querySelectorAll('.pxs-glow-mark').forEach(el => {
        el.style.transition = 'all 1.5s ease';
        el.style.background = 'transparent';
        el.style.boxShadow = 'none';
        el.style.color = 'inherit';
      });
    }, 9000);
  }

  /* Handle URL params on page load (cross-page navigation landing) */
  function handleURLParams() {
    const params = new URLSearchParams(window.location.search);
    const q = params.get('pxs_q');
    const s = params.get('pxs_s');
    if (q && s) {
      // Clean URL without reloading
      const cleanURL = window.location.pathname;
      window.history.replaceState({}, '', cleanURL);
      // Wait for page to fully paint
      setTimeout(() => {
        scrollToSection(s);
        setTimeout(() => highlightWord(q, s), 700);
      }, 500);
    }
  }

  /* ═══════════════════════════════════════════════════════════════════════
     4.  UI — Styles
  ═══════════════════════════════════════════════════════════════════════ */
  const CSS = `
  /* ── PhineX Search Engine Styles ── */
  :root {
    --pxs-neon: #39ff14;
    --pxs-void: #050508;
    --pxs-card: #13131e;
    --pxs-border: rgba(57,255,20,0.18);
    --pxs-text: #e0e0e0;
    --pxs-muted: #6b6b80;
    --pxs-radius: 12px;
    --pxs-z: 99999;
  }

  /* Overlay */
  #pxs-overlay {
    position: fixed; inset: 0;
    background: rgba(5,5,8,0.82);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
    z-index: var(--pxs-z);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 6vh 1rem 2rem;
    opacity: 0; visibility: hidden;
    transition: opacity .22s ease, visibility .22s ease;
  }
  #pxs-overlay.pxs-open {
    opacity: 1; visibility: visible;
  }

  /* Modal */
  #pxs-modal {
    background: var(--pxs-card);
    border: 1px solid var(--pxs-border);
    border-radius: var(--pxs-radius);
    box-shadow:
      0 0 0 1px rgba(57,255,20,.08),
      0 8px 60px rgba(0,0,0,.7),
      0 0 40px rgba(57,255,20,.04);
    width: 100%; max-width: 660px;
    max-height: 78vh;
    display: flex; flex-direction: column;
    overflow: hidden;
    transform: translateY(-16px) scale(.97);
    transition: transform .22s cubic-bezier(.34,1.56,.64,1);
  }
  #pxs-overlay.pxs-open #pxs-modal {
    transform: translateY(0) scale(1);
  }

  /* Search bar */
  #pxs-search-bar {
    display: flex; align-items: center; gap: .75rem;
    padding: 1rem 1.2rem;
    border-bottom: 1px solid var(--pxs-border);
  }
  #pxs-search-bar svg { flex-shrink: 0; opacity: .55; }

  #pxs-input {
    flex: 1; border: none; background: transparent;
    color: var(--pxs-text); font-size: 1.05rem;
    font-family: 'Syne', 'DM Sans', sans-serif;
    outline: none; caret-color: var(--pxs-neon);
  }
  #pxs-input::placeholder { color: var(--pxs-muted); }

  #pxs-close-btn {
    background: none; border: none; cursor: pointer;
    color: var(--pxs-muted); padding: .3rem;
    border-radius: 6px; transition: color .15s, background .15s;
    font-size: .78rem; letter-spacing: .06em;
    font-family: 'Syne', sans-serif;
  }
  #pxs-close-btn:hover { color: var(--pxs-text); background: rgba(255,255,255,.06); }

  /* Results */
  #pxs-results {
    overflow-y: auto; flex: 1;
    scrollbar-width: thin;
    scrollbar-color: rgba(57,255,20,.25) transparent;
  }
  #pxs-results::-webkit-scrollbar { width: 4px; }
  #pxs-results::-webkit-scrollbar-thumb { background: rgba(57,255,20,.25); border-radius: 2px; }

  .pxs-empty-state {
    padding: 2.5rem 1.5rem; text-align: center;
    color: var(--pxs-muted); font-size: .9rem;
    font-family: 'DM Sans', sans-serif;
  }
  .pxs-empty-state svg { margin-bottom: .75rem; opacity: .3; }

  /* Result item */
  .pxs-result-item {
    display: flex; align-items: center; gap: .85rem;
    padding: .85rem 1.2rem;
    cursor: pointer; border-bottom: 1px solid rgba(255,255,255,.04);
    transition: background .12s;
    position: relative;
  }
  .pxs-result-item:last-child { border-bottom: none; }
  .pxs-result-item:hover,
  .pxs-result-item.pxs-active {
    background: rgba(57,255,20,.065);
  }
  .pxs-result-item.pxs-active .pxs-item-icon { color: var(--pxs-neon); }

  .pxs-item-icon {
    width: 32px; height: 32px; flex-shrink: 0;
    border: 1px solid rgba(57,255,20,.22);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    color: rgba(57,255,20,.65);
    background: rgba(57,255,20,.06);
    transition: color .15s;
  }

  .pxs-item-body { flex: 1; min-width: 0; }

  /* Breadcrumb: Page / Section / word */
  .pxs-breadcrumb {
    display: flex; align-items: center; flex-wrap: wrap; gap: .3rem;
    font-size: .78rem; color: var(--pxs-muted);
    font-family: 'DM Sans', sans-serif;
    margin-bottom: .2rem;
  }
  .pxs-breadcrumb-sep { opacity: .4; }
  .pxs-breadcrumb-page {
    color: var(--pxs-neon); font-weight: 600; opacity: .9;
  }
  .pxs-breadcrumb-section { color: var(--pxs-text); opacity: .7; }

  /* Matched word chips */
  .pxs-word-chips {
    display: flex; flex-wrap: wrap; gap: .35rem; margin-top: .3rem;
  }
  .pxs-chip {
    background: rgba(57,255,20,.12);
    border: 1px solid rgba(57,255,20,.28);
    color: var(--pxs-neon);
    font-size: .7rem; font-family: 'Syne', monospace;
    padding: .1rem .45rem; border-radius: 20px;
    letter-spacing: .03em;
  }

  /* Arrow hint */
  .pxs-arrow-hint {
    flex-shrink: 0; opacity: 0;
    color: var(--pxs-neon); transition: opacity .15s;
  }
  .pxs-result-item:hover .pxs-arrow-hint,
  .pxs-result-item.pxs-active .pxs-arrow-hint { opacity: 1; }

  /* Footer hint */
  #pxs-footer {
    padding: .6rem 1.2rem;
    border-top: 1px solid var(--pxs-border);
    display: flex; align-items: center; gap: 1.2rem;
    flex-wrap: wrap;
  }
  .pxs-hint {
    display: flex; align-items: center; gap: .35rem;
    font-size: .7rem; color: var(--pxs-muted);
    font-family: 'DM Sans', sans-serif;
  }
  .pxs-key {
    display: inline-flex; align-items: center; justify-content: center;
    background: rgba(255,255,255,.07); border: 1px solid rgba(255,255,255,.12);
    border-radius: 4px; padding: .05rem .38rem;
    font-size: .68rem; color: var(--pxs-text);
    font-family: monospace;
  }

  /* ── GLOW HIGHLIGHT ── */
  .pxs-glow-mark {
    background: rgba(57,255,20,.22) !important;
    color: #39ff14 !important;
    padding: 1px 3px;
    border-radius: 3px;
    box-shadow:
      0 0 8px rgba(57,255,20,.7),
      0 0 18px rgba(57,255,20,.45),
      inset 0 0 4px rgba(57,255,20,.25);
    animation: pxsGlowPulse 2s ease-in-out infinite;
  }
  @keyframes pxsGlowPulse {
    0%, 100% { box-shadow: 0 0 8px rgba(57,255,20,.7), 0 0 18px rgba(57,255,20,.45); }
    50%       { box-shadow: 0 0 16px rgba(57,255,20,.95), 0 0 32px rgba(57,255,20,.65); }
  }

  /* ── Trigger button (the 🔍 in nav) ── */
  .pxs-trigger {
    cursor: pointer;
    display: inline-flex; align-items: center; gap: .45rem;
    background: rgba(57,255,20,.07);
    border: 1px solid rgba(57,255,20,.2);
    color: rgba(57,255,20,.8);
    padding: .42rem .9rem; border-radius: 8px;
    font-family: 'DM Sans', sans-serif; font-size: .82rem;
    transition: background .15s, box-shadow .15s;
  }
  .pxs-trigger:hover {
    background: rgba(57,255,20,.13);
    box-shadow: 0 0 14px rgba(57,255,20,.2);
  }

  /* ── Mobile ── */
  @media (max-width: 560px) {
    #pxs-overlay { padding: 1rem .6rem 1rem; align-items: flex-start; }
    #pxs-modal { max-height: 88vh; border-radius: 10px; }
    #pxs-input { font-size: .98rem; }
    .pxs-breadcrumb { font-size: .72rem; }
  }
  `;

  /* ═══════════════════════════════════════════════════════════════════════
     5.  UI — HTML
  ═══════════════════════════════════════════════════════════════════════ */
  function buildUI() {
    // Inject styles
    const style = document.createElement('style');
    style.id = 'pxs-styles';
    style.textContent = CSS;
    document.head.appendChild(style);

    // Remove any existing pxs overlay shells
    document.querySelectorAll('.pxs-overlay, #pxs-overlay').forEach(el => {
      if (el.id !== 'pxs-overlay') el.remove();
    });

    // Build overlay
    const overlay = document.createElement('div');
    overlay.id = 'pxs-overlay';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');
    overlay.setAttribute('aria-label', 'Site Search');
    overlay.innerHTML = `
      <div id="pxs-modal" role="search">
        <div id="pxs-search-bar">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#39ff14" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input
            id="pxs-input"
            type="search"
            autocomplete="off"
            autocorrect="off"
            spellcheck="false"
            placeholder="Search PhineX…"
            aria-label="Search PhineX"
          />
          <button id="pxs-close-btn" aria-label="Close search">ESC</button>
        </div>
        <div id="pxs-results" role="listbox" aria-label="Search results"></div>
        <div id="pxs-footer">
          <span class="pxs-hint"><kbd class="pxs-key">↑</kbd><kbd class="pxs-key">↓</kbd> Navigate</span>
          <span class="pxs-hint"><kbd class="pxs-key">↵</kbd> Open</span>
          <span class="pxs-hint"><kbd class="pxs-key">Esc</kbd> Close</span>
        </div>
      </div>
    `;
    document.body.appendChild(overlay);
  }

  /* ═══════════════════════════════════════════════════════════════════════
     6.  UI — Rendering
  ═══════════════════════════════════════════════════════════════════════ */
  const PAGE_ICONS = {
    'index.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/></svg>`,
    'hiring.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`,
    'x-academy.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 10v6M2 10l10-5 10 5-10 5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/></svg>`,
    'bugreport.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M8 6l4-4 4 4"/><path d="M2 11h4m12 0h4"/><path d="M6 8.5A6 6 0 0 0 6 17a6 6 0 0 0 6 6 6 6 0 0 0 6-6 6 6 0 0 0 0-8.5"/><path d="M12 12v5m0-5h.01"/></svg>`,
    'redeemcode.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>`,
    'settings.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/></svg>`,
    'aboutus.html': `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/></svg>`,
  };

  function highlightQuery(text, query) {
    if (!query) return esc(text);
    const tokens = tokenize(query);
    if (!tokens.length) return esc(text);
    const re = new RegExp('(' + tokens.map(escRe).join('|') + ')', 'gi');
    return esc(text).replace(re, '<b style="color:#39ff14;font-weight:600;">$1</b>');
  }

  function renderResults(results, query) {
    const container = document.getElementById('pxs-results');
    if (!container) return;

    if (!query || query.trim() === '') {
      container.innerHTML = `
        <div class="pxs-empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <div>Search across all PhineX pages</div>
        </div>`;
      return;
    }

    if (!results.length) {
      container.innerHTML = `
        <div class="pxs-empty-state">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/><path d="M8 11h6m-3-3v6"/></svg>
          <div>No results for <strong style="color:#e0e0e0">"${esc(query)}"</strong></div>
          <div style="margin-top:.4rem;font-size:.8rem">Try a different word or browse a page directly</div>
        </div>`;
      return;
    }

    const isOtherPage = r => r.page !== CURRENT_PAGE;
    let html = '';

    results.forEach((r, i) => {
      const icon = PAGE_ICONS[r.page] || PAGE_ICONS['index.html'];
      const other = isOtherPage(r);

      // Build breadcrumb
      let breadcrumb = '';
      if (other) {
        breadcrumb += `<span class="pxs-breadcrumb-page">${esc(r.pageTitle)}</span>`;
        breadcrumb += `<span class="pxs-breadcrumb-sep">/</span>`;
      }
      breadcrumb += `<span class="pxs-breadcrumb-section">${highlightQuery(r.section, query)}</span>`;

      // Word chips
      const chips = (r.matchedWords || []).slice(0, 5).map(w =>
        `<span class="pxs-chip">${esc(w)}</span>`
      ).join('');

      html += `
        <div class="pxs-result-item" role="option" data-idx="${i}" tabindex="-1" aria-label="${esc(r.section)} in ${esc(r.pageTitle)}">
          <div class="pxs-item-icon">${icon}</div>
          <div class="pxs-item-body">
            <div class="pxs-breadcrumb">${breadcrumb}</div>
            ${chips ? `<div class="pxs-word-chips">${chips}</div>` : ''}
          </div>
          <svg class="pxs-arrow-hint" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>
        </div>`;
    });

    container.innerHTML = html;

    // Bind click events
    container.querySelectorAll('.pxs-result-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.idx, 10);
        navigateToResult(results[idx]);
      });
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     7.  STATE & EVENTS
  ═══════════════════════════════════════════════════════════════════════ */
  let _results = [];
  let _activeIdx = -1;
  let _debounce = null;

  function setActive(idx) {
    const items = document.querySelectorAll('.pxs-result-item');
    items.forEach(el => el.classList.remove('pxs-active'));
    if (idx >= 0 && idx < items.length) {
      items[idx].classList.add('pxs-active');
      items[idx].scrollIntoView({ block: 'nearest' });
      _activeIdx = idx;
    } else {
      _activeIdx = -1;
    }
  }

  function openSearch(prefill) {
    const overlay = document.getElementById('pxs-overlay');
    const input = document.getElementById('pxs-input');
    if (!overlay || !input) return;
    overlay.classList.add('pxs-open');
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      input.focus();
      if (prefill) {
        input.value = prefill;
        input.dispatchEvent(new Event('input'));
      }
    }, 60);
  }

  function closeSearch() {
    const overlay = document.getElementById('pxs-overlay');
    if (!overlay) return;
    overlay.classList.remove('pxs-open');
    document.body.style.overflow = '';
    _activeIdx = -1;
  }

  function bindEvents() {
    const overlay  = document.getElementById('pxs-overlay');
    const modal    = document.getElementById('pxs-modal');
    const input    = document.getElementById('pxs-input');
    const closeBtn = document.getElementById('pxs-close-btn');
    const results  = document.getElementById('pxs-results');

    if (!overlay || !input) return;

    // Close on backdrop click
    overlay.addEventListener('click', e => {
      if (!modal.contains(e.target)) closeSearch();
    });

    // Close button
    closeBtn && closeBtn.addEventListener('click', closeSearch);

    // Input
    input.addEventListener('input', e => {
      clearTimeout(_debounce);
      const q = e.target.value.trim();
      _debounce = setTimeout(() => {
        _results = search(q);
        _activeIdx = -1;
        renderResults(_results, q);
      }, 120);
    });

    // Keyboard
    input.addEventListener('keydown', e => {
      const items = document.querySelectorAll('.pxs-result-item');
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActive(Math.min(_activeIdx + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActive(Math.max(_activeIdx - 1, 0));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (_activeIdx >= 0 && _results[_activeIdx]) {
          navigateToResult(_results[_activeIdx]);
        } else if (_results[0]) {
          navigateToResult(_results[0]);
        }
      } else if (e.key === 'Escape') {
        closeSearch();
      }
    });

    // Global keyboard shortcut: Ctrl/Cmd+K or /
    document.addEventListener('keydown', e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        overlay.classList.contains('pxs-open') ? closeSearch() : openSearch();
      }
      if (e.key === 'Escape' && overlay.classList.contains('pxs-open')) {
        closeSearch();
      }
    });

    // Wire up any existing search triggers (data-pxs-trigger, .pxs-trigger, #search-trigger)
    document.querySelectorAll('[data-pxs-trigger], .pxs-trigger, #search-trigger, .search-trigger').forEach(el => {
      el.addEventListener('click', e => { e.preventDefault(); openSearch(); });
    });

    // Also hook existing nav search icons (input[type=search] click in nav)
    document.querySelectorAll('nav input[type=search], .nav-search, .navbar-search').forEach(el => {
      el.addEventListener('focus', () => openSearch());
    });
  }

  /* ═══════════════════════════════════════════════════════════════════════
     8.  UTILITIES
  ═══════════════════════════════════════════════════════════════════════ */
  function esc(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }
  function escRe(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /* ═══════════════════════════════════════════════════════════════════════
     9.  PUBLIC API
  ═══════════════════════════════════════════════════════════════════════ */
  window.PhineXSearch = {
    open: openSearch,
    close: closeSearch,
    search: search,
    highlight: highlightWord,
  };

  /* ═══════════════════════════════════════════════════════════════════════
     10. INIT
  ═══════════════════════════════════════════════════════════════════════ */
  function init() {
    buildUI();
    renderResults([], '');
    bindEvents();
    handleURLParams();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();