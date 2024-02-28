import { Dictionary, MpSdk, Sweep } from "@matterport/webcomponent";
import { randomInt } from "../utils/mathUtil";

/**
 * Went with vanilla JS and used classes to help isolate state that is updated through observers
 * Exposes a public sweep method that uses the latest emitted info about the user's current floor
 * and available sweeps on that floor and randomly chooses one to switch too
 */
export module RandomSweep {
    export class Sweep {
        private mpSdk: MpSdk;
        private currentSweepObserver: CurrentSweepObserver;
        private currentFloorObserver: CurrentFloorObserver;
        private sweepCollectionObserver: SweepCollectionObserver;

        public constructor(mpSdk: MpSdk) {
            this.mpSdk = mpSdk;
            this.currentSweepObserver = new CurrentSweepObserver();
            this.currentFloorObserver = new CurrentFloorObserver();
            this.sweepCollectionObserver = new SweepCollectionObserver();
            mpSdk.Sweep.current.subscribe(this.currentSweepObserver);
            mpSdk.Sweep.data.subscribe(this.sweepCollectionObserver);
            mpSdk.Floor.current.subscribe(this.currentFloorObserver);
        }

        public sweep() {
            const availableSweeps = this.sweepCollectionObserver.sweepsPerLevel[this.currentFloorObserver.currentFloorId];
            const index = availableSweeps.indexOf(this.currentSweepObserver.currentSweepId, 0);
            let usableSweeps = [...availableSweeps];
            if (index > -1) {
                usableSweeps.splice(index, 1);
            }
            const nextSweepId = usableSweeps[randomInt(0, usableSweeps.length)];
            this.mpSdk.Sweep.moveTo(nextSweepId, {});
        }
    }

    class CurrentSweepObserver {
        public currentSweepId = '';

        public onChanged(sweepdata: MpSdk.Sweep.ObservableSweepData) {
            this.currentSweepId = sweepdata.id;
        }
    }

    class CurrentFloorObserver {
        public currentFloorId = '';

        public onChanged(floordata: MpSdk.Floor.ObservableFloorData) {
            this.currentFloorId = floordata.id ?? '';
        }
    }

    class SweepCollectionObserver {
        public sweepsPerLevel: Record<string, Array<string>> = {};

        onCollectionUpdated(collection: Dictionary<Sweep.ObservableSweepData>): void {
            this.sweepsPerLevel = {};
            for (const [key, item] of collection) {
                if (!item.enabled) {
                    continue;
                }

                if (item.floorInfo.id) {
                    let sweeps = this.sweepsPerLevel[item.floorInfo.id];
                    if (sweeps) {
                        sweeps.push(item.id);
                    } else {
                        sweeps = [item.id];
                        this.sweepsPerLevel[item.floorInfo.id] = sweeps;
                    }
                }
            }
        }
    }
}