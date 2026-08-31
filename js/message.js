/* Encodage / décodage du mot dans l'URL (base64url, compatible accents & emoji). */
(function (global) {
  'use strict';

  var DEFAULT = {
    to: 'Ma chérie',
    body: "Un petit coucou de la part de ton amoureux.\nJ'espère que tu vas bien et que tu passes une bonne journée. \Je t'aime très fort et je pense à toi.",
    from: 'Amoureusement amoureux, Chou'
  };

  function encode(data) {
    var bytes = new TextEncoder().encode(JSON.stringify(data));
    var binary = '';
    bytes.forEach(function (b) { binary += String.fromCharCode(b); });
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  }

  function decode(token) {
    var normalized = token.replace(/-/g, '+').replace(/_/g, '/');
    while (normalized.length % 4) normalized += '=';
    var binary = atob(normalized);
    var bytes = Uint8Array.from(binary, function (c) { return c.charCodeAt(0); });
    return JSON.parse(new TextDecoder().decode(bytes));
  }

  /* Lit le mot depuis le hash de l'URL, retombe sur un message par défaut. */
  function read() {
    var token = location.hash.replace(/^#/, '');
    if (!token) return Object.assign({}, DEFAULT);
    try {
      var data = decode(token);
      return {
        to: (data.to || DEFAULT.to).slice(0, 80),
        body: (data.body || DEFAULT.body).slice(0, 1200),
        from: (data.from || '').slice(0, 80)
      };
    } catch (e) {
      return Object.assign({}, DEFAULT);
    }
  }

  global.Msg = { encode: encode, decode: decode, read: read, DEFAULT: DEFAULT };
})(window);
