import React, { FC } from 'react'
import LoginController from 'ui/screens/auth/login/LoginController'
import { AuthStack } from './AuthStack'
import { STRINGS } from 'config'
import { usePreferredTheme } from 'hooks'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { shadowStyleProps } from 'utils/Util'
import SignUpController from 'ui/screens/auth/sign-up/SignUpController'

type Props = {
    initialRouteName: 'Login'
}

export const AuthRoutes: FC<Props> = ({ initialRouteName }) => {
    const { themedColors } = usePreferredTheme()

    return (
        <AuthStack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: themedColors.primaryColor,
                    ...shadowStyleProps,
                    shadowOpacity: 0.2,
                },
            }}
        >
            <AuthStack.Screen
                name="Login"
                component={LoginController}
                options={{
                    headerTitle: () => (
                        <HeaderTitle text={STRINGS.login.title} />
                    ),
                }}
            />
            <AuthStack.Screen
                name="SignUp"
                component={SignUpController}
                options={{
                    headerTitle: () => (
                        <HeaderTitle text={STRINGS.singUp.title} />
                    ),
                }}
            />
        </AuthStack.Navigator>
    )
}
