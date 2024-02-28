import { MpSdk } from '@matterport/webcomponent';
import './style.css';
import '@matterport/webcomponent';
import { setupThreeScene } from './setupThree';

const viewer = document.querySelector<MatterportViewer>('matterport-viewer');

const main = async () => {
  if (viewer) {
    const mpSdk = await viewer.sdkPromise;
    setupThreeScene(mpSdk);
    //const mpSdk = await viewer.playingPromise
    //  mpSdk.Camera.rotate(90, 0);
  }
};
main();
