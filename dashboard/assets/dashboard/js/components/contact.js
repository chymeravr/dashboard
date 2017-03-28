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
                <Grid stackable columns={1} verticalAlign='top' style={{ paddingTop: '100px' }}>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={6}>
                            <Header as='h1' style={Object.assign({}, style, { textAlign: 'left' })}>OFFICE</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1}>
                        <Grid.Column width={6}>
                            <Table basic='very'>
                                <Table.Body>
                                    <Table.Row>
                                        <Table.Cell />
                                        <Table.Cell>
                                            <Item.Group>
                                                <Item>
                                                    <Item.Content>
                                                        <Item.Header>United States</Item.Header>
                                                        <Item.Extra>San Francisco, CA</Item.Extra>
                                                        <Item.Description>
                                                            Ideapad Technologies Pvt. Ltd. <br />
                                                            91springboard, 3rd Floor <br />
                                                            Padmavati Complex, 80 ft Road <br />
                                                            Koramangala 8th Block, Bengaluru <br />
                                                            560095
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                            </Item.Group>
                                        </Table.Cell>
                                        <Table.Cell>
                                            <Item.Group style={{ textAlign: 'left' }}>
                                                <Item>
                                                    <Item.Content>
                                                        <Item.Header>India</Item.Header>
                                                        <Item.Extra>Bengaluru, KA</Item.Extra>
                                                        <Item.Description>
                                                            Ideapad Technologies Pvt. Ltd. <br />
                                                            91springboard, 3rd Floor <br />
                                                            Padmavati Complex, 80 ft Road <br />
                                                            Koramangala 8th Block, Bengaluru <br />
                                                            560095
                                                        </Item.Description>
                                                    </Item.Content>
                                                </Item>
                                            </Item.Group>
                                        </Table.Cell>
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={6}>
                            <Divider fitted />
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={4}>
                        <Grid.Column width={5} />
                        <Grid.Column width={2} >
                            <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Write to us</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: 'normal' }} href="mailto:help@chymeravr.com" target="_top">help@chymeravr.com</a>
                            </Header>
                            <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Sales enquiry</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: 'normal' }} href="mailto:sales@chymeravr.com" target="_top">sales@chymeravr.com</a>
                            </Header>
                        </Grid.Column>
                        <Grid.Column width={3}>
                            <Header as='h3' style={{ color: '#444', fontWeight: 'bold' }}>Mailing Address</Header>
                            Ideapad Technologies Pvt. Ltd. <br />
                            91springboard, 3rd Floor <br />
                            Padmavati Complex, 80 ft Road <br />
                            Koramangala 8th Block, Bengaluru <br />
                            560095
                         </Grid.Column>
                        <Grid.Column width={6} />
                    </Grid.Row>
                </Grid>
            </main>
        );
    }
}
