import React from 'react'
import 'react-native-gesture-handler'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppLog, TAG } from 'utils/Util'
import useNotification, { toNotificationData } from 'hooks/useNotification'
import { PushNotification } from 'utils/PushNotification'
import { PushNotificationContext } from 'hooks/usePushNotificationContextToNavigate'
import { SplashView } from 'ui/screens/auth/splash/SplashView'
import { OpenedEvent } from 'react-native-onesignal'
import { Provider } from 'react-redux'
import { store } from 'stores/store'

type Props = {}

const App: React.FC<Props> = () => {
    AppLog.log(() => 'Rendering App...')

    const { data: notificationUpdate, handleNotification } = useNotification()

    const notificationOpenedHandler = (data: OpenedEvent) => {
        AppLog.log(
            () => 'OneSignal: setNotificationOpenedHandler: ' + data,
            TAG.ONE_SIGNAL
        )

        const { additionalData } = data.notification

        handleNotification(toNotificationData(additionalData))
    }

    PushNotification.init(notificationOpenedHandler)

    return (
        <Provider store={store}>
            {/* <AppThemeProvider colorScheme={AppColorScheme.DARK}> */}
            <SafeAreaProvider>
                <PushNotificationContext.Provider value={notificationUpdate}>
                    <SplashView />
                </PushNotificationContext.Provider>
                {/* <SplashView /> */}
            </SafeAreaProvider>
            {/* </AppThemeProvider> */}
        </Provider>
    )
}
export default App
