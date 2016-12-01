import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callApiWithJwt, debug } from '../lib.js'

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = { username: '', password: '', assignUser: props.assignUser };
        debug("state login form", this.state);
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(state);
        }.bind(this);
    }

    tryLogin(e) {
        console.log("Trying to log in");
        console.log(config);
        var data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);
        for (var [key, value] of data.entries()) {
            console.log(key, value);
        }

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
            callApiWithJwt('/user/api/view_profile',
                'GET',
                {},
                (response) => this.state.assignUser(response),
                (error) => console.info(error)
            );
            hashHistory.push('/profile/' + this.state.username);
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