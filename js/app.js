/* Enchaînement : popup de bienvenue -> animation du bouquet -> le mot. */
(function () {
  'use strict';

  var welcome = document.getElementById('welcome');
  var enterBtn = document.getElementById('enter-btn');
  var scene = document.getElementById('scene');
  var svg = document.getElementById('bouquet');
  var note = document.getElementById('note');
  var replayBtn = document.getElementById('replay');
  var petalField = document.getElementById('petals');

  var reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var data = Msg.read();
  var timer = null;

  /* Le popup s'adresse à elle par son nom. */
  document.getElementById('w-title').textContent = data.to;
  document.getElementById('note-to').textContent = data.to + ',';
  document.getElementById('note-body').textContent = data.body;
  var fromEl = document.getElementById('note-from');
  if (data.from) { fromEl.textContent = data.from; } else { fromEl.remove(); }

  function makePetals(count) {
    petalField.textContent = '';
    if (reduced) return;
    for (var i = 0; i < count; i++) {
      var p = document.createElement('span');
      p.className = 'petal';
      var size = 8 + Math.random() * 14;
      p.style.left = (Math.random() * 100) + 'vw';
      p.style.width = size + 'px';
      p.style.height = size + 'px';
      p.style.setProperty('--dx', (Math.random() * 220 - 110) + 'px');
      p.style.setProperty('--spin', (Math.random() * 900 - 300) + 'deg');
      p.style.animationDuration = (7 + Math.random() * 9) + 's';
      p.style.animationDelay = (Math.random() * 8) + 's';
      p.style.filter = 'blur(' + (Math.random() < 0.3 ? 1.4 : 0) + 'px)';
      petalField.appendChild(p);
    }
  }

  function play() {
    clearTimeout(timer);
    note.classList.remove('is-in');
    var duration = Bouquet.build(svg);
    var wait = reduced ? 200 : (duration + 0.55) * 1000;
    timer = setTimeout(function () { note.classList.add('is-in'); }, wait);
  }

  function enter() {
    welcome.classList.add('is-gone');
    scene.removeAttribute('inert');
    scene.classList.add('is-live');
    makePetals(window.innerWidth < 600 ? 14 : 26);
    play();
    setTimeout(function () { welcome.remove(); }, 1000);
  }

  enterBtn.addEventListener('click', enter);
  replayBtn.addEventListener('click', play);
  enterBtn.focus({ preventScroll: true });
})();
