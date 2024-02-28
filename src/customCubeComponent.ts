import { Scene } from "@matterport/webcomponent";

export class CustomCubeComponent {
    public inputs: Record<string, unknown> | undefined;
    public outputs: Record<string, unknown> & Scene.PredefinedOutputs | undefined;
    public events: Record<string, boolean> | undefined;
    public context: Scene.IComponentContext | undefined;
    private material: THREE.Material | undefined;

    public componentType = 'cube';
    
    public onInit(): void {
        var THREE = this.context!.three;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var mesh = new THREE.Mesh( geometry, this.material );

        this.outputs!.objectRoot = mesh;   // gets added to the scene node
        this.outputs!.collider = mesh;     // will now be part of raycast testing
    }

    public onDestroy(): void {
        this.material?.dispose();
    }
}