import { fetchWithTimeout } from "./generateRoutine";
import { endpoint } from '../config';

export const getSelectedReport = async (id: number) => {
    const progressId = id;
    try {
        console.log("called");
        const response = await fetchWithTimeout (
            `${endpoint}/report/getReport/${progressId}`,
        {
            method: "GET",
            headers: {
            "Content-Type": "application/json",
            },
        });
    
        if (!response.ok) {
            const errorData = await response.json();
            console.log("ERRRR" + errorData);
            throw new Error(errorData.error || "Fetching exercises failed");
        }
        
        const data = await response.json();
        console.log(data);
        return data;
    } catch (error) {
      console.error("Error fetching exercises:", error);
    }
}