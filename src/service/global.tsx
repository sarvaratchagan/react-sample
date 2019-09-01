import NotifierProps from '../ui/Notifier';
import _merge from 'lodash-es/merge';

export const ACTION_LOADING_SHOW = 'G_LOADING_SHOW';
export const ACTION_LOADING_HIDE = 'G_LOADING_HIDE';
export const ACTION_NOTIFIER_SHOW = 'G_NOTIFIER_SHOW';
export const ACTION_NOTIFIER_HIDE = 'G_NOTIFIER_HIDE';
export const ACTION_REQUESTING_SHOW = 'G_REQUESTING_SHOW';
export const ACTION_REQUESTING_HIDE = 'G_REQUESTING_HIDE';

const NOTIFY_CONSTANT = {
    dismissible: true,
    open: true,
    placement: 'top-right',
};

export const actions = {
    showLoading: (text?: string) => ({
        type: ACTION_LOADING_SHOW,
        payload: {
            loadingText: text || 'Loading...',
        },
    }),
    hideLoading: () => ({
        type: ACTION_LOADING_HIDE,
    }),

    showRequesting: () => ({
        type: ACTION_REQUESTING_SHOW,
    }),
    hideRequesting: () => ({
        type: ACTION_REQUESTING_HIDE,
    }),

    notify: (notifierOptions: NotifierProps) => ({
        type: ACTION_NOTIFIER_SHOW,
        notifierOptions,
    }),
    notifyInfo: (message: string) => ({
        type: ACTION_NOTIFIER_SHOW,
        notifierOptions: _merge({}, NOTIFY_CONSTANT, {
            message,
            variant: 'info',
            title: 'info',
        }),
    }),
    notifySuccess: (message: string) => ({
        type: ACTION_NOTIFIER_SHOW,
        notifierOptions: _merge({}, NOTIFY_CONSTANT, {
            message,
            variant: 'success',
            title: 'Success',
        }),
    }),
    notifyWarning: (message: string) => ({
        type: ACTION_NOTIFIER_SHOW,
        notifierOptions: _merge({}, NOTIFY_CONSTANT, {
            message,
            variant: 'warning',
            title: 'warning',
        }),
    }),
    notifyError: (message: string) => ({
        type: ACTION_NOTIFIER_SHOW,
        notifierOptions: _merge({}, NOTIFY_CONSTANT, {
            message,
            variant: 'danger',
            title: 'Error',
        }),
    }),
    unnotify: () => ({
        type: ACTION_NOTIFIER_HIDE,
    }),
};

export const reducer = (state = { loading: false }, action) => {
    switch (action.type) {
        case ACTION_LOADING_SHOW: {
            const { loadingText } = action.payload;
            return { ...state, loading: true, loadingText };
        }
        case ACTION_LOADING_HIDE: {
            return { ...state, loading: false };
        }

        case ACTION_REQUESTING_SHOW: {
            return { ...state, requesting: true };
        }
        case ACTION_REQUESTING_HIDE: {
            return { ...state, requesting: false };
        }

        case ACTION_NOTIFIER_SHOW: {
            const notifierOptions = action.notifierOptions;
            return { ...state, showNotifier: true, notifierOptions };
        }
        case ACTION_NOTIFIER_HIDE:
            return { ...state, showNotifier: false };

        default:
            return state;
    }
};
