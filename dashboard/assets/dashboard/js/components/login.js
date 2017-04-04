import React from 'react'
import { config } from '../config.js'
import { hashHistory } from 'react-router';
import { callRawApiWithJwt, callApiWithJwt, debug } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { FormInput } from './common'
import { Button, Form, Container, Grid, Message, Header } from 'semantic-ui-react'

export class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            failed: false
        };
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => hashHistory.push('/profile/'),
            (error) => {
            }
        );
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

    tryLogin(e) {
        e.preventDefault();
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
                this.setState({ failed: true });
            });
    }

    render() {
        const errorMessage = this.state.failed ? (
            <Message
                error
                header='Invalid credentials'
                content='Username and Password are case sensitive'
                />
        ) : <div></div>

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB' }}>
                <Grid centered verticalAlign='middle' columns={4}>
                    <Grid.Row verticalAlign='middle' columns={1} style={{ height: '80vh' }}>
                        <Grid.Column verticalAlign='middle' width={4}>
                            <Header as='h1' className='whiteText'>Login!</Header>
                            {errorMessage}
                            <Form>
                                <Form.Input placeholder='Username' onChange={(e, d) => this.handleChange('username')(e, d)} />
                                <Form.Input placeholder='Password' type='password' onChange={(e, d) => this.handleChange('password')(e, d)} />
                                <Button type='submit' onClick={(e) => this.tryLogin(e)}>Login</Button>
                            </Form>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main>
        );
    }
}

