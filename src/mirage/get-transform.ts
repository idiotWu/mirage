export function getTransform(image: HTMLImageElement, orientation: number) {
  const { width, height } = image;

  /* tslint:disable:ter-indent */
  switch (orientation) {
    case 1:
    default:
      // default
      return {
        width, height,
        matrix: [1, 0,
                0, 1,
                0, 0],
      };

    case 2:
      // horizontal flip
      return {
        width, height,
        matrix: [-1, 0,
                0, 1,
                width, 0],
      };

    case 3:
      // 180° rotated
      return {
        width, height,
        matrix: [-1, 0,
                0, -1,
                width, height],
      };

    case 4:
      // vertical flip
      return {
        width, height,
        matrix: [1, 0,
                0, -1,
                0, height],
      };

    case 5:
      // vertical flip + -90° rotated
      return {
        width: height,
        height: width,
        matrix: [0, 1,
                1, 0,
                0, 0],
      };

    case 6:
      // -90° rotated
      return {
        width: height,
        height: width,
        matrix: [0, 1,
                -1, 0,
                height, 0],
      };

    case 7:
      // horizontal flip + -90° rotate
      return {
        width: height,
        height: width,
        matrix: [0, -1,
                -1, 0,
                height, width],
      };

    case 8:
      // 90° rotated
      return {
        width: height,
        height: width,
        matrix: [0, -1,
                1, 0,
                0, width],
      };
  }
}
