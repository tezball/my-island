export function cropImage(file: File, width: number, height: number): Promise<Blob> {
  return createImageBitmap(file).then(
    (bitmap) =>
      new Promise((resolve, reject) => {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Could not crop the photo"));
          return;
        }
        const target = width / height;
        const aspect = bitmap.width / bitmap.height;
        let sx = 0;
        let sy = 0;
        let sw = bitmap.width;
        let sh = bitmap.height;
        if (aspect > target) {
          sw = sh * target;
          sx = (bitmap.width - sw) / 2;
        } else {
          sh = sw / target;
          sy = (bitmap.height - sh) / 2;
        }
        ctx.drawImage(bitmap, sx, sy, sw, sh, 0, 0, width, height);
        canvas.toBlob(
          (blob) => (blob ? resolve(blob) : reject(new Error("Could not crop the photo"))),
          "image/jpeg",
          0.85,
        );
      }),
  );
}
