import { mirage } from './mirage/';

const foreground = document.getElementById('foreground') as HTMLInputElement;
const background = document.getElementById('background') as HTMLInputElement;
const render = document.getElementById('render') as HTMLCanvasElement;
const output = document.getElementById('output') as HTMLCanvasElement;

render.addEventListener('click', () => {
  const f = foreground.files[0];
  const b = background.files[0];

  if (!f || !b) {
    throw new Error('you idiot');
  }

  mirage(f, b).then(({ result }) => {
    output.width = result.width;
    output.height = result.height;

    const context = output.getContext('2d');
    context.drawImage(result, 0, 0);
  });
});
