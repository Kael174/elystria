const modeToggle = document.getElementById('modeToggle');

function gelistirmeassamasinda() {
  alert("This section is under development!")
}
function gelistirmeasamasinda() {
  alert("This section is under development!")
}

  modeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light-mode');

  if(document.body.classList.contains('light-mode')) {
    modeToggle.textContent = 'Turn on Dark Mode';
  } else {
    modeToggle.textContent = 'Turn on Light Mode';
  }
});
