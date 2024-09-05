import { CoreViewerApp, LoadingScreenPlugin, mobileAndTabletCheck } from 'webgi';
import './styles.css';
import { ShapeDiverSessionPlugin } from './ShapeDiverSessionPlugin';

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
    await viewer.initialize({});

    viewer.getPlugin(LoadingScreenPlugin)!.showFileNames = false;
    viewer.setEnvironmentMap('https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr');

    // Optionally you can also load a complete scene with the following line
    // The scene can be created and downloaded in the https://playground.ijewel3d.com/
    // await viewer.load(PATH_TO_SCENE);

    // Add the ShapeDiverSessionPlugin, which creates a session with the ShapeDiver API
    const shapeDiverSessionPlugin = await viewer.addPlugin(new ShapeDiverSessionPlugin({
        ticket:
        '1797d587f936764fbb26e32e06d81a11830c42f0dcc4cb63205b869ca6175fff990a7346d5ee36299ef48b2e7b553d86926a381738f799ad1493b9d5f84ed2dc79d5f897883196752a65b13c512594bdd03478eba068db4b946578d264200eff84227b4b3aa2ef-c738bb6ae4ab21c5b9cef0e334af34c7',
        modelViewUrl: 'https://sdr8euc1.eu-central-1.shapediver.com',
    }));

    // Check if the device is a mobile device
    const isMobile = mobileAndTabletCheck();
    // Set the render scale
    viewer.renderer.renderScale = Math.min(isMobile ? 1.5 : 2, window.devicePixelRatio);

    // Create a session with the model and load default outputs.
    await shapeDiverSessionPlugin.init();

    // There are many other plugins that can be added to the viewer. Here is some documentation on them:
    // - https://webgi.xyz/docs/manual/viewer-api#add-plugins
    // - https://webgi.xyz/docs/features
};

setup();
