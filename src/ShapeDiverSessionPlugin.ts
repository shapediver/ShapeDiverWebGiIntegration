import { AViewerPlugin, DiamondPlugin, IModel, MaterialConfiguratorBasePlugin, MathUtils, Mesh, MeshStandardMaterial2, ViewerApp } from "webgi";
import { createSession, ISessionApi, ITreeNode, SessionCreationDefinition, SessionOutputData, ShapeDiverResponseOutputContent } from "@shapediver/viewer.session";
import { staticMaterialDatabase } from "./staticMaterialDatabase";

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
        });
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
        const viewer = this._viewer;
        if (!viewer) return;

        // use the original uid if it exists, otherwise generate a new one
        const uid = outputUid || MathUtils.generateUUID();

        // load the model
        const ms = await viewer.load(content.href + "#f" + index + ".glb", { autoScale: false, pseudoCenter: false })
        ms.name = outputName;

        // dispose the old model
        if (this._models && this._models[uid] && this._models[uid][index]) {
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
