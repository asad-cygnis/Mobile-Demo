import React, { FC } from 'react'
import { usePreferredTheme } from 'hooks'
import HeaderTitle from 'ui/components/headers/header_title/HeaderTitle'
import { HomeStack } from './HomeStack'
import HomeController from 'ui/screens/home/HomeController'

type Props = {
    initialRouteName: 'Home'
}

export const HomeRoutes: FC<Props> = ({ initialRouteName }) => {
    const { themedColors } = usePreferredTheme()
    return (
        <HomeStack.Navigator
            initialRouteName={initialRouteName}
            screenOptions={{
                headerTitleAlign: 'center',
                headerStyle: {
                    backgroundColor: themedColors.primaryColor,
                },
            }}
        >
            <HomeStack.Screen
                name="Home"
                component={HomeController}
                options={{
                    headerTitle: () => <HeaderTitle text={'home'} />,
                }}
            />
        </HomeStack.Navigator>
    )
}
