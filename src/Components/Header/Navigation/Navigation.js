const links = document.querySelectorAll(
  '.main-header-link, .main-header-title'
);

links.forEach((link) => {
  link.addEventListener('click', (ev) => {
    links.forEach((link) => {
      link.classList.remove('active-link');
    });
    ev.target.classList.add('active-link');
    const settings = document.querySelectorAll(`[data-settings]`);
    settings.forEach((setting) => {
      if (setting.dataset.settings === ev.target.dataset.routelink) {
        setting.classList.remove('settings-invisible');
      } else {
        setting.classList.add('settings-invisible');
      }
    });
  });
});
