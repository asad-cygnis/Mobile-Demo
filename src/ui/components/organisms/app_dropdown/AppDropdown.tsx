import {
    ImageStyle,
    Pressable,
    StyleProp,
    StyleSheet,
    TextStyle,
    View,
    ViewStyle,
} from 'react-native'
import React, { useCallback, useEffect, useState } from 'react'
import { AppLabel } from 'ui/components/atoms/app_label/AppLabel'
import { AppLog, SvgProp, TAG } from 'utils/Util'
import { DropdownModal } from 'ui/components/organisms/app_dropdown/DropdownModal'
import { usePreferredTheme } from 'hooks'
import { DropDownItem } from 'models/DropDownItem'
import ChevronDown from 'assets/images/dropdown.svg'
import EIntBoolean from 'models/enums/EIntBoolean'
import { SPACE } from 'config/Dimens'

export interface AppDropdownProps {
    title?: string
    items: DropDownItem[] | any
    preselectedItemString?: string | DropDownItem
    shouldRunCallbackOnStart?: boolean
    selectedItemCallback: (item: DropDownItem) => void
    style?: StyleProp<ViewStyle>
    textStyle?: StyleProp<TextStyle>
    dropDownIconStyle?: StyleProp<ImageStyle>
    dialogBgColor?: string
    dialogCloseIconStyle?: StyleProp<ImageStyle>
    dropDownIcon?: SvgProp
    shouldShowCustomIcon?: boolean
    isLocked?: EIntBoolean
    onBlur?: () => void
    customTextContainerStyle?: StyleProp<TextStyle>
    placeHolderText?: DropDownItem | any
}

export const AppDropdown = React.memo<AppDropdownProps>(
    ({
        title,
        preselectedItemString,
        items,
        selectedItemCallback,
        dialogBgColor,
        dropDownIconStyle,
        dialogCloseIconStyle,
        style,
        textStyle,
        dropDownIcon,
        shouldShowCustomIcon = false,
        isLocked = EIntBoolean.FALSE,
        shouldRunCallbackOnStart = true,
        onBlur,
        customTextContainerStyle,
        placeHolderText,
    }) => {
        const [modalVisible, setModalVisible] = useState<boolean>(false)
        const [selectedItemText, setSelectedItemText] = useState<
            string | undefined
        >(title)

        const itemsList: DropDownItem[] = []

        if (placeHolderText) {
            itemsList.push(placeHolderText)
        }

        items.forEach((item: any) => {
            itemsList.push({
                text: item.text.toString(),
                value: item.value.toString(),
            })
        })

        // show pre-selected item's text
        useEffect(
            () => {
                if (selectedItemPosition === -1) {
                    if (preselectedItemString) {
                        let _selectedItemIndex = items.findIndex(
                            (item: any) =>
                                item.value?.toLowerCase() ===
                                preselectedItemString?.toString()?.toLowerCase()
                        )

                        if (_selectedItemIndex !== -1) {
                            selectedItem(items[_selectedItemIndex])
                        }
                    } else {
                        selectedItem(itemsList[0])
                    }
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            []
        )

        useEffect(() => {
            setSelectedItemText(title)
        }, [title])

        const { themedColors } = usePreferredTheme()

        function openModal() {
            AppLog.log(() => 'show modal', TAG.APP)
            setModalVisible(true)
        }

        function closeModal() {
            AppLog.log(() => 'close modal', TAG.APP)
            setModalVisible(false)
        }

        const [selectedItemPosition, setSelectedItemPosition] =
            useState<number>(-1)

        const selectedItem = useCallback(
            (item: DropDownItem | any) => {
                AppLog.log(() => 'selectedItem ' + item.value, TAG.APP)
                setModalVisible(false)
                setSelectedItemText(item.value)
                selectedItemCallback(item)
                setSelectedItemPosition(
                    itemsList.findIndex(
                        (optionItem: any) => optionItem.value === item.value
                    )
                )
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [selectedItemCallback]
        )

        // show pre-selected item's text
        useEffect(
            () => {
                if (selectedItemPosition === -1) {
                    if (preselectedItemString) {
                        let _selectedItemIndex = items.findIndex(
                            (item: any) =>
                                item.value?.toLowerCase() ===
                                preselectedItemString?.toString()?.toLowerCase()
                        )

                        if (_selectedItemIndex !== -1) {
                            selectedItem(items[_selectedItemIndex])
                        }
                    } else {
                        selectedItem(itemsList[0])
                    }
                }
            },
            // eslint-disable-next-line react-hooks/exhaustive-deps
            [
                items,
                selectedItem,
                preselectedItemString,
                shouldRunCallbackOnStart,
                selectedItemPosition,
            ]
        )

        return (
            <View
                style={[
                    styles.root,
                    {
                        backgroundColor: themedColors.secondaryBackground,
                    },
                    style,
                ]}
            >
                <DropdownModal
                    isVisible={modalVisible}
                    items={itemsList}
                    closeModal={() => {
                        closeModal()
                    }}
                    selectedItemCallback={selectedItem}
                    dropDownBgColor={dialogBgColor}
                    dialogCloseIconStyle={dialogCloseIconStyle}
                    selectedItemPosition={selectedItemPosition}
                    isLocked={isLocked}
                />

                <Pressable
                    testID="dropdown-click"
                    onPress={() => {
                        onBlur?.()
                        !isLocked && openModal()
                    }}
                >
                    <View style={[styles.wrapper]}>
                        <View
                            style={[
                                styles.textContainer,
                                customTextContainerStyle,
                            ]}
                        >
                            <AppLabel
                                text={selectedItemText}
                                style={[
                                    styles.text,
                                    {
                                        color:
                                            selectedItemText === title
                                                ? themedColors.interface['900']
                                                : themedColors.interface['700'],
                                    },
                                    textStyle,
                                ]}
                            />
                        </View>
                        {!shouldShowCustomIcon ? (
                            <ChevronDown
                                width={15}
                                height={15}
                                fill="#6B7280"
                                style={[styles.dropdownIcon, dropDownIconStyle]}
                            />
                        ) : (
                            dropDownIcon?.(themedColors.primaryColor)
                        )}
                    </View>
                </Pressable>
            </View>
        )
    }
)

const styles = StyleSheet.create({
    root: {
        borderRadius: 5,
        justifyContent: 'center',
    },
    wrapper: {
        paddingVertical: 10,
        paddingHorizontal: SPACE.md,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        //alignSelf: "flex-end",
        height: 44,
    },
    dropdownIcon: {
        width: 12,
        aspectRatio: 12 / 12,
        resizeMode: 'contain',
    },
    text: {
        // includeFontPadding: false,
        //backgroundColor: Colors.yellow,
        textAlign: 'center',
    },
    textContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        //backgroundColor: Colors.white,
        flex: 1,
    },
})
