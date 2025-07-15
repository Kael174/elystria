const modeToggle = document.getElementById('modeToggle');

modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if(document.body.classList.contains('light-mode')) {
    modeToggle.textContent = 'Karanlık Modu Aç';
  } else {
    modeToggle.textContent = 'Gece Modu Aç/Kapa';
  }
});