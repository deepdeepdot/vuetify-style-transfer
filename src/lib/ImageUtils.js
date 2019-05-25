function resizeImageToDestination(source, { width, height, destination }) {
  let ratio = source.width / source.height;
  // alert(ratio + "/" + source.width + "/" + source.height);

  // Compute width and height
  width = width || (height && height * ratio) || source.width;
  height = height || (width && width / ratio) || source.height;
  // alert('width:' + width + ", height:" + height);

  let resizedCanvas = document.createElement("canvas");
  resizedCanvas.width = width;
  resizedCanvas.height = height;

  let ctx = resizedCanvas.getContext("2d");
  ctx.drawImage(source, 0, 0, source.width, source.height, 0, 0, width, height);
  destination.src = resizedCanvas.toDataURL();
}

function loadImageFromFile(file, image, resize) {
  const fileReader = new FileReader();
  fileReader.onload = function(e) {
    const largeImage = new Image();
    largeImage.src = e.target.result;
    largeImage.onload = function() {
      resizeImageToDestination(largeImage, { ...resize, destination: image });
    };
  };
  fileReader.readAsDataURL(file);
}

function loadImageFromFileSelect(image, fileSelect, resize) {
  fileSelect.onchange = evt => {
    let file = evt.target.files[0];
    loadImageFromFile(file, image, resize);
  };
  fileSelect.click();
}

export {
  loadImageFromFile,
  loadImageFromFileSelect,
  resizeImageToDestination
};
