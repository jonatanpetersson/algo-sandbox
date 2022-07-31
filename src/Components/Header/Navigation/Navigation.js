InitNavigation();
function InitNavigation() {
  const select = (s) => document.querySelector(s);

  const homeLink = select('.home-link');
  const homeTab = select('.home-tab');
  const gameOfLifeLink = select('.game-of-life-link');
  const gameOfLifeTab = select('.game-of-life-tab');
  const textParticleLink = select('.text-particle-link');
  const textParticleTab = select('.text-particle-tab');
  const mazePathLink = select('.maze-path-link');
  const mazePathTab = select('.maze-path-tab');

  const router = {
    home: {
      link: homeLink,
      tab: homeTab,
    },
    'game-of-life': {
      link: gameOfLifeLink,
      tab: gameOfLifeTab,
    },
    'text-particle': {
      link: textParticleLink,
      tab: textParticleTab,
    },
    'maze-path': {
      link: mazePathLink,
      tab: mazePathTab,
    },
  };

  let activeTab;

  Object.keys(router).forEach((route) => {
    router[route].link.addEventListener('click', (ev) => {
      ev.preventDefault();
      const route = ev.currentTarget.dataset.route;
      router[activeTab].tab.classList.add('hide-tab');
      router[activeTab].link.classList.remove('active-link');
      router[route].tab.classList.remove('hide-tab');
      router[route].link.classList.add('active-link');
      activeTab = route;
    });
  });

  activeTab = 'home';
  router.home.link.classList.add('active-link');
  router.home.tab.classList.remove('hide-tab');
}
