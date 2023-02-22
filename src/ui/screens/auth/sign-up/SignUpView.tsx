import { StackScreenProps } from '@react-navigation/stack/lib/typescript/src/types'
import { SPACE } from 'config'
import { useFormik } from 'formik'
import React from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import { AuthStackParamList } from 'routes'
import {
    AppButton,
    BUTTON_TYPES,
} from 'ui/components/molecules/app_button/AppButton'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import Screen from 'ui/components/atoms/Screen'
import { AppLog } from 'utils/Util'
import * as Yup from 'yup'

type Props = {
    sendEmailButtonCallback?: (values: SignUpFormValues) => void
    shouldShowProgressBar: boolean
    openLoginScreen?: () => void
}

type SignUpFormValues = {
    email: string
}

export type SignUpScreenProp = StackScreenProps<AuthStackParamList, 'SignUp'>

const initialFormValues: SignUpFormValues = {
    email: '',
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .required('Email address is a required field.')
        .email('Enter valid emailP'),
})

export const SignUpView = React.memo<Props>((props) => {
    AppLog.log(() => 'Rendering SignUpView...')

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: (values: any) => {
            AppLog.log(values)
            props.sendEmailButtonCallback?.(values)
        },
        validationSchema: validationSchema,
    })

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.keyboardAvoidingView}
        >
            <Screen style={styles.container} requiresSafeArea={false}>
                <View>
                    <AppLabel text="SignUp" />
                    <AppButton
                        text="Submit"
                        onPress={() => {
                            formik.handleSubmit()
                        }}
                        buttonType={BUTTON_TYPES.NORMAL}
                    />
                </View>
            </Screen>
        </KeyboardAvoidingView>
    )
})

const styles = StyleSheet.create({
    keyboardAvoidingView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    scrollView: {},
})
