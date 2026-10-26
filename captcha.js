/*
 * Verificação anti-robô (Cloudflare Turnstile) usada pelo app Padaria Alfa nas telas de
 * entrar, criar conta e esqueci a senha. O app abre esta página e recebe a confirmação
 * (token), que vai junto com o login para o Supabase conferir.
 */
(function (raiz) {
  // chave pública do widget (a secreta fica só no Supabase)
  var SITE_KEY = '0x4AAAAAAFkXJuEowdJuSlqS';
  // No navegador, só entregamos a confirmação para o app rodando no próprio computador
  // ou na rede de casa (o Expo abre em localhost ou no IP do computador, em qualquer porta).
  var ORIGEM_LOCAL = /^http:\/\/(localhost|127\.0\.0\.1|192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+)(:\d+)?$/;

  function origemDoApp() {
    try {
      var origem = new URL(document.referrer).origin;
      return ORIGEM_LOCAL.test(origem) ? origem : null;
    } catch (e) {
      return null;
    }
  }

  function enviar(mensagem, tentativas) {
    var texto = JSON.stringify(mensagem);
    if (raiz.ReactNativeWebView) {
      raiz.ReactNativeWebView.postMessage(texto);
    } else if (raiz.parent && raiz.parent !== raiz) {
      var origem = origemDoApp();
      if (origem) raiz.parent.postMessage(texto, origem);
    } else if ((tentativas || 0) < 25) {
      // no celular, a ponte com o app pode ficar pronta um instante depois da página
      setTimeout(function () { enviar(mensagem, (tentativas || 0) + 1); }, 200);
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
