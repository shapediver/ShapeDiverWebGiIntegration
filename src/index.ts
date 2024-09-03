import { CoreViewerApp, LoadingScreenPlugin, mobileAndTabletCheck, TweakpaneUiPlugin } from 'webgi';
import './styles.css';
import { ParameterUI } from './ParameterUI';
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
    })
    await viewer.initialize({});
    viewer.getPlugin(LoadingScreenPlugin)!.showFileNames = false;
    viewer.setEnvironmentMap("https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr");

    // Add the ShapeDiverSessionPlugin, which creates a session with the ShapeDiver API
    const shapeDiverSessionPlugin = await viewer.addPlugin(new ShapeDiverSessionPlugin({
        ticket:
        "1797d587f936764fbb26e32e06d81a11830c42f0dcc4cb63205b869ca6175fff990a7346d5ee36299ef48b2e7b553d86926a381738f799ad1493b9d5f84ed2dc79d5f897883196752a65b13c512594bdd03478eba068db4b946578d264200eff84227b4b3aa2ef-c738bb6ae4ab21c5b9cef0e334af34c7",
        modelViewUrl: "https://sdr8euc1.eu-central-1.shapediver.com",
    }))

    // Check if the device is a mobile device
    const isMobile = mobileAndTabletCheck()
    // Set the render scale
    viewer.renderer.renderScale = Math.min(isMobile ? 1.5 : 2, window.devicePixelRatio)

    // Create a session with the model and load default outputs.
    await shapeDiverSessionPlugin.init();

    // Create a minimal UI for the parameters
    const paramsUi = new ParameterUI(shapeDiverSessionPlugin.session);

    // Add the UI to the viewer
    const uiPlugin = await viewer.addPlugin(new TweakpaneUiPlugin(!isMobile));
    uiPlugin.appendUiObject(paramsUi);
}

setup()
