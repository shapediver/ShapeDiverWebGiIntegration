
/**
 * The static material database
 * 
 * This database contains the material definitions for the different materials that can be applied to the models.
 * This database is used to when no material in the dynamic material database is found.
 * 
 * Material definitions can be created by visiting the [iJewel3d playground](https://playground.ijewel3d.com/). 
 * You can load a test model there and edit the materials (or assign new ones). 
 * Once you are content, you can export the material as a JSON by clicking on `Download pmat` (or `Download dmat` for gem stones) on the right side of the UI while the object is selected. 
 * If you store the material definition with the same name that the material of the geometry has, the new material definition will be assigned. 
 */
export const staticMaterialDatabase: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any
} = {
    'head.stone': {
        'metadata': {
            'version': 4.6,
            'type': 'DiamondMaterial',
            'generator': 'DiamondMaterial.toJSON'
        },
        'name': '4ab054b4-6fef-46d6-80c9-cf350e89e2a0',
        'uuid': 'f3144d6f-7a0c-4219-9f7f-91e6cc580899',
        'color': 3904722,
        'envMapIntensity': 1,
        'envMapIndex': 0,
        'envMapRotationOffset': 0,
        'dispersion': 0.0098,
        'squashFactor': 0.98,
        'geometryFactor': 0.5,
        'gammaFactor': 1,
        'absorptionFactor': 1.6,
        'reflectivity': 0.5,
        'refractiveIndex': 2.17,
        'rayBounces': 5,
        'diamondOrientedEnvMap': 0,
        'boostFactors': {
            'x': 1,
            'y': 1,
            'z': 1.2,
            'isVector3': true
        },
        'transmission': 0,
        'isDiamondMaterialParameters': true,
        'type': 'DiamondMaterial',
        'userData': {
            'separateEnvMapIntensity': true,
            'rootPath': 'https://playground.ijewel3d.com/assets/materials/gem/gem-sapphire-1.dmat',
            'cloneId': '0_1',
            'cloneCount': 0,
            'uuid': 'f3144d6f-7a0c-4219-9f7f-91e6cc580899'
        }
    },
    'shank.accentStones':
    {
        'metadata': {
            'version': 4.6,
            'type': 'DiamondMaterial',
            'generator': 'DiamondMaterial.toJSON'
        },
        'name': '4ab054b4-6fef-46d6-80c9-cf350e89e2a0',
        'uuid': 'a7d0ea13-217f-4d7d-afbf-e796fec08d94',
        'color': 16777215,
        'envMapIntensity': 1,
        'envMapIndex': 0,
        'envMapRotationOffset': 0,
        'dispersion': 0.012,
        'squashFactor': 0.98,
        'geometryFactor': 0.5,
        'gammaFactor': 1,
        'absorptionFactor': 1,
        'reflectivity': 0.5,
        'refractiveIndex': 2.6,
        'rayBounces': 5,
        'diamondOrientedEnvMap': 0,
        'boostFactors': {
            'x': 1,
            'y': 1,
            'z': 1,
            'isVector3': true
        },
        'transmission': 0,
        'isDiamondMaterialParameters': true,
        'type': 'DiamondMaterial',
        'userData': {
            'separateEnvMapIntensity': true,
            'rootPath': 'https://playground.ijewel3d.com/assets/materials/gem/gem-diamond-white1.dmat',
            'cloneId': '0_1',
            'cloneCount': 0,
            'uuid': 'a7d0ea13-217f-4d7d-afbf-e796fec08d94'
        }
    },
    'head.metal': {
        'metadata': {
            'version': 4.6,
            'type': 'Material',
            'generator': 'Material.toJSON'
        },
        'uuid': '4cbfe0d0-631f-4c20-bae2-4ead8bfb4048',
        'type': 'MeshStandardMaterial2',
        'name': '4ab054b4-6fef-46d6-80c9-cf350e89e2a0',
        'color': 12763843,
        'roughness': 0,
        'metalness': 1,
        'sheen': 0,
        'sheenColor': 0,
        'sheenRoughness': 1,
        'emissive': 0,
        'specularIntensity': 1,
        'specularColor': 16777215,
        'clearcoat': 0,
        'clearcoatRoughness': 0,
        'iridescence': 0,
        'iridescenceIOR': 1.3,
        'iridescenceThicknessRange': [
            100,
            400
        ],
        'anisotropy': 0,
        'anisotropyRotation': 0,
        'envMapIntensity': 1,
        'reflectivity': 0.49999999999999983,
        'transmission': 0,
        'thickness': 0,
        'attenuationDistance': 0,
        'attenuationColor': 16777215,
        'side': 2,
        'depthFunc': 3,
        'depthTest': true,
        'depthWrite': true,
        'colorWrite': true,
        'stencilWrite': false,
        'stencilWriteMask': 255,
        'stencilFunc': 519,
        'stencilRef': 0,
        'stencilFuncMask': 255,
        'stencilFail': 7680,
        'stencilZFail': 7680,
        'stencilZPass': 7680,
        'fog': false,
        'userData': {
            'gltfExtensions': {},
            'cloneId': '0_1_1',
            '_6b1395aa-194b-4458-bd49-22ec4592cfc2_version': 1,
            'cloneCount': 0,
            'rootPath': 'https://playground.ijewel3d.com/assets/materials/metal/polished/metal-whitegold-polished.pmat',
            'uuid': '4cbfe0d0-631f-4c20-bae2-4ead8bfb4048'
        },
        'textures': [],
        'images': []
    },
    'shank.metal': {
        'metadata': {
            'version': 4.6,
            'type': 'Material',
            'generator': 'Material.toJSON'
        },
        'uuid': '4cbfe0d0-631f-4c20-bae2-4ead8bfb4048',
        'type': 'MeshStandardMaterial2',
        'name': '4ab054b4-6fef-46d6-80c9-cf350e89e2a0',
        'color': 12763843,
        'roughness': 0,
        'metalness': 1,
        'sheen': 0,
        'sheenColor': 0,
        'sheenRoughness': 1,
        'emissive': 0,
        'specularIntensity': 1,
        'specularColor': 16777215,
        'clearcoat': 0,
        'clearcoatRoughness': 0,
        'iridescence': 0,
        'iridescenceIOR': 1.3,
        'iridescenceThicknessRange': [
            100,
            400
        ],
        'anisotropy': 0,
        'anisotropyRotation': 0,
        'envMapIntensity': 1,
        'reflectivity': 0.49999999999999983,
        'transmission': 0,
        'thickness': 0,
        'attenuationDistance': 0,
        'attenuationColor': 16777215,
        'side': 2,
        'depthFunc': 3,
        'depthTest': true,
        'depthWrite': true,
        'colorWrite': true,
        'stencilWrite': false,
        'stencilWriteMask': 255,
        'stencilFunc': 519,
        'stencilRef': 0,
        'stencilFuncMask': 255,
        'stencilFail': 7680,
        'stencilZFail': 7680,
        'stencilZPass': 7680,
        'fog': false,
        'userData': {
            'gltfExtensions': {},
            'cloneId': '0_1_1',
            '_6b1395aa-194b-4458-bd49-22ec4592cfc2_version': 1,
            'cloneCount': 0,
            'rootPath': 'https://playground.ijewel3d.com/assets/materials/metal/polished/metal-whitegold-polished.pmat',
            'uuid': '4cbfe0d0-631f-4c20-bae2-4ead8bfb4048'
        },
        'textures': [],
        'images': []
    }
};