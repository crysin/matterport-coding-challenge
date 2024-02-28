import { MpSdk } from "@matterport/webcomponent";
import { CustomCubeComponent } from "./customCubeComponent";

export const setupThreeScene = async (mpSdk: MpSdk) => {
    registerCustomCubeComponent(mpSdk);

    const [ sceneObject ] = await mpSdk.Scene.createObjects(1);
    addLights(sceneObject)
    addCube(sceneObject);
    sceneObject.start();
};

function registerCustomCubeComponent(mpSdk: MpSdk) {
     function CubeFactory() {
        return new CustomCubeComponent();
     }
     
     // Registering the component with the sdk
     // Circumventing typescript type checking as Matterport type requirements for Scene.IComponent
     // Matterport requires certain fields to be undefined before being used in addComponent
     mpSdk.Scene.register('cube', CubeFactory as any);
}

function addLights(sceneObject: MpSdk.Scene.IObject) {
    const lights = sceneObject.addNode();
    lights.addComponent('mp.lights');
    lights.start();
}

function addCube(sceneObject: MpSdk.Scene.IObject) {
    const modelNode = sceneObject.addNode();
    const component = modelNode.addComponent('cube', {visible: true});
    modelNode.start();
}