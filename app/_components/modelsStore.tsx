import { create } from "zustand";
import { persist } from 'zustand/middleware';

interface Picture {
    picture_id: number,
    post_id: number,
    url: string,
    file_name: string,
    nsfw: boolean,
    upload_date: string,
}

export interface Post {
    post_id: number,
    title: string,
    description: string,
    user_id: string,
    updated_at: string,
    upload_date: string,
    pictures?: Picture[],
}

interface ModelsState {
    models: Post[],
    setModels: (models: Post[]) => void,
    addModels: (models: Post[]) => void,
    clearModels: () => void,
}

export const modelsState = create<ModelsState>()(persist(
    (set) => ({
        models: [],
        setModels: (models: Post[]) => set({ models }),
        addModels: (models: Post[]) => set((state) => ({ models: [...state.models, ...models] })),
        clearModels: () => set({ models: [] }),
    }),
    {
        name: 'models',
    }
))