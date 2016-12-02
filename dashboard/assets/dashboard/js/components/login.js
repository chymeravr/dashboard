import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callApiWithJwt, debug } from '../lib.js'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: ''};
        // debug("state login form", this.state);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => hashHistory.push('/profile/'),
            (error) => ({})
        );
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

        callApiWithJwt('/user/api/login',
            'POST',
            data,
            (response) => {
                localStorage.setItem(config.jwt.tokenKey, response['token']);
                hashHistory.push('/profile/');
            },
            (error) => {
                throw error;
            }
        );
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