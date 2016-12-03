import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory } from 'react-router'

class SideBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {

        };
    }

    render() {

        return (
            <div className="teal col s3" >
                asdfasd
            asdfasdasdfasd

            asdfasd
            </div>
        );
    }
}

export class AdvertiserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentWillMount() {
        callApiWithJwt('/user/api/campaigns',
            'GET',
            {},
            (response) => this.setState({ campaigns: response }),
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );
    }

    render() {
        debug("Advertiser View", this.state);
        if (!this.state.campaigns) {
            return <div></div> // TODO : Spinner
        }

        var fabStyle = {
            bottom: '195px',
            right: '50px'
        }

        var heightStyle = {
            height: '100%',
            minHeight: '100%'
        }

        return (
            <div className="row" style={heightStyle}>
                <SideBar />
                <div></div>
                <ReactCSSTransitionGroup
                    component="table"
                    transitionName="fadeTransitionFast"
                    transitionAppear={true}
                    transitionLeave={false}
                    transitionEnterTimeout={150}
                    transitionLeaveTimeout={150}
                    transitionAppearTimeout={150}
                    className="table highlight grey-text text-darken-4 col s9 offset-s3">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Total Budget</th>
                            <th>Daily Budget</th>
                            <th>Start Date</th>
                            <th>End Date</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.state.campaigns.map(
                                campaign => {
                                    return (
                                        <tr key={campaign.id} className="grey-text text-darken-1">
                                            <td>{campaign.name}</td>
                                            <td>{campaign.type.name}</td>
                                            <td>{campaign.total_budget}</td>
                                            <td>{campaign.daily_budget}</td>
                                            <td>{campaign.start_date}</td>
                                            <td>{campaign.end_date}</td>
                                            <td>{campaign.status ? "Active" : "Paused"}</td>
                                        </tr>
                                    )
                                }
                            )
                        }
                    </tbody>
                </ReactCSSTransitionGroup>
                <div className="fixed-action-btn" style={fabStyle}>
                    <a className="btn-floating btn-large" onClick={() => alert('clicked')}>
                        <i className="large material-icons">add</i>
                    </a>
                </div>
            </div>
        );
    }
}
