import { NavigationContainer } from '@react-navigation/native'
import { COLORS, FONT_SIZE, SPACE } from 'config'
import Strings from 'config/Strings'
import Env from 'envs/env'
import { usePreferredTheme } from 'hooks'
import { useAppDispatch, useAppSelector } from 'hooks/redux'
import { SignInApiResponseModel } from 'models/api_responses/SignInApiResponseModel'
import React, { useEffect, useState } from 'react'
import {
    ActivityIndicator,
    Alert,
    BackHandler,
    Linking,
    StyleSheet,
    View,
} from 'react-native'
import VersionCheck from 'react-native-version-check'
import AuthStorage from 'repo/auth/AuthStorage'
import { AuthRoutes } from 'routes'
import { HomeRoutes } from 'routes/HomeRoutes'
import { setUser } from 'stores/authSlice'
import { RootState } from 'stores/store'
import { AppLabel, TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import { AppLog, TAG } from 'utils/Util'

interface Props {}

export const SplashView = React.memo<Props>(() => {
    AppLog.log(() => 'Rendering SplashView...')
    const { user } = useAppSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    const [isReady, setIsReady] = useState(false)

    const restoreUser = async () => {
        const _user: SignInApiResponseModel | undefined =
            await AuthStorage.getUser()
        if (_user) {
            dispatch(setUser(_user))
        }
    }

    async function versionCheckLibraryImpl(): Promise<{
        isNeeded: boolean
        storeUrl: string
    }> {
        let versionCheckNeedUpdate: any
        const noStoreUrlFound = {
            isNeeded: false,
            storeUrl: 'N/A',
        }
        try {
            versionCheckNeedUpdate =
                (await VersionCheck.needUpdate()) ?? noStoreUrlFound
        } catch (e) {
            // in case of no store url found
            AppLog.log(
                () => 'Exception occurred.. No store url found..',
                TAG.VERSION_CHECK
            )
            versionCheckNeedUpdate = noStoreUrlFound
        }

        AppLog.log(
            () =>
                'versionCheckNeedUpdate: ' +
                JSON.stringify(versionCheckNeedUpdate),
            TAG.VERSION_CHECK
        )
        return versionCheckNeedUpdate
    }

    async function checkForForcedUpdate() {
        return await versionCheckLibraryImpl()
    }

    function showForcedUpdateDialog(storeUrl: string) {
        Alert.alert(
            'Update available',
            'It looks like you are using an older version of our app. Please update to continue.',
            [
                {
                    text: 'Update',
                    onPress: () => {
                        BackHandler.exitApp()
                        Linking.openURL(storeUrl)
                    },
                },
            ]
        )
    }

    async function initializeApp() {
        let { isNeeded, storeUrl } = await checkForForcedUpdate()
        if (isNeeded && Env.SHOULD_ENABLE_FORCE_UPDATE) {
            showForcedUpdateDialog(storeUrl)
        } else {
            if (!isReady) {
                setTimeout(() => {
                    restoreUser().then(() => {
                        AppLog.log(() => 'Logging in...', TAG.AUTHENTICATION)
                        setIsReady(true)
                    })
                }, 2000)
            }
        }
    }

    useEffect(() => {
        initializeApp()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const theme = usePreferredTheme()

    if (!isReady) {
        return (
            <Screen style={styles.container} shouldAddBottomInset={false}>
                <View style={[styles.container]}>
                    <AppLabel
                        text={Strings.appTitle}
                        style={styles.label}
                        textType={TEXT_TYPE.SEMI_BOLD}
                    />
                    <ActivityIndicator
                        style={[styles.loaderContainer]}
                        size="small"
                        color={theme.themedColors.interface['500']}
                    />
                </View>
            </Screen>
        )
    }

    return (
        <NavigationContainer>
            {AppLog.log(
                () => 'User exists: ' + (user !== undefined),
                TAG.AUTHENTICATION
            )}
            {AppLog.log(
                () => 'user: ' + JSON.stringify(user),
                TAG.AUTHENTICATION
            )}
            {user !== undefined ? (
                <HomeRoutes initialRouteName="Home" />
            ) : (
                <AuthRoutes initialRouteName={'Login'} />
            )}
            {/* <AuthRoutes initialRouteName={"PreLogin"} /> */}
        </NavigationContainer>
        // </AuthContext.Provider>
    )
})

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    label: {
        fontSize: FONT_SIZE._2xl,
        color: COLORS.theme?.interface['600'],
    },
    loaderContainer: {
        padding: SPACE.md,
        position: 'absolute',
        bottom: 50,
    },
})
