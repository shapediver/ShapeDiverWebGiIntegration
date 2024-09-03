# ShapeDiver WebGi Integration

This is an example repository on how to combine ShapeDiver with WebGi (the rendering engine of iJewel3d). All geometry is provided by the headless ShapeDiver API, whereas the visualization is done by the WebGi viewer.

If you need any assistance, please let us know via the [ShapeDiver forum](https://forum.shapediver.com/) or the private support mail (if you have one in your subscription plan).

## Terminology

### What is ShapeDiver?

ShapeDiver is a cloud-based platform that allows users to upload and share parametric 3D models online. It is particularly useful for those working with Grasshopper, a visual programming language used in Rhino 3D. ShapeDiver enables designers, architects, and engineers to showcase and interact with their parametric models through a web browser without needing to install any software.

You can read more about ShapeDiver [here](https://shapediver.com/)!

### What is WebGi? What is iJewel3d?

WebGi is a powerful JavaScript library designed for rendering high-performance, interactive 3D graphics directly in web browsers. Built on top of [three.js](https://threejs.org/), it aims to simplify the creation of complex 3D scenes and experiences on the web, making it easier for developers to integrate advanced 3D visuals into websites.

iJewel3d is a company specifically tailored for the jewelry industry. This company (formerly named Pixotronics) developed WebGi to have a framework that fulfills all their rendering needs.

You can read more about WebGi [here](https://webgi.xyz/)!
And you can read more about iJewel3d [here](https://iJewel3d.com/)!

### ShapeDiver already has a 3D viewer, why use a different one?

Although ShapeDiver already provides a 3D viewer, rendering jewelry is complex and requires significant refinement. Since ShapeDiver focuses on various areas (such as AEC, furniture, and more) and iJewel3d already provides excellent results, it was decided to substitute ShapeDiver's rendering with iJewel3d's rendering for selected projects.

## Usage

### Headless ShapeDiver

For this example, only the references to the geometry from ShapeDiver are needed, which are then loaded by WebGi. Therefore, the ShapeDiver Viewer API is used in a headless mode. (Note: Although it is called the ShapeDiver Viewer API, in its headless version, there is no Viewer preset.)

In the example, a plugin has been created that can be integrated into WebGi to create a session and process the data that has changed after updates (customizations).

### WebGi

From the WebGi side, mostly just the rendering is used to display the geometry coming from ShapeDiver. For this purpose, a viewer is created, and several plugins are loaded to create the best rendering experience.

### Materials

To define preset materials and allow for easy exchanges, a system for the assignment of materials was implemented:
1. If an output called `MaterialDatabase` is present on the ShapeDiver side, its contents are loaded. If the name of a material within the loaded geometry matches an entry in this database, the material from the database is assigned.
2. If the name of a material within the loaded geometry matches an entry in the static database (defined within the code), the material from the static database is assigned. (If no material was found in step 1)
3. If no materials are found in these databases, the material will be left untouched.

Material definitions can be created by visiting the [iJewel3d playground](https://playground.ijewel3d.com/). You can load a test model there and assign edit the materials (or assign new ones). Once you are content, you can export the material as a JSON by clicking on `Download pmat` (or `Download dmat` for gem stones) on the right side of the UI while the object is selected. Then you can copy that material definition either into the Grasshopper file that is used, or in the static material definition. If you store the material definition with the same name that the material of the geometry has, the new material definition will be assigned. 

## Setup

First, install the dependencies:
```bash
npm install

```

To run the project in development mode:
```bash
npm start
```
Then navigate to http://localhost:3000/index.html in a web browser to see the default scene in the viewer.

To build the project for production:
```bash
npm run build
```

## Integration into existing projects

As you might want to integrate this workflow into existing ShapeDiver projects, here are some pointers on how to do that, but this might differ, depending on your current implementation.
- The code in the `index.ts` file is the entry point and can be used as a guide on how to initialize the WebGi viewer.
- Replace the `ticket` and `modelViewUrl` that are used as an input to the `ShapeDiverSessionPlugin` with your own `ticket` and `modelViewUrl`. These can be found on the model page on the platform.
- The `ShapeDiverSessionPlugin.ts` can be copied as is, depending on your needs, you can do the same for the `staticMaterialDatabase.ts` or just empty the example contents.