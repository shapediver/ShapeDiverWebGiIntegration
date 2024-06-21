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
        ticket: "05ad12e1f9c943adc306ea8c081989b0e9ba943da6776c7e8925479a6cc7e20f5a3bca32c94c0b28c0be3998b0fc28dff7418a566f0f7c49694e129e7ad570e29b5a46a61bafd848c2d59da55712a1449c583971851bc5c981e65239cc7d7343fd05e3398cf2c8-2bb884c60f43f1b75274bbb7e8229218",
        modelViewUrl: "https://sdr8euc1.eu-central-1.shapediver.com",
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
    const lengthParameter = session.getParameterByName("Finger Size")[0];

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
