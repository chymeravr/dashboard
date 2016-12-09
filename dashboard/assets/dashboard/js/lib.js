import { config } from './config.js'

export function debug(message, props) {
    console.info(message);
    console.info(props);
}

export function callApiWithJwt(path, method, body, onSuccess, onError, statusCode=200) {
    const jwtToken = localStorage.getItem(config.jwt.tokenKey);
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Authorization': 'JWT ' + jwtToken,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        if (response.status != statusCode) {
            throw new Error(response.statusText)
        }
        return response.json();
    }).then(onSuccess).catch(onError);
}

export function callRawApiWithJwt(path, method, body, onSuccess, onError, statusCode=200) {
    const jwtToken = localStorage.getItem(config.jwt.tokenKey);
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Authorization': 'JWT ' + jwtToken,
        }
    }).then(response => {
        if (response.status != statusCode) {
            throw new Error(response.statusText)
        }
        return response.json();
    }).then(onSuccess).catch(onError);
}

export function logout(hashHistory) {
    localStorage.removeItem(config.jwt.tokenKey);
    hashHistory.push('/login/');
}
