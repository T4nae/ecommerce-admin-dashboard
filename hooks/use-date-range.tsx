import { DateRange } from "react-day-picker";
import { create } from "zustand";

interface useStore {
    date: DateRange | undefined;
    setDate: (date: DateRange | undefined) => void;
}

export const useDateRange = create<useStore>((set, get) => ({
    date: undefined,
    setDate: (date) => set({ date: date }),
}));
