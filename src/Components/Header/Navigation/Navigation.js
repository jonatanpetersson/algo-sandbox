const links = document.querySelectorAll('.main-header-link');

links.forEach((link) => {
  link.addEventListener('click', (ev) => {
    links.forEach((link) => {
      link.classList.remove('active-link');
    });
    ev.target.classList.add('active-link');
  });
});
