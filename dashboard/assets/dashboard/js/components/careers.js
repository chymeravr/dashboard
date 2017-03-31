import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Header, Input, Flag, Table, Item, Divider, Accordion } from 'semantic-ui-react'

export class CareerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        $('.ui.accordion')
            .accordion()
            ;
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
                        <Grid.Column width={8}>
                            <Header as='h1' style={Object.assign({}, style, { textAlign: 'left' })}>We are hiring!</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={8}>
                            <Accordion fluid styled defaultActiveIndex={0}>
                                <Accordion.Title><Header as='h3'>Software Engineer</Header></Accordion.Title>
                                <Accordion.Content>
                                    <p>
                                        A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
                                        it can be found as a welcome guest in many households across the world.
                                    </p>
                                </Accordion.Content>
                                <Accordion.Title><Header as='h3'>Software Engineer</Header></Accordion.Title>
                                <Accordion.Content>
                                    <p>
                                        A dog is a type of domesticated animal. Known for its loyalty and faithfulness,
                                        it can be found as a welcome guest in many households across the world.
                                    </p>
                                </Accordion.Content>
                            </Accordion>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={8}>
                            <Header as='h3' className='boldText greyText'>Reach out to us</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: '300' }} href="mailto:jobs@chymeravr.com" target="_top">jobs@chymeravr.com</a>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}
