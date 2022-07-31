const mainContentNode = document.querySelector('.main-content');
const onObservation = function (mutationList) {
  const visibleTab = mutationList.at(-1);
  if (
    visibleTab.oldValue?.includes('hide-tab') &&
    visibleTab.target.className.includes('text-particle-tab')
  ) {
    InitTextParticleAnimator();
  }
};
const config = { attributes: true, subtree: true, attributeOldValue: true };
const observer = new MutationObserver(onObservation);
observer.observe(mainContentNode, config);
