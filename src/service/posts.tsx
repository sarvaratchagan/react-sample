import { call, put, takeEvery, takeLatest } from 'redux-saga/effects';
import { actions as globalActions } from './global';
import { Ajax, AjaxError } from 'app/helpers/ajax';
import { AxiosPromise } from 'axios';

const ACTION_POSTS_REQUEST = 'USER_POSTS_REQUEST';
const ACTION_POSTS_SUCCESS = 'USER_POSTS_SUCCESS';
const ACTION_POSTS_FAILURE = 'USER_POSTS_FAILURE';

const ACTION_POST_REQUEST = 'USER_POST_REQUEST';
const ACTION_POST_SUCCESS = 'USER_POST_SUCCESS';
const ACTION_POST_FAILURE = 'USER_POST_FAILURE';

const ACTION_USERS_REQUEST = 'READ_USERS_REQUEST';
const ACTION_USERS_SUCCESS = 'READ_USERS_SUCCESS';
const ACTION_USERS_FAILURE = 'READ_USERS_FAILURE';

const BASE_URL = 'https://jsonplaceholder.typicode.com';

interface Address {
    street: string;
    suite: string;
    city: string;
    zipcode: string;
    geo: Geo;
}

interface Geo {
    lat: string;
    lng: string;
}

interface Company {
    name: string;
    catchPhrase: string;
    bs: string;
}

export interface User {
    id: number;
    name: string;
    username: string;
    email: string;
    address: Address;
    phone: string;
    website: string;
    company: Company;
}

export interface Post {
    userId: number;
    id: number;
    title: string;
    body: string;
}

export interface AppState {
    posts?: Post[];
    post?: Post;
    users?: User[];
    user?: User;
    error?: any;
}

export const actions = {
    // posts
    posts: () => ({
        type: ACTION_POSTS_REQUEST,
    }),
    postsSuccess: (response: Post[]) => ({
        type: ACTION_POSTS_SUCCESS,
        payload: response,
    }),
    postsFailure: error => ({
        type: ACTION_POSTS_FAILURE,
        payload: error,
    }),

    // users
    users: () => ({
        type: ACTION_USERS_REQUEST,
    }),
    usersSuccess: (response: User[]) => ({
        type: ACTION_USERS_SUCCESS,
        payload: response,
    }),
    usersFailure: error => ({
        type: ACTION_USERS_FAILURE,
        payload: error,
    }),

    post: (id: number) => ({
        type: ACTION_POST_REQUEST,
        payload: id,
    }),
    postSuccess: (response: Post) => ({
        type: ACTION_POST_SUCCESS,
        payload: response,
    }),
    postFailure: error => ({
        type: ACTION_POST_FAILURE,
        payload: error,
    }),
};

export function reducer(state: AppState = {}, action): AppState {
    switch (action.type) {
        // posts
        case ACTION_POSTS_REQUEST:
            return {
                ...state,
            };

        case ACTION_POSTS_SUCCESS:
            return {
                ...state,
                posts: action.payload,
            };

        case ACTION_POSTS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        // users
        case ACTION_USERS_REQUEST:
            return {
                ...state,
            };

        case ACTION_USERS_SUCCESS:
            return {
                ...state,
                users: action.payload,
            };

        case ACTION_USERS_FAILURE:
            return {
                ...state,
                error: action.payload,
            };

        // user
        case ACTION_POST_REQUEST:
            return {
                ...state,
            };

        case ACTION_POST_SUCCESS:
            return {
                ...state,
                post: action.payload,
            };

        case ACTION_POST_FAILURE:
            return {
                ...state,
                error: action.payload,
            };
        default:
            return state;
    }
}

export const service = {
    posts: (): AxiosPromise | any => {
        return new Ajax().get(`${BASE_URL}/posts`);
    },
    post: (id: number): AxiosPromise | any => {
        return new Ajax().get(`${BASE_URL}/posts/${id}`);
    },
    users: (): AxiosPromise | any => {
        return new Ajax().get(`${BASE_URL}/users`);
    },
};

function* posts(action) {
    try {
        yield put(globalActions.showLoading('Loading posts...'));
        const postInfo: Post[] = yield call(service.posts);
        yield put(actions.postsSuccess(postInfo));
        yield put(globalActions.hideLoading());
    } catch (err) {
        yield put(globalActions.hideLoading());
        if (err) {
            const ajaxError = err as AjaxError;
            yield put(actions.postFailure(ajaxError));
        }
    }
}

function* users(action) {
    try {
        const id: number = action.payload;
        yield put(globalActions.showLoading('Loading users...'));
        const userInfo: User[] = yield call(service.users, id);
        yield put(actions.usersSuccess(userInfo));
        yield put(globalActions.hideLoading());
    } catch (err) {
        yield put(globalActions.hideLoading());
        if (err) {
            const ajaxError = err as AjaxError;
            yield put(actions.usersFailure(ajaxError));
        }
    }
}

function* post(action) {
    try {
        const id: number = action.payload;
        yield put(globalActions.showLoading('Loading post...'));
        const postInfo: Post = yield call(service.post, id);
        yield put(actions.postSuccess(postInfo));
        yield put(globalActions.hideLoading());
    } catch (err) {
        yield put(globalActions.hideLoading());
        if (err) {
            const ajaxError = err as AjaxError;
            yield put(actions.postFailure(ajaxError));
        }
    }
}

export function* saga() {
    yield takeLatest(ACTION_POSTS_REQUEST, posts);
    yield takeLatest(ACTION_USERS_REQUEST, users);
    yield takeLatest(ACTION_POST_REQUEST, post);
}
