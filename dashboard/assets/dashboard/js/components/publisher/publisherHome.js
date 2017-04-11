var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../../lib.js'
import { SignUp } from './../signUpRow'
import { Grid, Form, Button, Header, Input, Icon, Image, Message, Divider, Segment, Container, List } from 'semantic-ui-react'

export class PublisherHomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            next: '/login',
            loggedIn: false
        };
    }

    componentDidMount() {
        document.title = 'Publisher | Chymera VR'
    }

    componentWillMount() {

    }

    render() {
        const getImageWithCaption = (image, caption) => {
            return (
                <Grid.Column verticalAlign='bottom' width={2}>
                    <Image centered src={'static/img/' + image} />
                    <p className="boldText caption">{caption}</p>
                </Grid.Column>
            )
        }

        const signUpHeader = (
            <Grid.Row>
                <Grid.Column width={12}>
                    <Header as='h3' className="centerText greyText">
                        Are you a VR Publisher looking to monetize?
                        <br />
                        <strong>Reach us!</strong>
                    </Header>
                </Grid.Column>
            </Grid.Row>
        );

        return (
            <main className="Site-content">
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' className='publisherHomeMain' style={{ minHeight: 'calc(80vh)' }}>
                        <Grid.Column width={10}>
                            <Header as='h2' className='centerText whiteText boldText italic'>
                                Monetize your VR &amp; 360<sup>o</sup> Video Content <br />
                                &amp; drive discovery <br /><br />
                                <Button className="ui button navbarButton transparent" onClick={(e, d) => { } }>
                                    <Icon name='book' /> Documentation
                                </Button>
                            </Header>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row className='section' columns={9}>
                        <Grid.Column width={1} />
                        <Grid.Column only='computer' width={3} textAlign='right' verticalAlign='bottom'>
                            <Header as='h1' className='boldText greyText'>
                                Cross  <br />
                                Promotion  <br />
                                Network <br />
                            </Header>
                        </Grid.Column>
                        <Grid.Column only='mobile' width={3} textAlign='center' verticalAlign='bottom'>
                            <Header as='h1' className='boldText greyText'>
                                Cross  <br />
                                Promotion  <br />
                                Network  <br />
                            </Header>
                        </Grid.Column>
                        <Grid.Column stretched width={1} />
                        {getImageWithCaption("integrate-chymera.png", 'INTEGRATE CHYMERA ADS')}
                        <Grid.Column only='computer' width={1}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={1}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("earn-credits.png", 'EARN CREDITS')}
                        <Grid.Column only='computer' width={1}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={1}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("spend-credits.png", 'PROMOTE YOUR APP')}
                        <Grid.Column width={2} />
                    </Grid.Row>
                    <Divider />
                    <Grid.Row columns={3} verticalAlign='middle' className='section'>
                        <Grid.Column only='computer' width={2} />
                        <Grid.Column only='computer' width={4}>
                            <Image centered src="/static/img/access-premium.png" size='small' />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header as='h1' className='boldText blue'>
                                Premium Advertisers
                            </Header>
                            <p style={{ lineHeight: '35px' }}>
                                VR is an excellent platform for storytelling. Did you know that advertisers are excited to
                                unlock the potential of VR to share their brand story? They are eager to shell out big monies
                                to connect with users. So, your search for earnings ends here. Integrate Chymera ads and open
                                a brand new channel for revenue influx.
                            </p>
                        </Grid.Column>
                        <Grid.Column width={2} />
                    </Grid.Row>
                    <Divider />
                    <Grid.Row className='section' verticalAlign='middle'>
                        <Grid stackable columns={16}>
                            <Grid.Row columns={4} verticalAlign='middle' textAlign='left'>
                                <Grid.Column width={2} />
                                <Grid.Column width={6}>
                                    <Header as='h3' className='boldText blue'><Icon name='clock' />Timely payouts </Header>
                                    <p>We make sure your money reaches you at the earliest</p>
                                    <br />
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <Header as='h3' className='boldText blue'><Icon name='cubes' />Unity app?</Header>
                                    <p >Easy to use, drag and drop Chymera Unity SDK</p>
                                    <br />
                                </Grid.Column>
                                <Grid.Column only='computer' width={2} />
                                <Grid.Column only='computer' width={2} />
                                <Grid.Column width={6}>
                                    <Header as='h3' className='boldText blue'><Icon name='android' />Have native Android app for VR?</Header>
                                    <p>Try Chymera Android SDK for Daydream, Cardboard and GearVR</p>
                                    <br />
                                </Grid.Column>
                                <Grid.Column width={6}>
                                    <Header as='h3' className='boldText blue'><Icon name='line chart' />Worried when and where to place ad units?</Header>
                                    <p>Chymera Analytics helps you find out the best time and location for ad placement.</p>
                                </Grid.Column>
                                <Grid.Column width={2} />
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Divider />
                    <Grid.Row columns={16} verticalAlign='middle' className="section">
                        <SignUp headingRow={signUpHeader} />
                    </Grid.Row>
                    <Divider hidden />
                </Grid >
            </main >
        );
    }
}