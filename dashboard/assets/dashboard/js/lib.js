import { config } from './config.js'

export function debug(message, props) {
    console.info(message);
    console.info(props);
}

export function callApiWithJwt(path, method, body, onSuccess, onError) {
    const jwtToken = localStorage.getItem(config.jwt.tokenKey);
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Authorization': 'JWT ' + jwtToken
        }
    }).then(response => {
        if (response.status != 200) {
            throw new Error(response.statusText)
        }
        return response.json();
    }).then(onSuccess).catch(onError);
}