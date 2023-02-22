import { ApiResponse } from 'apisauce'
import { ApiErrorResponseModel } from 'models/api_responses/ApiErrorResponseModel'
import { PaginationParamsModel } from 'hooks/usePaginatedApi/PaginationParamsModel'
import { useRef, useState } from 'react'
import { AppLog, TAG } from 'utils/Util'

export type ApiMethodType<T, U, V> =
    | ((args: T, params?: PaginationParamsModel) => Promise<ApiResponse<U, V>>)
    | ((params?: PaginationParamsModel) => Promise<ApiResponse<U, V>>)

export const useApi = <
    T,
    U,
    V extends ApiErrorResponseModel = ApiErrorResponseModel
>(
    apiFunc: ApiMethodType<T, U, V>,
    shouldChangeLoadingStatusUponSuccessfullCompletion: boolean = true
) => {
    const [data, setData] = useState<U | undefined>(undefined)
    const [error, setError] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState(false)

    type RequestReturnType =
        | {
              hasError: false
              errorBody?: undefined
              dataBody: U
          }
        | {
              hasError: true
              errorBody: string
              dataBody?: undefined
          }

    const request = async (
        args: T,
        params?: PaginationParamsModel,
        shouldUpdateStates: boolean = true
    ): Promise<RequestReturnType> => {
        if (shouldUpdateStates) {
            setLoading(true)
            setError(undefined)
        }

        AppLog.log(() => 'Request Body:', TAG.API)
        AppLog.log(() => JSON.stringify(args), TAG.API)

        let response: any
        try {
            response = await apiFunc(args, params)
        } catch (e) {
            AppLog.bug('Error while calling apiFunc(...args): ')
            AppLog.bug(e)
        }

        AppLog.log(() => 'Response Body:', TAG.API)
        AppLog.log(
            () => response?.config?.url + ': ' + JSON.stringify(response),
            TAG.API
        )

        if (!response?.ok) {
            // move user to login screen if the token has expired
            let errorBody: string
            if (response?.status === 401) {
                errorBody = 'Token expired'
            } else {
                errorBody =
                    response?.data?.message ??
                    response?.originalError?.message ??
                    'An unexpected error occurred.'
            }
            if (shouldUpdateStates) {
                setError(errorBody)
                setLoading(false)
            }
            return { hasError: true, errorBody }
        } else {
            let dataBody = response.data
            dataBody = { data: dataBody }
            if (shouldUpdateStates) {
                setData(dataBody)
                if (shouldChangeLoadingStatusUponSuccessfullCompletion) {
                    setLoading(false)
                }
            }
            return { hasError: false, dataBody }
        }
    }

    const result = useRef({ data, error, loading, request })
    Object.assign(result.current, { data, error, loading, request })
    return result.current
}
