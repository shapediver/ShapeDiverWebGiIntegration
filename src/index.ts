import { CoreViewerApp, DirectionalLight, LoadingScreenPlugin, mobileAndTabletCheck } from 'webgi';
import './styles.css';
import { ShapeDiverSessionPlugin } from './ShapeDiverSessionPlugin';
import { createUi } from '@shapediver/viewer.shared.demo-helper';

const urlParams = new URLSearchParams(window.location.search);
const TICKET = urlParams.get('ticket') || '093ba93c953b425122eeb0fc588ea395d846d86943a7ab3af44cce4ccce6365befdbb33fed9deab95926a351ba471384d143b60d688383d24e19169a81f6a877e8c2d4911ce7256abd0d6307d0320790770f807679935745f98c6a01fe673431ed495f17e98004-996e1d95e780322572d397de7c82a88a';
const MODEL_VIEW_URL = urlParams.get('modelViewUrl') || 'https://sdr8euc1.eu-central-1.shapediver.com';

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
    const light = new DirectionalLight(0xffffff, 2.5);
    light.position.set(1, 1, 1);
    viewer.scene.add(light);

    // Optionally you can also load a complete scene with the following line
    // The scene can be created and downloaded in the https://playground.ijewel3d.com/
    // await viewer.load(PATH_TO_SCENE);

     // Add the ShapeDiverSessionPlugin, which creates a session with the ShapeDiver API
     const shapeDiverSessionPlugin = await viewer.addPlugin(new ShapeDiverSessionPlugin({
        ticket: TICKET,
        modelViewUrl: MODEL_VIEW_URL,
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
