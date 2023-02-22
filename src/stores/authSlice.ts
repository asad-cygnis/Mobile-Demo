import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import {
    SignInApiResponseModel,
    User,
} from 'models/api_responses/SignInApiResponseModel'
import AuthStorage from 'repo/auth/AuthStorage'
import { resetApiClient } from 'repo/Client'
import { AppLog, TAG } from 'utils/Util'

export interface AuthState {
    user: User | undefined
}

const initialState: AuthState = {
    user: undefined,
}

export const authSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser: (
            state,
            { payload }: PayloadAction<SignInApiResponseModel>
        ) => {
            let user = payload
            state.user = user.data
            AuthStorage.storeUser(user)

            const token = user.data.access_token

            AppLog.log(
                () => 'Resetting Authorization Token: ' + token,
                TAG.AUTHENTICATION
            )

            resetApiClient(token)

            // PushNotification.registerUser(user.id);
            // PushNotification.registerUser(user.data.id);
        },
        logOut: (state) => {
            // PushNotification.unRegisterUser();
            state.user = undefined
            AuthStorage.removeUser(() => resetApiClient())
            // PushNotification.unRegisterUser();
        },
        setApiClient: (state, { payload }: PayloadAction<string>) => {
            AppLog.log(
                () => 'Resetting Authorization Token: ' + payload,
                TAG.AUTHENTICATION
            )
            resetApiClient(payload)
        },
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        updateUserProfile: (state, { payload }: PayloadAction<User>) => {
            state.user = { ...state.user, ...payload }
            AuthStorage.storeProfileInCurrentUser({ ...state.user, ...payload })
        },
    },
})

// Action creators are generated for each case reducer function
export const { setUser, logOut, updateUserProfile, setApiClient } =
    authSlice.actions

export default authSlice.reducer
