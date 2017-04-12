/*
 * action types
 */

export const ATTEMPT_LOGIN = 'ATTEMP_LOGIN'
export const LOGIN_FAILED = 'LOGIN_FAILED'
export const LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED'
export const LOGOUT = 'LOGOUT'
export const NOT_ATTEMPTED = 'NOT_ATTEMPTED'

export function startLogin() {
    return { type: ATTEMPT_LOGIN }
}

export function loginFailed() {
    return { type: LOGIN_FAILED }
}

export function loginSucceeded(username) {
    return { type: LOGIN_SUCCEEDED, username }
}

export function logout() {
    return { type: LOGOUT }
}