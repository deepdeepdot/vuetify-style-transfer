function createDownloadLink(dataUrl, filename) {
  let a = document.createElement('a');
  a.href = dataUrl;
  a.download = filename;
  return a;
}

function loadImageFromFileInput(fileSelect, image, resize) {
  fileSelect.onchange = evt => {
    let file = evt.target.files[0];
    getOrientation(file, function(srcOrientation) {
      loadImageFromFile(file, image, resize, srcOrientation);
    });
  };
  fileSelect.click();
}

function loadImageFromFile(file, image, resize, srcOrientation = null) {
  let fileReader = new FileReader();
  fileReader.onload = function(e) {
    let largeImage = new Image();
    largeImage.src = e.target.result;
    largeImage.onload = function() {
      resizeImageToDestination(
        largeImage,
        { ...resize, destination: image },
        srcOrientation
      );
    };
  };
  fileReader.readAsDataURL(file);
}

function resizeImageToDestination(source, { width, height, destination }, srcOrientation) {
  let ratio = source.width / source.height;

  // Compute width and height
  width = width || (height && height * ratio) || source.width;
  height = height || (width && width / ratio) || source.height;

  let resizedCanvas = document.createElement("canvas");
  resizeCanvas(resizedCanvas, width, height, srcOrientation);

  let ctx = resizedCanvas.getContext("2d");
  transformContext(ctx, width, height, srcOrientation);

  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
  destination.src = resizedCanvas.toDataURL('image/png');
}

function resizeCanvas(resizedCanvas, width, height, srcOrientation) {
  // See: https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  let flip = srcOrientation && 4 < srcOrientation && srcOrientation < 9;
  if (flip) {
    resizedCanvas.width = height;
    resizedCanvas.height = width;
  } else {
    resizedCanvas.width = width;
    resizedCanvas.height = height;
  }
}

function transformContext(ctx, width, height, srcOrientation) {
  // See: https://stackoverflow.com/questions/20600800/js-client-side-exif-orientation-rotate-and-mirror-jpeg-images
  // transform context before drawing image
  switch (srcOrientation) {
    case 2: ctx.transform(-1, 0, 0, 1, width, 0); break;
    case 3: ctx.transform(-1, 0, 0, -1, width, height); break;
    case 4: ctx.transform(1, 0, 0, -1, 0, height); break;
    case 5: ctx.transform(0, 1, 1, 0, 0, 0); break;
    case 6: ctx.transform(0, 1, -1, 0, height, 0); break;
    case 7: ctx.transform(0, -1, -1, 0, height, width); break;
    case 8: ctx.transform(0, -1, 1, 0, 0, width); break;
    default: break;
  }
}

/*
 * getOrientation()
 * - Get EXIF orientation from a JPEG file
 * https://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side/32490603#32490603
 */
function getOrientation(file, callback) {
  let reader = new FileReader();
  reader.onload = function(e) {
    let view = new DataView(e.target.result);
    if (view.getUint16(0, false) != 0xffd8) {
      return callback(-2);
    }
    let length = view.byteLength,
        offset = 2;
    while (offset < length) {
      if (view.getUint16(offset + 2, false) <= 8) return callback(-1);
      let marker = view.getUint16(offset, false);
      offset += 2;
      if (marker == 0xffe1) {
        if (view.getUint32((offset += 2), false) != 0x45786966) {
          return callback(-1);
        }
        let little = view.getUint16((offset += 6), false) == 0x4949;
        offset += view.getUint32(offset + 4, little);
        let tags = view.getUint16(offset, little);
        offset += 2;
        for (let i = 0; i < tags; i++) {
          if (view.getUint16(offset + i * 12, little) == 0x0112) {
            return callback(view.getUint16(offset + i * 12 + 8, little));
          }
        }
      } else if ((marker & 0xff00) != 0xff00) {
        break;
      } else {
        offset += view.getUint16(offset, false);
      }
    }
    return callback(-1);
  };
  reader.readAsArrayBuffer(file);
}

export {
  createDownloadLink,
  loadImageFromFileInput,
};
