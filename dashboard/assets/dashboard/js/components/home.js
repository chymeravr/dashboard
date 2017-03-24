var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Grid, Form, Button, Header, Input, Icon, Image, Message, Divider, Segment } from 'semantic-ui-react'
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

    componentDidMount() {
        document.title = "Chymera VR";

        var width = Math.max(960, innerWidth),
            height = Math.max(500, innerHeight);
        var timer;
        var m;
        var i = 170;
        var svg = d3.select("#animatedBackground").append("svg")
            .attr("width", width)
            .attr("height", height)
            .attr("class", "slider");

        svg.append("rect")
            .attr("width", width)
            .attr("height", height)
            .on("ontouchstart" in document ? "touchmove" : "mousemove", setMousePosition);

        svg.on("mouseover", onMouseOver);
        svg.on("mouseout", onMouseOut);

        function onMouseOver() {
            m = d3.mouse(this);
            timer = setInterval(particle, 500);
            d3.event.preventDefault();
        }
        function onMouseOut() {
            clearInterval(timer);
        }
        function setMousePosition() {
            m = d3.mouse(this);
            particle();
            d3.event.preventDefault();
        }
        function particle() {
            var color;// = (i = (i + 1) % 210);
            if (i > 1) {
                i = 0.7;
            }
            i += 0.05;
            color = i;
            svg.insert("circle", "rect")
                .attr("cx", m[0])
                .attr("cy", m[1])
                .style("stroke", d3.hsl(198, 1, i))
                .attr("r", 1e-6)
                .style("stroke-opacity", 0.3)
                .transition()
                .duration(1000)
                .ease(Math.sqrt)
                .attr("r", 100)
                .style("stroke-opacity", 1e-6)
                .remove();

        }
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
            color: '#FFFFFF',
            fontSize: '60px',
            textAlign: 'center',
        }

        var imgCaptionStyle = {
            textAlign: 'center',
            color: '#444'
        }

        var submitButton = <Button color='orange' onClick={this.registerUser}>Sign Up</Button>;
        return (
            <main className="Site-content ui center aligned grid" style={{ backgroundColor: '#008FCB' }}>
                <Grid stackable centered columns={16} style={{ margin: 0 }} verticalAlign='middle'>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ height: '70vh' }} id="animatedBackground">
                        <Grid.Column width={10} style={{ position: 'absolute', zIndex: 2 }}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <Header as='h1' style={style}>Cross Promotion Network For <strong>VR</strong></Header>
                                        <p style={Object.assign({}, style, { fontSize: '20px', fontWeight: 'normal !important' })}>
                                            We are the world's smallest ad network
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={8} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            <Input style={{ position:'absolute', zIndex:10, width:'200px'}} fluid error={this.state.emailExists && this.state.registered}
                                                action={submitButton} placeholder='Email Address' onChange={this.handleChange('email').bind(this)} value={this.state.email} />
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#008FCB' }}>
                        <Image src="/static/img/arrow.png" />
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#0d95ce' }}>
                        <Header as='h6' style={Object.assign({}, style, { fontSize: '20px' })}>NEXT EVENT <strong>VR</strong></Header>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '200px' }}></Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '200px' }} columns={5}>
                        <Grid.Column verticalAlign='bottom' width={3}>
                            <Image centered src="/static/img/integrate-chymera.png" />
                            <Header as='h1' style={imgCaptionStyle}>INTEGRATE CHYMERA ADS</Header>
                        </Grid.Column>
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column verticalAlign='bottom' width={3}>
                            <Image centered src="/static/img/earn-credits.png" />
                            <Header as='h1' style={imgCaptionStyle}>EARN CREDITS</Header>
                        </Grid.Column>
                        <Grid.Column only='computer' width={2}><Image centered src="/static/img/arrow-right.png" /></Grid.Column>
                        <Grid.Column verticalAlign='bottom' width={3}>
                            <Image centered src="/static/img/spend-credits.png" />
                            <Header as='h1' style={imgCaptionStyle}>SPEND CREDITS TO PROMOTE YOUR APP</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row style={{ backgroundColor: '#FFF', minHeight: '150px' }}></Grid.Row>
                    <Grid.Row columns={2} style={{ backgroundColor: '#f9f9f9', minHeight: '200px', margin: '0px', padding: '0px' }}>
                        <Grid.Column width={8} verticalAlign="center" style={{ backgroundImage: 'url(static/img/advertiser.png)', backgroundSize: 'cover', height: '600px', paddingTop: '50px' }}>
                            <Header as='h1' style={{ fontSize: '40px', fontWeight: 'bold', color: '#008fcb', paddingTop: '100px' }}>ADVERTISER</Header>
                            <Header as='h1' style={{ fontSize: '30px', fontWeight: 'normal', color: '#444', maxWidth: '500px', margin: '0px auto', paddingBottom: '50px' }}>
                                Advertise with us and make the most of your money. Advertise with us and make the most of your money.
                                </Header>
                            <Button content='READ MORE' color="orange" />
                        </Grid.Column>
                        <Grid.Column width={8} verticalAlign="center" style={{ backgroundImage: 'url(static/img/publisher.png)', backgroundSize: 'cover', height: '600px', paddingTop: '50px' }}>
                            <Header as='h1' style={{ fontSize: '40px', fontWeight: 'bold', color: '#008fcb', paddingTop: '100px' }}>PUBLISHER</Header>
                            <Header as='h1' style={{ fontSize: '30px', fontWeight: 'normal', color: '#444', maxWidth: '500px', margin: '0px auto', paddingBottom: '50px' }}>
                                Monetise with us and make the most money. Monetise with us and make the most money.
                                </Header>
                            <Button content='READ MORE' color="orange" />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={2} style={{ minHeight: '200px', margin: '0px', padding: '0px' }} className="greyGradientBackground">
                        <Grid>
                            <Grid.Row columns={1}>
                                <Grid.Column>
                                    <Header as='h1' style={{ fontSize: '40px', fontWeight: 'bold', color: '#4a4a4a', paddingTop: '100px' }}>ALL FORMAT SUPPORT</Header>
                                    <Image centered src="/static/img/lines-heading.png" />
                                </Grid.Column>
                            </Grid.Row>
                            <Grid.Row columns={4} style={{ paddingTop: '100px' }}>
                                <Grid.Column width={3}>
                                </Grid.Column>
                                <Grid.Column verticalAlign='bottom' width={5}>
                                    <Image centered src="/static/img/360-image-video.png" />
                                    <Header as='h1' style={{ color: "#1196ce", textAlign: 'center' }}> 360 IMAGE/ VIDEO</Header>
                                    <Header as='h3' style={{ color: '#353535', fontWeight: 'normal' }}>Most immersive formats available at your fingertips</Header>
                                </Grid.Column>
                                <Grid.Column verticalAlign='bottom' width={5}>
                                    <Image centered src="/static/img/2d-texture.png" />
                                    <Header as='h1' style={{ color: "#1196ce", textAlign: 'center' }}>2D TEXTURES</Header>
                                    <Header as='h3' style={{ color: '#353535', fontWeight: 'normal' }}>Most immersive in game formats available at your fingertips</Header>
                                </Grid.Column>
                                <Grid.Column width={3}></Grid.Column>
                            </Grid.Row>
                            <Grid.Row>
                                <Image style={{ padding: '100px' }} centered src="/static/img/all-platforms.png" />
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ minHeight: '40vh', backgroundColor: '#FFFFFF' }}>
                        <Grid.Column width={10}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                    <Grid.Column width={12}>
                                        <p style={Object.assign({}, style, { fontSize: '20px', fontWeight: 'normal', color: '#505050' })}>
                                            We are the world's smallest ad network
                                        </p>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column width={8} >
                                        <Form>
                                            {this.state.emailExists ? <Message negative><p>Email invalid or already registered!</p></Message> : ''}
                                            {this.state.registered ? <Message positive><p>Email registered!</p></Message> : ''}
                                            <Input fluid error={this.state.emailExists && this.state.registered} action={submitButton} placeholder='Email Address' onChange={this.handleChange('email').bind(this)} value={this.state.email} />
                                        </Form>
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}

module.exports = HomeView 