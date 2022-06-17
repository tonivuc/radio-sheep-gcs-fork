import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Feature, FeatureCollection, Point} from "geojson";

const USE_ONLY_EVERY_10TH_MEASUREMENT = true;

const sheepRttPoints = createSlice({
    name: 'sheepRttPoints',
    initialState: {value: <FeatureCollection<Point>> {type: "FeatureCollection", features: []}},
    reducers: {
        storeSheepRttPoint: (state, action: PayloadAction<Feature<Point>>) => {
            const index = state.value.features.findIndex(({id}) => id === action.payload.id)
            const features = state.value.features.slice();
            if (index === -1) {
                features.push(action.payload)
            } else {
                features[index] = action.payload
            }
            state.value = {
                type: 'FeatureCollection',
                features,
            }
        },
        setSheepRttPoints: (state, action: PayloadAction<FeatureCollection<Point>>) => {
            if (USE_ONLY_EVERY_10TH_MEASUREMENT) {
                const allRTTPoints = action.payload
                const every10thRTTMeasurement = onlyEver10thMeasurement(allRTTPoints)
                state.value = {type: "FeatureCollection", features: every10thRTTMeasurement};
            }
            else {
                
                state.value = action.payload;
            }
        },
        removeSheepRttPoints: (state) => {
            state.value = {type: "FeatureCollection", features: []};
        },
    },
});

function onlyEver10thMeasurement(allRTTPoints : FeatureCollection<Point>) {
    const rttPointsSplitIntoArrays = splitIntoArrayForEachTagID(allRTTPoints);
    return getEvery10thMeasurement(rttPointsSplitIntoArrays);
}

function splitIntoArrayForEachTagID(allRTTPoints : FeatureCollection<Point>): Map<number, Feature<Point>[]> {
    const filteredPoints:  Feature<Point>[] = allRTTPoints.features;
    const rttPointsSortedBySheepId = new Map<number, Feature<Point>[]>();
    filteredPoints.forEach((point) => {
        if (rttPointsSortedBySheepId.has(point?.properties?.tid)) {
            rttPointsSortedBySheepId.get(point?.properties?.tid)!.push(point)
        }
        else {
            rttPointsSortedBySheepId.set(point?.properties?.tid,[point])
        }
    })
    return rttPointsSortedBySheepId;
}

function getEvery10thMeasurement(rttPointsInArrays : Map<number, Feature<Point>[]>) {
    const newArray: Feature<Point>[] = [];
    rttPointsInArrays.forEach((keyValue) => {
        let counter = 0;
        keyValue.forEach((feature) => {
            if (counter % 10 === 0) { //For every 10th measurement
                newArray.push(feature);
            }
            counter++;
        })
    })
    return newArray.sort(sortById);
}

function sortById(a: Feature<Point>, b: Feature<Point>) { 
    return Number(a?.id) - Number(b?.id);
}

export const {storeSheepRttPoint, setSheepRttPoints, removeSheepRttPoints} = sheepRttPoints.actions;

export default sheepRttPoints.reducer;

export const selectSheepRttPoints = (state: RootState) => state.sheepRttPoints.value;
