var React = require('react');
var Link = require('react-router').Link
import { hashHistory } from 'react-router'
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
                <Grid.Column width={5} className={className}>
                    <div >
                        <Header as='h2' style={{ fontWeight: 'bold', color: '#008fcb', }}>{header}</Header>
                        <p style={{ textAlign: 'left' }}>{content}</p>
                        <Button as='a' content='Read More' color="orange" onClick={(e, d) => hashHistory.push(link)} />
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
            <main className="Site-content" >
                <Grid stackable centered verticalAlign='middle'>
                    <Grid.Row columns={1} verticalAlign='middle' style={{ minHeight: 'calc(70vh)', marginTop: '-10px' }} className='blueBg'>
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
                    <Grid.Row className="blueBg">
                        <Image src="/static/img/arrow.png" />
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#0d95ce', }} columns={1}>
                        <Grid.Column width={16}>
                            <p className='centerText whiteText'>Meet us at <strong>SVVR 2017</strong>, 29-31 March in San Jose, CA</p>
                        </Grid.Column>
                    </Grid.Row>


                    <Grid.Row className='section' columns={5}>
                        {getImageWithCaption("cross-promotion.png", 'CROSS PROMOTE')}
                        {getImageWithCaption("increase-downloads.png", 'TARGET HIGH VALUE USERS')}
                        {getImageWithCaption("access-premium.png", 'MONETIZE')}
                    </Grid.Row>


                    <Grid.Row columns={4} className='advPubSection' verticalAlign='top' style={{paddingBottom:'0px'}}>
                        <Grid.Column width={1} />
                        {getClientLink('ADVERTISER',
                            "VR is an amazing platform for story-telling. Research has shown that VR \
                            content evokes more intense emotions than traditional 2D platforms\
                            . Don't you want to leave a long lasting impression of your brand in user's mind?",
                            '/advertiser/', 'summary advertiserSummary')}
                        <Grid.Column width={1} />
                        {getClientLink('PUBLISHER',
                            "Being much more effective and engaging than traditional ads, VR advertising is attracting\
                             leading advertisers globally. And guess what, we make sure Chymera ads aren't intrusive",
                            '/publisher/', 'summary publisherSummary')}
                        <Grid.Column width={1} />
                    </Grid.Row>


                    <Grid.Row columns={2} className="greyGradientBackground section">
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
                                        <Header as='h3' className="boldText blue"> 360 IMAGE/VIDEO AD</Header>
                                        <p style={{ paddingLeft: '40px', paddingRight: '40px' }}>Fully immersive user experience using 360 Ad creatives</p>
                                    </Grid.Column>
                                    <Grid.Column verticalAlign='top' width={8}>
                                        <Image centered src="/static/img/2d-texture.png" />
                                        <Header as='h3' className="boldText blue">TEXTURE ADS</Header>
                                        <p style={{ paddingLeft: '40px', paddingRight: '40px' }}> Use traditional 2D Ads, strategically placed within VR environment</p>
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
                    <Grid.Row columns={16} verticalAlign='middle' className='section'>
                        <SignUp headingRow={signUpHeader} bordered={true} />
                    </Grid.Row>
                    <Divider hidden />
                </Grid >
            </main >
        );
    }
}