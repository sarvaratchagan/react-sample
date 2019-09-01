import _merge from 'lodash-es/merge';
import storage from 'app/helpers/storage';
import utils from 'app/helpers/utils';
import { KEY_TOKEN, KEY_USERS } from 'app/service/auth';

/***
 * ==========================================================================
 * **********************   RequestInit  ************************************
 * ==========================================================================
 *
 body?: BodyInit | null; // body data type must match "Content-Type" header
 cache?: RequestCache; // *default, no-cache, reload, force-cache, only-if-cached
 credentials?: RequestCredentials;  // include, *same-origin, omit
 headers?: HeadersInit; // { 'Content-Type': 'application/json' } or { 'Content-Type': 'application/x-www-form-urlencoded' }
 integrity?: string;
 keepalive?: boolean;
 method?: string; // *GET, POST, PUT, DELETE, etc.
 mode?: RequestMode; // no-cors, cors, *same-origin
 redirect?: RequestRedirect; // manual, *follow, error
 referrer?: string; // no-referrer, *client
 referrerPolicy?: ReferrerPolicy;
 signal?: AbortSignal | null;
 window?: any;
 */
export class Facker {
    private fetch = window.fetch;
    public constructor() {}

    read(url, opts: RequestInit): Promise<Response> | any {
        // authenticate
        if (url.endsWith('/users/authenticate') && opts.method === 'POST') {
            // get parameters from post request
            let params = JSON.parse(opts.body as string);
            const users = storage.get(KEY_USERS);

            // find if any user matches login credentials
            let filteredUsers = (users || []).filter((user: any) => {
                return (
                    user.username === params.username &&
                    user.password === params.password
                );
            });

            if (filteredUsers.length) {
                // if login details are valid return user details and fake jwt token
                let user = filteredUsers[0];
                const token = {};
                let responseJson = {
                    id: user.id,
                    username: user.username,
                    firstName: user.firstName,
                    lastName: user.lastName,
                };
                token[utils.randomString(32)] = responseJson;
                storage.set(KEY_TOKEN, token);
                return Promise.resolve({
                    status: 200,
                    ok: true,
                    statusText: JSON.stringify(responseJson),
                });
            } else {
                // else return error
                return Promise.reject({
                    status: 401,
                    ok: false,
                    data: {
                        error_description: 'Incorrect username and password',
                    },
                });
            }
        } else if (url.endsWith('/users/register') && opts.method === 'POST') {
            // register user
            // get new user object from post body
            let newUser = JSON.parse(opts.body as string);
            const users = storage.get(KEY_USERS) || [];

            // validation
            let duplicateUser = users.filter((user: any) => {
                return user.username === newUser.username;
            }).length;
            if (duplicateUser) {
                return Promise.reject({
                    ok: false,
                    data: {
                        error_description: `Username ${newUser.username}  is already taken`,
                    },
                });
            }

            // save new user
            newUser.id = users.length
                ? Math.max(...users.map((user: any) => user.id)) + 1
                : 1;
            users.push(newUser);
            storage.set(KEY_USERS, JSON.stringify(users));

            // respond 200 OK
            return Promise.resolve({
                status: 200,
                ok: true,
                statusText: JSON.stringify(newUser),
            });
        }
        // pass through any requests not handled above
        return this.fetch(url, opts);
    }

    public get(url, options: RequestInit): Promise<Response> {
        const opt = _merge({}, { method: 'GET' }, options);
        return this.read(url, opt);
    }

    public post(url, options: RequestInit): Promise<Response> {
        const opt = _merge({}, { method: 'POST' }, options);
        return this.read(url, opt);
    }

    public delete(url, options: RequestInit): Promise<Response> {
        const opt = _merge({}, { method: 'DELETE' }, options);
        return this.read(url, opt);
    }

    public put(url, options: RequestInit): Promise<Response> {
        const opt = _merge({}, { method: 'PUT' }, options);
        return this.read(url, opt);
    }
}
