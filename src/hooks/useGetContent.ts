import {useQuery} from "@tanstack/react-query";
import {api} from "../api/apiInstance.ts";

export type GetContentResponse = {
    data: {
        headTitle: string,
        firstTask: {
            firstTaskBtn: string,
            firstTaskFooter: string,
            firstTaskResults: {
                firstTaskResultsA100Footer: string,
                firstTaskResultsA100Title: string,
                firstTaskResultsBtn: string,
                firstTaskResultsRoastFooter: string,
                firstTaskResultsRoastTitle: string,
                firstTaskResultsTitle: string
            },
            firstTaskTitle: string
        },
        fourthTask: {
            fourthTaskBtn: string,
            fourthTaskFooter: string,
            fourthTaskResult: {
                fourthTaskResultA100Title: string,
                fourthTaskResultTitle: string,
                fourthTaskResultsA100Footer: string,
                fourthTaskResultsBtn: string,
                fourthTaskResultsRoastFooter: string,
                fourthTaskResultsRoastTitle: string
            },
            fourthTaskTitle: string
        },
        secondTask: {
            secondTaskBtn: string,
            secondTaskFooter: string,
            secondTaskResult: {
                secondTaskResultA100Title: string,
                secondTaskResultTitle: string,
                secondTaskResultsA100Footer: string,
                secondTaskResultsBtn: string,
                secondTaskResultsRoastFooter: string,
                secondTaskResultsRoastTitle: string
            },
            secondTaskTitle: string
        },
        thirdTask: {
            thirdTaskBtn: string,
            thirdTaskFooter: string,
            thirdTaskResult: {
                thirdTaskResultA100Title: string,
                thirdTaskResultTitle: string,
                thirdTaskResultsA100Footer: string,
                thirdTaskResultsBtn: string,
                thirdTaskResultsRoastFooter: string,
                thirdTaskResultsRoastTitle: string
            },
            thirdTaskTitle: string
        },
        mainPage: {
            mainButton: string,
            mainFooter: string,
            mainSubSubTitle: string,
            mainSubTitle: string,
            mainTitle: string
        }
    }
}

export const useGetContent = () => {
    return useQuery({
        queryKey: ["get-content"],
        queryFn: () => api.post<GetContentResponse>("/api/quiz/getContent/"),
        retry: 0,
        gcTime: Infinity,
        staleTime: Infinity,
        select: response => response.data.data
    })
}