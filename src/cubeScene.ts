import { MpSdk } from "@matterport/webcomponent";
import { CustomCubeComponent } from "./customCubeComponent";

export class CubeScene {
    private mpSdk: MpSdk;
    private _sceneObject?: MpSdk.Scene.IObject;
    private cubes: Record<string, MpSdk.Scene.IComponent>;
    private paths: Record<string, MpSdk.Scene.EmitPath<unknown>>;

    constructor(mpSdk: MpSdk) {
        this.mpSdk = mpSdk;
        this.cubes = {};
        this.paths = {};
    }

    public get sceneObject(): MpSdk.Scene.IObject | undefined {
        return this._sceneObject;
    }

    public async init() {
        this.registerCustomCubeComponent();

        const [ sceneObject ] = await this.mpSdk.Scene.createObjects(1);
        this._sceneObject = sceneObject;
        this.addLights()
    }

    public start(): void {
        this._sceneObject?.start();
    }

    public onCubeClicked(cubeId: string, callback: () => void): void {
        const outputSpy = {
            path: this.paths[cubeId],
            onEvent() {
                callback();
            }
        };
        this._sceneObject!.spyOnEvent(outputSpy)
    }

    private addLights() {
        const lights = this._sceneObject!.addNode();
        lights.addComponent('mp.lights');
        lights.start();
    }

    public addCube(id: string) {
        console.log('sceneObject', this._sceneObject);
        const modelNode = this._sceneObject!.addNode();
        console.log('modelNode', modelNode)
        const cube = modelNode.addComponent('cube', {visible: true}, id);
        const outputPath = this._sceneObject!.addEmitPath(cube, 'clicked', id);
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