import { MpSdk } from "@matterport/webcomponent";
import { CustomCubeComponent } from "../custom-components/customCubeComponent";

/**
 * Creates a scene that will allow for custom cubes to be added and reacted to when clicked
 */
export class CubeScene {
    private mpSdk: MpSdk;
    private sceneObject?: MpSdk.Scene.IObject;
    private cubes: Record<string, MpSdk.Scene.IComponent>;
    private paths: Record<string, MpSdk.Scene.EmitPath<unknown>>;

    constructor(mpSdk: MpSdk) {
        this.mpSdk = mpSdk;
        this.cubes = {};
        this.paths = {};
    }

    public async create() {
        // This method could be moved to be called in a static method since it's just registering with Matterport
        // the custom component, only ever needs to be invoked once
        this.registerCustomCubeComponent();

        const [ sceneObject ] = await this.mpSdk.Scene.createObjects(1);
        this.sceneObject = sceneObject;
        this.addLights();
    }

    public start(): void {
        this.sceneObject?.start();
    }

    // Didn't want other components to have direct reference to paths, so using an id that client defines when creating the cube to find reference to path
    // and add a listener for
    public onCubeClicked(cubeId: string, callback: () => void): void {
        const outputSpy = {
            path: this.paths[cubeId],
            onEvent() {
                callback();
            }
        };
        this.sceneObject!.spyOnEvent(outputSpy);
    }

    private addLights() {
        const lights = this.sceneObject!.addNode();
        lights.addComponent('mp.lights');
        lights.start();
    }

    public addCube(id: string) {
        const modelNode = this.sceneObject!.addNode();
        const cube = modelNode.addComponent('cube', {visible: true}, id);
        const outputPath = this.sceneObject!.addEmitPath(cube, 'clicked', id);
        this.cubes[id] = cube;
        this.paths[id] = outputPath;
        modelNode.start();
    }

    private registerCustomCubeComponent() {
        function CubeFactory() {
           return new CustomCubeComponent();
        }
        
        // Registering the component with the sdk
        // Circumventing typescript type checking as Matterport type requirements for Scene.IComponent
        // Matterport requires certain fields to be undefined before being used in addComponent
        this.mpSdk.Scene.register('cube', CubeFactory as any);
   }
}