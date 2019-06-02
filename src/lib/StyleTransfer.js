/*
 * StyleTransfer
 */
import * as tf from '@tensorflow/tfjs';
const config = {
  model_domain_url: "" // URL domain for models, "" is for relative to the web app
}

// Need to double-check if this still holds, not much difference at first
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

function imgToTensor(img) {
  if (!img) { alert('imgToTensor: missing image'); }
  return tf.browser.fromPixels(img).toFloat().div(tf.scalar(255)).expandDims();
}

const model = {
  MOBILE_STYLE_NET: 'saved_model_style_js/model.json',
  INCEPTION_STYLE_NET: 'saved_model_style_inception_js/model.json',
  SEPARABLE_TRANSFORM_NET: 'saved_model_transformer_separable_js/model.json',
  ORIGINAL_TRANSFORM_NET: 'saved_model_transformer_js/model.json',
};

// Clarity vs flexibility
// Clarity: Less 'this' vs support for multiple instances of StyleTransfer
let domain = config['model_domain_url'],
    styleNet = null,
    transformNet = null,
    nets = {};

// eslint-disable-next-line no-console
let logger = (msg) => console.log(msg);

async function loadModel(type, tfOptions, reportStatus = logger, reportError = logger) {
  const url = domain + '/' + model[type];

  // Note: Checking for `!nets[type]` is not sufficient to prevent multiple threads
  //       loading the same model since tf.loadGraphModel() can take a long while
  if (!nets[type]) {
    let numTrials = 3;
    for (let i = 0; i < numTrials; i++) {
      try {
        nets[type] = await tf.loadGraphModel(url, tfOptions);
        reportStatus('Loaded... ' + type);
        break;
      } catch(error) {
        reportError('loading model error: ' + error);
        if (i === numTrials) {
          reportError('Sorry, we could not load the models, restart the browser or restart your phone');
        }
      }
    }
  }
  return nets[type];
}

class Observer {
  listeners = {
    modelLoaded: []
  };

  on(type, listener) {
    if (type in this.listeners) {
      this.listeners[type].push(listener);
    } else {
      alert('unrecognized event type: ' + type);
    }
  }

  publish(event, data) {
    this.listeners[event].forEach(listener => listener(data));
  }
}

// To make it work with the upgrade to Tensorflow.js 1.1.2 (otherwise, stuck with TF 1.0)
const fetchFunc = window.fetch.bind(window);

let observer = new Observer();

class StyleTransfer extends Observer{
  on(event, listener) {
    observer.on(event, listener);
  }

  async loadMobileNetStyleModel(reportStatus, reportError, onProgress) {
    let tfOptions = { onProgress, fetchFunc };
    styleNet = await loadModel('MOBILE_STYLE_NET', tfOptions, reportStatus, reportError);
    observer.publish('modelLoaded', { type: 'style', choice: 'MOBILE_STYLE_NET' });
    return styleNet;
  }

  async loadInceptionStyleModel(reportStatus, reportError, onProgress) {
    let tfOptions = { onProgress, fetchFunc };
    styleNet = await loadModel('INCEPTION_STYLE_NET', tfOptions, reportStatus, reportError);
    observer.publish('modelLoaded', { type: 'style', choice: 'INCEPTION_STYLE_NET' });
    return styleNet;
  }

  async loadOriginalTransformerModel(reportStatus, reportError, onProgress) {
    let tfOptions = { onProgress, fetchFunc };
    transformNet = await loadModel('ORIGINAL_TRANSFORM_NET', tfOptions, reportStatus, reportError);
    observer.publish('modelLoaded', { type: 'transform', choice: 'ORIGINAL_TRANSFORM_NET' });
    return transformNet;
  }

  async loadSeparableTransformerModel(reportStatus, reportError, onProgress) {
    let tfOptions = { onProgress, fetchFunc };
    transformNet = await loadModel('SEPARABLE_TRANSFORM_NET', tfOptions, reportStatus, reportError);
    observer.publish('modelLoaded', { type: 'transform', choice: 'SEPARABLE_TRANSFORM_NET' });
    return transformNet;
  }

  async startStyling({
    contentImg,
    styleImg,
    styleRatio,
    destination,
    reportStatus})
  {
    await tf.nextFrame();
    reportStatus('Generating 100D style representation');

    await tf.nextFrame();
    let bottleneck = await tf.tidy(() => {
      return styleNet.predict(imgToTensor(styleImg));
    });
    if (styleRatio !== 1.0) {
      reportStatus('Generating 100D identity style representation');
      await tf.nextFrame();
      const identityBottleneck = await tf.tidy(() => {
          return styleNet.predict(imgToTensor(contentImg));
      });
      const styleBottleneck = bottleneck;
      bottleneck = await tf.tidy(() => {
        const styleBottleneckScaled = styleBottleneck.mul(tf.scalar(styleRatio));
        const identityBottleneckScaled = identityBottleneck.mul(tf.scalar(1.0 - styleRatio));
        return styleBottleneckScaled.addStrict(identityBottleneckScaled);
      });
      styleBottleneck.dispose();
      identityBottleneck.dispose();
    }
    reportStatus('Stylizing image...');
    await tf.nextFrame();
    const stylized = await tf.tidy(() => {
      return transformNet.predict([imgToTensor(contentImg), bottleneck]).squeeze();
    });
    await tf.browser.toPixels(stylized, destination);
    bottleneck.dispose(); // Might wanna keep this around
    stylized.dispose();
  }

  async startCombining({
    combContentImg,
    combStyleImg1,
    combStyleImg2,
    combStyleRatio,
    destination,
    reportStatus }
  ) {
    await tf.nextFrame();
    reportStatus('Generating 100D style representation of image 1');
    await tf.nextFrame();
    const bottleneck1 = await tf.tidy(() => {
      return styleNet.predict(imgToTensor(combStyleImg1));
    });

    reportStatus('Generating 100D style representation of image 2');
    await tf.nextFrame();
    const bottleneck2 = await tf.tidy(() => {
      return styleNet.predict(imgToTensor(combStyleImg2));
    });

    reportStatus('Stylizing image...');
    await tf.nextFrame();
    const combinedBottleneck = await tf.tidy(() => {
      const scaledBottleneck1 = bottleneck1.mul(tf.scalar(1 - combStyleRatio));
      const scaledBottleneck2 = bottleneck2.mul(tf.scalar(combStyleRatio));
      return scaledBottleneck1.addStrict(scaledBottleneck2);
    });

    const stylized = await tf.tidy(() => {
      return transformNet.predict([imgToTensor(combContentImg), combinedBottleneck]).squeeze();
    });

    await tf.browser.toPixels(stylized, destination);
    bottleneck1.dispose();  // Might wanna keep this around
    bottleneck2.dispose();
    combinedBottleneck.dispose();
    stylized.dispose();
  }
}

export default StyleTransfer;
