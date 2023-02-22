import { ApiSuccessResponseModel } from './ApiSuccessResponseModel'

export type SignInApiResponseModel = ApiSuccessResponseModel<User>

export type User = {
    id: number
    full_name?: string
    email?: string
    contact_number?: string
    profile_image?: null
    role_id?: number
    social_account_id?: null
    date_of_birth?: null
    gender?: string
    referral_code?: null
    own_referral_code?: null
    credit?: number
    activation_key?: null
    activated_at?: Date
    latitude?: null
    longitude?: null
    is_5_day_notify?: null
    is_live_offer_notify?: null
    status?: string
    is_referral_code?: number
    credit_assigned?: number
    trial_ends_at?: null
    card_last_four?: null
    card_brand?: null
    stripe_id?: null
    created_at?: Date
    updated_at?: Date
    deleted_at?: null
    activation_code?: null
    provider?: null
    reload_count?: number
    app_share_count?: number
    postcode?: null
    default_address_id?: null
    delivery_contact?: null
    square_customer_id?: null
    square_idempotency_key?: null
    access_token: string
    is_interest_selected?: boolean
    is_location_updated?: boolean
    default_address?: null
}
