import { RouteProp, useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack'
import { STRINGS } from 'config'
import { useAuth, usePreventDoubleTap } from 'hooks'
import { useAppDispatch } from 'hooks/redux'
import { SignInApiRequestModel } from 'models/api_requests/SignInApiRequestModel'
import React, {
    FC,
    useCallback,
    useLayoutEffect,
    useRef,
    useState,
} from 'react'
import { useAuthApis } from 'repo/auth/AuthApis'
import { AuthStackParamList } from 'routes'
import { setUser } from 'stores/authSlice'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import CustomAlertWithTitleAndMessage from 'ui/components/organisms/app_popup/CustomAlertWithTitleAndMessage'
import { LoginView } from 'ui/screens/auth/login/LoginView'

type LoginNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>

// eslint-disable-next-line @typescript-eslint/no-unused-vars
type LoginScreenProps = RouteProp<AuthStackParamList, 'Login'>

type Props = {}

const LoginController: FC<Props> = () => {
    const requestModel = useRef<SignInApiRequestModel>()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const auth = useAuth()

    const [shouldShowErrorDialog, setShouldShowErrorDialog] = useState(false)

    const navigation = useNavigation<LoginNavigationProp>()

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { request: signInRequest, loading, error } = useAuthApis().signIn
    const dispatch = useAppDispatch()

    const handleSignIn = usePreventDoubleTap(async () => {
        // if (requestModel.current === undefined) {
        //     return
        // }
        // const { hasError, dataBody } = await signInRequest(requestModel.current)
        // if (hasError || dataBody === undefined) {
        //     setShouldShowErrorDialog(true)
        //     return
        // } else {
        //     dispatch(setUser(dataBody.data))
        //     // await auth.setApiClient(dataBody.data.access_token);
        //     // await auth.logIn(dataBody);
        // }

        dispatch(
            setUser({
                data: {
                    id: -1,
                    access_token: 'v387y8923nbn543fdh24-b565453',
                },
                message: 'User Login Successfully',
            })
        )
    })

    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: () => (
                <HeaderTitle
                    text={STRINGS.login.title}
                    shouldTruncate={false}
                />
            ),
        })
    }, [navigation])

    const openSignUpScreen = useCallback(() => {
        navigation.navigate('SignUp')
    }, [navigation])

    return (
        <>
            <LoginView
                signIn={(values) => {
                    requestModel.current = {
                        ...values,
                    }
                    handleSignIn()
                }}
                shouldShowProgressBar={loading}
                openSignUpScreen={openSignUpScreen}
            />
            <CustomAlertWithTitleAndMessage
                title={'Unable to Sign In'}
                message={error ?? 'N/A'}
                shouldShow={shouldShowErrorDialog}
                hideDialogue={() => setShouldShowErrorDialog(false)}
            />
        </>
    )
}

export default LoginController
