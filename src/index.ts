import 'core-js';
import 'whatwg-fetch';

import { mirage } from './mirage/';

import './style.css';

const foreground = document.getElementById('foreground') as HTMLInputElement;
const background = document.getElementById('background') as HTMLInputElement;
const render = document.getElementById('render') as HTMLCanvasElement;
const output = document.getElementById('output') as HTMLCanvasElement;

function run(f, b) {
  return mirage(f, b).then(({ result }) => {
    output.width = result.width;
    output.height = result.height;

    const context = output.getContext('2d');
    context.drawImage(result, 0, 0);
  }).catch(console.log);
}

render.addEventListener('click', () => {
  const f = foreground.files[0];
  const b = background.files[0];

  if (!f || !b) {
    throw new Error('you idiot');
  }

  run(f, b);
});

Promise.all([
  fetch('images/foreground.jpg'),
  fetch('images/background.jpg'),
]).then(([f, b]) => {
  return Promise.all([
    f.blob(),
    b.blob(),
  ]);
}).then(([f, b]) => {
  return run(f, b);
}).catch(console.log);
