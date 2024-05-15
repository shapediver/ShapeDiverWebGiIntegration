import { addBasePlugins, Vector3, ViewerApp } from 'webgi';
import { createSession } from '@shapediver/viewer.session';
import { outputUpdateHandler } from './outputUpdateHandler';
import './styles.css';

async function setupViewer() {
    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas') as HTMLCanvasElement,
    })
    viewer.setEnvironmentMap("https://demo-assets.pixotronics.com/pixo/hdr/gem_2.hdr");

    // Move the camera to see the model
    viewer.scene.activeCamera.position = new Vector3(0, 70, 110);
    viewer.scene.activeCamera.target = new Vector3(0, 0, 0);

    // Add the base plugins
    await addBasePlugins(viewer);

    // Initialize the ShapeDiver session
    const session = await createSession({
        ticket: "ad89b7ee26f8a625df026d2d699eb0e4df2d432490c7b23d10ef24e7901d3b6142781d010408dad96368a26940b3c34f1be7949a66c6c61d49810ff8902c2eca707c057e5a6fd260d1af7f78cfc49814523ec4496d60b813a845d928571034a45c53f46c01a392-ff8192216a5a32e34b0f46633e3bf16d",
        modelViewUrl: "https://sdr7euc1.eu-central-1.shapediver.com",
    });

    /**
     * Register the outputUpdateHandler for every output
     */
    for (const outputId in session.outputs) {
        const output = session.outputs[outputId];
        // Call the handler once to load the initial content
        outputUpdateHandler(output, viewer, output.material ? session.outputs[output.material] : undefined);
        // Register the handler to be called whenever the output changes
        output.updateCallback = () => outputUpdateHandler(output, viewer, output.material ? session.outputs[output.material] : undefined);
    }

    /**
     * Create a custom slider to change the length of the model
     */
    const lengthParameter = session.getParameterByName("Length")[0];

    const lengthSlider = document.createElement('input');
    lengthSlider.style.position = 'absolute';
    lengthSlider.style.top = '10px';
    document.body.appendChild(lengthSlider);

    lengthSlider.type = 'range';
    lengthSlider.min = lengthParameter.min + '';
    lengthSlider.max = lengthParameter.max + '';
    lengthSlider.value = lengthParameter.value + '';
    switch(lengthParameter.type) {
        case 'Int':
            lengthSlider.step = '1';
            break;
        case 'Even':
        case 'Odd':
            lengthSlider.step = '2';
            break;
        default:
            lengthSlider.step = (1 / Math.pow(10, lengthParameter.decimalplaces!)) + '';
    }

    /**
     * Update the parameter value when the slider changes
     */
    lengthSlider.onchange = () => {
        lengthParameter.value = parseFloat(lengthSlider.value);
        lengthSlider.disabled = true;
        session.customize().then(() => lengthSlider.disabled = false);
    };
}

setupViewer()
