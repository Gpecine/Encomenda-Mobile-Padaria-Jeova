/*
 * Página-ponte do login (Google e links do e-mail) do app Padaria Alfa.
 * O Supabase devolve para esta página https com ?app=<endereço do app>&code=...;
 * daqui levamos o código para o app (o Chrome do Android abre o app com um toque).
 */
(function (raiz) {
  // Só abrimos endereços do próprio app (evita usar a página para mandar a outros sites).
  var ESQUEMAS = ['exp:', 'exps:', 'padaria:'];
  var REPASSAR = ['code', 'error', 'error_code', 'error_description'];

  function calcularDestino(href) {
    var url = new URL(href);
    var busca = new URLSearchParams(url.search);
    var fragmento = new URLSearchParams(url.hash.replace(/^#/, ''));
    var ler = function (nome) {
      return busca.get(nome) || fragmento.get(nome);
    };

    var app = ler('app');
    if (!app) return { erro: 'Endereço do app ausente.' };
    var esquema = app.split(':')[0].toLowerCase() + ':';
    if (ESQUEMAS.indexOf(esquema) < 0) return { erro: 'Endereço do app inválido.' };

    var repasse = new URLSearchParams();
    REPASSAR.forEach(function (nome) {
      var valor = ler(nome);
      if (valor) repasse.set(nome, valor);
    });
    var extra = repasse.toString();
    var destino = extra ? app + (app.indexOf('?') >= 0 ? '&' : '?') + extra : app;

    return { destino: destino, erroLogin: ler('error_description') || ler('error') || null };
  }

  raiz.calcularDestino = calcularDestino;
  if (typeof module !== 'undefined') module.exports = { calcularDestino: calcularDestino };
})(typeof window !== 'undefined' ? window : globalThis);
