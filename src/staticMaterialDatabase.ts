
/**
 * The static material database
 * 
 * This database contains the material definitions for the different materials that can be applied to the models.
 * This database is used to when no material in the dynamic material database is found.
 */
export const staticMaterialDatabase: {
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