import { AViewerPlugin, DiamondMaterialParameters, DiamondPlugin, IModel, MaterialConfiguratorBasePlugin, MathUtils, Mesh, MeshStandardMaterial2, ViewerApp } from "webgi";
import { createSession, ISessionApi, ITreeNode, SessionCreationDefinition, SessionOutputData, ShapeDiverResponseOutputContent } from "@shapediver/viewer.session";

/**
 * The static material database
 * 
 * This database contains the material definitions for the different materials that can be applied to the models.
 * This database is used to when no material in the dynamic material database is found.
 */
const staticMaterialDatabase: {
    [key: string]: any
} = {
    'stone': {
        "name": "zircon-yellow",
        "uuid": "8515627c-c6b8-45dc-bff3-161fa400b991",
        "color": 16579713,
        "envMapIntensity": 1.3,
        "dispersion": 0.018000000000000002,
        "squashFactor": 0.98,
        "geometryFactor": 0.5,
        "gammaFactor": 1,
        "absorptionFactor": 1.3,
        "reflectivity": 0.5,
        "refractiveIndex": 1.98,
        "rayBounces": 5,
        "diamondOrientedEnvMap": 1,
        "boostFactors": {
            "x": 1.3,
            "y": 0.9,
            "z": 1,
            "isVector3": true
        },
        "transmission": 0,
        "isDiamondMaterialParameters": true,
        "type": "DiamondMaterial",
        "userData": {
            "separateEnvMapIntensity": true,
            "uuid": "8515627c-c6b8-45dc-bff3-161fa400b991"
        }
    },
    'metal': {
        "metadata": {
            "version": 4.6,
            "type": "Material",
            "generator": "Material.toJSON"
        },
        "uuid": "b96fdc44-51a6-4c24-bc21-72fe2c83394c",
        "type": "MeshStandardMaterial2",
        "name": "scratch",
        "color": 16034684,
        "roughness": 0.26116099121163555,
        "metalness": 0.9,
        "sheen": 0.2723217056874157,
        "sheenColor": 15651511,
        "sheenRoughness": 1,
        "emissive": 0,
        "specularIntensity": 1,
        "specularColor": 16777215,
        "clearcoat": 0,
        "clearcoatRoughness": 0,
        "iridescence": 0,
        "iridescenceIOR": 1.3,
        "iridescenceThicknessRange": [
            100,
            400
        ],
        "anisotropy": 0,
        "anisotropyRotation": 0,
        "bumpMap": "044beed6-d489-4039-b1ae-39b64af1af2a",
        "bumpScale": 0.009999999999999981,
        "roughnessMap": "044beed6-d489-4039-b1ae-39b64af1af2a",
        "envMapIntensity": 1,
        "reflectivity": 0.49999999999999983,
        "transmission": 0,
        "thickness": 0,
        "attenuationDistance": 0,
        "attenuationColor": 16777215,
        "side": 2,
        "depthFunc": 3,
        "depthTest": true,
        "depthWrite": true,
        "colorWrite": true,
        "stencilWrite": false,
        "stencilWriteMask": 255,
        "stencilFunc": 519,
        "stencilRef": 0,
        "stencilFuncMask": 255,
        "stencilFail": 7680,
        "stencilZFail": 7680,
        "stencilZPass": 7680,
        "fog": false,
        "userData": {
            "_triplanarMapping": {
                "enable": true,
                "scaleFactor": 0.58,
                "blendFactor": 1,
                "offsetFactor": 0
            },
            "gltfExtensions": {},
            "_9c0eb19a-863e-4e38-9c54-fdde7af5eb71_version": 1,
            "cloneId": "0",
            "cloneCount": 2,
            "uuid": "b96fdc44-51a6-4c24-bc21-72fe2c83394c"
        },
        "textures": [
            {
                "metadata": {
                    "version": 4.6,
                    "type": "Texture",
                    "generator": "Texture.toJSON"
                },
                "uuid": "044beed6-d489-4039-b1ae-39b64af1af2a",
                "name": "",
                "image": "df4b7c73-9b4c-4e14-aec9-4c908defea42",
                "mapping": 300,
                "channel": 0,
                "repeat": [
                    2,
                    2
                ],
                "offset": [
                    0,
                    0
                ],
                "center": [
                    0,
                    0
                ],
                "rotation": 0,
                "wrap": [
                    1000,
                    1000
                ],
                "format": 1023,
                "internalFormat": null,
                "type": 1009,
                "colorSpace": "srgb-linear",
                "encoding": 3000,
                "minFilter": 1008,
                "magFilter": 1006,
                "anisotropy": 1,
                "flipY": false,
                "generateMipmaps": true,
                "premultiplyAlpha": false,
                "unpackAlignment": 4,
                "userData": {
                    "rootPath": "https://playground.ijewel3d.com/assets/maps/albedo/metal/scratch-3.jpg"
                }
            }
        ],
        "images": []
    }
}

/**
 * The ShapeDiver session plugin
 * 
 * This plugin is used to create a session with the ShapeDiver API.
 * It also loads the glb content from the session and applies the materials to the models.
 */
export class ShapeDiverSessionPlugin extends AViewerPlugin<''> {
    // #region Properties (6)

    /**
     * The dynamic material database
     * 
     * This database contains the material definitions for the different materials that can be applied to the models.
     * This database is used as a default.
     * 
     * The contents of this database are updated by reading the MaterialDatabase output from the session (if there is one).
     */
    private _dynamicMaterialDatabase: { [key: string]: any } = {};
    private _enabled = false;
    private _loadedOutputVersions: { [key: string]: string } = {};
    private _models: Record<string, IModel[][]> = {};
    private _session?: ISessionApi;

    public static readonly PluginType = 'ShapeDiverSessionPlugin';

    // #endregion Properties (6)

    // #region Constructors (1)

    constructor(private readonly _sessionCreationDefinition: SessionCreationDefinition) {
        super();
    }

    // #endregion Constructors (1)

    // #region Public Getters And Setters (3)

    public get enabled(): boolean {
        return this._enabled;
    }

    public get models(): Record<string, IModel[][]> {
        return this._models;
    }

    public get session(): ISessionApi | undefined {
        return this._session;
    }

    // #endregion Public Getters And Setters (3)

    // #region Public Methods (2)

    /**
     * Create the session with the session creation definition
     * 
     * Then create the callbacks for the MaterialDatabase output and the session update.
     */
    public async init(): Promise<void> {
        this._session = await createSession(this._sessionCreationDefinition);

        const materialDatabaseOutput = this._session.getOutputByName('MaterialDatabase')[0];

        /**
         * If the MaterialDatabase output is found, create a callback that updates the dynamicMaterialDatabase.
         * This callback is called when the MaterialDatabase output is updated.
         */
        if (materialDatabaseOutput) {
            const cb = (newNode?: ITreeNode) => {
                if (!newNode) return;

                // update the dynamic material database
                this._dynamicMaterialDatabase = (newNode.data.find((d) => d instanceof SessionOutputData) as SessionOutputData).responseOutput.content?.[0].data;

                // clear the loaded output versions so that the new material definitions are applied
                this._loadedOutputVersions = {};
            }

            materialDatabaseOutput.updateCallback = cb;
            cb(materialDatabaseOutput.node);
        }

        /**
         * Create a callback that is called when the session is updated.
         * This callback is called when the session is updated.
         */
        this._session.updateCallback = (newNode?: ITreeNode) => {
            if (!newNode || !this._session) return;

            // iterate over all outputs
            for (const outputId in this._session.outputs) {
                const outputApi = this._session.outputs[outputId];

                // if the output is already loaded, skip it
                if (this._loadedOutputVersions[outputId] === outputApi.version) continue;
                // skip the MaterialDatabase output, this output is handled separately
                if (outputApi.name === 'MaterialDatabase' || outputApi.displayname === 'MaterialDatabase') continue;

                // iterate over all content in the output and load the glb content
                const content = outputApi.content;
                if (!content?.length) continue;
                for (let i = 0; i < content.length; i++) {
                    const item = content[i];
                    switch (item.format) {
                        case "gltf":
                        case "glb":
                            this.loadGlbContent(outputApi.name, outputApi.uid, item, i);
                    }
                }

                // store the version of the output
                this._loadedOutputVersions[outputId] = outputApi.version;
            }

        };
        this._session.updateCallback(this._session.node, this._session.node);

        this._enabled = true;
    }

    public async onRemove(v: ViewerApp): Promise<void> {
        await this._session?.close();

        return super.onRemove(v);
    }

    // #endregion Public Methods (2)

    // #region Private Methods (3)

    /**
     * Apply the material to the model
     * 
     * Iterate over all objects in the model and apply a material to them.
     * 
     * First, search for the material name in the dynamic material database.
     * If no material is found, search in the static material database.
     * 
     * @param viewer The viewer
     * @param ms The model
     */
    private applyMaterial(viewer: ViewerApp, ms: IModel) {
        // for every object in the model, check if it belongs to a defined material library
        // if it does, store it in the material library
        ms.modelObject.traverse((child: any) => {
            if (!child.material) return;

            // check if the material name is in the dynamic material database
            for (const key in this._dynamicMaterialDatabase) {
                if (child.material.name === key) {
                    this.createMaterialFromDefinition(viewer, child, this._dynamicMaterialDatabase[key]);
                    return;
                }
            }

            // check if the material name is in the static material database
            for (const key in staticMaterialDatabase) {
                if (child.material.name === key) {
                    this.createMaterialFromDefinition(viewer, child, staticMaterialDatabase[key]);
                    return;
                }
            }
        })

        // update the material configurator
        const configurator = viewer.getPluginByType<MaterialConfiguratorBasePlugin>('MaterialConfiguratorPlugin')
        if (configurator) {
            configurator.reapplyAll()
        }
    }

    /**
     * Create a material from a definition
     * 
     * @param viewer The viewer
     * @param child The object
     * @param definition The material definition
     */
    private async createMaterialFromDefinition(viewer: ViewerApp, child: Mesh<any, any>, definition: any) {
        const parsedDefinition = JSON.parse(definition);
        if (parsedDefinition.type === 'DiamondMaterial') {
            viewer.getPlugin(DiamondPlugin)!.makeDiamond(child.material, { cacheKey: child.material.name, normalMapRes: 512 }, parsedDefinition)
        } else {
            child.material = new MeshStandardMaterial2().fromJSON(parsedDefinition);
        }
    }

    /**
     * Load a glb content into the viewer
     * 
     * Store the model in the models dictionary.
     * Apply the material to the model.
     * 
     * @param outputName The name of the output
     * @param outputUid The uid of the output (if it exists)
     * @param content The content of the output
     * @param index The index of the content
     * @returns 
     */
    private async loadGlbContent(
        outputName: string,
        outputUid: string | undefined,
        content: ShapeDiverResponseOutputContent,
        index: number
    ) {
        const viewer = this._viewer
        if (!viewer) return;

        // use the original uid if it exists, otherwise generate a new one
        const uid = outputUid || MathUtils.generateUUID();

        // load the model
        const ms = await viewer.load(content.href + "#f" + index + ".glb", { autoScale: false, pseudoCenter: false })
        ms.name = outputName;

        // dispose the old model
        if (this._models && this._models[uid] && this._models[uid][index]) { // todo: make clearAll
            this._models[uid][index].forEach((m: IModel) => m.modelObject.dispose());
            this._models[uid][index] = [];
        }

        // store the new model
        if (!this._models[uid]) this._models[uid] = [];
        this._models[uid][index] = [ms];

        // apply the material
        this.applyMaterial(viewer, ms);

        return viewer.fitToView();
    }

    // #endregion Private Methods (3)
}
