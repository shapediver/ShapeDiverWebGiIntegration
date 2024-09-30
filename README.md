# ShapeDiver WebGi Integration

This repository contains sample code for using the WebGi rendering engine with ShapeDiver. It serves as an example for creating 3D configurators based on the ShapeDiver geometry backend and the WebGi rendering engine. 

You can see a deployed version of this example here: [https://shapediver.github.io/ShapeDiverWebGiIntegration/](https://shapediver.github.io/ShapeDiverWebGiIntegration/)

Are you looking for support? Please check out your options for getting in touch with us [here](https://help.shapediver.com/doc/community-and-support). 

## Terminology

### What is ShapeDiver?

[ShapeDiver](https://shapediver.com) turns your Grasshopper files into online applications. Safely share your design tools with others without exposing the original code. Easily embed them on any website via an iframe or integrate them with your favorite eCommerce platform or ERP system via our APIs and SDKs. ShapeDiver allows you to manage and enable easy access to your entire library of Grasshopper files from a web browser.

### What is WebGi?

[WebGi](https://webgi.xyz/) is a JavaScript library that allows developers to embed high-fidelity, interactive 3D graphics into web applications. It simplifies the integration of 3D models into websites, enhancing user experience with photorealistic visuals and smooth interactivity. Built on top of [three.js](https://threejs.org/), WebGi ensures efficient and cross-platform rendering of 3D content across different devices and browsers. 

WebGi is developed by [iJewel3d](https://iJewel3d.com/) (formerly known as Pixotronics). 

## Why combine ShapeDiver with WebGi?

ShapeDiver provides a multi-purpose 3D Viewer that offers extensive features for building interactive 3D configurators and web apps. For a complete overview of the ShapeDiver 3D Viewer, please refer to its [documentation](https://help.shapediver.com/doc/viewer). 
Since the ShapeDiver 3D Viewer does not explicitly focus on rendering jewelry, and WebGi provides excellent results, we decided to provide this integration. Note that using WebGi with ShapeDiver requires a separate license. Please [contact us](https://www.shapediver.com/contact) for details. 

## Usage

### Headless ShapeDiver 3D Viewer

This example uses the ShapeDiver 3D Viewer in headless mode: It only uses those parts that communicate with ShapeDiver geometry backend systems and manage parameters and outputs. This reuse of functionality allows for a simple transition between the ShapeDiver Viewer and WebGi because the implementation of the UI stays the same. 

### WebGi

Extensions to WebGi are typically implemented as plugins. Therefore, this integration example provides a plugin called [ShapeDiverSessionPlugin](src/ShapeDiverSessionPlugin.ts) for WebGi that opens a session with a ShapeDiver model and hands over the geometry to be displayed to WebGi. The plugin also updates the scene after parameter changes. 

### Materials

The material definitions used by ShapeDiver and WebGi are similar but different. Material properties assigned to geometry using ShapeDiver's material components in Grasshopper can not be used to define WebGi materials directly. Therefore this 
integration uses the following approach to assign materials to objects by material **name**: 

#### 1. Assign material names in Grasshopper

  * Use the [glTF 2.0 Material component](https://help.shapediver.com/doc/gltf-2-0-material) to assign named materials to your geometric objects. Only the **Name** property of the material is important; all other properties are ignored. 
  * Use the [glTF 2.0 Display component](https://help.shapediver.com/doc/gltf-2-0-display) to output geometry. 

The display component saves the geometry, including its material assignments, to a glTF file, which is exposed on the [Geometry Backend API](https://help.shapediver.com/doc/understanding-the-geometry-backend-api) and loaded by the headless ShapeDiver 3D Viewer. 

#### 2. Use WebGi materials from a database
The [ShapeDiverSessionPlugin](src/ShapeDiverSessionPlugin.ts) assigns WebGi materials to geometric objects based on the names of the materials you assigned to the objects in Grasshopper. For each object, it does the following: 

  * Check if the object is assigned to a material. If not, WebGi renders the objects using a default material.
  * Check if the object's material name is contained in the *dynamic material database*. If so, assign the material. 
  * Check if the object's material name is contained in the *static material database*. If so, assign the material. 

### How to define WebGi materials

You can create WebGi material definitions by using the [iJewel3d playground](https://playground.ijewel3d.com/). Use drag & drop to load a test model in format glTF or 3dm and edit the materials or assign new ones. Once you are done, export the material as a JSON by clicking on `Download pmat` (or `Download dmat` for gem stones) on the right-hand side of the UI while the object is selected. Copy your material definitions into one of the material databases and assign names to them.

### Static material database
The static material database allows to define materials statically, as part of the web application. You can find an example in [staticMaterialDatabase.ts](src/staticMaterialDatabase.ts). The static material database is a dictionary mapping material names to WebGi material definitions.

### Dynamic material database
Optionally you can define a dynamic material database using your Grasshopper model. An example can be found in this Grasshopper model: [materials-json-test.ghx](Grasshopper/materials-json-test.ghx). The dynamic material database is a JSON dictionary mapping material names to WebGi material definitions. 


### Notes about rendering diamonds

WebGi offers caching and optimization possibilities that support rendering models using many gemstones. The caching happens by diamond material name. You can read more about this [here](https://webgi.xyz/docs/industries/jewellery#cachekey-and-normalmapres). These are the most important takeaways: 

  * Use the same diamond material name for stones sharing the same geometry, even if they are placed in different locations of the scene. 
  * Use different material names for stones that are different from each other.

## Limitations

ShapeDiver's 3D Viewer offers [features](https://help.shapediver.com/doc/viewer) that are unavailable when using this integration. This includes the following features: 

  * Augmented reality
  * Interactions (Selection, hovering, dragging)
  * Attribute visualisation
  * HTML anchor elements

## Setup

First, install the dependencies:
```bash
npm install

```

To run the project in development mode use:
```bash
npm start
```
Then navigate to http://localhost:3000/index.html in a web browser to see the default scene in the viewer.

To build the project for production:
```bash
npm run build
```

## Integration into existing projects

Here are some hints on how to integrate this code into existing projects: 

  *  The code in [`index.ts`](src/index.ts) file is the entry point and can be used as a guide on how to initialize the WebGi viewer.
  * Replace the `ticket` and `modelViewUrl` with the correct values for your model. You can find your model's `ticket` and `modelViewUrl` on the view and edit pages of your model on the ShapeDiver Platform.
  * The [ShapeDiverSessionPlugin](src/ShapeDiverSessionPlugin.ts) can be copied as is. Depending on your needs, you can do the same for [staticMaterialDatabase.ts](src/staticMaterialDatabase.ts) or just replace the example materials.
