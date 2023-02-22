import { useAppDispatch, useAppSelector } from 'hooks/redux'
import React, { FC } from 'react'
import { logOut } from 'stores/authSlice'
import { RootState } from 'stores/store'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import { AppButton } from 'ui/components/molecules/app_button/AppButton'

export const HomeView: FC = () => {
    const { user } = useAppSelector((state: RootState) => state.auth)
    const dispatch = useAppDispatch()
    return (
        <Screen style={{ flex: 1 }}>
            <AppLabel text={user?.email} style={{ fontSize: 34 }} />
            <AppButton
                text="logout"
                onPress={() => {
                    dispatch(logOut())
                }}
            />
        </Screen>
    )
}
