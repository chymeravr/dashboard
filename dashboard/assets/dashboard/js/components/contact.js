import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Header, Input, Flag, Table, Item, Divider } from 'semantic-ui-react'

export class ContactView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = 'Contact Us | Chymera VR'
    }
    

    render() {

        var style = {
            color: '#008fcb',
            fontSize: '60px',
            textAlign: 'center',
            fontWeight: 300,
        }

        return (
            <main className="Site-content centre ui aligned" style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
                <Grid stackable columns={10} verticalAlign='top' style={{ paddingTop: '100px', paddingLeft: '20px' }}>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={6}>
                            <Header as='h1' style={Object.assign({}, style, { textAlign: 'left' })}>Office</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={2}>
                        <Grid.Column width={3}>
                            <Item.Group>
                                <Item>
                                    <Item.Content>
                                        <Item.Header>United States</Item.Header>
                                        <Item.Extra>San Francisco, CA</Item.Extra>
                                        <Item.Description>
                                            1535 Mission Street<br />
                                            (650) 336 5405
                                        </Item.Description>
                                    </Item.Content>
                                </Item>
                            </Item.Group>
                        </Grid.Column>
                        <Grid.Column width={3}>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={6}>
                            <Divider fitted />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={4}>
                        <Grid.Column width={5} />
                        <Grid.Column width={3} >
                            <Header as='h3' className='boldText greyText'>Write to us</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: '300' }} href="mailto:info@chymeravr.com" target="_top">info@chymeravr.com</a>
                            </Header>
                            <Header as='h3' className='boldText greyText'>Sales enquiry</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: '300' }} href="mailto:sales@chymeravr.com" target="_top">sales@chymeravr.com</a>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={2}>
                            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3153.6961475840726!2d-122.41972038468245!3d37.77372227975972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8085809de8449d55%3A0x930cde3edb0c120c!2s1535+Mission+St%2C+San+Francisco%2C+CA+94103%2C+USA!5e0!3m2!1sen!2sin!4v1490792625405" frameBorder="0" style={{ border: 0 }} allowFullScreen></iframe>
                        </Grid.Column>
                        <Grid.Column width={6} />
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}
