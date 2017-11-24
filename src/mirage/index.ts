import * as EXIF from 'exif-js';

import { Defer } from './defer';
import { getTransform } from './get-transform';

function getImage(file: File): Promise<HTMLImageElement> {
  const urlBlob = URL.createObjectURL(file);
  const image = new Image();
  const deferred = new Defer<HTMLImageElement>();

  image.onload = () => {
    deferred.resolve(image);
  };

  image.onerror = () => {
    deferred.reject('image load error');
  };

  image.src = urlBlob;

  return deferred.promise;
}

function drawImage(image: HTMLImageElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  const deferred = new Defer<HTMLCanvasElement>();

  EXIF.getData(image, () => {
    const orientation = EXIF.getTag(image, 'Orientation') || 1;

    const { width, height, matrix } = getTransform(image, orientation);

    canvas.width = width;
    canvas.height = height;

    context.save();
    context.transform.apply(context, matrix);
    context.drawImage(image, 0, 0);
    context.restore();

    URL.revokeObjectURL(image.src);
    deferred.resolve(canvas);
  });

  return deferred.promise;
}

function centeringImage(source: HTMLCanvasElement, sw: number, sh: number, cw: number, ch: number, fillStyle: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  canvas.width = cw;
  canvas.height = ch;

  context.fillStyle = fillStyle;
  context.fillRect(0, 0, cw, ch);
  context.drawImage(source, (cw - sw) / 2, (ch - sh) / 2);

  return Promise.resolve(canvas);
}

function grayScale(r: number, g: number, b: number): number {
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function compose(g1: number, g2: number): [number, number] {
  const a = 255 - (g1 - g2);
  const c = g2 / (a / 255);

  return [c, a];
}

function render(foreground: HTMLCanvasElement, background: HTMLCanvasElement): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');

  const { width, height } = foreground;

  canvas.width = width;
  canvas.height = height;

  const imageData1 = foreground.getContext('2d').getImageData(0, 0, width, height);
  const imageData2 = background.getContext('2d').getImageData(0, 0, width, height);

  const result = new ImageData(width, height);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      const g1 = grayScale(
        imageData1.data[offset],
        imageData1.data[offset + 1],
        imageData1.data[offset + 2],
      );
      const g2 = grayScale(
        imageData2.data[offset],
        imageData2.data[offset + 1],
        imageData2.data[offset + 2],
      );
      const [c, a] = compose(g1 * 0.75 + 63, g2 * 0.25);

      result.data[offset] = c;
      result.data[offset + 1] = c;
      result.data[offset + 2] = c;
      result.data[offset + 3] = a;
    }
  }

  context.putImageData(result, 0, 0);

  return Promise.resolve(canvas);
}

export async function mirage(file1, file2) {
  const foreground = await getImage(file1).then(drawImage);
  const background = await getImage(file2).then(drawImage);

  const cw = Math.max(foreground.width, background.width);
  const ch = Math.max(foreground.height, background.height);

  const result = await Promise.all([
    centeringImage(foreground, foreground.width, foreground.height, cw, ch, '#fff'),
    centeringImage(background, background.width, background.height, cw, ch, '#000'),
  ]).then(([f, b]) => {
    return render(f, b);
  });

  return {
    result,
    foreground,
    background,
  };
}
