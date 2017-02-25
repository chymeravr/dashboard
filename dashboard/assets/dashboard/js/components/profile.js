import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon } from 'semantic-ui-react'

class Offering extends React.Component {
    constructor(props) {
        super(props);
        this.balance = props.balance;
        this.offering = props.offering;
        this.message = props.message;
    }

    componentWillReceiveProps(nextProps) {
        this.balance = nextProps.balance;
        this.offering = nextProps.offering;
        this.message = nextProps.message;
    }

    render() {
        console.info(this.balance);
        const offeringLinkStyle = {
            fontWeight: 'bold',
            fontSize: '30px',
            textAlign: 'center',
            color: '#eeeeee',
        }
        switch (this.offering) {
            case 'Advertise':
                var message = "Funds available"
                var linkTo = "/advertiser/"
                break;
            case 'Monetise':
                var message = "Earnings available"
                var linkTo = "/publisher/"
                break
        }
        return (
            <div>
                <div className="col s12 m6">
                    <div className="card blue-grey lighten-2">
                        <div className="card-content white-text">
                            <span className="card-title">$ {this.balance}</span>
                            <p>{message}</p>
                        </div>
                        <div className="card-action blue-grey center-align">
                            <Link to={linkTo} style={offeringLinkStyle}>
                                {this.offering}
                            </Link>
                        </div>
                    </div>
                </div >
            </div >
        );
    }
}

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
            <main className="Site-content ui center aligned grid" style={{ backgroundColor: '#2185d0' }}>
                {body}
            </main>
        );
    }
}
