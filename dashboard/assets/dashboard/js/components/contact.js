import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Header, Input, Flag } from 'semantic-ui-react'

export class ContactView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {

    }

    render() {

        var style = {
            color: '#008fcb',
            fontSize: '60px',
            textAlign: 'center',
            fontWeight: 300,
        }

        return (
            <main className="Site-content ui aligned grid" style={{ backgroundColor: '#FFF', height: '100vh' }}>
                <Grid stretched verticalAlign='middle' columns={1}>
                    <Grid.Row columns={1} style={{ height: '70vh' }} id="animatedBackground">
                        <Grid.Column width={16} style={{ position: 'absolute', zIndex: 2 }}>
                            <Grid>
                                <Grid.Row columns={2}>
                                    <Grid.Column width={5} />
                                    <Grid.Column width={11}>
                                        <Header as='h1' style={Object.assign({}, style, { textAlign: 'left' })}>Get in touch!</Header>
                                    </Grid.Column>
                                </Grid.Row>
                                <Grid.Row centered columns={3}>
                                    <Grid.Column width={5} />
                                    <Grid.Column width={6}>
                                        <Card.Group>
                                            <Card>
                                                <Card.Content>
                                                    <Card.Header style={{ color: '#444' }}>United States</Card.Header>
                                                    <Card.Meta>San Francisco</Card.Meta>
                                                    <Card.Description>
                                                        Ideapad Technologies Pvt. Ltd. <br />
                                                        91springboard, 3rd Floor <br />
                                                        Padmavati Complex, 80 ft Road <br />
                                                        Koramangala 8th Block, Bengaluru <br />
                                                        560095
                                                    </Card.Description>
                                                </Card.Content>
                                            </Card>
                                            <Card>
                                                <Card.Content>
                                                    <Card.Header style={{ color: '#444' }}>India</Card.Header>
                                                    <Card.Meta>Bengaluru</Card.Meta>
                                                    <Card.Description>
                                                        Ideapad Technologies Pvt. Ltd. <br />
                                                        91springboard, 3rd Floor <br />
                                                        Padmavati Complex, 80 ft Road <br />
                                                        Koramangala 8th Block, Bengaluru <br />
                                                        560095
                                                    </Card.Description>
                                                </Card.Content>
                                            </Card>
                                        </Card.Group>
                                    </Grid.Column>
                                    <Grid.Column width={5} />
                                </Grid.Row>
                                <Grid.Row centered columns={2}>
                                    <Grid.Column width={3}>
                                        <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Write to us</Header>
                                        <Header as='a' >
                                            <a style={{ color: '#008fcb', fontWeight: 'normal' }} href="mailto:help@chymeravr.com" target="_top">help@chymeravr.com</a>
                                        </Header>
                                        <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Sales enquiry</Header>
                                        <Header as='a' >
                                            <a style={{ color: '#008fcb', fontWeight: 'normal' }} href="mailto:sales@chymeravr.com" target="_top">sales@chymeravr.com</a>
                                        </Header>
                                    </Grid.Column>
                                    <Grid.Column width={3} textAlignment='right'>
                                        <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Mailing Address</Header>
                                        Ideapad Technologies Pvt. Ltd. <br />
                                        91springboard, 3rd Floor <br />
                                        Padmavati Complex, 80 ft Road <br />
                                        Koramangala 8th Block, Bengaluru <br />
                                        560095
                                    </Grid.Column>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main>
        );
    }
}
