/**
 * Interactive System Dashboard — Apple HIG Engine
 * Pure Vanilla JavaScript implementation with smooth canvas rendering
 */

(function () {
  'use strict';

  // State
  const State = {
    cpu: 12.4,
    mem: 4.2,
    disk: 68.1,
    net: 142,
    history: [],
    maxHistory: 30,
    logs: [
      { time: '11:42:01', level: 'info', msg: 'Kernel initialization complete. Ready for telemetry stream.' },
      { time: '11:42:04', level: 'info', msg: 'Reagent dom mounted on container #app.' },
      { time: '11:42:15', level: 'info', msg: 'Network socket connected to telemetry multiplexer.' },
      { time: '11:42:28', level: 'warn', msg: 'Memory allocation threshold warning: GC cycle recommended.' },
      { time: '11:43:02', level: 'info', msg: 'Garbage collection completed. 384 MB reclaimed.' }
    ],
    searchFilter: '',
    activeTab: 'overview'
  };

  // Seed history
  for (let i = 0; i < State.maxHistory; i++) {
    State.history.push({
      cpu: 10 + Math.random() * 15,
      mem: 20 + Math.random() * 10
    });
  }

  // DOM Elements
  const valCpu = document.getElementById('val-cpu');
  const barCpu = document.getElementById('bar-cpu');
  const valMem = document.getElementById('val-mem');
  const barMem = document.getElementById('bar-mem');
  const valDisk = document.getElementById('val-disk');
  const barDisk = document.getElementById('bar-disk');
  const valNet = document.getElementById('val-net');
  const barNet = document.getElementById('bar-net');
  const logStream = document.getElementById('logStream');
  const logSearch = document.getElementById('logSearch');
  const clearLogs = document.getElementById('clearLogs');
  const simulatePulse = document.getElementById('simulatePulse');
  const themeToggle = document.getElementById('themeToggle');
  const canvas = document.getElementById('telemetryChart');
  const ctx = canvas.getContext('2d');
  const tabButtons = document.querySelectorAll('.pill-btn');

  function getColors() {
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    return {
      isDark,
      grid: isDark ? 'rgba(84, 84, 88, 0.35)' : 'rgba(60, 60, 67, 0.12)',
      text: isDark ? 'rgba(235, 235, 245, 0.60)' : 'rgba(60, 60, 67, 0.60)',
      cpuStroke: isDark ? '#0A84FF' : '#007AFF',
      cpuGrad1: isDark ? 'rgba(10, 132, 255, 0.35)' : 'rgba(0, 122, 255, 0.25)',
      cpuGrad2: 'rgba(0, 122, 255, 0)',
      memStroke: isDark ? '#30D158' : '#34C759',
      memGrad1: isDark ? 'rgba(48, 209, 88, 0.25)' : 'rgba(52, 199, 89, 0.15)',
      memGrad2: 'rgba(52, 199, 89, 0)'
    };
  }

  function resizeCanvas() {
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.parentElement.getBoundingClientRect();
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    canvas.style.width = rect.width + 'px';
    canvas.style.height = rect.height + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    renderChart();
  }

  function renderChart() {
    const width = canvas.parentElement.getBoundingClientRect().width;
    const height = canvas.parentElement.getBoundingClientRect().height;
    const colors = getColors();

    ctx.clearRect(0, 0, width, height);

    const padLeft = 45;
    const padRight = 20;
    const padTop = 20;
    const padBottom = 30;
    const chartW = width - padLeft - padRight;
    const chartH = height - padTop - padBottom;

    // Draw horizontal grid lines & labels
    ctx.strokeStyle = colors.grid;
    ctx.lineWidth = 1;
    ctx.font = '10px -apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif';
    ctx.fillStyle = colors.text;
    ctx.textAlign = 'right';
    ctx.textBaseline = 'middle';

    for (let i = 0; i <= 4; i++) {
      const y = padTop + (chartH / 4) * i;
      const pct = 100 - i * 25;
      ctx.beginPath();
      ctx.moveTo(padLeft, y);
      ctx.lineTo(padLeft + chartW, y);
      ctx.stroke();
      ctx.fillText(pct + '%', padLeft - 8, y);
    }

    if (State.history.length < 2) return;

    // Helper for smooth Bezier spline
    function drawSpline(dataKey, strokeColor, grad1, grad2) {
      const step = chartW / (State.history.length - 1);
      const points = State.history.map((pt, i) => {
        const x = padLeft + i * step;
        const val = Math.min(100, Math.max(0, pt[dataKey]));
        const y = padTop + chartH - (val / 100) * chartH;
        return { x, y };
      });

      // Fill path
      ctx.beginPath();
      ctx.moveTo(points[0].x, padTop + chartH);
      ctx.lineTo(points[0].x, points[0].y);

      for (let i = 0; i < points.length - 1; i++) {
        const cpX = (points[i].x + points[i + 1].x) / 2;
        ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
      }

      ctx.lineTo(points[points.length - 1].x, padTop + chartH);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, padTop, 0, padTop + chartH);
      grad.addColorStop(0, grad1);
      grad.addColorStop(1, grad2);
      ctx.fillStyle = grad;
      ctx.fill();

      // Stroke path
      ctx.beginPath();
      ctx.moveTo(points[0].x, points[0].y);
      for (let i = 0; i < points.length - 1; i++) {
        const cpX = (points[i].x + points[i + 1].x) / 2;
        ctx.bezierCurveTo(cpX, points[i].y, cpX, points[i + 1].y, points[i + 1].x, points[i + 1].y);
      }
      ctx.strokeStyle = strokeColor;
      ctx.lineWidth = 2.5;
      ctx.lineCap = 'round';
      ctx.stroke();
    }

    drawSpline('mem', colors.memStroke, colors.memGrad1, colors.memGrad2);
    drawSpline('cpu', colors.cpuStroke, colors.cpuGrad1, colors.cpuGrad2);
  }

  function renderLogs() {
    const filter = State.searchFilter.toLowerCase();
    const filtered = State.logs.filter(log => {
      if (!filter) return true;
      return log.msg.toLowerCase().includes(filter) ||
             log.level.toLowerCase().includes(filter) ||
             log.time.includes(filter);
    });

    logStream.innerHTML = '';
    for (const log of filtered) {
      const entry = document.createElement('div');
      entry.className = 'log-entry';
      entry.innerHTML = `
        <span class="log-time">[${log.time}]</span>
        <span class="log-level ${log.level}">${log.level.toUpperCase()}</span>
        <span class="log-msg">${escapeHtml(log.msg)}</span>
      `;
      logStream.appendChild(entry);
    }
    logStream.scrollTop = logStream.scrollHeight;
  }

  function escapeHtml(str) {
    return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function addLog(level, msg) {
    const now = new Date();
    const time = now.toTimeString().split(' ')[0];
    State.logs.push({ time, level, msg });
    if (State.logs.length > 100) State.logs.shift();
    renderLogs();
  }

  function updateMetrics(pulse = false) {
    // Random subtle telemetry flutter
    const deltaCpu = pulse ? (20 + Math.random() * 30) : ((Math.random() - 0.48) * 3);
    State.cpu = Math.max(4.5, Math.min(96.0, State.cpu + deltaCpu));

    const deltaMem = pulse ? (1.5 + Math.random() * 2) : ((Math.random() - 0.5) * 0.1);
    State.mem = Math.max(3.2, Math.min(14.8, State.mem + deltaMem));

    const deltaNet = pulse ? (80 + Math.random() * 120) : ((Math.random() - 0.5) * 15);
    State.net = Math.max(20, Math.min(950, State.net + deltaNet));

    // Update DOM
    valCpu.textContent = State.cpu.toFixed(1) + '%';
    barCpu.style.width = State.cpu.toFixed(1) + '%';

    const memPct = ((State.mem / 16) * 100).toFixed(0);
    valMem.textContent = State.mem.toFixed(1) + ' GB';
    barMem.style.width = memPct + '%';

    valDisk.textContent = State.disk.toFixed(1) + '%';
    barDisk.style.width = State.disk.toFixed(1) + '%';

    valNet.textContent = Math.round(State.net) + ' Mbps';
    barNet.style.width = Math.min(100, (State.net / 500) * 100).toFixed(0) + '%';

    // Push history
    State.history.push({ cpu: State.cpu, mem: (State.mem / 16) * 100 });
    if (State.history.length > State.maxHistory) State.history.shift();

    renderChart();
  }

  // Event Listeners
  window.addEventListener('resize', () => resizeCanvas());

  if (window.matchMedia) {
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
      renderChart();
    });
  }

  logSearch.addEventListener('input', (e) => {
    State.searchFilter = e.target.value;
    renderLogs();
  });

  clearLogs.addEventListener('click', () => {
    State.logs = [];
    renderLogs();
  });

  simulatePulse.addEventListener('click', () => {
    updateMetrics(true);
    addLog('info', `Manual burst stimulated. Active CPU spike to ${State.cpu.toFixed(1)}%.`);
  });

  themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.classList.toggle('dark-mode');
    renderChart();
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      tabButtons.forEach(b => {
        b.classList.remove('active');
        b.setAttribute('aria-selected', 'false');
      });
      btn.classList.add('active');
      btn.setAttribute('aria-selected', 'true');
      State.activeTab = btn.dataset.tab;
    });
  });

  // Init
  resizeCanvas();
  renderLogs();
  setInterval(() => updateMetrics(false), 2000);

  // Periodic subtle logs
  setInterval(() => {
    const events = [
      { l: 'info', m: 'Telemetry ping acknowledged by edge gateway (4ms).' },
      { l: 'info', m: 'Process cljs.compiler.worker thread pool verified.' },
      { l: 'info', m: 'Memory heap compact completed successfully.' },
      { l: 'warn', m: 'Network socket frame jitter: 1.2ms offset.' }
    ];
    const item = events[Math.floor(Math.random() * events.length)];
    addLog(item.l, item.m);
  }, 7000);

})();
