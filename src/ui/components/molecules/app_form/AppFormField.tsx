import { FONT_SIZE, SPACE } from 'config/Dimens'
import { FormikValues, useFormikContext } from 'formik'
import { usePreferredTheme } from 'hooks'
import EIntBoolean from 'models/enums/EIntBoolean'
import React, { useCallback } from 'react'
import { StyleSheet, View } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import {
    AppLabel,
    AppLabelProps,
    TEXT_TYPE,
} from 'ui/components/atoms/app_label/AppLabel'
import {
    AppInputField,
    AppInputFieldProps,
} from '../appinputfield/AppInputField'
import { AppFormValidationLabel } from './AppFormValidationLabel'

export interface AppFormFieldProps {
    fieldTestID?: string
    validationLabelTestID?: string
    name: string
    readOnly?: boolean
    value?: string
    labelProps?: AppLabelProps
    fieldInputProps: AppInputFieldProps
    linkLabelProps?: AppLabelProps
    linkLabelOnPress?: () => void
    secureTextEntry?: boolean
    shouldNotOptimize?: boolean
    customTextChanged?: (value: string) => void
    isLocked?: EIntBoolean
}

type Props = AppFormFieldProps

const AppFormField = React.memo<Props>(
    ({
        name,
        labelProps,
        fieldInputProps,
        fieldTestID,
        validationLabelTestID,
        linkLabelProps,
        linkLabelOnPress,
        secureTextEntry,
        customTextChanged,
        isLocked = EIntBoolean.FALSE,
    }) => {
        const theme = usePreferredTheme()
        const { viewStyle, ...restFieldInputProps } = fieldInputProps
        const {
            errors,
            setFieldTouched,
            setFieldValue,
            touched,
            initialValues,
        } = useFormikContext<FormikValues>()

        const _setFieldTouched = useCallback(
            () => setFieldTouched(name),
            [setFieldTouched, name]
        )

        return (
            <>
                {labelProps && (
                    <View style={styles.linkLabelContainer}>
                        <AppLabel
                            textType={TEXT_TYPE.BOLD}
                            {...labelProps}
                            style={[
                                styles.label,
                                {
                                    color: theme.themedColors.interface['900'],
                                },
                                labelProps ? labelProps.style : {},
                            ]}
                        />
                        <View style={styles.space} />

                        {linkLabelProps && (
                            <TouchableOpacity onPress={linkLabelOnPress}>
                                <AppLabel
                                    textType={TEXT_TYPE.BOLD}
                                    style={[
                                        styles.linkLabel,
                                        {
                                            color: theme.themedColors
                                                .primaryColor,
                                        },
                                    ]}
                                    {...linkLabelProps}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
                <AppInputField
                    testID={fieldTestID}
                    valueToShowAtStart={initialValues[name]}
                    onChangeText={(text) => {
                        setFieldValue(name, text)
                        _setFieldTouched()
                        customTextChanged?.(text)
                    }}
                    onBlur={_setFieldTouched}
                    secureTextEntry={secureTextEntry}
                    viewStyle={[
                        styles.inputFieldContainer,
                        {
                            backgroundColor:
                                theme.themedColors.secondaryBackground,
                            borderColor: theme.themedColors.borderColor,
                        },
                        viewStyle,
                    ]}
                    {...restFieldInputProps}
                    editable={!isLocked}
                />
                {errors[name] && touched[name] && (
                    <AppFormValidationLabel
                        validationLabelTestID={validationLabelTestID}
                        errorString={errors[name] as string}
                        shouldVisible={true}
                    />
                )}
            </>
        )
    }
)

const styles = StyleSheet.create({
    label: {
        marginBottom: SPACE._2md,
        fontSize: FONT_SIZE.sm,
    },
    space: {
        flex: 1,
    },
    linkLabelContainer: {
        flexDirection: 'row',
    },
    linkLabel: {
        fontSize: FONT_SIZE.xs,
    },
    inputFieldContainer: { height: 44 },
})

export default AppFormField
