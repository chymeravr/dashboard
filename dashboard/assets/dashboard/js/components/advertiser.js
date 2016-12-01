import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'

class Offering extends React.Component {
    render() {
        const offeringLinkStyle = {
            fontWeight: 'bold',
            fontSize: '30px',
            textAlign: 'center',
            color: '#eeeeee',
        }
        return (
            <div class="row">
                <div className="col s12 m6">
                    <div className="card blue-grey lighten-2">
                        <div className="card-content white-text">
                            <span className="card-title">$ {this.props.balance}</span>
                            <p>{this.props.message}</p>
                        </div>
                        <div className="card-action blue-grey center-align">
                            <a href="#" style={offeringLinkStyle}>
                                {this.props.offering}
                            </a>
                        </div>
                    </div>
                </div>
            </div>
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
            {},
            (response) => this.setState(response),
            (error) => alert(error)
        );
    }

    render() {
        debug("Profile View", this.state);

        var body = <div></div>
        var advertisingMessage = "Funds available";
        var publisherMessage = "Earnings available";
        if (this.state.username) {
            body = (
                <div className="row">
                    <div className="col s8 offset-s2">
                        <Offering offering="Advertise"
                            balance={this.state.advertising_budget}
                            message={advertisingMessage} />
                        <Offering offering="Monetise"
                            balance={this.state.publisher_earnings}
                            message={publisherMessage} />
                    </div>
                </div>
            )
        }
        return (
            <div className="container valign">
                {body}
            </div>
        );
    }
}
