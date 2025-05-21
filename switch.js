document.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href && !href.startsWith('#')) {
      e.preventDefault();
      document.body.classList.add('fade-out');
      setTimeout(() => {
        window.location = href;
      }, 500);
    }
  });
});

window.addEventListener('DOMContentLoaded', () => {
  document.body.classList.add('fade-in');
});
