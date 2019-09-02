import { all } from 'redux-saga/effects';

import { saga as authSaga } from 'app/service/auth';
import { saga as postSaga } from 'app/service/posts';

export default function* rootSaga() {
    yield all([authSaga(), postSaga()]);
}
