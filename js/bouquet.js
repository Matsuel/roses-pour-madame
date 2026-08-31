/* Construction du bouquet de roses en SVG (tiges, feuilles, fleurs, papier, ruban). */
(function (global) {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  function el(name, attrs) {
    var node = document.createElementNS(NS, name);
    for (var key in attrs) {
      if (attrs[key] !== undefined && attrs[key] !== null) {
        node.setAttribute(key, attrs[key]);
      }
    }
    return node;
  }

  /* Pétale en goutte, pointe vers le haut, base au centre de la fleur. */
  function petalPath(r) {
    var w = r * 0.78;
    return 'M0 0 C' + -w + ' ' + -r * 0.45 + ',' + -w * 0.88 + ' ' + -r * 1.2 + ',0 ' + -r * 1.35 +
           ' C' + w * 0.88 + ' ' + -r * 1.2 + ',' + w + ' ' + -r * 0.45 + ',0 0 Z';
  }

  /* Une rose : trois couronnes de pétales + un coeur enroulé. */
  function rose(cx, cy, r, hue, delay) {
    var holder = el('g', { transform: 'translate(' + cx + ' ' + cy + ')' });
    var head = el('g', { class: 'rose-head', style: '--d:' + delay + 's' });

    var rings = [
      { count: 7, radius: r, light: 34, sat: 58, rot: 0 },
      { count: 6, radius: r * 0.74, light: 44, sat: 64, rot: 26 },
      { count: 5, radius: r * 0.5, light: 54, sat: 70, rot: 50 }
    ];

    rings.forEach(function (ring) {
      var step = 360 / ring.count;
      for (var i = 0; i < ring.count; i++) {
        head.appendChild(el('path', {
          d: petalPath(ring.radius),
          transform: 'rotate(' + (ring.rot + i * step) + ')',
          fill: 'hsl(' + hue + ' ' + ring.sat + '% ' + ring.light + '%)',
          stroke: 'hsl(' + hue + ' 55% 20% / .45)',
          'stroke-width': Math.max(0.6, r * 0.02)
        }));
      }
    });

    /* Coeur en spirale */
    var c = r * 0.26;
    head.appendChild(el('circle', { r: c, fill: 'hsl(' + hue + ' 72% 60%)' }));
    head.appendChild(el('path', {
      d: 'M' + -c * 0.7 + ' 0 A' + c * 0.7 + ' ' + c * 0.7 + ' 0 1 1 ' + c * 0.35 + ' ' + c * 0.6 +
         ' A' + c * 0.42 + ' ' + c * 0.42 + ' 0 1 0 ' + -c * 0.12 + ' ' + -c * 0.2,
      fill: 'none',
      stroke: 'hsl(' + hue + ' 60% 26% / .7)',
      'stroke-width': Math.max(0.8, r * 0.035),
      'stroke-linecap': 'round'
    }));
    /* Reflet */
    head.appendChild(el('ellipse', {
      cx: -r * 0.22, cy: -r * 0.3, rx: r * 0.2, ry: r * 0.12,
      transform: 'rotate(-30 ' + -r * 0.22 + ' ' + -r * 0.3 + ')',
      fill: 'rgba(255,255,255,.18)'
    }));

    holder.appendChild(head);
    return holder;
  }

  function leaf(x, y, angle, size, delay) {
    var holder = el('g', { transform: 'translate(' + x + ' ' + y + ') rotate(' + angle + ')' });
    var animated = el('g', { class: 'leaf', style: '--d:' + delay + 's' });
    animated.appendChild(el('path', {
      d: 'M0 0 C' + size * 0.35 + ' ' + -size * 0.5 + ',' + size * 0.85 + ' ' + -size * 0.42 + ',' + size + ' 0' +
         ' C' + size * 0.85 + ' ' + size * 0.42 + ',' + size * 0.35 + ' ' + size * 0.5 + ',0 0 Z',
      fill: '#3f7a48'
    }));
    animated.appendChild(el('path', {
      d: 'M' + size * 0.08 + ' 0 L' + size * 0.9 + ' 0',
      stroke: 'rgba(255,255,255,.28)', 'stroke-width': Math.max(0.7, size * 0.05), fill: 'none'
    }));
    holder.appendChild(animated);
    return holder;
  }

  /* Disposition : 8 roses en éventail au-dessus d'une base commune. */
  var HEADS = [
    { x: 200, y: 152, r: 46, hue: 348 },
    { x: 112, y: 205, r: 39, hue: 340 },
    { x: 289, y: 200, r: 39, hue: 352 },
    { x:  62, y: 293, r: 33, hue: 344 },
    { x: 338, y: 288, r: 33, hue: 351 },
    { x: 143, y: 300, r: 31, hue: 335 },
    { x: 258, y: 296, r: 31, hue: 356 },
    { x: 202, y: 258, r: 28, hue: 346 }
  ];

  var BASE = { x: 200, y: 596 };

  function build(svg) {
    while (svg.firstChild) svg.removeChild(svg.firstChild);

    var defs = el('defs');
    var grad = el('linearGradient', { id: 'paper', x1: '0', y1: '0', x2: '1', y2: '1' });
    grad.appendChild(el('stop', { offset: '0', 'stop-color': '#f6e2cf' }));
    grad.appendChild(el('stop', { offset: '.55', 'stop-color': '#e2c1a4' }));
    grad.appendChild(el('stop', { offset: '1', 'stop-color': '#b98f74' }));
    defs.appendChild(grad);
    svg.appendChild(defs);

    var stemLayer = el('g');
    var leafLayer = el('g');
    var roseLayer = el('g');
    var wrapLayer = el('g');

    HEADS.forEach(function (head, i) {
      var spread = head.x - BASE.x;
      var d = 'M' + BASE.x + ' ' + BASE.y +
              ' C' + (BASE.x + spread * 0.12) + ' ' + (BASE.y - 150) +
              ',' + (head.x + spread * 0.22) + ' ' + (head.y + 165) +
              ',' + head.x + ' ' + head.y;

      var stem = el('path', {
        class: 'stem',
        d: d,
        'stroke-width': 3.4 + head.r * 0.045,
        style: '--d:' + (i * 0.09) + 's'
      });
      stemLayer.appendChild(stem);

      /* Feuilles accrochées le long de la tige */
      var side = spread >= 0 ? 1 : -1;
      [0.42, 0.66].forEach(function (t, k) {
        var p = pointOnCubic(BASE, { x: BASE.x + spread * 0.12, y: BASE.y - 150 },
                             { x: head.x + spread * 0.22, y: head.y + 165 }, head, t);
        leafLayer.appendChild(leaf(p.x, p.y, side * (k ? 34 : -28) + (side > 0 ? 8 : 172),
                                   20 + head.r * 0.28, 0.9 + i * 0.07 + k * 0.12));
      });

      roseLayer.appendChild(rose(head.x, head.y, head.r, head.hue, 1.25 + i * 0.11));
    });

    /* Papier kraft + ruban */
    wrapLayer.appendChild(el('path', {
      class: 'wrap-paper',
      d: 'M200 636 L118 448 Q200 486 282 448 Z',
      fill: 'url(#paper)'
    }));
    wrapLayer.appendChild(el('path', {
      class: 'wrap-paper',
      d: 'M200 636 L118 448 Q160 470 200 474 Z',
      fill: 'rgba(0,0,0,.14)'
    }));

    var ribbon = el('g', { class: 'ribbon' });
    ribbon.appendChild(el('path', {
      d: 'M158 548 Q200 566 242 548 L246 566 Q200 584 154 566 Z',
      fill: '#c8395e'
    }));
    ribbon.appendChild(el('path', {
      d: 'M200 558 C176 526 142 528 148 552 C152 570 184 572 200 558 Z',
      fill: '#e0567a'
    }));
    ribbon.appendChild(el('path', {
      d: 'M200 558 C224 526 258 528 252 552 C248 570 216 572 200 558 Z',
      fill: '#e0567a'
    }));
    ribbon.appendChild(el('circle', { cx: 200, cy: 558, r: 7, fill: '#f08aa5' }));
    wrapLayer.appendChild(ribbon);

    svg.appendChild(stemLayer);
    svg.appendChild(leafLayer);
    svg.appendChild(wrapLayer);
    svg.appendChild(roseLayer);

    /* Longueur réelle des tiges pour l'animation de tracé */
    stemLayer.querySelectorAll('.stem').forEach(function (path) {
      path.style.setProperty('--len', path.getTotalLength());
    });

    /* Durée totale de l'animation, pour enchaîner sur le mot */
    return 1.25 + HEADS.length * 0.11 + 1.05;
  }

  function pointOnCubic(p0, p1, p2, p3, t) {
    var u = 1 - t;
    return {
      x: u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x,
      y: u * u * u * p0.y + 3 * u * u * t * p1.y + 3 * u * t * t * p2.y + t * t * t * p3.y
    };
  }

  global.Bouquet = { build: build };
})(window);
