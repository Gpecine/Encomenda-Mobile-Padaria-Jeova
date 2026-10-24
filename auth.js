/* Ações da página auth.html (fora do HTML para a política de segurança proibir scripts embutidos). */
(function () {
  var r = calcularDestino(location.href);
  var titulo = document.getElementById('titulo');
  var texto = document.getElementById('texto');
  var erro = document.getElementById('erro');
  var voltar = document.getElementById('voltar');

  if (r.erro) {
    titulo.textContent = 'Não foi possível voltar ao app';
    texto.textContent = r.erro + ' Feche esta página e tente de novo pelo app.';
    voltar.style.display = 'none';
    return;
  }
  if (r.erroLogin) {
    titulo.textContent = 'O login não deu certo';
    texto.textContent = 'Volte para o app e tente de novo.';
    erro.style.display = 'block';
    erro.textContent = r.erroLogin;
  }
  voltar.href = r.destino;
  // tenta abrir sozinho; se o navegador bloquear, o botão resolve
  setTimeout(function () { location.href = r.destino; }, 300);
})();
