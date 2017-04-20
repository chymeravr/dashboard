import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Divider, Header, Input } from 'semantic-ui-react'
import StripeCheckout from 'react-stripe-checkout';

export class ProfileView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { amount: 100, chargeFailed: false, chargeSucceeded: false };
        this.handleChange = this.handleChange.bind(this);
        this.onToken = this.onToken.bind(this);
    }

    componentDidMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            null,
            (response) => {
                this.setState(response);
                document.title = response.username;
            },
            (error) => {
                hashHistory.push('/login/');
            }
        );
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        };
    }

    onToken(token) {
        callApiWithJwt('/user/api/charge',
            'POST',
            JSON.stringify({ token: token.id, amount: this.state.amount }),
            (response) => {
                this.setState(Object.assign({}, this.state, { chargeSucceeded: true, chargeFailed: false }))
            },
            (error) => {
                this.setState(Object.assign({}, this.state, { chargeSucceeded: false, chargeFailed: true }))
            }
        );
    }

    render() {
        debug("profile", this.state);
        var advertisingMessage = "Funds available";
        var publisherMessage = "Earnings available";

        const funds = this.state.advertising_funds - this.state.advertising_burn;
        const earnings = this.state.publisher_earnings - this.state.publisher_payout;

        const amount = this.state.amount;
        if (this.state.user && this.state.user.username) {
            var body = (
                <Grid centered columns={1}>
                    <Grid.Row columns={5} style={{ minHeight: '70vh' }}>
                        <Grid.Column verticalAlign='middle'>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>{this.state.user.username}</Card.Header>
                                    <Card.Description>
                                        <Statistic>
                                            <Statistic.Value style={{ color: funds < 10 ? 'red' : 'green' }}>{funds}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Funds</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{earnings}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Earnings</Statistic.Label>
                                        </Statistic>
                                    </Card.Description>
                                </Card.Content>
                                <Card.Content extra>
                                    <div className='ui two buttons'>
                                        <Button color='teal' as={Link} to='/dashboard/advertiser/'>Advertiser Dashboard</Button>
                                        <Button color='yellow' as={Link} to='/dashboard/publisher/'>Publisher Dashboard</Button>
                                    </div>
                                </Card.Content>
                            </Card>
                            <Divider />
                            <Header as='h3' className='whiteText'>Add Funds</Header>
                            <Input type='number' min='1' step='1' fluid label="Amount ($)" value={amount} onChange={this.handleChange('amount').bind(this)} />
                            {amount != parseInt(amount, 10) ? <Message error className='smallText' content="Please round up the amount to nearest dollar value" /> : ''}
                            <br />
                            <StripeCheckout
                                name="Chymera VR Inc."
                                description="Add funds"
                                token={this.onToken}
                                stripeKey="pk_test_6pRNASCoBOKtIshFeQd4XMUh"
                                amount={this.state.amount * 100}
                                >
                                <Button disabled={amount != parseInt(amount, 10)} fluid content="Pay with Card" color='green' />
                            </StripeCheckout>
                            <br />
                            {this.state.chargeSucceeded ? <Message positive className='smallText' content="Payment Successful" /> : ''}
                            {this.state.chargeFailed ? <Message error className='smallText' content="Payment Failed" /> : ''}
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            )
        } else {
            /**
             * The API call hasn't succeeded yet. TODO Show a spinner'
             */
            var body = <div key="notloaded"></div>
        }
        return (
            <main className="Site-content" style={{ backgroundColor: '#008FCB', minHeight: '100vh' }}>
                {body}
            </main>
        );
    }
}
