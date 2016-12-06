import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6

class Offering extends React.Component {
    render() {
        const offeringLinkStyle = {
            fontWeight: 'bold',
            fontSize: '30px',
            textAlign: 'center',
            color: '#eeeeee',
        }
        switch (this.props.offering) {
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
                            <span className="card-title">$ {this.props.balance}</span>
                            <p>{message}</p>
                        </div>
                        <div className="card-action blue-grey center-align">
                            <Link to={linkTo} style={offeringLinkStyle}>
                                {this.props.offering}
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
            (response) => this.setState(response),
            (error) => {
                hashHistory.push('/login/');
            }
        );
    }

    render() {
        // debug("Profile View", this.state);
        var advertisingMessage = "Funds available";
        var publisherMessage = "Earnings available";
        if (this.state.username) {
            var body = (
                // Key is important for transitions
                <div key="loaded" className="row">
                    <div className="col s8 offset-s2">
                        <Offering offering="Advertise"
                            balance={this.state.advertising_budget} />
                        <Offering offering="Monetise"
                            balance={this.state.publisher_earnings} />
                    </div>
                </div>
            )
        } else {
            /**
             * The API call hasn't succeeded yet. TODO Show a spinner'
             */
            var body = <div key="notloaded"></div>
        }
        return (
            <ReactCSSTransitionGroup
                transitionName="fadeTransition"
                transitionAppear={true}
                transitionLeave={false}
                transitionEnterTimeout={500}
                transitionLeaveTimeout={500}
                transitionAppearTimeout={500}
                className="container">
                {body}
            </ReactCSSTransitionGroup>
        );
    }
}
