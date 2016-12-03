import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callRawApiWithJwt, callApiWithJwt, debug } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { FormInput } from './common'

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
            this.setState(Object.assign({}, this.state, state));
        };
    }

    tryLogin(e) {
        var data = new FormData();
        data.append("username", this.state.username);
        data.append("password", this.state.password);

        callRawApiWithJwt('/user/api/login',
            'POST',
            data,
            (response) => {
                localStorage.setItem(config.jwt.tokenKey, response['token']);
                hashHistory.push('/profile/');
            },
            (error) => {
                throw error;
            });
    }

    render() {
        return (
            <ReactCSSTransitionGroup
                component="div"
                transitionName="fadeTransition"
                transitionAppear={true}
                transitionLeave={false}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionAppearTimeout={500}
                className="center-align container">
                <form className="row">
                    <div className="col s6 offset-s3">
                        <FormInput
                            fieldName="username"
                            label="Username"
                            value={this.state.username}
                            handleChange={this.handleChange('username').bind(this)} />
                        <FormInput
                            fieldName="password"
                            label="Password"
                            value={this.state.password}
                            handleChange={this.handleChange('password').bind(this)}
                            type="password" />
                        <a className="waves-effect waves-light btn right" onClick={this.tryLogin.bind(this)}>
                            Login
                        </a>
                    </div>
                </form>
            </ReactCSSTransitionGroup>
        );
    }
}

