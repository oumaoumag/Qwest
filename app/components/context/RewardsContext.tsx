import { createContext, useContext, useState } from "react";

type RewardsContextType = {
    points: number;
    addPoints: (points: number) => void;
};

const RewardsContext = createContext<RewardsContextType | undefined>(undefined);

export function RewardsProvider({ children }: { children: React.ReactNode }) {
    const [points, setPoints] = useState(0);
}