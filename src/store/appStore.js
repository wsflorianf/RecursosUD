import {create} from 'zustand';

const useAppStore = create((set) => ({
  barOptions: {message: "", color: 'gray'},
  setBarOptions: (newOptions) => {
    set({ barOptions: newOptions });
    setTimeout(() => {
      set({ barOptions: {message: "", color: 'gray'} });
    }, 3000);
  },
  loading: false,
  setLoading: (newState) => set({ loading: newState }),
}));

export default useAppStore;