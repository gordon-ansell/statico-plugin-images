/**
 * Please refer to the following files in the root directory:
 * 
 * README.md        For information about the package.
 * LICENSE          For license details, copyrights and restrictions.
 */
'use strict';

const { string, syslog, GAError } = require('js-framework');
const ImageAssetsHandler = require('./src/assetshandlers/imageAssetsHandler');
const ImgShortcode = require('./src/shortcodes/imgShortcode');
const path = require('path');
const pack = require('./package.json');
const debug = require('debug')('Statico:plugin:images'),
      debugf = require('debug')('Full.Statico:plugin:images');


module.exports = function(config, options = {}) {

    let imageCfg = {
        exts: ['jpg', 'jpeg', 'png', 'webp'],
        placeholderWidth: 24,
        widths: [1920, 1280, 1024, 768, 480, 320],
        upscaling: false,
        aliases: {
            jpg: 'jpeg'
        },
        formats: {
            png: ['webp', 'png'],
            jpeg: ['webp', 'jpeg'],
            webp: ['webp', 'jpeg'],
        },
        baseTypes: ['jpg', 'jpeg', 'png'],
        sharp: {
            constructorOptions: {},
            imageTypeOptions: {
                png: {},
                jpeg: {},
                webp: {},
                svg: {},
                avif: {},
            }
        },
        filenameMask: '{fn}-{width}.{ext}',
        generateThumbnail: true,
        thumbnailSize: {
            width: 1280,
            height: 720
        },
        thumbnailFilenameMask: '{fn}-{width}-thumbnail.{ext}',
        genDir: '_generatedImages',
        outputDir: config.asset('_generatedImages'),
        mimes: {
            jpeg: "image/jpeg",
            jpg: "image/jpeg",
            webp: "image/webp",
            png: "image/png",
            svg: "image/svg+xml",
            avif: "image/avif",       
        },
        generated: new Map(),
        generatedStoreFile: '.generatedImages.json', 
        generatedStorePath: undefined,
    };

    imageCfg.generatedStorePath = path.join(config.sitePath, imageCfg.generatedStoreFile);

    config.assetHandlers.image = imageCfg;

    config.assetHandlers.addHandler('image', new ImageAssetsHandler(config), ['jpg', 'jpeg', 'png', 'webp']);

    config.addNunjucksShortcode('img', ImgShortcode, true);
    debug(`Added shortcode to Nunjucks: img`);

    syslog.notice(`Statico image plugin version ${pack.version} loaded.`);

}
