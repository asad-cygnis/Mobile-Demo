import { SignInApiResponseModel } from 'models/api_responses/SignInApiResponseModel'
import React, { useContext } from 'react'
import AuthStorage from 'repo/auth/AuthStorage'
import { resetApiClient } from 'repo/Client'
import { AppLog, TAG } from 'utils/Util'
import { PushNotification } from 'utils/PushNotification'

type AuthProviderModel = {
    user?: SignInApiResponseModel
    setUser: (user: SignInApiResponseModel | undefined) => void
}

export const AuthContext = React.createContext<AuthProviderModel>({
    setUser: () => {},
})

export default () => {
    const { user, setUser } = useContext<AuthProviderModel>(AuthContext)

    const logIn = async (model: SignInApiResponseModel) => {
        await AuthStorage.storeUser(model)

        const token = model.data.access_token
        AppLog.log(
            () => 'Resetting Authorization Token: ' + token,
            TAG.AUTHENTICATION
        )
        resetApiClient(token)

        // update AuthProvider after everything has been done
        setUser(model)

        PushNotification.registerUser(model.data.id)
    }

    const logOut = () => {
        setUser(undefined)
        AuthStorage.removeUser(() => resetApiClient())
        PushNotification.unRegisterUser()
    }

    const setApiClient = async (accessToken: string) => {
        AppLog.log(
            () => 'Resetting Authorization Token: ' + accessToken,
            TAG.AUTHENTICATION
        )
        resetApiClient(accessToken)
    }

    return { user, logIn, logOut, setApiClient }
}
