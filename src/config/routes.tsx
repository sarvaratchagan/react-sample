import * as React from 'react';
import NotFound from 'app/pages/public/NotFound';
import Login from 'app/pages/auth/Login';
import Account from 'app/pages/auth/Account';

const routes = [
    {
        path: '/login',
        exact: true,
        component: Login,
    },
    {
        path: '/register',
        exact: true,
        component: Account,
    },
    {
        path: '*',
        exact: true,
        component: NotFound,
    },
];

export default routes;
