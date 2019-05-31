/*
 * StyleTransfer
 */

// const env = process.NODE_ENV == 'production' ? 'prod' : 'dev';
import * as tf from '@tensorflow/tfjs';
import config from '@/config';

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

async function loadModel(type, options, reportStatus, reportError) {
  const url = domain + '/' + model[type];

  if (!nets[type]) { // This is not sufficient to prevent multiple threads loading the same
    let numTrials = 3;
    for (let i = 0; i < numTrials; i++) {
      try {
        nets[type] = await tf.loadGraphModel(url, options);
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

// To make it work with the upgrade to Tensorflow.js 1.1.2 (otherwise, stuck with TF 1.0)
const fetchFunc = window.fetch.bind(window);

export default class StyleTransfer {
  loadMobileNetStyleModel(reportStatus, reportError, onProgress) {
    return loadModel('MOBILE_STYLE_NET', {
      onProgress,
      fetchFunc,
    }, reportStatus, reportError).then(function(result) {
      styleNet = result;
      return result;
    });
  }

  loadInceptionStyleModel(reportStatus, reportError, onProgress) {
    return loadModel('INCEPTION_STYLE_NET', {
      onProgress,
      fetchFunc,
    }, reportStatus, reportError).then(function(result) {
      styleNet = result;
      return result;
    });
  }

  loadOriginalTransformerModel(reportStatus, reportError, onProgress) {
    return loadModel('ORIGINAL_TRANSFORM_NET', {
      onProgress,
      fetchFunc,
    }, reportStatus, reportError).then(function(result) {
      transformNet = result;
      return result;
    });
  }

  loadSeparableTransformerModel(reportStatus, reportError, onProgress) {
    return loadModel('SEPARABLE_TRANSFORM_NET', {
      onProgress,
      fetchFunc,
    }, reportStatus, reportError).then(function(result) {
      transformNet = result;
      return result;
    });
  }

  async startStyling({contentImg, styleImg, styleRatio, destination, reportStatus}) {
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

  async startCombining({combContentImg, combStyleImg1, combStyleImg2, combStyleRatio, destination, reportStatus }) {
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
