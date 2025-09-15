import { useContext } from "react";
import { NoDark } from "../Context/Darkmode/DarkmodeContext";

export default function useNoDark() {
    return useContext(NoDark);
}
