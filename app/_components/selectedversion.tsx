'use client'

import { create } from "zustand";

interface SelectedVersionState {
    selectedVersion: {
        version_magnet: string,
        version_desc: string,
        name: string,
        post_id?: number,
        user_id?: string,
    },
    setSelectedVersion: (version: any) => void,
}

export const selectedVersionStore = create<SelectedVersionState>((set) => ({
  selectedVersion: {
    version_magnet: "",
    version_desc: "",
    name: "",
  },
  setSelectedVersion: (version: any) => set({
    selectedVersion: version
  })
}));