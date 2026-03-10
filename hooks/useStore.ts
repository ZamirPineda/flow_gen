import { create } from 'zustand';

interface AppState {
    is3DMode: boolean;
    toggle3DMode: () => void;
}

export const useStore = create<AppState>((set) => ({
    is3DMode: false,
    toggle3DMode: () => set((state) => ({ is3DMode: !state.is3DMode })),
}));
