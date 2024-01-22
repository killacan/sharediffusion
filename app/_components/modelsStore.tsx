import { create } from "zustand";


export interface Post {
    post_id: number,
    title: string,
    description: string,
    user_id: string,
}

interface ModelsState {
    models: Post[],
    setModels: (models: Post[]) => void,
}

export const modelsState = create<ModelsState>()(
    (set) => ({
        models: [],
        setModels: (models: Post[]) => set({ models })
    })
)