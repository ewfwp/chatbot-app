import { readFile, writeFile } from 'node:fs/promises';
import { PurgeCSS } from 'purgecss';
import postcss from 'postcss';
import prefixSelector from 'postcss-prefix-selector';

const bootstrapFile = 'node_modules/bootstrap/dist/css/bootstrap.min.css';
const angularStylesFile = 'dist/ewfwp-chatbot-app/browser/styles.css';
const targetFile = 'ewfwp-chatbot-app/web-component/assets/styles.css';

const [purged] = await new PurgeCSS().purge({
  content: ['src/**/*.html', 'src/**/*.ts'],
  css: [bootstrapFile],
});

const prefixed = await postcss([
  prefixSelector({
    prefix: 'ewfwp-chatbot-app',
  }),
]).process(purged.css, {
  from: bootstrapFile,
  to: targetFile,
  map: false,
});

const angularStyles = await readFile(angularStylesFile, 'utf8');

await writeFile(targetFile, `${angularStyles}\n${prefixed.css}`);

console.info('Styles geschreven met opgeschoonde en geprefixte Bootstrap.');
