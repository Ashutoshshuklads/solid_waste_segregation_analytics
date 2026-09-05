/* ==========================================================
   Solid Waste Generation Analytics - JavaScript
   Pure Vanilla JS (No external libraries)
   ========================================================== */

// Navigation controller
function navigateTo(viewName) {
  // Hide all views
  const views = document.querySelectorAll('.page-view');
  views.forEach(v => v.classList.remove('active'));

  // Deactivate all nav links
  const navLinks = document.querySelectorAll('.nav-link');
  navLinks.forEach(l => l.classList.remove('active'));

  // Activate targeted view and nav link
  const targetView = document.getElementById(`view-${viewName}`);
  const targetNav = document.getElementById(`nav-${viewName}`);

  if (targetView) {
    targetView.classList.add('active');
  }
  if (targetNav) {
    targetNav.classList.add('active');
  }

  // If entering analytics view, initialize or re-render charts
  if (viewName === 'analytics') {
    // slight delay to ensure container dimensions are computed
    setTimeout(renderAllCharts, 50);
  }

  window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================================
// Chart Utility: Setup High-DPI Canvas
// ==========================================================
function setupCanvas(canvasId) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return null;

  const dpr = window.devicePixelRatio || 1;
  const rect = canvas.getBoundingClientRect();
  const width = rect.width || 380;
  const height = 250;

  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = width + 'px';
  canvas.style.height = height + 'px';

  const ctx = canvas.getContext('2d');
  ctx.resetTransform();
  ctx.scale(dpr, dpr);
  return { ctx, width, height };
}

// ==========================================================
// 1. Most Common Waste Type (Vertical Bar Chart)
// ==========================================================
function renderChartWasteType() {
  const setup = setupCanvas('chart-waste-type');
  if (!setup) return;
  const { ctx, width, height } = setup;

  const data = [
    { label: 'Organic/Food', value: 45, color: '#2e7d32' },
    { label: 'Plastics', value: 25, color: '#388e3c' },
    { label: 'Paper', value: 15, color: '#4caf50' },
    { label: 'Metal & Glass', value: 10, color: '#81c784' },
    { label: 'Others', value: 5, color: '#a5d6a7' }
  ];

  const padding = { top: 30, right: 20, bottom: 45, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = 50;

  // Draw background gridlines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 5; i++) {
    const val = (maxVal / 5) * i;
    const y = padding.top + chartH - (val / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${val}%`, padding.left - 8, y + 4);
  }

  // Draw Bars
  const barWidth = Math.min(42, (chartW / data.length) * 0.65);
  const gap = chartW / data.length;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxVal) * chartH;
    const x = padding.left + index * gap + (gap - barWidth) / 2;
    const y = padding.top + chartH - barHeight;

    // Bar rectangle
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    // Value on top of bar
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${item.value}%`, x + barWidth / 2, y - 6);

    // Label below bar
    ctx.fillStyle = '#4b5563';
    ctx.font = '10px sans-serif';
    ctx.save();
    ctx.translate(x + barWidth / 2, padding.top + chartH + 16);
    ctx.fillText(item.label, 0, 0);
    ctx.restore();
  });
}

// ==========================================================
// 2. Waste Segregation Practice (Donut Chart)
// ==========================================================
function renderChartSegregationPractice() {
  const setup = setupCanvas('chart-segregation-practice');
  if (!setup) return;
  const { ctx, width, height } = setup;

  const data = [
    { label: 'Regularly Segregate', value: 61, color: '#2e7d32' },
    { label: 'Sometimes / Irregular', value: 24, color: '#f59e0b' },
    { label: 'Never Segregate', value: 15, color: '#ef4444' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = width * 0.35;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) - 15;
  const innerRadius = outerRadius * 0.55;

  let startAngle = -Math.PI / 2;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100%', centerX, centerY - 2);
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px sans-serif';
  ctx.fillText('Total', centerX, centerY + 12);

  // Legend on right
  const legendX = width * 0.64;
  let legendY = height / 2 - (data.length * 28) / 2 + 10;

  data.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, 12, 12, 3);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.value}%`, legendX + 18, legendY + 10);

    ctx.fillStyle = '#4b5563';
    ctx.font = '10px sans-serif';
    ctx.fillText(item.label, legendX + 48, legendY + 10);

    legendY += 26;
  });
}

// ==========================================================
// 3. Awareness Level (Column Chart)
// ==========================================================
function renderChartAwarenessLevel() {
  const setup = setupCanvas('chart-awareness-level');
  if (!setup) return;
  const { ctx, width, height } = setup;

  const data = [
    { label: 'High Awareness', value: 42, color: '#16a34a' },
    { label: 'Moderate Awareness', value: 30, color: '#65a30d' },
    { label: 'Low / Not Aware', value: 28, color: '#9ca3af' }
  ];

  const padding = { top: 30, right: 20, bottom: 45, left: 45 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = 50;

  // Grid lines
  ctx.strokeStyle = '#e5e7eb';
  ctx.lineWidth = 1;
  ctx.fillStyle = '#6b7280';
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'right';

  for (let i = 0; i <= 5; i++) {
    const val = (maxVal / 5) * i;
    const y = padding.top + chartH - (val / maxVal) * chartH;
    ctx.beginPath();
    ctx.moveTo(padding.left, y);
    ctx.lineTo(width - padding.right, y);
    ctx.stroke();
    ctx.fillText(`${val}%`, padding.left - 8, y + 4);
  }

  // Bars
  const barWidth = Math.min(50, (chartW / data.length) * 0.5);
  const gap = chartW / data.length;

  data.forEach((item, index) => {
    const barHeight = (item.value / maxVal) * chartH;
    const x = padding.left + index * gap + (gap - barWidth) / 2;
    const y = padding.top + chartH - barHeight;

    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(x, y, barWidth, barHeight, [4, 4, 0, 0]);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${item.value}%`, x + barWidth / 2, y - 6);

    ctx.fillStyle = '#4b5563';
    ctx.font = '11px sans-serif';
    ctx.fillText(item.label, x + barWidth / 2, padding.top + chartH + 18);
  });
}

// ==========================================================
// 4. Preferred Waste Management Method (Horizontal Bar Chart)
// ==========================================================
function renderChartPreferredMethod() {
  const setup = setupCanvas('chart-preferred-method');
  if (!setup) return;
  const { ctx, width, height } = setup;

  const data = [
    { label: 'Door-to-door Collection', value: 52, color: '#2e7d32' },
    { label: 'Community Bins', value: 26, color: '#3b82f6' },
    { label: 'Recycling Centers', value: 14, color: '#8b5cf6' },
    { label: 'Home Composting', value: 8, color: '#10b981' }
  ];

  const padding = { top: 20, right: 45, bottom: 20, left: 140 };
  const chartW = width - padding.left - padding.right;
  const chartH = height - padding.top - padding.bottom;
  const maxVal = 60;

  const barHeight = 22;
  const gap = chartH / data.length;

  data.forEach((item, index) => {
    const y = padding.top + index * gap + (gap - barHeight) / 2;
    const barWidth = (item.value / maxVal) * chartW;

    // Label
    ctx.fillStyle = '#374151';
    ctx.font = '11px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText(item.label, padding.left - 10, y + 15);

    // Background track
    ctx.fillStyle = '#f1f5f9';
    ctx.beginPath();
    ctx.roundRect(padding.left, y, chartW, barHeight, 4);
    ctx.fill();

    // Bar
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(padding.left, y, barWidth, barHeight, 4);
    ctx.fill();

    // Value text
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.value}%`, padding.left + barWidth + 8, y + 15);
  });
}

// ==========================================================
// 5. Waste Disposal Frequency (Donut Chart)
// ==========================================================
function renderChartDisposalFrequency() {
  const setup = setupCanvas('chart-disposal-frequency');
  if (!setup) return;
  const { ctx, width, height } = setup;

  const data = [
    { label: 'Daily Collection', value: 64, color: '#2e7d32' },
    { label: 'Alternate Days', value: 22, color: '#0284c7' },
    { label: 'Weekly', value: 10, color: '#f59e0b' },
    { label: 'Irregular / As needed', value: 4, color: '#94a3b8' }
  ];

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const centerX = width * 0.35;
  const centerY = height / 2;
  const outerRadius = Math.min(centerX, centerY) - 15;
  const innerRadius = outerRadius * 0.55;

  let startAngle = -Math.PI / 2;

  data.forEach(item => {
    const sliceAngle = (item.value / total) * 2 * Math.PI;

    ctx.beginPath();
    ctx.arc(centerX, centerY, outerRadius, startAngle, startAngle + sliceAngle);
    ctx.arc(centerX, centerY, innerRadius, startAngle + sliceAngle, startAngle, true);
    ctx.closePath();
    ctx.fillStyle = item.color;
    ctx.fill();

    startAngle += sliceAngle;
  });

  // Center text
  ctx.fillStyle = '#1f2937';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('100%', centerX, centerY - 2);
  ctx.fillStyle = '#6b7280';
  ctx.font = '10px sans-serif';
  ctx.fillText('Frequency', centerX, centerY + 12);

  // Legend on right
  const legendX = width * 0.63;
  let legendY = height / 2 - (data.length * 24) / 2 + 8;

  data.forEach(item => {
    ctx.fillStyle = item.color;
    ctx.beginPath();
    ctx.roundRect(legendX, legendY, 10, 10, 2);
    ctx.fill();

    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 11px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${item.value}%`, legendX + 16, legendY + 9);

    ctx.fillStyle = '#4b5563';
    ctx.font = '10px sans-serif';
    ctx.fillText(item.label, legendX + 46, legendY + 9);

    legendY += 24;
  });
}

// Master chart renderer
function renderAllCharts() {
  renderChartWasteType();
  renderChartSegregationPractice();
  renderChartAwarenessLevel();
  renderChartPreferredMethod();
  renderChartDisposalFrequency();
}

// Listen to window resize to make charts responsive
window.addEventListener('resize', () => {
  const analyticsView = document.getElementById('view-analytics');
  if (analyticsView && analyticsView.classList.contains('active')) {
    renderAllCharts();
  }
});

// Initialization
document.addEventListener('DOMContentLoaded', () => {
  // Initial page load starts at Home
  navigateTo('home');
});
