import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Feature, FeatureCollection, Point} from "geojson";

const USE_ONLY_EVERY_10TH_MEASUREMENT = false;

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
            }
            else {
                console.log(onlyEver10thMeasurement(action.payload));
                state.value = action.payload;
            }
            
        },
        removeSheepRttPoints: (state) => {
            state.value = {type: "FeatureCollection", features: []};
        },
    },
});

function onlyEver10thMeasurement(allRTTPoints : FeatureCollection<Point>) {
    //const filteredPoints:  FeatureCollection<Point> = null;
    const rttPointsSplitIntoArrays = splitIntoArrayForEachTagID(allRTTPoints);
    console.log(rttPointsSplitIntoArrays)
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
        keyValue.forEach((feature, tagId) => {
            if (counter === 0) {
                newArray.push(feature);
                counter++;
            }
            else if (counter === 9) {
                counter = 0;
            }
            else {
                counter++;
            }
        })
    })
    return newArray;
}

export const {storeSheepRttPoint, setSheepRttPoints, removeSheepRttPoints} = sheepRttPoints.actions;

export default sheepRttPoints.reducer;

export const selectSheepRttPoints = (state: RootState) => state.sheepRttPoints.value;
