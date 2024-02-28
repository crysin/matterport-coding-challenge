import './style.css';
import '@matterport/webcomponent';

const viewer = document.querySelector<MatterportViewer>('matterport-viewer');
if (viewer) {
  viewer.addEventListener('mpSdkPlaying', evt => {
    const mpSdk = evt.detail.mpSdk;
    mpSdk.Camera.rotate(90, 0);
  })
}

const main = async () => {
  if (viewer) {
    const mpSdk = await viewer.playingPromise
    //  mpSdk.Camera.rotate(90, 0);
  }
}
main();
