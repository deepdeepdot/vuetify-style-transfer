# vuetify-style-transfer

[![Netlify Status](https://api.netlify.com/api/v1/badges/bf298076-ed4b-4365-be74-26a8061a3b44/deploy-status)](https://app.netlify.com/sites/style-transfer/deploys)

If the Netlify build is successful, then the live URL is at
https://style-transfer.netlify.com


## README

This project is based on:
https://github.com/reiinakano/arbitrary-image-stylization-tfjs

I refactored the Javascript and re-implemented the client-side using Vue/Vuetify. There are some upgrades to the latest Tensorflow.js and number of fixes and improvements for mobile web.

A Vue application can be deployed using [Netlify very quickly](https://medium.com/vuejoy/how-to-deploy-your-vue-app-with-netlify-in-less-than-2-min-d6ab26c6557d)

[Vuetify](https://vuetifyjs.com) is a [material design](https://material.io/design/) implementation for [Vue](https://vuejs.org)


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

### Utilities in /lib
The lib folder contains three utility classes
* CameraCapture: handles camera capture for desktop and laptops, for mobile we use `<input capture="camera">`
* ImageUtils: 
  - `createDownloadLink(dataUrl, filename)`: creates the link to save an image
  - `loadImageFromFileInput(fileInput, image, sizeOptions)`: reads a file into an image
* StyleTransfer: loads tensorflow models and executes style transfer using Tensorflow.js


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

