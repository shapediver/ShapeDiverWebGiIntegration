import { CoreViewerApp, LoadingScreenPlugin, mobileAndTabletCheck } from 'webgi';
import './styles.css';
import { ShapeDiverSessionPlugin } from './ShapeDiverSessionPlugin';
import { createUi } from '@shapediver/viewer.shared.demo-helper';

/**
 * Setup the WebGi viewer and add all necessary plugins
 * 
 * This function initializes the WebGi viewer and adds all necessary plugins to the viewer.
 * The plugins are added in the following order:
 * - LoadingScreenPlugin
 * - ShapeDiverSessionPlugin -> creates a session with the ShapeDiver API
 * - all others, see loadPlugins()
 */
const setup = async () => {
    // Initialize the viewer with a canvas element
    // You can read more about the viewer creation here: https://webgi.xyz/docs/manual/viewer-api#create-the-viewer
    const viewer = new CoreViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    });
    // You can choose from various options when initializing the viewer. Please read more about them here: https://webgi.xyz/docs/api/classes/Viewer_Editor_Templates.CoreViewerApp#initialize
    await viewer.initialize({ ground: false});

    viewer.getPlugin(LoadingScreenPlugin)!.showFileNames = false;
    viewer.setEnvironmentMap('https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr');

    // Optionally you can also load a complete scene with the following line
    // The scene can be created and downloaded in the https://playground.ijewel3d.com/
    // await viewer.load(PATH_TO_SCENE);

     // Add the ShapeDiverSessionPlugin, which creates a session with the ShapeDiver API
     const shapeDiverSessionPlugin = await viewer.addPlugin(new ShapeDiverSessionPlugin({
        ticket:
        'ee1622c04230a13e8632917d16834f2932ed3373e35a461e0a799b877d8e816f1db6168261d152536868ec651bc641e4eb5bd189520c7e9e6204e73f9b027173f09e8fdd87234380bdacb3240bb71ac8217e0e4c5924bb1dc6e75fcf5d0c76df47502202094bb4-5a7f2add154eb6589385a5718804ce39',
        modelViewUrl: 'https://sdr8euc1.eu-central-1.shapediver.com',
    }));

    // Check if the device is a mobile device
    const isMobile = mobileAndTabletCheck();
    // Set the render scale
    viewer.renderer.renderScale = Math.min(isMobile ? 1.5 : 2, window.devicePixelRatio);

    // Create a session with the model and load default outputs.
    await shapeDiverSessionPlugin.init();

    // Create a demonstration UI for the parameters
    createUi(shapeDiverSessionPlugin.session!, document.getElementById('parameter-ui') as HTMLDivElement);

    // There are many other plugins that can be added to the viewer. Here is some documentation on them:
    // - https://webgi.xyz/docs/manual/plugins-basics
    // - https://webgi.xyz/docs/features
    // Some plugins, like the DiamondPlugin, are already included in the viewer by default.
    // You can read more about the diamond plugin here: https://webgi.xyz/docs/industries/jewellery/index.html
};

setup();
