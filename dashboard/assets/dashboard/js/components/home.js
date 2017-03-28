var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Grid, Form, Button, Header, Input, Icon, Image, Message, Divider, Segment, Container } from 'semantic-ui-react'
// import '../../css/animation.css'

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

        }

        var imgCaptionStyle = {

        }

        const getClientLink = (header, content, link, className) => {
            return (
                <Grid.Column width={8} verticalAlign="center">
                    <div className={className}>
                        <Header as='h2' style={{ fontWeight: 'bold', color: '#008fcb', }}>{header}</Header>
                        <p>{content}</p>
                        <Button content='READ MORE' color="orange" />
                    </div>
                </Grid.Column>
            )
        }

        const getImageWithCaption = (image, caption) => {
            return (
                <Grid.Column verticalAlign='bottom' width={3}>
                    <Image centered src={'static/img/' + image} />
                    <p className="boldText caption">{caption}</p>
                </Grid.Column>
            )
        }

        const submitButton = <Button onClick={this.registerUser} className="button">Sign Up</Button>;

        const topEmailInput =
            <Input fluid error={this.state.emailExists && this.state.registered}
                label={submitButton} placeholder='Email Address' labelPosition='right'
                onChange={this.handleChange('email').bind(this)} value={this.state.email} />

        const bottomEmailInput =
            <Input className='orangeInput' fluid error={this.state.emailExists && this.state.registered}
                label={submitButton} placeholder='Email Address' labelPosition='right'
                onChange={this.handleChange('email').bind(this)} value={this.state.email} />

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB', marginTop: '-100px', }}>
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' style={{ height: '100vh' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header as='h1' className='centerText whiteText'>Cross Promotion Network For <strong>VR</strong></Header>
                                        <p className='centerText whiteText'>
                                            We are the world's smallest ad network
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={10} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {topEmailInput}
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                        <Image src="/static/img/arrow.png" />
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#0d95ce', }}>
                        <Grid.Column>
                            <p className='centerText whiteText'>NEXT EVENT</p>
                        </Grid.Column>
                    </Grid.Row>


                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '200px', paddingTop: '100px', paddingBottom: '100px' }} columns={5}>
                        {getImageWithCaption("integrate-chymera.png", 'INTEGRATE CHYMERA ADS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        {getImageWithCaption("earn-credits.png", 'EARN CREDITS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        {getImageWithCaption("spend-credits.png", 'SPEND CREDITS TO PROMOTE YOUR APP')}
                    </Grid.Row>


                    <Grid.Row columns={2} className='advPubSection' verticalAlign='middle'>
                        {getClientLink('ADVERTISER', 'Advertise with us and make the most of your money. Advertise with us and make the most of your money.', '', 'advertiserSummary')}
                        {getClientLink('PUBLISHER', 'Monetise with us and make the most money. Monetise with us and make the most money. Get rich', '', 'publisherSummary')}
                    </Grid.Row>


                    <Grid.Row columns={2} style={{ minHeight: '200px', paddingTop:'100px' }} className="greyGradientBackground">
                        <Grid stackable>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header as='h2'>ALL FORMAT SUPPORT</Header>
                                    <Image centered src="/static/img/lines-heading.png" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={4}>
                                <Grid.Column width={3}>
                                </Grid.Column>
                                <Grid.Column verticalAlign='bottom' width={5}>
                                    <Image centered src="/static/img/360-image-video.png" />
                                    <Header as='h3'> 360 IMAGE/ VIDEO</Header>
                                    <p>Most immersive formats available at your fingertips</p>
                                </Grid.Column>
                                <Grid.Column verticalAlign='bottom' width={5}>
                                    <Image centered src="/static/img/2d-texture.png" />
                                    <Header as='h3'>2D TEXTURES</Header>
                                    <p>Most immersive in game formats available at your fingertips</p>
                                </Grid.Column>
                                <Grid.Column width={3}></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Image size='medium' style={{ paddingBottom: '100px', paddingTop:'100px' }} centered src="/static/img/all-platforms.png" />
                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ minHeight: '40vh', backgroundColor: '#FFFFFF' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header as='h3' className="centerText">
                                            We are the world's smallest ad network
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={10} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {bottomEmailInput}
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid >
            </main >
        );
    }
}

module.exports = HomeView 