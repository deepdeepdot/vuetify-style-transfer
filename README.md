# vuetify-style-transfer

[![Netlify Status](https://api.netlify.com/api/v1/badges/bf298076-ed4b-4365-be74-26a8061a3b44/deploy-status)](https://app.netlify.com/sites/style-transfer/deploys)

Live URL: https://style-transfer.netlify.com (if the Netlify build is successful)


## README

This project is based on:
https://github.com/reiinakano/arbitrary-image-stylization-tfjs

I refactored the Javascript and re-implemented the client-side using Vue/Vuetify. There are some upgrades to the latest Tensorflow.js and a number of fixes and improvements for mobile web.

A Vue application can be deployed using [Netlify very quickly](https://medium.com/vuejoy/how-to-deploy-your-vue-app-with-netlify-in-less-than-2-min-d6ab26c6557d)

[Vuetify](https://vuetifyjs.com) is one of the [material design](https://material.io/design/) implementations for [Vue](https://vuejs.org)


## Motivation

Finally I decided to explore machine learning starting with the famous Andrew Ng's coursera class.
Then I proceeced to deep learning (neural networks) and computer vision.
* [MIT's Intro to Deep Learning](http://introtodeeplearning.com/)
* [Kadenze's Creative apps with Tensorflow](https://www.kadenze.com/courses/)
* [CS231, Stanford's cs231, CNN for visual recognition](http://cs231n.stanford.edu/)
creative-applications-of-deep-learning-with-tensorflow/info)
* [Udemy's PyTorch and Computer Vision](https://www.udemy.com/pytorch-for-deep-learning-and-computer-vision/)


I found out about Style Transfer through [Tensorflow examples](https://www.tensorflow.org/alpha/tutorials/generative/style_transfer). But training a model with a specific style would take about 4 hours on an nvidia GTX 1080.

Later, I found out about a much faster way to do Style Transfer without the GPU intensive training per single style through Reiiniko's work. Given my expertise on Javascript, I decided to refactor it to understand how Tensorflow.js worked. In the process I learned some limitations with Tensorflow.js with mobile web.


## Architecture

### Components

The App contains a Tabs component with two StylizePanelLayouts.
Each StylizePanelLayout contains a CameraModal, a StylizeControl and three instances of ImageInputs (two for the styles and one for the image content).
The StylizeControl contains the Stylize button and the Tensorflow model selectors.

```
App -> Tabs -> StylizePanelLayout -> ImageInput
                                  -> ImageInput
                                  -> ImageInput
                                  -> Cameramodal
                                  -> StylizeControl

            -> StylizePanelLayout -> ImageInput
                                  -> ImageInput
                                  -> ImageInput
                                  -> Cameramodal
                                  -> StylizeControl
```

### Emitted Events

```
ImageInput -> imageSizeChanged -> StylizePanelLayout
           -> imageSelected    -> StylizePanelLayout

StylizedControl -> styleAction -> StylizePanelLayout
                -> modelLoaded -> StylizePanelLayout

```

### Utilities in /lib
The lib folder contains three utility classes
* `CameraCapture`: handles camera capture for desktop and laptops, for mobile we use `<input capture="camera">`
* `ImageUtils`: 
  - `createDownloadLink(dataUrl, filename)`: creates the link to save an image
  - `loadImageFromFileInput(fileInput, image, sizeOptions)`: reads a file into an image
* `StyleTransfer`: loads tensorflow models and executes style transfer using Tensorflow.js


## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

## Issues

* Safari browser on laptops will reload the web page due to high memory consumption (these models are several MBs)
