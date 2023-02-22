import { COLORS, FONT_SIZE, SPACE, STRINGS } from 'config'
import Strings from 'config/Strings'
import { FormikValues } from 'formik'
import { usePreferredTheme } from 'hooks'
import React, { FC } from 'react'
import { KeyboardAvoidingView, Platform, StyleSheet, View } from 'react-native'
import {
    ScrollView,
    TouchableWithoutFeedback,
} from 'react-native-gesture-handler'
import Screen from 'ui/components/atoms/Screen'
import { BUTTON_TYPES } from 'ui/components/molecules/app_button/AppButton'
import AppForm from 'ui/components/molecules/app_form/AppForm'
import AppFormField from 'ui/components/molecules/app_form/AppFormField'
import { AppFormSubmit } from 'ui/components/molecules/app_form/AppFormSubmit'
import * as Yup from 'yup'
import { TEXT_TYPE } from 'ui/components/atoms/app_label/AppLabel'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'

type Props = {
    signIn: (values: LoginFormValues) => void
    shouldShowProgressBar: boolean
    openSignUpScreen: () => void
}

type LoginFormValues = {
    email: string
    password: string
    remember_me: boolean
}

const validationSchema = Yup.object().shape({
    email: Yup.string()
        .email(Strings.login.enter_valid_email_validation)
        .required(Strings.login.email_required_validation),
    password: Yup.string()
        .required(Strings.login.pass_required_validation)
        .min(7, Strings.login.min_pass_validation),
    rememberMe: Yup.boolean(),
    // .matches(loginRegx, Strings.login.pass_validation)
})

let initialValues: FormikValues = {
    email: 'anis.ghazi@startrum.com',
    password: '123456789',
    rememberMe: false,
}

export const LoginView: FC<Props> = ({
    signIn,
    shouldShowProgressBar,
    openSignUpScreen,
}) => {
    const { themedColors } = usePreferredTheme()

    const onSubmit = (_value: FormikValues) => {
        signIn({
            email: _value.email,
            password: _value.password,
            remember_me: _value.rememberMe,
        })
    }

    return (
        <>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : undefined}
                style={styles.keyboardAvoidingView}
            >
                <Screen style={styles.container} requiresSafeArea={false}>
                    <ScrollView
                        style={styles.scrollView}
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.scrollViewContent}
                    >
                        <View>
                            <AppForm
                                initialValues={initialValues}
                                onSubmit={onSubmit}
                                validationSchema={validationSchema}
                            >
                                <AppFormField
                                    fieldTestID="email"
                                    validationLabelTestID={
                                        'emailValidationLabel'
                                    }
                                    name="email"
                                    labelProps={{
                                        text: STRINGS.login.email_address,
                                    }}
                                    fieldInputProps={{
                                        textContentType: 'emailAddress',
                                        keyboardType: 'email-address',
                                        returnKeyType: 'next',
                                        placeholder:
                                            STRINGS.login.enter_your_email,
                                        autoCapitalize: 'none',
                                        placeholderTextColor:
                                            themedColors.placeholderColor,
                                        style: {
                                            color: COLORS.theme?.interface[
                                                '900'
                                            ],
                                        },
                                        viewStyle: [styles.textFieldStyle],
                                    }}
                                />
                                <AppFormField
                                    fieldTestID="password"
                                    validationLabelTestID={
                                        'passwordValidationLabel'
                                    }
                                    name="password"
                                    labelProps={{
                                        text: STRINGS.login.password,
                                        style: styles.nextField,
                                    }}
                                    secureTextEntry={true}
                                    fieldInputProps={{
                                        textContentType: 'password',
                                        keyboardType: 'default',
                                        returnKeyType: 'done',
                                        placeholder: STRINGS.login.enter_pass,
                                        autoCapitalize: 'none',
                                        placeholderTextColor:
                                            themedColors.placeholderColor,
                                        style: {
                                            color: COLORS.theme?.interface[
                                                '900'
                                            ],
                                        },
                                        viewStyle: [styles.textFieldStyle],
                                    }}
                                />
                                <AppFormSubmit
                                    text={STRINGS.login.sign_in}
                                    buttonType={BUTTON_TYPES.NORMAL}
                                    textType={TEXT_TYPE.BOLD}
                                    shouldShowProgressBar={
                                        shouldShowProgressBar
                                    }
                                    textStyle={[
                                        styles.signInButtonText,
                                        {
                                            color: themedColors.primaryBackground,
                                        },
                                    ]}
                                    buttonStyle={styles.signInContainer}
                                />

                                <TouchableWithoutFeedback
                                    style={{
                                        alignItems: 'center',
                                    }}
                                    onPress={openSignUpScreen}
                                >
                                    <AppLabel
                                        text={Strings.login.register}
                                        style={[styles.register]}
                                        textType={TEXT_TYPE.SEMI_BOLD}
                                    />
                                </TouchableWithoutFeedback>
                            </AppForm>
                        </View>
                    </ScrollView>
                </Screen>
            </KeyboardAvoidingView>
        </>
    )
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
    },
    container: {
        flex: 1,
        paddingVertical: SPACE.lg,
        paddingHorizontal: SPACE.lg,
    },
    keyboardAvoidingView: {
        flex: 1,
    },
    textFieldStyle: {
        borderWidth: 1,
    },
    signInButtonText: {
        fontSize: FONT_SIZE.lg,
    },
    scrollViewContent: {
        flexGrow: 1,
        flexDirection: 'column',
    },
    nextField: { marginTop: SPACE.lg },
    signInContainer: { marginVertical: SPACE._3xl },
    register: {
        color: COLORS.theme?.primaryShade[700],
    },
})
