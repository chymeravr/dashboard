import { combineReducers } from 'redux'
import { LOGIN_FAILED, LOGIN_SUCCEEDED, ATTEMPT_LOGIN, LOGOUT, LOGIN_STATES, NOT_ATTEMPTED } from './loginActions'


function loginState(state = NOT_ATTEMPTED, action) {
    console.info(state, action);
    switch (action.type) {
        case ATTEMPT_LOGIN:
            return ATTEMPT_LOGIN;
        case LOGIN_FAILED:
            return LOGIN_FAILED;
        case LOGIN_SUCCEEDED:
            return LOGIN_SUCCEEDED;
        case LOGOUT:
            return NOT_ATTEMPTED;
        default:
            return state
    }
}

function username(state = '', action) {
    switch (action.type) {
        case LOGIN_SUCCEEDED:
            return action.username
        default:
            return state;
    }
}

const loginApp = combineReducers({
    loginState,
    username
})

export default loginApp