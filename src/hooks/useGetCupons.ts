import {useMutation} from "@tanstack/react-query";
import {api} from "../api/apiInstance.ts";

export interface CuponsData {
    a100: {
        barcode: string,
        promocode: string
    },
    roust: {
        barcode: string,
        promocode: string
    }
}

interface GetCuponsResponse {
    data: null | CuponsData,
    errors: {
        code: number,
        customData: null | string,
        message: string
    }[],
    status: "error" | "success"
}

export const useGetCupons = () => {
    return useMutation({
        mutationKey: ["get-cupon"],
        mutationFn: async (stage: number) => {
            const formData = new FormData()
            formData.append("stepNumber", stage.toString())

            const response = await api.post<GetCuponsResponse>(`/api/quiz/getCoupon/${stage}/`, formData)
            if (response.data.status === "error") {
                throw new Error(response.data.errors?.[0]?.message ?? "Что-то пошло не так")
            }
            return response.data
        },
        retry: 0,
    })
}