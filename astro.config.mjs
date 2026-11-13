import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://anetrhee.github.io',
  // 'class' lets parent-scoped styles reach classes passed into child components (e.g. <Clock class="header__clock" />)
  scopedStyleStrategy: 'class',
  build: { inlineStylesheets: 'auto' },
  devToolbar: { enabled: false },
});
