import React, { FC } from 'react'

import { HomeView } from './HomeView'

//type HomeNavigationProp = StackNavigationProp<HomeStackParamList, "Home">;

type Props = {}

const HomeController: FC<Props> = () => {
    return <HomeView />
}

export default HomeController
