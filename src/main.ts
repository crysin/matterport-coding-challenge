import { CubeScene } from './scenes/cubeScene';
import './style.css';
import '@matterport/webcomponent';
import { RandomSweep } from './sweep-behaviors/randomSweep';

const viewer = document.querySelector<MatterportViewer>('matterport-viewer');

const main = async () => {
  if (viewer) {
    const mpSdk = await viewer.sdkPromise;
    // Create stateful scene class to hold references from matterport scene
    const scene = new CubeScene(mpSdk);
    // Create a stateful sweep class to hold references from observables
    const randomSweep = new RandomSweep.Sweep(mpSdk);
    await scene.create();
    scene.addCube('clickable_cube');
    // Looking through docs couldn't find a documented way to do a path binding between clicking an object and invoking a sweep
    // using spy to monitor clicks
    scene.onCubeClicked('clickable_cube', () => randomSweep.sweep());
    scene.start();
  }
};
main();
