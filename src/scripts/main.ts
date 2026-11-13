import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import { CustomEase } from 'gsap/CustomEase';

import { setScrollbarWidth } from './env';
import { initLenis } from './lenis';
import { initTransitions, revealPage } from './transition';
import { initClock } from './clock';
import { initFavicon } from './favicon';
import { initIntro } from './intro';
import { initReveals, initInViewPlayback, initFeature, initScrollParallax, initSkills } from './reveals';
import { initHovers } from './hovers';
import { initCursorPreviews } from './cursorPreview';
import { initParallax } from './parallax';
import { initHeroShader } from './heroShader';
import { initMenu, initAnchors, initHeader, initAccordions } from './ui';

gsap.registerPlugin(ScrollTrigger, SplitText, ScrambleTextPlugin, CustomEase);
CustomEase.create('outQuint', '0.22, 1, 0.36, 1');
CustomEase.create('transition', '0.645, 0.045, 0.355, 1');

setScrollbarWidth();
window.addEventListener('resize', setScrollbarWidth);
window.scrollTo(0, 0);

initTransitions();
initClock();
initFavicon();

document.fonts.ready.then(() => {
  initLenis();
  initMenu();
  initAnchors();
  initHeader();
  initAccordions();
  initHeroShader();
  initFeature();
  initScrollParallax();
  initSkills();
  initReveals();
  initInViewPlayback();
  initHovers();
  initCursorPreviews();
  initParallax();
  const intro = initIntro();

  document.documentElement.classList.remove('is-loading');
  revealPage();
  ScrollTrigger.refresh();
  intro.then(() => ScrollTrigger.refresh());
});
