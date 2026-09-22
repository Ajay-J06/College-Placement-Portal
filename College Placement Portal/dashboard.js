/* ===========================================================
   PlacementPro Admin — dashboard.js
   Animated counters + hand-rolled Canvas charts (no chart libs)
   =========================================================== */

(function () {
  'use strict';

  document.addEventListener('DOMContentLoaded', function () {
    animateCounters();
    drawDeptChart();
    drawPlacementDonut();
    drawMonthlyChart();
    drawCompanyHiringChart();
  });

  // Redraw charts on resize
  var resizeTimer;

  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);

    resizeTimer = setTimeout(function () {
      drawDeptChart();
      drawPlacementDonut();
      drawMonthlyChart();
      drawCompanyHiringChart();
    }, 200);
  });

  /* ===================== ANIMATED COUNTERS ===================== */

  function animateCounters() {
    var counters = document.querySelectorAll('[data-counter]');
    var seen = new WeakSet();

    var observer = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (
            entry.isIntersecting &&
            !seen.has(entry.target)
          ) {
            seen.add(entry.target);
            runCounter(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    counters.forEach(function (el) {
      observer.observe(el);
    });
  }

  function runCounter(el) {
    var target =
      parseFloat(
        el.getAttribute('data-counter')
      ) || 0;

    var suffix =
      el.getAttribute('data-suffix') || '';

    var duration = 1200;
    var start = performance.now();

    function tick(now) {
      var progress =
        Math.min(
          (now - start) / duration,
          1
        );

      var eased =
        1 - Math.pow(
          1 - progress,
          3
        );

      var value =
        Math.round(target * eased);

      el.textContent =
        value.toLocaleString() + suffix;

      if (progress < 1) {
        requestAnimationFrame(tick);
      } else {
        el.textContent =
          target.toLocaleString() + suffix;
      }
    }

    requestAnimationFrame(tick);
  }

  /* ===================== CANVAS UTILITIES ===================== */

  function setupCanvas(canvas) {
    if (!canvas) return null;

    var rect =
      canvas.getBoundingClientRect();

    var dpr =
      window.devicePixelRatio || 1;

    var w =
      rect.width ||
      canvas.clientWidth ||
      300;

    var h =
      parseInt(canvas.style.height) ||
      canvas.clientHeight ||
      220;

    canvas.width = w * dpr;
    canvas.height = h * dpr;

    var ctx =
      canvas.getContext('2d');

    ctx.scale(dpr, dpr);

    return {
      ctx: ctx,
      w: w,
      h: h
    };
  }

  function roundRect(
    ctx,
    x,
    y,
    w,
    h,
    r
  ) {
    var radius =
      Math.min(
        r,
        w / 2,
        h / 2
      );

    ctx.beginPath();

    ctx.moveTo(
      x + radius,
      y
    );

    ctx.lineTo(
      x + w - radius,
      y
    );

    ctx.arcTo(
      x + w,
      y,
      x + w,
      y + radius,
      radius
    );

    ctx.lineTo(
      x + w,
      y + h - radius
    );

    ctx.arcTo(
      x + w,
      y + h,
      x + w - radius,
      y + h,
      radius
    );

    ctx.lineTo(
      x + radius,
      y + h
    );

    ctx.arcTo(
      x,
      y + h,
      x,
      y + h - radius,
      radius
    );

    ctx.lineTo(
      x,
      y + radius
    );

    ctx.arcTo(
      x,
      y,
      x + radius,
      y,
      radius
    );

    ctx.closePath();
  }

  /* ===================== DEPARTMENT BAR CHART ===================== */

  function drawDeptChart() {
    var canvas =
      document.getElementById('deptChart');

    var setup =
      setupCanvas(canvas);

    if (!setup) return;

    var ctx = setup.ctx;
    var w = setup.w;
    var h = setup.h;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    var data = [
      {
        label: 'CSE',
        value: 168,
        color: '#2563EB'
      },
      {
        label: 'ECE',
        value: 122,
        color: '#4F46E5'
      },
      {
        label: 'MECH',
        value: 88,
        color: '#0891B2'
      },
      {
        label: 'CIVIL',
        value: 54,
        color: '#F59E0B'
      },
      {
        label: 'EEE',
        value: 66,
        color: '#22C55E'
      },
      {
        label: 'IT',
        value: 44,
        color: '#EF4444'
      }
    ];

    var padding = {
      top: 16,
      right: 16,
      bottom: 32,
      left: 36
    };

    var chartW =
      w - padding.left - padding.right;

    var chartH =
      h - padding.top - padding.bottom;

    var maxVal =
      Math.max.apply(
        null,
        data.map(function (d) {
          return d.value;
        })
      ) * 1.15;

    var barSlot =
      chartW / data.length;

    var barWidth =
      Math.min(
        barSlot * 0.5,
        46
      );

    /* Gridlines */

    ctx.strokeStyle = '#E2E8F0';
    ctx.lineWidth = 1;
    ctx.font =
      '11px Poppins, sans-serif';

    ctx.fillStyle = '#94A3B8';

    var steps = 4;

    for (
      var i = 0;
      i <= steps;
      i++
    ) {
      var y =
        padding.top +
        chartH -
        (
          chartH * i / steps
        );

      ctx.beginPath();

      ctx.moveTo(
        padding.left,
        y
      );

      ctx.lineTo(
        w - padding.right,
        y
      );

      ctx.stroke();

      var val =
        Math.round(
          (maxVal * i) / steps
        );

      ctx.textAlign = 'right';

      ctx.fillText(
        val,
        padding.left - 8,
        y + 4
      );
    }

    /* Bars */

    data.forEach(function (
      d,
      idx
    ) {
      var barH =
        (d.value / maxVal) *
        chartH;

      var x =
        padding.left +
        idx * barSlot +
        (
          barSlot -
          barWidth
        ) / 2;

      var y =
        padding.top +
        chartH -
        barH;

      var grad =
        ctx.createLinearGradient(
          0,
          y,
          0,
          y + barH
        );

      grad.addColorStop(
        0,
        d.color
      );

      grad.addColorStop(
        1,
        d.color + 'CC'
      );

      ctx.fillStyle = grad;

      roundRect(
        ctx,
        x,
        y,
        barWidth,
        barH,
        6
      );

      ctx.fill();

      ctx.fillStyle = '#1E293B';

      ctx.font =
        '600 11px Poppins, sans-serif';

      ctx.textAlign = 'center';

      ctx.fillText(
        d.value,
        x + barWidth / 2,
        y - 8
      );

      ctx.fillStyle = '#64748B';

      ctx.font =
        '11px Poppins, sans-serif';

      ctx.fillText(
        d.label,
        x + barWidth / 2,
        padding.top +
        chartH +
        20
      );
    });
  }

  /* ===================== PLACEMENT DONUT CHART ===================== */

  function drawPlacementDonut() {
    var canvas =
      document.getElementById(
        'placementDonut'
      );

    var setup =
      setupCanvas(canvas);

    if (!setup) return;

    var ctx = setup.ctx;
    var w = setup.w;
    var h = setup.h;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    var data = [
      {
        value: 456,
        color: '#2563EB'
      },
      {
        value: 58,
        color: '#0891B2'
      },
      {
        value: 28,
        color: '#E2E8F0'
      }
    ];

    var total =
      data.reduce(
        function (sum, d) {
          return sum + d.value;
        },
        0
      );

    var cx = w / 2;
    var cy = h / 2;

    var radius =
      Math.min(w, h) / 2 - 8;

    var innerRadius =
      radius * 0.62;

    var startAngle =
      -Math.PI / 2;

    data.forEach(function (d) {
      var sliceAngle =
        (d.value / total) *
        Math.PI *
        2;

      var endAngle =
        startAngle +
        sliceAngle;

      ctx.beginPath();

      ctx.arc(
        cx,
        cy,
        radius,
        startAngle,
        endAngle
      );

      ctx.arc(
        cx,
        cy,
        innerRadius,
        endAngle,
        startAngle,
        true
      );

      ctx.closePath();

      ctx.fillStyle =
        d.color;

      ctx.fill();

      startAngle =
        endAngle;
    });

    ctx.fillStyle =
      '#1E293B';

    ctx.font =
      '700 22px Poppins, sans-serif';

    ctx.textAlign =
      'center';

    ctx.fillText(
      Math.round(
        (data[0].value / total) * 100
      ) + '%',
      cx,
      cy - 2
    );

    ctx.font =
      '11px Poppins, sans-serif';

    ctx.fillStyle =
      '#64748B';

    ctx.fillText(
      'Placed',
      cx,
      cy + 16
    );
  }

  /* ===================== MONTHLY APPLICATIONS LINE CHART ===================== */

  function drawMonthlyChart() {
    var canvas =
      document.getElementById(
        'monthlyChart'
      );

    var setup =
      setupCanvas(canvas);

    if (!setup) return;

    var ctx = setup.ctx;
    var w = setup.w;
    var h = setup.h;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    var labels = [
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug'
    ];

    var values = [
      86,
      104,
      92,
      138,
      121,
      176,
      158
    ];

    var padding = {
      top: 18,
      right: 16,
      bottom: 28,
      left: 34
    };

    var chartW =
      w - padding.left - padding.right;

    var chartH =
      h - padding.top - padding.bottom;

    var maxVal =
      Math.max.apply(
        null,
        values
      ) * 1.2;

    var stepX =
      chartW /
      (values.length - 1);

    /* Gridlines */

    ctx.strokeStyle =
      '#E2E8F0';

    ctx.lineWidth = 1;

    ctx.font =
      '10.5px Poppins, sans-serif';

    ctx.fillStyle =
      '#94A3B8';

    for (
      var i = 0;
      i <= 3;
      i++
    ) {
      var y =
        padding.top +
        chartH -
        (
          chartH *
          i /
          3
        );

      ctx.beginPath();

      ctx.moveTo(
        padding.left,
        y
      );

      ctx.lineTo(
        w - padding.right,
        y
      );

      ctx.stroke();

      ctx.textAlign =
        'right';

      ctx.fillText(
        Math.round(
          (maxVal * i) / 3
        ),
        padding.left - 8,
        y + 4
      );
    }

    var points =
      values.map(
        function (v, idx) {
          return {
            x:
              padding.left +
              idx * stepX,

            y:
              padding.top +
              chartH -
              (
                v /
                maxVal
              ) *
              chartH
          };
        }
      );

    /* Filled Area */

    var fillGrad =
      ctx.createLinearGradient(
        0,
        padding.top,
        0,
        padding.top + chartH
      );

    fillGrad.addColorStop(
      0,
      'rgba(37,99,235,0.25)'
    );

    fillGrad.addColorStop(
      1,
      'rgba(37,99,235,0.02)'
    );

    ctx.beginPath();

    ctx.moveTo(
      points[0].x,
      padding.top +
      chartH
    );

    points.forEach(
      function (p) {
        ctx.lineTo(
          p.x,
          p.y
        );
      }
    );

    ctx.lineTo(
      points[
        points.length - 1
      ].x,
      padding.top +
      chartH
    );

    ctx.closePath();

    ctx.fillStyle =
      fillGrad;

    ctx.fill();

    /* Line */

    ctx.beginPath();

    points.forEach(
      function (p, idx) {
        if (idx === 0) {
          ctx.moveTo(
            p.x,
            p.y
          );
        } else {
          ctx.lineTo(
            p.x,
            p.y
          );
        }
      }
    );

    ctx.strokeStyle =
      '#2563EB';

    ctx.lineWidth = 2.5;

    ctx.lineJoin =
      'round';

    ctx.stroke();

    /* Points + Labels */

    points.forEach(
      function (p, idx) {

        ctx.beginPath();

        ctx.arc(
          p.x,
          p.y,
          4,
          0,
          Math.PI * 2
        );

        ctx.fillStyle =
          '#fff';

        ctx.fill();

        ctx.lineWidth = 2.5;

        ctx.strokeStyle =
          '#2563EB';

        ctx.stroke();

        ctx.fillStyle =
          '#64748B';

        ctx.font =
          '10.5px Poppins, sans-serif';

        ctx.textAlign =
          'center';

        ctx.fillText(
          labels[idx],
          p.x,
          padding.top +
          chartH +
          20
        );
      }
    );
  }

  /* ===================== COMPANY-WISE HIRING BAR CHART ===================== */

  function drawCompanyHiringChart() {
    var canvas =
      document.getElementById(
        'companyHiringChart'
      );

    var setup =
      setupCanvas(canvas);

    if (!setup) return;

    var ctx = setup.ctx;
    var w = setup.w;
    var h = setup.h;

    ctx.clearRect(
      0,
      0,
      w,
      h
    );

    var data = [
      {
        label: 'TCS',
        value: 62,
        color: '#2563EB'
      },
      {
        label: 'Infosys',
        value: 54,
        color: '#4F46E5'
      },
      {
        label: 'Wipro',
        value: 41,
        color: '#0891B2'
      },
      {
        label: 'Cognizant',
        value: 33,
        color: '#F59E0B'
      },
      {
        label: 'Zoho',
        value: 22,
        color: '#22C55E'
      }
    ];

    var padding = {
      top: 8,
      right: 40,
      bottom: 8,
      left: 74
    };

    var chartW =
      w - padding.left - padding.right;

    var chartH =
      h - padding.top - padding.bottom;

    var maxVal =
      Math.max.apply(
        null,
        data.map(
          function (d) {
            return d.value;
          }
        )
      ) * 1.15;

    var rowH =
      chartH /
      data.length;

    var barHeight =
      Math.min(
        rowH * 0.5,
        22
      );

    ctx.font =
      '11.5px Poppins, sans-serif';

    data.forEach(
      function (d, idx) {

        var y =
          padding.top +
          idx * rowH +
          (
            rowH -
            barHeight
          ) / 2;

        var barW =
          (
            d.value /
            maxVal
          ) *
          chartW;

        /* Company Name */

        ctx.fillStyle =
          '#1E293B';

        ctx.textAlign =
          'right';

        ctx.fillText(
          d.label,
          padding.left - 12,
          y +
          barHeight / 2 +
          4
        );

        /* Background Bar */

        roundRect(
          ctx,
          padding.left,
          y,
          chartW,
          barHeight,
          5
        );

        ctx.fillStyle =
          '#F1F5F9';

        ctx.fill();

        /* Actual Bar */

        roundRect(
          ctx,
          padding.left,
          y,
          barW,
          barHeight,
          5
        );

        ctx.fillStyle =
          d.color;

        ctx.fill();

        /* Value */

        ctx.fillStyle =
          '#1E293B';

        ctx.font =
          '600 11px Poppins, sans-serif';

        ctx.textAlign =
          'left';

        ctx.fillText(
          d.value,
          padding.left +
          barW +
          8,
          y +
          barHeight / 2 +
          4
        );

        ctx.font =
          '11.5px Poppins, sans-serif';
      }
    );
  }

})();