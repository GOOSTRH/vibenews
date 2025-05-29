import { create } from 'zustand';

interface StoreState {
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const useStore = create<StoreState>((set) => ({
  selectedCategory: 'all',
  setSelectedCategory: (category) => set({ selectedCategory: category }),
})); 