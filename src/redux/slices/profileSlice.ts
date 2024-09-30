import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ProfileState {
    profiles: Array<{
        childId: number;
        name: string;
        sex: number;
        birthdate: string;
        imageProfile: string;
    }>;
    selectedProfile: {
        childId: number;
        name: string;
        sex: number;
        birthdate: string;
        imageProfile: string;
    } | null;
}

const initialState: ProfileState = {
    profiles: [],
    selectedProfile: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfiles: (state, action: PayloadAction<ProfileState['profiles']>) => {
            state.profiles = action.payload;
        },
        setSelectedProfile: (state, action: PayloadAction<ProfileState['selectedProfile']>) => {
            state.selectedProfile = action.payload;
        },
        clearProfile: (state) => {
            state.selectedProfile = null;
        },
    },
});

export const { setProfiles, setSelectedProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
