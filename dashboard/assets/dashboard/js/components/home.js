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
                <Grid.Column width={8} verticalAlign="middle">
                    <div className={className}>
                        <Header as='h2' style={{ fontWeight: 'bold', color: '#008fcb', }}>{header}</Header>
                        <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>{content}</p>
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

        const submitButton = <Button onClick={(e, d) => { this.registerUser(); e.preventDefault(); } } className="button">Sign Up</Button >;
        const mobileSubmitButton = <Button fluid onClick={(e, d) => { this.registerUser(); e.preventDefault(); } } className="button">Sign Up</Button>;
        const topEmailInput =
            <Input fluid error={this.state.emailExists && this.state.registered}
                label={submitButton} placeholder='Email Address' labelPosition='right'
                onChange={this.handleChange('email').bind(this)} value={this.state.email} />

        const topEmailInputMobile = (
            <div>
                <Input fluid error={this.state.emailExists && this.state.registered}
                    placeholder='Email Address' labelPosition='right'
                    onChange={this.handleChange('email').bind(this)} value={this.state.email} />
                <br />
                {mobileSubmitButton}
            </div>
        )

        const bottomEmailInput =
            <Input className='orangeInput' fluid error={this.state.emailExists && this.state.registered}
                label={submitButton} placeholder='Email Address' labelPosition='right'
                onChange={this.handleChange('email').bind(this)} value={this.state.email} />

        const bottomEmailInputMobile =
            <div>
                <Input className='orangeInput' fluid error={this.state.emailExists && this.state.registered}
                    placeholder='Email Address' labelPosition='right'
                    onChange={this.handleChange('email').bind(this)} value={this.state.email} />
                <br />
                {mobileSubmitButton}
            </div>

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB' }}>
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' style={{ minHeight: '100vh' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header as='h1' className='centerText whiteText boldText'>Virtual Reality Monetization and Advertising Network
                                        </Header>
                                        <p className='centerText whiteText'>
                                            Chymera enables VR developers to monetize content via premium advertisements
                                                and drive higher engagement. <br />We deliver value to advertisers, helping their
                                                consumers discover new products in a highly immersive medium.
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row only='computer'>
                                    <Grid.Column width={10} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {topEmailInput}
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row only='mobile'>
                                    <Grid.Column width={14} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {topEmailInputMobile}
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                        <Image src="/static/img/arrow.png" />
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#0d95ce', }} columns={1}>
                        <Grid.Column width={4}>
                            <p className='centerText whiteText'>MEET US AT SVVR 2017, 29-31 MARCH IN SAN JOSE, CA</p>
                        </Grid.Column>
                    </Grid.Row>


                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '200px', paddingTop: '100px', paddingBottom: '100px' }} columns={5}>
                        {getImageWithCaption("integrate-chymera.png", 'INTEGRATE CHYMERA ADS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={2}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("earn-credits.png", 'EARN CREDITS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={2}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("spend-credits.png", 'SPEND CREDITS TO PROMOTE YOUR APP')}
                    </Grid.Row>


                    <Grid.Row columns={2} className='advPubSection' verticalAlign='middle'>
                        {getClientLink('ADVERTISER', 'Immerse target audience in VR to help them discover new products', '', 'advertiserSummary')}
                        {getClientLink('PUBLISHER', 'Monetize your VR apps/games and 360 content via premium Ads', '', 'publisherSummary')}
                    </Grid.Row>


                    <Grid.Row columns={2} style={{ minHeight: '200px', paddingTop: '100px' }} className="greyGradientBackground">
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
                                    <Header as='h3' className="boldText blue"> 360 IMAGE/VIDEO</Header>
                                    <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>Fully immersive user experience using 360 Ad creatives</p>
                                </Grid.Column>
                                <Grid.Column verticalAlign='bottom' width={5}>
                                    <Image centered src="/static/img/2d-texture.png" />
                                    <Header as='h3' className="boldText blue">2D TEXTURES</Header>
                                    <p style={{ paddingLeft: '40px', paddingRight: '40px' }}> Use traditional 2D Ads, strategically placed within VR environment</p>
                                </Grid.Column>
                                <Grid.Column width={3}></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Image size='medium' style={{ paddingBottom: '100px', paddingTop: '100px' }} centered src="/static/img/all-platforms.png" />
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
                                            Sign-up on the platform as an Advertiser/Publisher
                                        </Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row only='computer'>
                                    <Grid.Column width={10} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {bottomEmailInput}
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row only='mobile'>
                                    <Grid.Column width={14} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            {bottomEmailInputMobile}
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