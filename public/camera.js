var isMobile = (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent));

// The width and height of the captured photo. We will set the
// width to the value defined here, but the height will be
// calculated based on the aspect ratio of the input stream.

var width = isMobile ? 320 : 400;    // We will scale the photo width to this
var height = 0;     // This will be computed based on the input stream

var streaming = false;
var video = null;
var canvas = document.createElement('canvas');
var videoStream = null;

const mediaDevices = navigator.mediaDevices; // Try to bind this asap before vue takes over?

function getUserMedia(constraints) {
    let callback = function (stream) {
        video.srcObject = stream;
        video.src = URL.createObjectURL(stream);
        video.play();
        videoStream = stream;
    };
    let errorCallback = function (error) {
        if (error.name === 'ConstraintNotSatisfiedError') {
            return new Error('The resolution ' + constraints.video.width.exact + 'x' +
                constraints.video.width.exact + ' px is not supported by your device.');
        } else if (error.name === 'PermissionDeniedError') {
            return new Error('Permissions have not been granted to use your camera and ' +
                'microphone, you need to allow the page access to your devices in ' +
                'order for the demo to work.');
        }
        return new Error('activateCamera error: ' + error.name);
    };
    // Deprecated API: navigator.getUserMedia(), still not working in iphone6
    //
    // const navigatorGetUserMedia = navigator.getUserMedia ||
    //     navigator.webkitGetUserMedia || navigator.mozGetUserMedia ||
    //     navigator.msGetUserMedia;
    // return navigatorGetUserMedia.call(navigator, constraints, callback, errorCallback);
    return mediaDevices.getUserMedia(constraints)
        .then(callback)
        .catch(errorCallback);
}

function activateCamera(mediaConstraints) {
    // Make sure to return a Promise in all scenarios
    if (typeof navigator.mediaDevices === 'undefined') {
        return Promise.reject('Cannot access camera device: mediaDevices');
    }
    if (!videoStream) {
        var constraints = {
            ...mediaConstraints,
            audio: false,
            video: true
        };
        return getUserMedia(constraints);
    }
    return Promise.resolve({});
}

function deactivateCamera() {
    if (videoStream) {
        videoStream.getTracks().forEach(track => track.stop())
    }
    videoStream = null;
}

function takePicture(photo, resizePhoto) {
    if (videoStream) {
        var context = canvas.getContext('2d');
        if (width && height) {
            canvas.style.setProperty('width', width + 'px');
            canvas.style.setProperty('height', height + 'px');
            canvas.width = width;
            canvas.height = height;
            context.drawImage(video, 0, 0, width, height);

            var data = canvas.toDataURL('image/png');
            photo.setAttribute('src', data);
            if (resizePhoto) {
                photo.style.setProperty('width', width + 'px');
                photo.style.setProperty('height', height + 'px');
            }
            return {
                width,
                height,
            }
        }
    }
    else {
        clearphoto(photo);
    }
}

function clearphoto(photo) {
    var context = canvas.getContext('2d');
    context.fillStyle = "#AAA";
    context.fillRect(0, 0, canvas.width, canvas.height);

    var data = canvas.toDataURL('image/png');
    photo.setAttribute('src', data);
}

function initCamera(theVideo) {
    video = theVideo;

    video.addEventListener('canplay', function (/* ev */) {
        if (!streaming) {
            height = video.videoHeight / (video.videoWidth / width);
            // Firefox currently has a bug where the height can't be read from
            // the video, so we will make assumptions if this happens.
            if (isNaN(height)) {
                height = width / (4 / 3);
            }
            video.style.setProperty('width', width + 'px');
            video.style.setProperty('height', height + 'px');
            streaming = true;
        }
    }, false);
}

function startup() {
    var startButton = document.getElementById('startButton');
    var pictureButton = document.getElementById('pictureButton');
    var stopButton = document.getElementById('stopButton');
    var photo = document.getElementById('photo');
    var theVideo = document.getElementById('webcam-video');

    initCamera(theVideo);

    startButton.addEventListener('click', function (ev) {
        activateCamera();
        ev.preventDefault();
    }, false);

    pictureButton.addEventListener('click', function (ev) {
        takePicture(photo, true);
        ev.preventDefault();
    }, false);

    stopButton.addEventListener('click', function (ev) {
        deactivateCamera();
        ev.preventDefault();
    });

    clearphoto(photo);
}

// Capture a photo by fetching the current contents of the video
// and drawing it into a canvas, then converting that to a PNG
// format data URL. By drawing it on an offscreen canvas and then
// drawing that to the screen, we can change its size and/or apply
// other changes before drawing it.

// Set up our event listener to run the startup process
// once loading is complete.
window.addEventListener('load', startup, false);