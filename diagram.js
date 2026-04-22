function draw() {
    const svg = document.getElementById('svg');
    const container = document.getElementById('flow');
    if (!svg || !container) return;
    
    svg.innerHTML = '';
    const cr = container.getBoundingClientRect();
  
    function right(el) { const r = el.getBoundingClientRect(); return { x: r.right - cr.left, y: (r.top + r.bottom) / 2 - cr.top }; }
    function left(el) { const r = el.getBoundingClientRect(); return { x: r.left - cr.left, y: (r.top + r.bottom) / 2 - cr.top }; }
    function bottom(el) { const r = el.getBoundingClientRect(); return { x: (r.left + r.right) / 2 - cr.left, y: r.bottom - cr.top }; }
    function top(el) { const r = el.getBoundingClientRect(); return { x: (r.left + r.right) / 2 - cr.left, y: r.top - cr.top }; }
  
    const sap = document.getElementById('n-sap');
    const express = document.getElementById('n-express');
    const multer = document.getElementById('n-multer');
    const vault = document.getElementById('n-vault');
    const sdk = document.getElementById('n-sdk');
    const blob = document.getElementById('n-blob');
  
    // Only draw if elements exist
    if (!sap || !express) return;
  
    const arcs = [
      [right(sap), left(express), '#4a90d9', 'HTTPS POST'],
      [bottom(express), top(multer), '#5b8def', 'buffer'],
      [bottom(multer), top(vault), '#f4a623', 'cred request'],
      [bottom(vault), top(sdk), '#5b8def', 'credentials'],
      [right(sdk), left(blob), '#0072c6', 'stream upload'],
    ];
  
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    svg.appendChild(defs);
  
    function ensureMarker(color) {
      const id = 'arr-' + color.replace('#','');
      if (defs.querySelector('#' + id)) return id;
      const m = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
      m.setAttribute('id', id); m.setAttribute('viewBox', '0 0 8 8');
      m.setAttribute('refX', '7'); m.setAttribute('refY', '4');
      m.setAttribute('markerWidth', '5'); m.setAttribute('markerHeight', '5');
      m.setAttribute('orient', 'auto-start-reverse');
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', 'M0,0 L8,4 L0,8 Z'); p.setAttribute('fill', color);
      m.appendChild(p); defs.appendChild(m);
      return id;
    }
  
    arcs.forEach(([s, e, color, label]) => {
      const mid = ensureMarker(color);
      const isVertical = Math.abs(s.x - e.x) < 10;
      let d = isVertical ? `M ${s.x} ${s.y} L ${e.x} ${e.y}` : `M ${s.x} ${s.y} C ${(s.x + e.x) / 2} ${s.y}, ${(s.x + e.x) / 2} ${e.y}, ${e.x} ${e.y}`;
  
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', d); path.setAttribute('stroke', color);
      path.setAttribute('stroke-width', '1.5'); path.setAttribute('fill', 'none');
      path.setAttribute('marker-end', `url(#${mid})`); path.setAttribute('opacity', '0.7');
      svg.appendChild(path);
  
      if (label && path.getTotalLength) {
        const len = path.getTotalLength();
        if(len > 0) {
            const mp = path.getPointAtLength(len * 0.5);
            const w = label.length * 6.2 + 12;
            const bg = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
            bg.setAttribute('x', mp.x - w/2); bg.setAttribute('y', mp.y - 10);
            bg.setAttribute('width', w); bg.setAttribute('height', 18);
            bg.setAttribute('rx', '4'); bg.setAttribute('fill', '#0f172a');
            svg.appendChild(bg);
      
            const txt = document.createElementNS('http://www.w3.org/2000/svg', 'text');
            txt.setAttribute('x', mp.x); txt.setAttribute('y', mp.y + 3);
            txt.setAttribute('text-anchor', 'middle'); txt.setAttribute('font-size', '10');
            txt.setAttribute('fill', color); txt.setAttribute('font-family', 'IBM Plex Mono, monospace');
            txt.setAttribute('font-weight', '500'); txt.textContent = label;
            svg.appendChild(txt);
        }
      }
    });
  }
  
  // Robustly handle drawing when layout changes or finishes loading
  window.addEventListener('load', () => {
      const flow = document.getElementById('flow');
      if (flow) {
          // ResizeObserver triggers draw() anytime the grid changes shape (e.g. Tailwind loading)
          new ResizeObserver(draw).observe(flow);
      }
      setTimeout(draw, 100);
  });