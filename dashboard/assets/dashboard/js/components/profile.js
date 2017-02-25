import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon } from 'semantic-ui-react'

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            null,
            (response) => {
                // List of users will have exacatly 1 element
                this.setState(response[0]);
                document.title = response[0].username;
            },
            (error) => {
                hashHistory.push('/login/');
            }
        );
    }

    render() {
        console.info(this.state);
        var advertisingMessage = "Funds available";
        var publisherMessage = "Earnings available";
        if (this.state.user && this.state.user.username) {
            var body = (
                // Key is important for transitions
                <div key="loaded" className="row">
                    <Grid centered stretched verticalAlign='middle' columns={4}>
                        <Grid.Row verticalAlign='middle'>
                            <Grid.Column verticalAlign='middle'>
                                <Card>
                                    <Card.Content>
                                        <Card.Header>{this.state.user.username}</Card.Header>
                                        <Card.Description>
                                            <Statistic>
                                                <Statistic.Label>Funds</Statistic.Label>
                                                <Statistic.Value>{this.state.advertising_budget}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            </Statistic>
                                            <Statistic>
                                                <Statistic.Label>Earnings</Statistic.Label>
                                                <Statistic.Value>{this.state.publisher_earnings}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            </Statistic>
                                        </Card.Description>
                                    </Card.Content>
                                    <Card.Content extra>
                                        <div className='ui two buttons'>
                                            <Button color='blue' as={Link} to='/advertiser/'>Advertise</Button>
                                            <Button inverted color='blue' as={Link} to='/publisher/'>Monetize</Button>
                                        </div>
                                    </Card.Content>
                                </Card>
                            </Grid.Column>
                        </Grid.Row>
                    </Grid>
                </div>
            )
        } else {
            /**
             * The API call hasn't succeeded yet. TODO Show a spinner'
             */
            var body = <div key="notloaded"></div>
        }
        return (
            <main className="Site-content ui center aligned grid" style={{ backgroundColor: '#2185d0', height: '100vh' }}>
                {body}
            </main>
        );
    }
}
