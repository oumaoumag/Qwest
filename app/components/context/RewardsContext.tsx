import { createContext, useContext, useState } from "react";

type RewardsContextType = {
    points: number;
    addPoints: (points: number) => void;
};
