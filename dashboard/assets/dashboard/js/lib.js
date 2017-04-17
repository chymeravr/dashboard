import { config } from './config.js'
const DEBUG = true;
export function debug(message, props) {
    if (DEBUG) {
        console.info(message);
        console.info(props);
    }
}

export function callApiWithJwt(path, method, body, onSuccess, onError, statusCode = 200) {
    document.body.classList.add("wait");
    const jwtToken = localStorage.getItem(config.jwt.tokenKey);
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Authorization': 'JWT ' + jwtToken,
            'Content-Type': 'application/json'
        }
    }).then(response => {
        let json = response.json();
        if (response.status != statusCode) {
            json.then(error => {
                onError(error);
                document.body.classList.remove("wait");
            })
        } else {
            json.then(json => {
                onSuccess(json);
                document.body.classList.remove("wait");
            })
        }
    }).catch(error => {
        document.body.classList.remove("wait");
        alert('Site unreachable');
    });
}

export function callApi(path, method, body, onSuccess, onError, statusCode = 200) {
    document.body.classList.add("wait");
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(response => {
        let json = response.json();
        if (response.status != statusCode) {
            json.then(error => {
                onError(error);
                document.body.classList.remove("wait");
            })
        } else {
            json.then(json => {
                onSuccess(json);
                document.body.classList.remove("wait");
            })
        }
    }).catch(error => {
        document.body.classList.remove("wait");
        alert('Site unreachable');
    });;
}

export function callRawApiWithJwt(path, method, body, onSuccess, onError, statusCode = 200) {
    document.body.classList.add("wait");
    const jwtToken = localStorage.getItem(config.jwt.tokenKey);
    fetch(path, {
        method: method,
        body: body,
        headers: {
            'Authorization': 'JWT ' + jwtToken,
        }
    }).then(response => {
        let json = response.json();
        if (response.status != statusCode) {
            json.then(error => {
                onError(error);
                document.body.classList.remove("wait");
            })
        } else {
            json.then(json => {
                onSuccess(json);
                document.body.classList.remove("wait");
            })
        }
    }).catch(error => {
        document.body.classList.remove("wait");
        alert('Site unreachable');
    });;
}

export function logout(hashHistory) {
    localStorage.removeItem(config.jwt.tokenKey);
    hashHistory.push('/login/');
}

export function addHttp(url) {
    if (!/^(?:f|ht)tps?\:\/\//.test(url)) {
        url = "http://" + url;
    }
    return url;
}

export function dataURItoBlob(dataURI) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
        ia[i] = byteString.charCodeAt(i);
    }

    return new Blob([ab], { type: mimeString });
}

export function getCreativeType(format, vision) {
    // Webapp will always send an equirectangular image.
    switch (vision) {
        case '0': return 0; // Mono
        case '1': return 1; // Stereo
    }
}
