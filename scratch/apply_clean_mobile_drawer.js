const fs = require('fs');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

const demosList = [
  { num: '01', dir: '01-entrada-3d', name: 'Entradas 3D' },
  { num: '02', dir: '02-parallax-multicapa', name: 'Parallax Scrub' },
  { num: '03', dir: '03-loops-desfasados', name: 'Loops Armónicos' },
  { num: '04', dir: '04-suspension-viewport', name: 'CPU Saver' },
  { num: '05', dir: '05-carga-condicional', name: 'Carga Dinámica' },
  { num: '06', dir: '06-refresh-lazy-images', name: 'Zero CLS' },
  { num: '07', dir: '07-matchmedia-responsive', name: 'matchMedia()' },
  { num: '08', dir: '08-context-cleanup', name: 'gsap.context()' },
  { num: '09', dir: '09-texto-revelado-lineas', name: 'Texto Revelado' },
  { num: '10', dir: '10-canvas-secuencia-scroll', name: 'Canvas Scroll' },
  { num: '11', dir: '11-benchmark-transform-vs-layout', name: 'Benchmark WPO' },
  { num: '12', dir: '12-cursor-magnetico-quickto', name: 'Cursor Magnético' }
];

const drawerExtraCSS = `
    /* Mobile Drawer Rediseñado (2 Columnas & Cero Obstrucción) */
    .mobile-drawer {
      height: calc(100dvh - 56px) !important;
      padding: 1.25rem 1rem 6rem !important;
      overflow-y: auto !important;
      overscroll-behavior: contain !important;
      -webkit-overflow-scrolling: touch !important;
    }

    .mobile-drawer__header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid var(--border-subtle);
      margin-bottom: 0.25rem;
    }

    .mobile-drawer__title {
      font-family: var(--font-code);
      font-size: 0.72rem;
      text-transform: uppercase;
      color: var(--accent-primary);
      font-weight: 700;
      letter-spacing: 0.08em;
    }

    .mobile-demos-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.45rem;
    }

    .mobile-nav-card {
      display: flex;
      align-items: center;
      gap: 0.45rem;
      padding: 0.65rem 0.6rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-subtle);
      border-radius: var(--radius-sm);
      color: var(--text-main);
      text-decoration: none;
      font-family: var(--font-code);
      font-size: 0.72rem;
      transition: all 0.2s ease;
      min-width: 0;
    }

    .mobile-nav-card:hover, .mobile-nav-card:active {
      background: var(--bg-surface-elevated);
      border-color: var(--accent-primary);
    }

    .mobile-nav-card--active {
      border-color: var(--accent-primary) !important;
      background: rgba(6, 182, 212, 0.12) !important;
      color: #fff;
    }

    .mobile-nav-card__num {
      font-weight: 800;
      color: var(--accent-primary);
      font-size: 0.72rem;
      flex-shrink: 0;
    }

    .mobile-nav-card__name {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      color: var(--text-main);
    }

    .mobile-drawer__actions {
      display: flex;
      flex-direction: column;
      gap: 0.45rem;
      margin-top: 0.5rem;
      padding-top: 0.65rem;
      border-top: 1px solid var(--border-subtle);
    }

    .mobile-btn-action {
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0.7rem;
      border-radius: var(--radius-sm);
      font-family: var(--font-code);
      font-size: 0.76rem;
      font-weight: 700;
      text-decoration: none;
      text-align: center;
    }

    .mobile-btn-action--hub {
      background: var(--bg-surface-elevated);
      border: 1px solid var(--border-strong);
      color: #fff;
    }

    .mobile-btn-action--wpo {
      background: transparent;
      border: 1px solid var(--border-subtle);
      color: var(--text-muted);
    }
`;

function generateDrawerHTML(isRoot, currentNum = '') {
  const prefix = isRoot ? 'demos/' : '../';
  const hubLink = isRoot ? 'index.html' : '../../index.html';
  const wpoLink = isRoot ? '#criterios' : '../../index.html#criterios';

  let items = demosList.map(d => {
    const isActive = d.num === currentNum;
    const href = isRoot ? `${prefix}${d.dir}/index.html` : (d.num === currentNum ? 'index.html' : `${prefix}${d.dir}/index.html`);
    const activeClass = isActive ? ' mobile-nav-card--active' : '';
    return `      <a href="${href}" class="mobile-nav-card${activeClass}">
        <span class="mobile-nav-card__num">${d.num}</span>
        <span class="mobile-nav-card__name">${d.name}</span>
      </a>`;
  }).join('\n');

  return `<div id="mobileDrawer" class="mobile-drawer" aria-hidden="true">
    <div class="mobile-drawer__header">
      <span class="mobile-drawer__title">Catálogo de Demos (12)</span>
      <span style="font-family: var(--font-code); font-size: 0.68rem; color: var(--text-dim);">60 FPS GPU</span>
    </div>

    <div class="mobile-demos-grid">
${items}
    </div>

    <div class="mobile-drawer__actions">
      <a href="${hubLink}" class="mobile-btn-action mobile-btn-action--hub">← Volver al Hub Principal</a>
      <a href="${wpoLink}" class="mobile-btn-action mobile-btn-action--wpo">Ver Criterios Técnicos WPO ↗</a>
    </div>
  </div>`;
}

function processFileSafely(filePath, isRoot, currentNum) {
  let content = fs.readFileSync(filePath, 'utf8');

  // 1. Add extra CSS right before </style> if not present
  if (!content.includes('.mobile-demos-grid')) {
    content = content.replace('</style>', `${drawerExtraCSS}\n  </style>`);
  }

  // 2. Safely replace ONLY the <div id="mobileDrawer" ...> ... </div> block
  const drawerRegex = /<div id="mobileDrawer"[\s\S]*?<\/div>\s*<\/div>/;
  const singleDivDrawerRegex = /<div id="mobileDrawer"[\s\S]*?<\/div>/;

  // Find exact start and end of mobileDrawer
  const startIndex = content.indexOf('<div id="mobileDrawer"');
  if (startIndex !== -1) {
    // Find the next occurrence of </header> or <main or <section after startIndex
    const afterDrawerIndex = content.slice(startIndex).search(/<\/(header|nav)>|<(main|section|article)/i);
    if (afterDrawerIndex !== -1) {
      const fullDrawerBlock = content.substring(startIndex, startIndex + afterDrawerIndex).trim();
      const newDrawer = generateDrawerHTML(isRoot, currentNum);
      content = content.replace(fullDrawerBlock, newDrawer);
    }
  }

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Processed ${path.basename(path.dirname(filePath)) || 'root'}`);
}

// 1. Process index.html
processFileSafely(path.join(rootDir, 'index.html'), true, '');

// 2. Process all demos
demosList.forEach(d => {
  const filePath = path.join(rootDir, 'demos', d.dir, 'index.html');
  if (fs.existsSync(filePath)) {
    processFileSafely(filePath, false, d.num);
  }
});
