import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner } from '../common'
import { CampaignEditModal } from './campaignModal'


/**
 * Store direct properties of campaigns which can be printed by map
 */
const headers = {
    //'Name': 'name',
    'Total Budget': 'totalBudget',
    'Daily Budget': 'dailyBudget',
    'Start Date': 'startDate',
    'End Date': 'endDate'
}

export class AdvertiserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalIsOpen: false };
        this.openModal = this.openModal.bind(this);
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/advertiser/campaigns/',
            'GET',
            null,
            (response) => {
                response = response.map(cmp => Object.assign(cmp, { key: cmp.id }));
                this.setState(Object.assign({}, this.state, { campaigns: response }))
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    postSave(campaign) {
        campaign.key = campaign.id;
        this.state.campaigns.unshift(campaign);
        this.setState(Object.assign({}, this.state));
    }

    openModal() {
        $('.modal').modal();
        $('#cmpForm').modal('open');
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    render() {
        if (!this.state.campaigns) {
            return spinner
        }


        var heightStyle = {
            height: '100%',
            minHeight: '100%',
        }


        if (this.state.campaigns.length == 0) {
            var noCmpMessage = (
                <div className="container center">
                    <div className=" center">
                        <div className="col s12 m5">
                            <div className="card-panel blue-grey">
                                <span className="white-text">
                                    NO CAMPAIGNS FOUND
                            </span>
                            </div>
                        </div>
                    </div>
                </div>
            )
        } else {
            var noCmpMessage = <div></div>
        }
        return (
            <div className="container" style={heightStyle} >
                <div className="row">
                    <h2 className="thin col">Campaigns</h2>
                    <br />
                    <a className="waves-effect waves-light btn-large col right" onClick={this.openModal}>
                        <i className="material-icons left">add</i>
                        Add Campaign
                     </a>
                </div>
                <ReactCSSTransitionGroup
                    component="table"
                    transitionName="fadeTransitionFast"
                    transitionAppear={true}
                    transitionLeave={false}
                    transitionEnterTimeout={150}
                    transitionLeaveTimeout={150}
                    transitionAppearTimeout={150}
                    className="table highlight grey-text text-darken-4 col s12">
                    <thead>
                        <tr>
                            <th>Campaign Name</th>
                            {Object.keys(headers).map(header => <th key={header}>{header}</th>)}
                            <th>Campaign Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.campaigns.map(campaign =>
                            <tr key={campaign.key} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/advertiser/campaigns/' + campaign.id + "/"}>
                                        {campaign.name}
                                    </Link>
                                </td>
                                {Object.keys(headers).map(key => <td key={key}>{campaign[headers[key]]}</td>)}
                                <td>{config.campaignTypes[campaign.campaignType]}</td>
                                <td>{campaign.status ? "Active" : "Paused"}</td>
                            </tr>)
                        }
                    </tbody>
                    <br />
                    <br />
                </ReactCSSTransitionGroup>
                {noCmpMessage}

                <CampaignEditModal label="Create Campaign" saveMethod="POST" postSave={this.postSave.bind(this)} successStatus="201" />
            </div >
        );
    }
}
