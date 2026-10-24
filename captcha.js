/*
 * Verificação anti-robô (Cloudflare Turnstile) usada pelo app Padaria Alfa nas telas de
 * entrar, criar conta e esqueci a senha. O app abre esta página e recebe a confirmação
 * (token), que vai junto com o login para o Supabase conferir.
 */
(function (raiz) {
  // chave pública do widget (a secreta fica só no Supabase)
  var SITE_KEY = '0x4AAAAAAFkXJuEowdJuSlqS';
  // no navegador, só entregamos a confirmação para o app rodando nestes endereços
  var ORIGENS_WEB = ['http://localhost:8081'];

  function enviar(mensagem) {
    var texto = JSON.stringify(mensagem);
    if (raiz.ReactNativeWebView) {
      raiz.ReactNativeWebView.postMessage(texto);
    } else if (raiz.parent && raiz.parent !== raiz) {
      ORIGENS_WEB.forEach(function (origem) {
        raiz.parent.postMessage(texto, origem);
      });
    }
  }

  raiz.iniciarCaptcha = function () {
    raiz.turnstile.render('#widget', {
      sitekey: SITE_KEY,
      theme: 'light',
      language: 'pt-br',
      size: 'flexible',
      callback: function (token) { enviar({ tipo: 'token', token: token }); },
      'expired-callback': function () { enviar({ tipo: 'expirou' }); },
      'timeout-callback': function () { enviar({ tipo: 'expirou' }); },
      'error-callback': function () { enviar({ tipo: 'erro' }); },
    });
  };
})(window);
