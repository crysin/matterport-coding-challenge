import { Dictionary, MpSdk, Sweep } from '@matterport/webcomponent';
import { CubeScene } from './cubeScene';
import './style.css';
import '@matterport/webcomponent';
import { randomInt } from './utils/mathUtil';

const viewer = document.querySelector<MatterportViewer>('matterport-viewer');
let currentFloorId = '';
let currentSweepId = '';
let sweepsPerLevel: Record<string, Array<string>>  = {};

const sweepDataObserver = {
  onCollectionUpdated(collection: Dictionary<Sweep.ObservableSweepData>): void {
    sweepsPerLevel = {};
    for (const [key, item] of collection) {
      if (!item.enabled) {
        continue;
      }

      if (item.floorInfo.id) {
        let sweeps = sweepsPerLevel[item.floorInfo.id];
        if (sweeps) {
          sweeps.push(item.id);
        } else {
          sweeps = [item.id];
          sweepsPerLevel[item.floorInfo.id] = sweeps;
        }
      }
      console.log(`the collection contains ${item} at the index ${key}`);
    }
  }
}

const floorObserver = (floordata: MpSdk.Floor.ObservableFloorData) => {
  currentFloorId = floordata.id ?? '';
}

const sweepObserver = (sweepdata: MpSdk.Sweep.ObservableSweepData) => { 
  currentSweepId = sweepdata.id;
}

const sweep = (mpSdk: MpSdk) => {
  const availableSweeps = sweepsPerLevel[currentFloorId];
  const index = availableSweeps.indexOf(currentSweepId, 0);
  let usableSweeps = [...availableSweeps];
  if (index > -1) {
    usableSweeps.splice(index, 1);
  }
  const nextSweepId = usableSweeps[randomInt(0, usableSweeps.length)];
  mpSdk.Sweep.moveTo(nextSweepId, {});
}

const main = async () => {
  if (viewer) {
    const mpSdk = await viewer.sdkPromise;
    mpSdk.Sweep.current.subscribe(sweepObserver)
    mpSdk.Sweep.data.subscribe(sweepDataObserver)
    mpSdk.Floor.current.subscribe(floorObserver);
    const scene = new CubeScene(mpSdk);
    await scene.init();
    scene.addCube('clickable_cube');
    scene.onCubeClicked('clickable_cube', () => sweep(mpSdk));
    scene.start();
  }
};
main();
