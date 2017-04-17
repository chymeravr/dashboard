import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callRawApiWithJwt, callApiWithJwt, debug, callApi } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { FormInput } from './common'
import { Button, Form, Container, Grid, Message, Header, Menu } from 'semantic-ui-react'
import { ATTEMPT_LOGIN, LOGIN_SUCCEEDED, LOGIN_FAILED } from '../redux/loginActions'


export class Login_P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            registrationFailed: false,
            activeItem: 'login',
            loginState: props.loginState,
        };
        this.handleItemClick = this.handleItemClick.bind(this);
        this.tryLogin = props.tryLogin;
        this.signup = this.signup.bind(this);
    }

    componentWillReceiveProps(props) {
        this.setState(Object.assign({}, this.state, { loginState: props.loginState }));
    }

    handleChange(key) {
        return (e, d) => {
            var state = {};
            state[key] = d.value;
            this.setState(Object.assign({}, this.state, state));
        };
    }

    componentDidMount() {
        document.title = "Login";
    }

    signup(e) {
        e.preventDefault();
        const data = {
            user: {
                username: this.state.r_username,
                password: this.state.r_password
            },
            email: this.state.r_email,
        }
        callApi('/user/api/signup',
            'POST',
            JSON.stringify(data),
            (response) => this.setState(Object.assign({}, this.state, { registered: true, error: null })),
            (error) => { console.info(error); this.setState(Object.assign({}, this.state, { registered: false, error: error })); },
            201);
    }

    handleItemClick(name) {
        return () => this.setState(Object.assign({}, this.state, { activeItem: name }))
    }


    render() {
        debug('Login', this.state);

        const loginErrorMessage = this.state.loginState == 'LOGIN_FAILED' ? (
            <Message
                error
                header='Invalid credentials or Inactive account'
                content='Username and Password are case sensitive. Contact sales@chymeravr.com for activation'
                />
        ) : <div></div>

        const activeItem = this.state.activeItem;
        const loginForm =
            <Grid.Column verticalAlign='middle' width={4}>
                {loginErrorMessage}
                <Form>
                    <Form.Input placeholder='Username' onChange={(e, d) => this.handleChange('username')(e, d)} />
                    <Form.Input placeholder='Password' type='password' onChange={(e, d) => this.handleChange('password')(e, d)} />
                    <Button type='submit' onClick={(e) => this.tryLogin(e, this.state.username, this.state.password)}>Submit</Button>
                </Form>
            </Grid.Column>

        const usernameError = this.state.error && this.state.error.user && this.state.error.user.username;
        const passwordError = this.state.error && this.state.error.user && this.state.error.user.password;
        const emailError = this.state.error && this.state.error.email;

        const signUpForm =
            <Grid.Column verticalAlign='middle' width={4}>
                {this.state.registered ? <Message positive content='Registration Successful. Our team will contact you regarding further steps on how to activate your account' /> : ''}
                <Form error={this.state.error}>
                    {usernameError ? (<Message error content={this.state.error.user.username.join('\n')} />) : <div></div>}
                    <Form.Input placeholder='Username' onChange={(e, d) => this.handleChange('r_username')(e, d)} error={usernameError} />

                    {passwordError ? (<Message error content={this.state.error.user.password.join('\n')} />) : <div></div>}
                    <Form.Input placeholder='Password' type='password' onChange={(e, d) => this.handleChange('r_password')(e, d)} error={passwordError} />

                    {emailError ? (<Message error content={this.state.error.email.join('\n')} />) : <div></div>}
                    <Form.Input placeholder='Email' type='email' onChange={(e, d) => this.handleChange('r_email')(e, d)} error={emailError} />
                    <Button type='submit' onClick={(e) => this.signup(e)}>Submit</Button>
                </Form>
            </Grid.Column>

        const content = activeItem === 'login' ? loginForm : signUpForm;

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB' }}>
                <Grid centered verticalAlign='middle' columns={4}>
                    <Grid.Row verticalAlign='middle' columns={1} style={{ minHeight: '80vh' }}>
                        <Grid.Column verticalAlign='middle' width={4}>
                            <Menu tabular secondary inverted>
                                <Menu.Item name='login' active={activeItem === 'login'} onClick={this.handleItemClick('login')} />
                                <Menu.Item name='signup' active={activeItem === 'signup'} onClick={this.handleItemClick('signup')} />
                            </Menu>
                            {content}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main>
        );
    }
}

