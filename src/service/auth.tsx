import { AjaxError } from 'app/helpers/ajax';
import { call, put, takeLatest } from 'redux-saga/effects';
import { AxiosPromise } from 'axios';
import { Facker } from 'app/helpers/Facker';
import { actions as globalActions } from './global';
import { push } from 'connected-react-router';
import storage from 'app/helpers/storage';

export const KEY_TOKEN = 'token';
export const KEY_USERS = 'users';

export const ACTION_AUTH_REQUEST = 'USER_AUTH_REQUEST';
export const ACTION_AUTH_SUCCESS = 'USER_AUTH_SUCCESS';
export const ACTION_AUTH_FAILURE = 'USER_AUTH_FAILURE';

export const ACTION_LOGIN_REQUEST = 'USER_LOGIN_REQUEST';
export const ACTION_LOGIN_SUCCESS = 'USER_LOGIN_SUCCESS';
export const ACTION_LOGIN_FAILURE = 'USER_LOGIN_FAILURE';

export const ACTION_REGISTER_REQUEST = 'USER_REGISTER_REQUEST';
export const ACTION_REGISTER_SUCCESS = 'USER_REGISTER_SUCCESS';
export const ACTION_REGISTER_FAILURE = 'USER_REGISTER_FAILURE';

export const ACTION_LOGOUT_REQUEST = 'USER_LOGOUT_REQUEST';
export const ACTION_LOGOUT_SUCCESS = 'USER_LOGOUT_SUCCESS';
export const ACTION_LOGOUT_FAILURE = 'USER_LOGOUT_FAILURE';

export const ACTION_GETUSER_REQUEST = 'USER_GETUSER_REQUEST';
export const ACTION_GETUSER_SUCCESS = 'USER_GETUSER_SUCCESS';
export const ACTION_GETUSER_FAULURE = 'USER_GETUSER_FAILURE';

interface UserInfo {
    id: string;
    username: string;
    firstName: string;
    lastName: string;
    token: string;
}

export interface AuthState {
    user?: UserInfo;
    token?: TokenInfo;
    error?: any;
}

export interface TokenInfo {
    access_token: string;
    refresh_token?: string;
    token_type?: string;
    expires_in?: number;
    scope?: string;
}

export interface LoginData {
    username: string;
    password: string;
    rememberMe: boolean;
    grant_type?: string;
}

export interface AccountData {
    username: string;
    password: string;
    firstName: string;
    lastName: string;
}

export const actions = {
    authSuccess: (tokenInfo: TokenInfo) => ({
        type: ACTION_AUTH_SUCCESS,
        payload: tokenInfo,
    }),
    login: (data: any) => ({
        type: ACTION_LOGIN_REQUEST,
        payload: data,
    }),
    loginSuccess: (response: TokenInfo) => ({
        type: ACTION_LOGIN_SUCCESS,
        payload: response,
    }),
    loginFailure: error => ({
        type: ACTION_LOGIN_FAILURE,
        payload: error,
    }),
    getUserInfo: (accessToken: string) => ({
        type: ACTION_GETUSER_REQUEST,
        payload: accessToken,
    }),
    getUserInfoSuccess: (userInfo: UserInfo) => ({
        type: ACTION_GETUSER_SUCCESS,
        payload: userInfo,
    }),
    logout: () => ({
        type: ACTION_LOGOUT_REQUEST,
    }),
    logoutSuccess: () => ({
        type: ACTION_LOGOUT_SUCCESS,
    }),
    register: (data: any) => ({
        type: ACTION_REGISTER_REQUEST,
        payload: data,
    }),
    registerSuccess: (response: TokenInfo) => ({
        type: ACTION_REGISTER_SUCCESS,
        payload: response,
    }),
    registerFailure: error => ({
        type: ACTION_REGISTER_FAILURE,
        payload: error,
    }),
};

export function reducer(state: AuthState = {}, action): AuthState {
    switch (action.type) {
        case ACTION_AUTH_SUCCESS:
            return {
                ...state,
                token: action.payload,
            };

        case ACTION_LOGIN_REQUEST:
            return { ...state };
        case ACTION_LOGIN_SUCCESS:
            return {
                ...state,
                token: action.payload,
            };
        case ACTION_GETUSER_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };

        case ACTION_LOGOUT_SUCCESS:
            return { ...state, user: null, token: null };

        case ACTION_REGISTER_REQUEST:
            return { ...state };

        case ACTION_REGISTER_SUCCESS:
            return {
                ...state,
                user: action.payload,
            };

        default:
            return state;
    }
}

export const service = {
    login: (data: LoginData) => {
        const fake = new Facker();
        return fake.post('/users/authenticate', { body: JSON.stringify(data) });
    },
    register: (data: AccountData) => {
        const fake = new Facker();
        return fake.post('/users/register', { body: JSON.stringify(data) });
    },
    getUser: (): AxiosPromise | any => {
        const fake = new Facker();
        return fake.post('', null);
    },
    logout: (): AxiosPromise | any => {},
};

function* auth() {
    yield put(globalActions.showLoading('Redirecting to authorize...'));
}

function* authSuccess(action) {
    yield put(actions.getUserInfo(action.payload));
}

function* register(action) {
    try {
        const userData: AccountData = action.payload;
        yield put(globalActions.showLoading('Logging in...'));
        const tokenInfo: TokenInfo = yield call(service.register, {
            ...userData,
        });
        yield put(actions.registerSuccess(tokenInfo));
        yield put(globalActions.hideLoading());
        yield put(push('/login'));
        yield put(
            globalActions.notifySuccess('Successfully registered you account'),
        );
    } catch (err) {
        yield put(globalActions.hideLoading());
        if (err) {
            const ajaxError = err as AjaxError;
            yield put(
                globalActions.notifyError(
                    `${ajaxError.status}: ${ajaxError.data.error_description}`,
                ),
            );
        } else {
            yield put(globalActions.notifyError(`Service Unavailable`));
        }
    }
}

function* login(action) {
    try {
        // effects(call, put):
        // trigger off the code that we want to call that is asynchronous
        // and also dispatched the result from that asynchrous code.
        const loginData: LoginData = action.payload;
        yield put(globalActions.showLoading('Logging in...'));
        const tokenInfo: TokenInfo = yield call(service.login, {
            ...loginData,
        });
        yield put(actions.loginSuccess(tokenInfo));
        yield put(actions.getUserInfo(tokenInfo.access_token));
        yield put(globalActions.hideLoading());
        yield put(push('/posts'));
    } catch (err) {
        yield put(globalActions.hideLoading());
        if (err) {
            const ajaxError = err as AjaxError;
            yield put(
                globalActions.notifyError(
                    `${ajaxError.status}: ${ajaxError.data.error_description}`,
                ),
            );
        } else {
            yield put(globalActions.notifyError(`Service Unavailable`));
        }
    }
}

function* logout(action) {
    yield put(actions.logoutSuccess());
}

function userConverter(response: any): UserInfo {
    return {
        id: response.id,
        username: response.username,
        firstName: response.firstName,
        lastName: response.lastName,
        token: response.token,
    };
}

function* getUser(action) {
    try {
        yield put(globalActions.showLoading('Getting user info...'));
        const response = yield call(service.getUser);
        console.log(response);
        const userInfo: UserInfo = userConverter(response);
        yield put(actions.getUserInfoSuccess(userInfo));
        yield put(globalActions.hideLoading());
        yield put(push('/admin'));
    } catch (e) {
        yield put(globalActions.hideLoading());
    }
}

export function* saga() {
    // takeEvery:
    // listen for certain actions that are going to be dispatched and take them and run through our worker saga.
    yield takeLatest(ACTION_AUTH_REQUEST, auth);
    yield takeLatest(ACTION_AUTH_SUCCESS, authSuccess);
    yield takeLatest(ACTION_LOGIN_REQUEST, login);
    yield takeLatest(ACTION_REGISTER_REQUEST, register);
    yield takeLatest(ACTION_LOGOUT_REQUEST, logout);
    yield takeLatest(ACTION_GETUSER_REQUEST, getUser);
}

export function isAuthorized(): boolean {
    const token = storage.get(KEY_TOKEN);
    return !!token;
}
