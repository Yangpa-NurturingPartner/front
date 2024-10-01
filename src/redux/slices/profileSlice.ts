import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Profile 인터페이스 정의
export interface Profile {
    childId: number;
    name: string;
    sex: number;
    birthdate: string;
    imageProfile: string;
}

// ProfileState 인터페이스 정의
export interface ProfileState {
    profiles: Profile[];
    selectedProfile: Profile | null;
}

// 초기 상태 설정
const initialState: ProfileState = {
    profiles: [],
    selectedProfile: null,
};

const profileSlice = createSlice({
    name: 'profile',
    initialState,
    reducers: {
        setProfiles: (state, action: PayloadAction<Profile[]>) => {
            state.profiles = action.payload;
        },
        setSelectedProfile: (state, action: PayloadAction<Profile | null>) => {
            state.selectedProfile = action.payload;
        },
        clearProfile: (state) => {
            state.selectedProfile = null;
        },
    },
});

export const { setProfiles, setSelectedProfile, clearProfile } = profileSlice.actions;
export default profileSlice.reducer;
