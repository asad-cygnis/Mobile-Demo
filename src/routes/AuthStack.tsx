import { createStackNavigator } from '@react-navigation/stack'

export type AuthStackParamList = {
    Login: undefined
    SignUp: undefined
}

export const AuthStack = createStackNavigator<AuthStackParamList>()
