var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import { SignUp } from './signUpRow'
import { Grid, Form, Button, Header, Input, Icon, Image, Message, Divider, Segment, Container, List } from 'semantic-ui-react'

export class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            next: '/login',
        };
    }

    componentDidMount() {
        document.title = 'Chymera VR | VR Ad Network'
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => this.setState({ next: '/profile/' }),
            (error) => ({})
        );
    }

    render() {
        debug('home', this.state);

        const getClientLink = (header, content, link, className) => {
            return (
                <Grid.Column width={8} verticalAlign="middle">
                    <div className={className}>
                        <Header as='h2' style={{ fontWeight: 'bold', color: '#008fcb', }}>{header}</Header>
                        <List style={{ padding: '20px 10vw 20px 15vw', textAlign: 'left' }}>
                            {content.map(x =>
                                <List.Item style={{ paddingTop: '20px' }}>
                                    <List.Icon name="angle double right" />
                                    <List.Content>
                                        <p style={{ color: '#444', fontStyle: 'italic' }}>{x}</p>
                                    </List.Content>
                                </List.Item>
                            )}
                        </List>
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

        const signUpHeader = (
            <Grid.Row>
                <Grid.Column width={12}>
                    <Header as='h3' className="centerText">
                        Sign-up on the platform as an Advertiser/Publisher
                    </Header>
                </Grid.Column>
            </Grid.Row>
        );

        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB' }}>
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' style={{ minHeight: 'calc(70vh)' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header as='h1' className='centerText whiteText boldText'>Advertising platform for VR
                                        </Header>
                                        <p className='centerText whiteText'>
                                            Powering engaging ads with highest ROI on premium Apps
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row />
                                <Grid.Row >
                                    <SignUp />
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                        <Image src="/static/img/arrow.png" />
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#0d95ce', }} columns={1}>
                        <Grid.Column width={16}>
                            <p className='centerText whiteText'>Meet us at <strong>SVVR 2017</strong>, 29-31 March in San Jose, CA</p>
                        </Grid.Column>
                    </Grid.Row>


                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '200px', paddingTop: '100px', paddingBottom: '100px' }} columns={5}>
                        {getImageWithCaption("integrate-chymera.png", 'INTEGRATE CHYMERA ADS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={2}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("earn-credits.png", 'EARN CREDITS')}
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column only='mobile' width={2}><Image centered src="/static/img/arrow-down.png" /></Grid.Column>
                        {getImageWithCaption("spend-credits.png", 'PROMOTE YOUR APP')}
                    </Grid.Row>


                    <Grid.Row columns={2} className='advPubSection' verticalAlign='middle'>
                        {getClientLink('ADVERTISER',
                            ['Ad formats with higher interaction rates',
                                'Ad spend that generates more conversions',
                                'Harness VR data to analyze user behaviour',
                                'Advertise on best VR apps'],
                            '', 'summary advertiserSummary')}

                        {getClientLink('PUBLISHER',
                            ['Ad formats designed for the best user experience',
                                'Channelize advertisers willingness to spend in VR',
                                'Generate more revenue through premium VR ads',
                                'Integrate highest quality ads'], '', 'summary publisherSummary')}
                    </Grid.Row>


                    <Grid.Row columns={2} style={{ minHeight: '200px', paddingTop: '100px' }} className="greyGradientBackground">
                        <Grid stackable>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header as='h2' style={{ color: '#444' }}>Ad Formats</Header>
                                    <Image centered src="/static/img/lines-heading.png" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row only='computer' style={{ height: '100px' }} />
                            <Grid.Row columns={4}>
                                <Grid.Column width={3} only='computer'>
                                </Grid.Column>
                                <Grid.Column verticalAlign='top' width={5}>
                                    <Image centered src="/static/img/360-image-video.png" />
                                    <Header as='h3' className="boldText blue"> 360 IMAGE/VIDEO AD</Header>
                                    <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>Fully immersive user experience using 360 Ad creatives</p>
                                </Grid.Column>
                                <Grid.Column verticalAlign='top' width={5}>
                                    <Image centered src="/static/img/2d-texture.png" />
                                    <Header as='h3' className="boldText blue">TEXTURE ADS</Header>
                                    <p style={{ paddingLeft: '40px', paddingRight: '40px' }}> Use traditional 2D Ads, strategically placed within VR environment</p>
                                </Grid.Column>
                                <Grid.Column width={3} only='computer' />
                            </Grid.Row>
                            <Grid.Row>
                                <Grid.Column>
                                    <Image size='medium' style={{ paddingBottom: '50px', paddingTop: '50px' }} centered src="/static/img/all-platforms.png" />

                                </Grid.Column>
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ backgroundColor: '#FFFFFF', padding: '10rem 0 10rem 0' }}>
                        <SignUp headingRow={signUpHeader} bordered={true} />
                    </Grid.Row>
                </Grid >
            </main >
        );
    }
}