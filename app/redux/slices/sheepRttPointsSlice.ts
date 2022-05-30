import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {RootState} from '../store';
import {Feature, FeatureCollection, Point} from "geojson";
import { isValid } from 'date-fns';

const isValidRTTMeasurement = (point: Feature<Point>): boolean => {
    const rssi = point?.properties?.rssi
    if (typeof rssi == 'number' && rssi != 0) {
        return true;
    }
    return false;
  };

const sheepRttPoints = createSlice({
    name: 'sheepRttPoints',
    initialState: {value: <FeatureCollection<Point>> {type: "FeatureCollection", features: []}},
    reducers: {
        storeSheepRttPoint: (state, action: PayloadAction<Feature<Point>>) => {
            if (isValidRTTMeasurement(action.payload)) {
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
            }
            else {
                //Do nothin brah
                console.log("Corrupted RTT measurement received, not storing.");
            }
        },
        setSheepRttPoints: (state, action: PayloadAction<FeatureCollection<Point>>) => {
            state.value = action.payload;
        },
        removeSheepRttPoints: (state) => {
            state.value = {type: "FeatureCollection", features: []};
        },
    },
});

export const {storeSheepRttPoint, setSheepRttPoints, removeSheepRttPoints} = sheepRttPoints.actions;

export default sheepRttPoints.reducer;

export const selectSheepRttPoints = (state: RootState) => state.sheepRttPoints.value;

export const selectValidRttPoints = (state: RootState) => {
    const oldPoints = state.sheepRttPoints.value;
    const filteredPoints = oldPoints.features.filter(point => isValidRTTMeasurement(point));
    return ({
        type: "FeatureCollection",
        features: filteredPoints
    })
}


