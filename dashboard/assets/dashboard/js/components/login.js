import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callRawApiWithJwt, callApiWithJwt, debug, callApi } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { FormInput } from './common'
import { Button, Form, Container, Grid, Message, Header, Menu } from 'semantic-ui-react'

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loginFailed: false,
            registrationFailed: false,
            activeItem: 'login'
        };
        this.handleItemClick = this.handleItemClick.bind(this);
        this.tryLogin = props.tryLogin;
        this.signup = this.signup.bind(this);
    }

    componentWillMount() {

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
                username: this.state.username,
                password: this.state.password
            },
            email: this.state.email,
        }

        callApi('/user/api/signup',
            'POST',
            JSON.stringify(data),
            (response) => this.setState(Object.assign({}, this.state, { registered: true, registrationFailed: false })),
            (error) => { this.setState(Object.assign({}, this.state, { registrationFailed: true })); throw error;},
            201);
    }

    handleItemClick(name) {
        return () => this.setState(Object.assign({}, this.state, { activeItem: name }))
    }


    render() {
        debug('Login', this.state)
        const loginErrorMessage = this.state.loginFailed ? (
            <Message
                error
                header='Invalid credentials'
                content='Username and Password are case sensitive'
                />
        ) : <div></div>

        const registrationErrorMessage = this.state.registrationFailed ? (
            <Message
                error
                content='Registration Failed'
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

        const signUpForm =
            <Grid.Column verticalAlign='middle' width={4}>
                {registrationErrorMessage}
                <Form>
                    <Form.Input placeholder='Username' onChange={(e, d) => this.handleChange('username')(e, d)} />
                    <Form.Input placeholder='Password' type='password' onChange={(e, d) => this.handleChange('password')(e, d)} />
                    <Form.Input placeholder='Email' type='email' onChange={(e, d) => this.handleChange('email')(e, d)} />
                    <Button type='submit' onClick={(e) => this.signup(e)}>Submit</Button>
                </Form>
            </Grid.Column>

        const content = activeItem === 'login' ? loginForm : signUpForm;

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB' }}>
                <Grid centered verticalAlign='middle' columns={4}>
                    <Grid.Row verticalAlign='middle' columns={1} style={{ height: '80vh' }}>
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

