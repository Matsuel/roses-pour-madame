/* Génère le lien partageable à partir du formulaire. */
(function () {
  'use strict';

  var form = document.getElementById('compose');
  var to = document.getElementById('f-to');
  var body = document.getElementById('f-body');
  var from = document.getElementById('f-from');
  var count = document.getElementById('count');
  var result = document.getElementById('result');
  var linkInput = document.getElementById('link');
  var copyBtn = document.getElementById('copy');
  var copyState = document.getElementById('copy-state');
  var preview = document.getElementById('preview');

  function payload() {
    return {
      to: to.value.trim() || Msg.DEFAULT.to,
      body: body.value.trim() || Msg.DEFAULT.body,
      from: from.value.trim()
    };
  }

  function buildUrl() {
    var base = location.href.replace(/creer\.html.*$/, '') + 'index.html';
    return base + '#' + Msg.encode(payload());
  }

  body.addEventListener('input', function () {
    count.textContent = body.value.length;
  });

  [to, body, from].forEach(function (input) {
    input.addEventListener('input', function () { preview.href = buildUrl(); });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    linkInput.value = buildUrl();
    result.hidden = false;
    copyState.textContent = '';
    result.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    linkInput.select();
  });

  copyBtn.addEventListener('click', function () {
    linkInput.select();
    var done = function () { copyState.textContent = 'Lien copié ✓'; };
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(linkInput.value).then(done, function () {
        copyState.textContent = 'Copie manuelle : le lien est sélectionné.';
      });
    } else {
      try { document.execCommand('copy'); done(); }
      catch (err) { copyState.textContent = 'Copie manuelle : le lien est sélectionné.'; }
    }
  });

  preview.href = buildUrl();
})();
