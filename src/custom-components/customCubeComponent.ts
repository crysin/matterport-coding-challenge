import  { Scene } from "@matterport/webcomponent";
/**
 * A custom cube component that emits when it was clicked
 */
export class CustomCubeComponent {
    public inputs: Record<string, unknown> | undefined;
    public outputs: Record<string, unknown> & Scene.PredefinedOutputs | undefined;
    public events: Record<string, boolean> | undefined;
    public context: Scene.IComponentContext | undefined;
    public emits: Record<string, boolean>;
    private material: THREE.Material | undefined;

    public componentType = 'cube';
    
    public constructor() {
        this.events = {
            // There is a typed enum for this event but it's not exported?
            ["INTERACTION.CLICK"]: true,
        }
        this.emits = {
            clicked: true
        }
    }

    public onInit(): void {
        var THREE = this.context!.three;
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        this.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
        var mesh = new THREE.Mesh( geometry, this.material );

        this.outputs!.objectRoot = mesh;   // gets added to the scene node
        this.outputs!.collider = mesh;     // will now be part of raycast testing
    }

    //stub, will get replaced by Matterport at
    public notify(eventType: string, eventData?: unknown): void {

    }

    public onEvent(eventType: string) {
        if (eventType === "INTERACTION.CLICK") {
            this.notify('clicked');
        }
    }

    public onDestroy(): void {
        this.material?.dispose();
    }
}