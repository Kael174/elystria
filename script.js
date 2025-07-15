const modeToggle = document.getElementById('modeToggle');

  function gelistirmeAsamasinda() {
    alert('Bu bölüm henüz yapım aşamasında!');
    window.location.href = 'index.html';
  }

<button onclick="gelistirmeAsamasinda()">🔮 Mistik Blog</button>
<button onclick="gelistirmeAsamasinda()">⚙️ Teknoloji Köşesi</button>

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if(document.body.classList.contains('light-mode')) {
    modeToggle.textContent = 'Karanlık Modu Aç';
  } else {
    modeToggle.textContent = 'Gece Modu Aç/Kapa';
  }
});
