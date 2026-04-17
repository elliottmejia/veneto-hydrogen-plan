import { marked } from 'marked';
import hljs from 'highlight.js';
import 'highlight.js/styles/github.css';
import mermaid from 'mermaid';
import mdTech from './HYDROGEN_BUILD_PLAN.md';
import mdBiz from './HYDROGEN_BUILD_PLAN_BUSINESS.md';

mermaid.initialize({ startOnLoad: false, theme: 'neutral', securityLevel: 'loose' });

function parseMd(md) {
  const mermaidStash = [];
  const mdSansCharts = md.replace(/```mermaid\n([\s\S]*?)```/g, (_, code) => {
    const idx = mermaidStash.push(code.trim()) - 1;
    return `MERMAID_PLACEHOLDER_${idx}`;
  });
  return marked.parse(mdSansCharts).replace(/MERMAID_PLACEHOLDER_(\d+)/g, (_, i) =>
    `<div class="mermaid-wrapper"><pre class="mermaid">${mermaidStash[i]}</pre></div>`
  );
}

const docs = [
  { id: 'technical', label: 'Technical Plan', md: mdTech },
  { id: 'business', label: 'Business Overview', md: mdBiz },
];

let activeTab = docs[0].id;

function buildNav(contentEl, navEl) {
  navEl.innerHTML = '';
  const headings = contentEl.querySelectorAll('h2, h3');
  const HEADER_H = 72 + 44; // sticky header + tab bar

  headings.forEach((h, i) => {
    if (!h.id) {
      h.id = 'h-' + i + '-' + h.textContent
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '');
    }
    const a = document.createElement('a');
    a.href = '#' + h.id;
    a.textContent = h.textContent.trim();
    if (h.tagName === 'H3') a.classList.add('h3-link');
    navEl.appendChild(a);
  });

  navEl.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - HEADER_H;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });

  const allAnchors = navEl.querySelectorAll('a');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        allAnchors.forEach(a => a.classList.remove('active'));
        const active = navEl.querySelector(`a[href="#${entry.target.id}"]`);
        if (active) active.classList.add('active');
      }
    });
  }, { rootMargin: '-10% 0px -80% 0px', threshold: 0 });

  headings.forEach(h => observer.observe(h));
}

function renderTab(tabId) {
  activeTab = tabId;
  const doc = docs.find(d => d.id === tabId);
  const contentEl = document.getElementById('content');
  const navEl = document.getElementById('sidebar-nav');

  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === tabId);
  });

  contentEl.innerHTML = parseMd(doc.md);
  window.scrollTo({ top: 0, behavior: 'instant' });

  contentEl.querySelectorAll('pre code').forEach(el => hljs.highlightElement(el));
  mermaid.run({ nodes: contentEl.querySelectorAll('pre.mermaid') });

  buildNav(contentEl, navEl);
}

// Wire up tab buttons
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => renderTab(btn.dataset.tab));
});

renderTab(activeTab);
