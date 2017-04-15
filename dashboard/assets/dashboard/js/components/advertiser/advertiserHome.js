var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../../lib.js'
import { SignUp } from './../signUpRow'
import { Grid, Form, Button, Header, Input, Icon, Image, Message, Divider, Segment, Container, List } from 'semantic-ui-react'

export class AdvertiserHomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            next: '/login',
            loggedIn: false
        };
    }

    componentDidMount() {
        document.title = 'Advertiser | Chymera VR'
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
                        Are you a VR Advertiser looking to promote your content?
                        <br />
                        <strong>Reach us!</strong>
                    </Header>
                </Grid.Column>
            </Grid.Row>
        );

        return (
            <main className="Site-content">
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' className='advertiserHomeMain' style={{ minHeight: 'calc(80vh)' }}>
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
                    <Grid.Row className='section' columns={9} style={{ minHeight: '300px' }}>

                    </Grid.Row>
                    <Divider />
                    <Grid.Row columns={3} verticalAlign='middle' className='section'>
                        <Grid.Column only='computer' width={2} />
                        <Grid.Column only='computer' width={4}>
                            <Image centered src="/static/img/access-to-premium.png" size='medium' />
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
                    <Grid.Row columns={3} verticalAlign='middle' className='section greyBackground'>
                        <Grid.Column only='computer' width={2} />
                        <Grid.Column width={6}>
                            <Header as='h1' className='boldText blue'>
                                Global audience to reach
                            </Header>
                            <p style={{ lineHeight: '35px' }}>
                                VR is an excellent platform for storytelling. Did you know that advertisers are excited to
                                unlock the potential of VR to share their brand story? They are eager to shell out big monies
                                to connect with users. So, your search for earnings ends here. Integrate Chymera ads and open
                                a brand new channel for revenue influx.
                            </p>
                        </Grid.Column>
                        <Grid.Column only='computer' width={4}>
                            <Image centered src="/static/img/global-audience.png" size='medium' />
                        </Grid.Column>
                        <Grid.Column width={2} />
                    </Grid.Row>
                    <Grid.Row columns={3} verticalAlign='middle' className='section'>
                        <Grid.Column only='computer' width={2} />
                        <Grid.Column only='computer' width={4}>
                            <Image centered src="/static/img/analytics-to-understand.png" size='medium' />
                        </Grid.Column>
                        <Grid.Column width={6}>
                            <Header as='h1' className='boldText blue'>
                                Analytics
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
                    <Grid.Row columns={3} verticalAlign='middle' className='section greyBackground'>
                        <Grid.Column only='computer' width={2} />
                        <Grid.Column width={6}>
                            <Header as='h1' className='boldText blue'>
                                Ad creation services
                            </Header>
                            <p style={{ lineHeight: '35px' }}>
                                VR is an excellent platform for storytelling. Did you know that advertisers are excited to
                                unlock the potential of VR to share their brand story? They are eager to shell out big monies
                                to connect with users. So, your search for earnings ends here. Integrate Chymera ads and open
                                a brand new channel for revenue influx.
                            </p>
                        </Grid.Column>
                        <Grid.Column only='computer' width={4}>
                            <Image centered src="/static/img/ad-creation-services.png" size='medium' />
                        </Grid.Column>
                        <Grid.Column width={2} />
                    </Grid.Row>
                    <Grid.Row columns={2} className="greyGradientBackground section" style={{ paddingBottom: '0px' }}>
                        <Grid.Column>
                            <Grid centered stackable>
                                <Grid.Row columns={1}>
                                    <Grid.Column>
                                        <Header as='h2' className='greyText centerText'>Ad Formats</Header>
                                        <Image centered src="/static/img/lines-heading.png" />
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row columns={2}>
                                    <Grid.Column verticalAlign='top' width={8}>
                                        <Image centered src="/static/img/360-image-video.png" />
                                        <Header as='h3' className="boldText blue"> 360 IMAGE/VIDEO ADS</Header>
                                        <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>Fully immersive user experience using 360 Ad creatives</p>
                                    </Grid.Column>
                                    <Grid.Column verticalAlign='top' width={8}>
                                        <Image centered src="/static/img/2d-texture.png" />
                                        <Header as='h3' className="boldText blue">TEXTURE ADS</Header>
                                        <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>Traditional 2D Ads, strategically placed within VR environment</p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row only='computer' />
                                <Grid.Row>
                                    <Grid.Column>
                                        <Image size='medium' centered src="/static/img/all-platforms.png" />
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={16} verticalAlign='middle' className="section">
                        <SignUp headingRow={signUpHeader} />
                    </Grid.Row>
                    <Divider hidden />
                </Grid>
            </main >
        );
    }
}