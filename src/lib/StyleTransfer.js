/* eslint-disable require-jsdoc */
/*
 * StyleTransfer
 */

import * as tf from '@tensorflow/tfjs';

// Need to double-check if this still holds, not much difference at first
tf.ENV.set('WEBGL_PACK', false);  // This needs to be done otherwise things run very slow v1.0.4

function imgToTensor(img) {
    if (!img) { alert('imgToTensor: invalid image'); }
    return tf.browser.fromPixels(img).toFloat().div(tf.scalar(255)).expandDims();
}

let model = {
    MOBILE_STYLE_NET: 'saved_model_style_js/model.json',
    INCEPTION_STYLE_NET: 'saved_model_style_inception_js/model.json',
    ORIGINAL_TRANSFORM_NET: 'saved_model_transformer_js/model.json',
    SEPARABLE_TRANSFORM_NET: 'saved_model_transformer_separable_js/model.json',
};

let styleNet = null;
let transformNet = null;

export default class StyleTransfer {
    constructor() {
        this.nets = {};
    }

    async loadModel(type) {
        if (!this.nets[type]) {
            this.nets[type] = await tf.loadGraphModel(model[type]);
        }
        return this.nets[type];
    }

    async loadMobileNetStyleModel() {
        const modelLoad = this.loadModel('MOBILE_STYLE_NET');
        modelLoad.then(function(result) {
            styleNet = result;
            return result;
        });
        return modelLoad;
    }

    async loadInceptionStyleModel() {
        const modelLoad = this.loadModel('INCEPTION_STYLE_NET');
        modelLoad.then(function (result) {
            styleNet = result;
            return result
        });
        return modelLoad;
    }

    async loadOriginalTransformerModel() {
        const modelLoad = this.loadModel('ORIGINAL_TRANSFORM_NET');
        modelLoad.then(function (result) {
            transformNet = result;
            return result
        });
        return modelLoad;
    }

    async loadSeparableTransformerModel() {
        const modelLoad = this.loadModel('SEPARABLE_TRANSFORM_NET');
        modelLoad.then(function (result) {
            transformNet = result;
            return result
        });
        return modelLoad;
    }

    async startStyling({ contentImg, styleImg, styleRatio, destination, reportStatus }) {
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
        bottleneck.dispose();  // Might wanna keep this around
        stylized.dispose();
    }

    async startCombining({ combContentImg, combStyleImg1, combStyleImg2, combStyleRatio, destination, reportStatus }) {
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

/*
  async benchmark() {
    const x = tf.randomNormal([1, 256, 256, 3]);
    const bottleneck = tf.randomNormal([1, 1, 1, 100]);

    let styleNet = await styleTransfer.loadInceptionStyleModel();
    let time = await this.benchmarkStyle(x, styleNet);
    styleNet.dispose();

    styleNet = await styleTransfer.loadMobileNetStyleModel();
    time = await this.benchmarkStyle(x, styleNet);
    styleNet.dispose();

    let transformNet = await styleTransfer.loadOriginalTransformerModel();
    time = await this.benchmarkTransform(
        x, bottleneck, transformNet);
    transformNet.dispose();

    transformNet = await styleTransfer.loadSeparableTransformerModel();
    time = await this.benchmarkTransform(
      x, bottleneck, transformNet);
    transformNet.dispose();

    x.dispose();
    bottleneck.dispose();
  }

  async benchmarkStyle(x, styleNet) {
    const profile = await tf.profile(() => {
      tf.tidy(() => {
        const dummyOut = styleNet.predict(x);
        dummyOut.print();
      });
    });
    console.log(profile);
    const time = await tf.time(() => {
      tf.tidy(() => {
        for (let i = 0; i < 10; i++) {
          const y = styleNet.predict(x);
          y.print();
        }
      })
    });
    console.log(time);
  }

  async benchmarkTransform(x, bottleneck, transformNet) {
    const profile = await tf.profile(() => {
      tf.tidy(() => {
        const dummyOut = transformNet.predict([x, bottleneck]);
        dummyOut.print();
      });
    });
    console.log(profile);
    const time = await tf.time(() => {
      tf.tidy(() => {
        for (let i = 0; i < 10; i++) {
          const y = transformNet.predict([x, bottleneck]);
          y.print();
        }
      })
    });
    console.log(time);
  }
*/