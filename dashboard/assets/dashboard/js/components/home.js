var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Grid, Form, Button, Header, Input, Icon, Message } from 'semantic-ui-react'
import '../../css/animation.css'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            next: '/login',
            emailExists: false,
            registered: false
        };
        this.handleChange = this.handleChange.bind(this);
        this.registerUser = this.registerUser.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => this.setState({ next: '/profile/' }),
            (error) => ({})
        );
    }

    componentDidMount() {
        document.title = "Chymera VR";
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        };
    }

    registerUser() {
        callApiWithJwt(
            '/user/api/preview_register',
            'POST',
            JSON.stringify({ user_email: this.state.email }),
            (response) => {
                (this.setState(Object.assign({}, this.state, { emailExists: false, registered: true })))
            },
            (error) => {
                (this.setState(Object.assign({}, this.state, { emailExists: true, registered: false })))
            },
            201
        );
    }

    render() {
        debug('home', this.state);
        var style = {
            fontWeight: "bold",
            color: '#FFFFFF',
            fontSize: '50px'
        }

        var submitButton = <Button color='orange' onClick={this.registerUser}>Sign Up!</Button>;
        return (
            <main className="Site-content ui center aligned grid" style={{ backgroundColor: '#2185d0' }}>
                <Grid centered columns={16} style={{ margin: 0 }} verticalAlign='middle'>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ height: '92vh' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={4} />
                                    <Grid.Column width={9}>
                                        <Header as='h1' style={style}>Cross Promotion Network For <strong>VR</strong></Header>
                                    </Grid.Column>
                                    <Grid.Column width={3} />

                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={4} />
                                    <Grid.Column width={9} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            <Input fluid error={this.state.emailExists && this.state.registered} action={submitButton} placeholder='Email Address' onChange={this.handleChange('email').bind(this)} value={this.state.email} />
                                        </Form>
                                    </Grid.Column>
                                    <Grid.Column width={3} />
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <div className="floating"><Icon inverted size='massive' name="rocket icon" /></div>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={16} style={{ backgroundColor: '#FFFFFF', height: '50vh' }}>
                        <Grid.Row>
                            <Header as='h1' style={style}>Cross Promotion Network For VR</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Form>
                                <Input action='Search' placeholder='Search' style={{ paddingRight: '0px' }} />
                            </Form>
                        </Grid.Row>
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}

module.exports = HomeView 