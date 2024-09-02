import { AssetExporterPlugin, BloomPlugin, CoreViewerApp, DepthOfFieldPlugin, DiamondPlugin, FileTransferPlugin, GroundPlugin, HierarchyUiPlugin, LoadingScreenPlugin, mobileAndTabletCheck, OutlinePlugin, PickingPlugin, ProgressivePlugin, RandomizedDirectionalLightPlugin, SimpleBackgroundEnvUiPlugin, SSAOPlugin, SSRPlugin, TonemapPlugin, TweakpaneUiPlugin } from 'webgi';
import './styles.css';
import { ParameterUI } from './ParameterUI';
import { ShapeDiverSessionPlugin } from './ShapeDiverSessionPlugin';

/**
 * Setup the viewer and add all necessary plugins
 * 
 * This function initializes the viewer and adds all necessary plugins to the viewer.
 * The plugins are added in the following order:
 * - LoadingScreenPlugin
 * - ShapeDiverSessionPlugin
 * - all others, see loadPlugins()
 */
const setup = async () => {
    // Initialize the viewer
    const viewer = new CoreViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    })
    await viewer.initialize({});
    viewer.getPlugin(LoadingScreenPlugin)!.showFileNames = false;
    viewer.setEnvironmentMap("https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr");

    // Add the ShapeDiverSessionPlugin
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
    // Load all other plugins
    await loadPlugins(viewer, paramsUi, isMobile);
}

/** 
 * Load all plugins
 * 
 * This function loads all plugins that are necessary for the viewer.
 */
const loadPlugins = async (viewer: CoreViewerApp, paramsUi: ParameterUI, isMobile: boolean) => {
    // await viewer.addPlugin(new PickingPlugin(BoxSelectionWidget, false, true));
    await viewer.addPlugin(SimpleBackgroundEnvUiPlugin)
    await viewer.addPlugin(FileTransferPlugin)
    await viewer.addPlugin(AssetExporterPlugin)
    await viewer.addPlugin(HierarchyUiPlugin)

    const picking = await viewer.addPlugin(new PickingPlugin());
    await viewer.addPlugin(OutlinePlugin)
    viewer.renderer.refreshPipeline()

    const uiPlugin = await viewer.addPlugin(new TweakpaneUiPlugin(!isMobile));
    uiPlugin.colorMode = 'white'

    uiPlugin.appendUiObject(paramsUi);
    uiPlugin.setupPluginUi(HierarchyUiPlugin)
    uiPlugin.setupPluginUi(SimpleBackgroundEnvUiPlugin)
    uiPlugin.appendUiObject(viewer.scene.activeCamera)
    // uiPlugin.setupPluginUi(PickingPlugin)
    uiPlugin.setupPluginUi(TonemapPlugin)
    // uiPlugin.setupPluginUi(OutlinePlugin)
    uiPlugin.setupPluginUi(GroundPlugin)
    uiPlugin.setupPluginUi(SSRPlugin)
    uiPlugin.setupPluginUi(SSAOPlugin)
    uiPlugin.setupPluginUi(DiamondPlugin)
    // uiPlugin.setupPluginUi(ProgressivePlugin)
    uiPlugin.setupPluginUi(BloomPlugin)
    // uiPlugin.setupPluginUi(TemporalAAPlugin)
    uiPlugin.setupPluginUi(PickingPlugin)
    uiPlugin.setupPluginUi(AssetExporterPlugin)
    uiPlugin.setupPluginUi(DepthOfFieldPlugin)
    uiPlugin.setupPluginUi(RandomizedDirectionalLightPlugin)
}

setup()
