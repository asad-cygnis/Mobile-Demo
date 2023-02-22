import { API } from 'config'
import { useApi } from 'hooks/useApi'
import { SignInApiRequestModel } from 'models/api_requests/SignInApiRequestModel'
import { SignUpApiRequestModel } from 'models/api_requests/SignUpRequestModel'
import { SignInApiResponseModel } from 'models/api_responses/SignInApiResponseModel'
import { SignUpApiResponseModel } from 'models/api_responses/SignUpApiResponseModel'
import { apiClient } from 'repo/Client'

function signIn(requestModel: SignInApiRequestModel) {
    return apiClient.post<SignInApiResponseModel>(
        API.LOGIN_URL,
        JSON.stringify(requestModel)
    )
}

function signUp(requestModel: SignUpApiRequestModel) {
    return apiClient.post<SignUpApiResponseModel>(
        API.SIGN_UP_URL,
        JSON.stringify(requestModel)
    )
}

export const useAuthApis = () => {
    return {
        signIn: useApi(signIn),
        signUp: useApi(signUp),
    }
}
