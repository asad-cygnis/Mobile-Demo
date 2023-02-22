import { StackNavigationProp } from '@react-navigation/stack'
import React, { FC, useRef } from 'react'
import { Alert, Keyboard } from 'react-native'
import { AuthStackParamList } from 'routes'
import { useNavigation } from '@react-navigation/native'
import { usePreventDoubleTap } from 'hooks'
import { SignUpView } from './SignUpView'
import { SignUpApiRequestModel } from 'models/api_requests/SignUpRequestModel'
import { useAuthApis } from 'repo/auth/AuthApis'

type SignUpNavigationProp = StackNavigationProp<AuthStackParamList, 'SignUp'>

type Props = {
    navigation: SignUpNavigationProp
}

const SignUpController: FC<Props> = () => {
    const requestModel = useRef<SignUpApiRequestModel>()
    const navigation = useNavigation<SignUpNavigationProp>()

    // // Add no toolbar
    // useLayoutEffect(() => {
    //     navigation.setOptions(NoHeader.create())
    // }, [navigation])

    const showLoginScreen = usePreventDoubleTap(() => {
        Keyboard.dismiss()
        navigation.pop()
        navigation.replace('Login')
    })

    const { request: signUpRequest } = useAuthApis().signUp

    const handleSendEmail = usePreventDoubleTap(async () => {
        if (requestModel.current === undefined) {
            return
        }

        const { hasError, errorBody, dataBody } = await signUpRequest(
            requestModel.current
        )

        if (hasError || dataBody === undefined) {
            Alert.alert('Please try again', errorBody)
            return
        } else {
            Alert.alert('User signed up successfully')
        }
    })

    return (
        <SignUpView
            sendEmailButtonCallback={(_values) => {
                // requestModel.current = values
                handleSendEmail()
            }}
            shouldShowProgressBar={false}
            openLoginScreen={showLoginScreen}
        />
    )
}

export default SignUpController
