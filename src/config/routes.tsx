import * as React from 'react';
import { Redirect } from 'react-router';

import NotFound from 'app/pages/public/NotFound';
import Login from 'app/pages/auth/Login';
import Account from 'app/pages/auth/Account';
import Main from 'app/pages/main/Main';
import { isAuthorized } from 'app/service/auth';

const routes = [
    {
        path: '/login',
        exact: true,
        /* eslint-disable */
        render: () => {
            if (isAuthorized()) {
                return <Redirect to="/posts" />;
            }
            return <Login />;
        },
    },
    {
        path: '/register',
        exact: true,
        /* eslint-disable */
        render: () => {
            if (isAuthorized()) {
                return <Redirect to="/posts" />;
            }
            return <Account />;
        },
    },
    {
        path: '/posts',
        // `render()` method support in react-router-config v5.0
        /* eslint-disable */
        render: () => {
            if (isAuthorized()) {
                return <Main />;
            }
            return <Redirect to="/login" />;
        },
    },
    {
        path: '*',
        component: NotFound,
    },
];

export default routes;
