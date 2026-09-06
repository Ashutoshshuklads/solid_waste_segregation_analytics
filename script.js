/* ==========================================================
   Solid Waste Generation Analytics - JavaScript
   Pure Vanilla JS (No external libraries)
   ========================================================== */


// ==========================================================
// Navigation Controller
// ==========================================================
function navigateTo(viewName) {

  // Hide all views
  const views = document.querySelectorAll('.page-view');

  views.forEach(v => {
    v.classList.remove('active');
  });


  // Deactivate all navigation links
  const navLinks = document.querySelectorAll('.nav-link');

  navLinks.forEach(l => {
    l.classList.remove('active');
  });


  // Target view
  const targetView =
    document.getElementById(`view-${viewName}`);

  const targetNav =
    document.getElementById(`nav-${viewName}`);


  // Activate target view
  if (targetView) {
    targetView.classList.add('active');
  }


  // Activate target navigation button
  if (targetNav) {
    targetNav.classList.add('active');
  }


  // Render analytics charts
  if (viewName === 'analytics') {

    setTimeout(renderAllCharts, 50);

  }


  // Render survey charts
  if (viewName === 'surveys') {

    setTimeout(renderAllSurveyCharts, 50);

  }


  // Scroll to top
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });

}



// ==========================================================
// Chart Utility
// High-DPI Canvas Setup
// ==========================================================
function setupCanvas(canvasId) {

  const canvas =
    document.getElementById(canvasId);

  if (!canvas) return null;


  const dpr =
    window.devicePixelRatio || 1;


  const rect =
    canvas.getBoundingClientRect();


  const width =
    rect.width || 380;


  const height = 250;


  canvas.width =
    width * dpr;

  canvas.height =
    height * dpr;


  canvas.style.width =
    width + 'px';

  canvas.style.height =
    height + 'px';


  const ctx =
    canvas.getContext('2d');


  ctx.resetTransform();

  ctx.scale(dpr, dpr);


  return {
    ctx,
    width,
    height
  };

}



// ==========================================================
// 1. Most Common Waste Type
// Vertical Bar Chart
// ==========================================================
function renderChartWasteType() {

  const setup =
    setupCanvas('chart-waste-type');

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const data = [

    {
      label: 'Food/Kitchen',
      value: 58,
      color: '#2e7d32'
    },

    {
      label: 'Other',
      value: 25,
      color: '#388e3c'
    },

    {
      label: 'Paper',
      value: 9,
      color: '#4caf50'
    },

    {
      label: 'Plastic',
      value: 8,
      color: '#81c784'
    }

  ];


  const padding = {

    top: 30,
    right: 20,
    bottom: 45,
    left: 45

  };


  const chartW =
    width -
    padding.left -
    padding.right;


  const chartH =
    height -
    padding.top -
    padding.bottom;


  const maxVal = 60;


  // Grid lines
  ctx.strokeStyle =
    '#e5e7eb';

  ctx.lineWidth = 1;

  ctx.fillStyle =
    '#6b7280';

  ctx.font =
    '11px sans-serif';

  ctx.textAlign =
    'right';


  for (let i = 0; i <= 5; i++) {

    const val =
      (maxVal / 5) * i;


    const y =
      padding.top +
      chartH -
      (val / maxVal) * chartH;


    ctx.beginPath();

    ctx.moveTo(
      padding.left,
      y
    );

    ctx.lineTo(
      width - padding.right,
      y
    );

    ctx.stroke();


    ctx.fillText(
      `${val}%`,
      padding.left - 8,
      y + 4
    );

  }


  // Bars
  const barWidth =
    Math.min(
      42,
      (chartW / data.length) * 0.65
    );


  const gap =
    chartW / data.length;


  data.forEach(
    (item, index) => {

      const barHeight =
        (item.value / maxVal) *
        chartH;


      const x =
        padding.left +
        index * gap +
        (gap - barWidth) / 2;


      const y =
        padding.top +
        chartH -
        barHeight;


      // Bar
      ctx.fillStyle =
        item.color;


      ctx.beginPath();

      ctx.roundRect(
        x,
        y,
        barWidth,
        barHeight,
        [4, 4, 0, 0]
      );

      ctx.fill();


      // Value
      ctx.fillStyle =
        '#1f2937';

      ctx.font =
        'bold 11px sans-serif';

      ctx.textAlign =
        'center';


      ctx.fillText(
        `${item.value}%`,
        x + barWidth / 2,
        y - 6
      );


      // Label
      ctx.fillStyle =
        '#4b5563';

      ctx.font =
        '10px sans-serif';


      ctx.save();

      ctx.translate(
        x + barWidth / 2,
        padding.top + chartH + 16
      );


      ctx.fillText(
        item.label,
        0,
        0
      );


      ctx.restore();

    }
  );

}



// ==========================================================
// 2. Waste Segregation Practice
// Donut Chart
// ==========================================================
function renderChartSegregationPractice() {

  const setup =
    setupCanvas(
      'chart-segregation-practice'
    );

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const data = [

    {
      label: 'Always',
      value: 25,
      color: '#2e7d32'
    },

    {
      label: 'Sometimes',
      value: 17,
      color: '#f59e0b'
    },

    {
      label: 'Never',
      value: 58,
      color: '#ef4444'
    }

  ];


  const total =
    data.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );


  const centerX =
    width * 0.35;


  const centerY =
    height / 2;


  const outerRadius =
    Math.min(
      centerX,
      centerY
    ) - 15;


  const innerRadius =
    outerRadius * 0.55;


  let startAngle =
    -Math.PI / 2;


  data.forEach(item => {

    const sliceAngle =
      (item.value / total) *
      2 *
      Math.PI;


    ctx.beginPath();

    ctx.arc(
      centerX,
      centerY,
      outerRadius,
      startAngle,
      startAngle + sliceAngle
    );


    ctx.arc(
      centerX,
      centerY,
      innerRadius,
      startAngle + sliceAngle,
      startAngle,
      true
    );


    ctx.closePath();

    ctx.fillStyle =
      item.color;

    ctx.fill();


    startAngle +=
      sliceAngle;

  });


  // Center
  ctx.fillStyle =
    '#1f2937';

  ctx.font =
    'bold 14px sans-serif';

  ctx.textAlign =
    'center';


  ctx.fillText(
    '100%',
    centerX,
    centerY - 2
  );


  ctx.fillStyle =
    '#6b7280';

  ctx.font =
    '10px sans-serif';


  ctx.fillText(
    'Total',
    centerX,
    centerY + 12
  );


  // Legend
  const legendX =
    width * 0.64;


  let legendY =
    height / 2 -
    (data.length * 28) / 2 +
    10;


  data.forEach(item => {

    ctx.fillStyle =
      item.color;


    ctx.beginPath();

    ctx.roundRect(
      legendX,
      legendY,
      12,
      12,
      3
    );

    ctx.fill();


    ctx.fillStyle =
      '#1f2937';

    ctx.font =
      'bold 11px sans-serif';

    ctx.textAlign =
      'left';


    ctx.fillText(
      `${item.value}%`,
      legendX + 18,
      legendY + 10
    );


    ctx.fillStyle =
      '#4b5563';

    ctx.font =
      '10px sans-serif';


    ctx.fillText(
      item.label,
      legendX + 48,
      legendY + 10
    );


    legendY += 26;

  });

}



// ==========================================================
// 3. Awareness Level
// Column Chart
// ==========================================================
function renderChartAwarenessLevel() {

  const setup =
    setupCanvas(
      'chart-awareness-level'
    );

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const data = [

    {
      label: 'Yes',
      value: 33,
      color: '#16a34a'
    },

    {
      label: 'Somewhat',
      value: 34,
      color: '#65a30d'
    },

    {
      label: 'No',
      value: 33,
      color: '#9ca3af'
    }

  ];


  const padding = {

    top: 30,
    right: 20,
    bottom: 45,
    left: 45

  };


  const chartW =
    width -
    padding.left -
    padding.right;


  const chartH =
    height -
    padding.top -
    padding.bottom;


  const maxVal = 50;


  // Grid
  ctx.strokeStyle =
    '#e5e7eb';

  ctx.lineWidth = 1;

  ctx.fillStyle =
    '#6b7280';

  ctx.font =
    '11px sans-serif';

  ctx.textAlign =
    'right';


  for (let i = 0; i <= 5; i++) {

    const val =
      (maxVal / 5) * i;


    const y =
      padding.top +
      chartH -
      (val / maxVal) *
      chartH;


    ctx.beginPath();

    ctx.moveTo(
      padding.left,
      y
    );

    ctx.lineTo(
      width - padding.right,
      y
    );

    ctx.stroke();


    ctx.fillText(
      `${val}%`,
      padding.left - 8,
      y + 4
    );

  }


  // Bars
  const barWidth =
    Math.min(
      50,
      (chartW / data.length) * 0.5
    );


  const gap =
    chartW / data.length;


  data.forEach(
    (item, index) => {

      const barHeight =
        (item.value / maxVal) *
        chartH;


      const x =
        padding.left +
        index * gap +
        (gap - barWidth) / 2;


      const y =
        padding.top +
        chartH -
        barHeight;


      ctx.fillStyle =
        item.color;


      ctx.beginPath();

      ctx.roundRect(
        x,
        y,
        barWidth,
        barHeight,
        [4, 4, 0, 0]
      );

      ctx.fill();


      ctx.fillStyle =
        '#1f2937';

      ctx.font =
        'bold 12px sans-serif';

      ctx.textAlign =
        'center';


      ctx.fillText(
        `${item.value}%`,
        x + barWidth / 2,
        y - 6
      );


      ctx.fillStyle =
        '#4b5563';

      ctx.font =
        '11px sans-serif';


      ctx.fillText(
        item.label,
        x + barWidth / 2,
        padding.top +
        chartH +
        18
      );

    }
  );

}



// ==========================================================
// 4. Waste Collection Frequency
// Horizontal Bar Chart
// ==========================================================
function renderChartPreferredMethod() {

  const setup =
    setupCanvas(
      'chart-preferred-method'
    );

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const data = [

    {
      label: 'Daily',
      value: 58,
      color: '#2e7d32'
    },

    {
      label: "I don't know",
      value: 25,
      color: '#3b82f6'
    },

    {
      label: 'Irregularly',
      value: 9,
      color: '#8b5cf6'
    },

    {
      label: 'Once a week',
      value: 8,
      color: '#10b981'
    }

  ];


  const padding = {

    top: 20,
    right: 45,
    bottom: 20,
    left: 140

  };


  const chartW =
    width -
    padding.left -
    padding.right;


  const chartH =
    height -
    padding.top -
    padding.bottom;


  const maxVal = 60;


  const barHeight = 22;

  const gap =
    chartH / data.length;


  data.forEach(
    (item, index) => {

      const y =
        padding.top +
        index * gap +
        (gap - barHeight) / 2;


      const barWidth =
        (item.value / maxVal) *
        chartW;


      // Label
      ctx.fillStyle =
        '#374151';

      ctx.font =
        '11px sans-serif';

      ctx.textAlign =
        'right';


      ctx.fillText(
        item.label,
        padding.left - 10,
        y + 15
      );


      // Background
      ctx.fillStyle =
        '#f1f5f9';


      ctx.beginPath();

      ctx.roundRect(
        padding.left,
        y,
        chartW,
        barHeight,
        4
      );

      ctx.fill();


      // Bar
      ctx.fillStyle =
        item.color;


      ctx.beginPath();

      ctx.roundRect(
        padding.left,
        y,
        barWidth,
        barHeight,
        4
      );

      ctx.fill();


      // Value
      ctx.fillStyle =
        '#1f2937';

      ctx.font =
        'bold 11px sans-serif';

      ctx.textAlign =
        'left';


      ctx.fillText(
        `${item.value}%`,
        padding.left +
        barWidth +
        8,
        y + 15
      );

    }
  );

}



// ==========================================================
// 5. Biggest Waste Management Problem
// Donut Chart
// ==========================================================
function renderChartDisposalFrequency() {

  const setup =
    setupCanvas(
      'chart-disposal-frequency'
    );

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const data = [

    {
      label: 'Lack of awareness',
      value: 33,
      color: '#2e7d32'
    },

    {
      label: 'Lack of dustbins',
      value: 17,
      color: '#0284c7'
    },

    {
      label: 'Other',
      value: 25,
      color: '#f59e0b'
    },

    {
      label: 'Poor waste segregation',
      value: 17,
      color: '#94a3b8'
    },

    {
      label: 'Irregular waste collection',
      value: 8,
      color: '#ef4444'
    }

  ];


  const total =
    data.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );


  const centerX =
    width * 0.35;


  const centerY =
    height / 2;


  const outerRadius =
    Math.min(
      centerX,
      centerY
    ) - 15;


  const innerRadius =
    outerRadius * 0.55;


  let startAngle =
    -Math.PI / 2;


  data.forEach(item => {

    const sliceAngle =
      (item.value / total) *
      2 *
      Math.PI;


    ctx.beginPath();

    ctx.arc(
      centerX,
      centerY,
      outerRadius,
      startAngle,
      startAngle + sliceAngle
    );


    ctx.arc(
      centerX,
      centerY,
      innerRadius,
      startAngle + sliceAngle,
      startAngle,
      true
    );


    ctx.closePath();

    ctx.fillStyle =
      item.color;

    ctx.fill();


    startAngle +=
      sliceAngle;

  });


  // Center
  ctx.fillStyle =
    '#1f2937';

  ctx.font =
    'bold 14px sans-serif';

  ctx.textAlign =
    'center';


  ctx.fillText(
    '100%',
    centerX,
    centerY - 2
  );


  ctx.fillStyle =
    '#6b7280';

  ctx.font =
    '10px sans-serif';


  ctx.fillText(
    'Frequency',
    centerX,
    centerY + 12
  );


  // Legend
  const legendX =
    width * 0.63;


  let legendY =
    height / 2 -
    (data.length * 24) / 2 +
    8;


  data.forEach(item => {

    ctx.fillStyle =
      item.color;


    ctx.beginPath();

    ctx.roundRect(
      legendX,
      legendY,
      10,
      10,
      2
    );

    ctx.fill();


    ctx.fillStyle =
      '#1f2937';

    ctx.font =
      'bold 11px sans-serif';

    ctx.textAlign =
      'left';


    ctx.fillText(
      `${item.value}%`,
      legendX + 16,
      legendY + 9
    );


    ctx.fillStyle =
      '#4b5563';

    ctx.font =
      '10px sans-serif';


    ctx.fillText(
      item.label,
      legendX + 46,
      legendY + 9
    );


    legendY += 24;

  });

}



// ==========================================================
// Master Chart Renderer
// ==========================================================
function renderAllCharts() {

  renderChartWasteType();

  renderChartSegregationPractice();

  renderChartAwarenessLevel();

  renderChartPreferredMethod();

  renderChartDisposalFrequency();

}



// ==========================================================
// Survey Charts
// Questions 1 to 10
// Donut Charts
// ==========================================================
function drawDonutChart(
  canvasId,
  data
) {

  const setup =
    setupCanvas(canvasId);

  if (!setup) return;


  const {
    ctx,
    width,
    height
  } = setup;


  const total =
    data.reduce(
      (sum, item) =>
        sum + item.value,
      0
    );


  const centerX =
    width * 0.35;


  const centerY =
    height / 2;


  const outerRadius =
    Math.min(
      centerX,
      centerY
    ) - 15;


  const innerRadius =
    outerRadius * 0.55;


  let startAngle =
    -Math.PI / 2;


  data.forEach(item => {

    const sliceAngle =
      (item.value / total) *
      2 *
      Math.PI;


    ctx.beginPath();

    ctx.arc(
      centerX,
      centerY,
      outerRadius,
      startAngle,
      startAngle + sliceAngle
    );


    ctx.arc(
      centerX,
      centerY,
      innerRadius,
      startAngle + sliceAngle,
      startAngle,
      true
    );


    ctx.closePath();

    ctx.fillStyle =
      item.color;

    ctx.fill();


    startAngle +=
      sliceAngle;

  });


  // Center
  ctx.fillStyle =
    '#1f2937';

  ctx.font =
    'bold 14px sans-serif';

  ctx.textAlign =
    'center';


  ctx.fillText(
    '100%',
    centerX,
    centerY - 2
  );


  ctx.fillStyle =
    '#6b7280';

  ctx.font =
    '10px sans-serif';


  ctx.fillText(
    'Respondents',
    centerX,
    centerY + 12
  );


  // Legend
  const legendX =
    width * 0.64;


  const rowHeight =
    data.length > 5
      ? 22
      : 25;


  let legendY =
    height / 2 -
    (data.length * rowHeight) / 2 +
    8;


  data.forEach(item => {

    ctx.fillStyle =
      item.color;


    ctx.beginPath();

    ctx.roundRect(
      legendX,
      legendY,
      10,
      10,
      2
    );

    ctx.fill();


    ctx.fillStyle =
      '#1f2937';

    ctx.font =
      'bold 10px sans-serif';

    ctx.textAlign =
      'left';


    ctx.fillText(
      `${item.value}%`,
      legendX + 16,
      legendY + 9
    );


    ctx.fillStyle =
      '#4b5563';

    ctx.font =
      '9px sans-serif';


    ctx.fillText(
      item.label,
      legendX + 46,
      legendY + 9
    );


    legendY +=
      rowHeight;

  });

}



// ==========================================================
// Actual Survey Data
// 100-Respondent Equivalent
// ==========================================================
const surveyData = {

  // Q1
  1: [

    {
      label: 'Food/Kitchen waste',
      value: 58,
      color: '#2e7d32'
    },

    {
      label: 'Other',
      value: 25,
      color: '#388e3c'
    },

    {
      label: 'Paper',
      value: 9,
      color: '#4caf50'
    },

    {
      label: 'Plastic',
      value: 8,
      color: '#81c784'
    }

  ],


  // Q2
  2: [

    {
      label: 'Less than 1 kg',
      value: 50,
      color: '#2e7d32'
    },

    {
      label: '1- kg',
      value: 25,
      color: '#388e3c'
    },

    {
      label: 'More than 5 kg',
      value: 17,
      color: '#f59e0b'
    },

    {
      label: '3-5 kg',
      value: 8,
      color: '#94a3b8'
    }

  ],


  // Q3
  3: [

    {
      label: 'Always',
      value: 25,
      color: '#2e7d32'
    },

    {
      label: 'Sometimes',
      value: 17,
      color: '#f59e0b'
    },

    {
      label: 'Never',
      value: 58,
      color: '#ef4444'
    }

  ],


  // Q4
  4: [

    {
      label: 'Yes',
      value: 42,
      color: '#2e7d32'
    },

    {
      label: 'No',
      value: 58,
      color: '#ef4444'
    }

  ],


  // Q5
  5: [

    {
      label: 'Wet waste',
      value: 42,
      color: '#2e7d32'
    },

    {
      label: 'I do not separate waste',
      value: 42,
      color: '#f59e0b'
    },

    {
      label: 'Glass/Metal',
      value: 16,
      color: '#3b82f6'
    }

  ],


  // Q6
  6: [

    {
      label: 'Yes',
      value: 33,
      color: '#2e7d32'
    },

    {
      label: 'Somewhat',
      value: 34,
      color: '#65a30d'
    },

    {
      label: 'No',
      value: 33,
      color: '#9ca3af'
    }

  ],


  // Q7
  7: [

    {
      label: 'Daily',
      value: 58,
      color: '#2e7d32'
    },

    {
      label: "I don't know",
      value: 25,
      color: '#3b82f6'
    },

    {
      label: 'Irregularly',
      value: 9,
      color: '#8b5cf6'
    },

    {
      label: 'Once a week',
      value: 8,
      color: '#f59e0b'
    }

  ],


  // Q8
  8: [

    {
      label: "I don't know",
      value: 50,
      color: '#2e7d32'
    },

    {
      label: 'Municipal workers',
      value: 17,
      color: '#3b82f6'
    },

    {
      label: 'Society/Building staff',
      value: 17,
      color: '#8b5cf6'
    },

    {
      label: 'Private waste collector',
      value: 8,
      color: '#f59e0b'
    },

    {
      label: 'Other',
      value: 8,
      color: '#94a3b8'
    }

  ],


  // Q9
  9: [

    {
      label: 'Yes',
      value: 33,
      color: '#2e7d32'
    },

    {
      label: 'Partially',
      value: 17,
      color: '#f59e0b'
    },

    {
      label: 'No',
      value: 50,
      color: '#ef4444'
    }

  ],


  // Q10
  10: [

    {
      label: 'Lack of awareness',
      value: 33,
      color: '#2e7d32'
    },

    {
      label: 'Lack of dustbins',
      value: 17,
      color: '#3b82f6'
    },

    {
      label: 'Other',
      value: 25,
      color: '#f59e0b'
    },

    {
      label: 'Poor waste segregation',
      value: 17,
      color: '#94a3b8'
    },

    {
      label: 'Irregular waste collection',
      value: 8,
      color: '#ef4444'
    }

  ]

};



// ==========================================================
// Render All Survey Charts
// ==========================================================
function renderAllSurveyCharts() {

  Object.keys(surveyData).forEach(
    number => {

      drawDonutChart(
        `survey-chart-${number}`,
        surveyData[number]
      );

    }
  );

}



// ==========================================================
// Responsive Charts
// ==========================================================
window.addEventListener(
  'resize',
  () => {

    const analyticsView =
      document.getElementById(
        'view-analytics'
      );


    if (
      analyticsView &&
      analyticsView.classList.contains('active')
    ) {

      renderAllCharts();

    }


    const surveysView =
      document.getElementById(
        'view-surveys'
      );


    if (
      surveysView &&
      surveysView.classList.contains('active')
    ) {

      renderAllSurveyCharts();

    }

  }
);



// ==========================================================
// Initialization
// ==========================================================
document.addEventListener(
  'DOMContentLoaded',
  () => {

    navigateTo('home');

  }
);