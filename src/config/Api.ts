import Env from 'envs/env'

export default {
    BASE_URL: Env.BASE_URL,
    API_URL: 'api/',
    CHECK_FOCRCE_UPDATE: 'version?platform=android&version=',

    // Auth
    LOGIN_URL: 'auth/login',
    SIGN_UP_URL: 'auth/register',
}
