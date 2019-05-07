
function initalizeWebcamVariables() {

    let webcamVideoElement = document.getElementById('webcam-video');

    navigator.getUserMedia = navigator.getUserMedia ||
        navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
        navigator.msGetUserMedia;

    let videoStream = null;

    let camModal = $('#cam-modal');
    camModal.on('hidden.bs.modal', () => {
        if (videoStream) {
            videoStream.getTracks()[0].stop();
        }
    });

    camModal.on('shown.bs.modal', () => {
        navigator.getUserMedia(
            {
                video: true,
            },
            (stream) => {
                videoStream = stream;
                webcamVideoElement.srcObject = stream;
                webcamVideoElement.play();
            },
            (err) => {
                console.error(err);
            }
        );
    });

    let snapButton = document.getElementById('snap-button');
    snapButton.onclick = () => {
        let imgElement = null; // TODO: pass contentImg or styleImg... to change src
        captureImageFromCamera(imgElement);
        camModal.modal('hide');
    }
}

function captureImageFromCamera(imgElement) {
    let video = document.getElementById('webcam-video');
    // TODO: document.createElement('canvas'); // no need to hide it
    let canvas = document.getElementById('hidden-canvas');
    canvas.width = video.width;
    canvas.height = video.height;
    let ctx = canvas.getContext('2d');
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    let imageDataURL = canvas.toDataURL('image/jpg');
    imgElement.src = imageDataURL;
}

