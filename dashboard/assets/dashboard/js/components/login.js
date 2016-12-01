import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callApiWithJwt, debug } from '../lib.js'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', assignUser: props.assignUser };
        // debug("state login form", this.state);
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(state);
        }.bind(this);
    }

    tryLogin(e) {
        var data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);

        fetch('/user/api/login', {
            method: 'POST',
            body: data
        }).then(response => {
            if (response.status != 200) {
                throw new Error(response.statusText)
            }
            return response.json();
        }).then(token => {
            localStorage.setItem(config.jwt.tokenKey, token['token']);
            hashHistory.push('/profile/');
        }).catch(function (error) {
            throw error
        });
    }

    render() {
        return (
            <div className="container">
                <form className="row">
                    <div className="col s6 offset-s3">
                        <div className="input-field row">
                            <input id="username" type="text" value={this.state.username}
                                onChange={this.handleChange('username')} />
                            <label htmlFor="username">Username</label>
                        </div>
                        <div className="input-field row">
                            <input id="password" type="password" value={this.state.password}
                                onChange={this.handleChange('password')} />
                            <label htmlFor="password">Password</label>
                        </div>
                        <a className="waves-effect waves-light btn right" onClick={this.tryLogin.bind(this)}>
                            Login
                    </a>
                    </div>
                </form>
            </div>
        );
    }
}

module.exports = LoginForm