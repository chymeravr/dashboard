import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner, PageHeading } from '../common'
import { AdgroupEditModal } from './adgroupModal'
import { CampaignEditModal } from './campaignModal'


/**
 * Store direct properties of campaigns which can be printed by map
 */

const adgroupHeaders = {
    // 'Name': 'name',
    'Total Budget': 'totalBudget',
    'Daily Budget': 'dailyBudget',
    'Start Date': 'startDate',
    'End Date': 'endDate',
    'Bid': 'bid',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Burn': 'burn'
}

export class CampaignDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cmpModalIsOpen: false,
            agModalIsOpen: false,
            campaignId: this.props.params.campaignId
        };
        this.openCampaignModal = this.openCampaignModal.bind(this);
        this.openAgModal = this.openAgModal.bind(this);

    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/advertiser/campaigns/' + this.state.campaignId,
            'GET',
            null,
            (response) => {
                this.setState(Object.assign({}, this.state, { campaign: response }));
                document.title = response.name + " | Campaign";
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
                // throw error;
            },
        );
    }


    openCampaignModal() {
        $('.modal').modal();
        $('#cmpForm').modal('open');
        this.setState(Object.assign({}, this.state, { cmpModalIsOpen: true }));
    }

    openAgModal() {
        $('.modal').modal();
        $('#agForm').modal('open');
        this.setState(Object.assign({}, this.state, { agModalIsOpen: true }));
    }

    postSave(campaign) {
        this.setState(Object.assign({}, this.state, { campaign: campaign }))
    }

    postAdgroupAddition(adgroup) {
        $('#agForm').modal('close');
        this.state.campaign.adgroups.unshift(adgroup);
        // To reset state of modal
        this.setState(Object.assign({}, this.state, { timestamp: Date.now() }));
    }

    setAdgroupStatus(index, status) {
        console.info(status);
        const adgroupId = this.state.campaign.adgroups[index].id;
        callApiWithJwt('/user/api/advertiser/adgroups/' + adgroupId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.campaign.adgroups[index].status = status
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                alert(error)
            },
        );
    }

    render() {
        if (!this.state.campaign) {
            return (
                spinner
            )
            // TODO : Spinner
        }
        var fabStyle = {
            bottom: '50px',
            right: '50px'
        }

        var heightStyle = {
            height: '100%',
            minHeight: '100%',
        }
        return (
            <div className="container">
                <PageHeading title="Campaign Detail" onClick={e => this.openAgModal()} buttonText="Adgroup" />
                <div className="card blue-grey darken-1">
                    <div className="card-content white-text">
                        <span className="card-title">
                            {this.state.campaign.name}
                            <a className="right" href="javascript:void(0);" onClick={e => this.openCampaignModal()}>
                                <i className="material-icons white-text">edit</i>
                            </a>
                        </span>
                        <table>
                            <thead>
                                <tr>
                                    <th>Total Budget</th>
                                    <th>Daily Budget</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr className="white-text text-darken-1">
                                    <td>{this.state.campaign.totalBudget}</td>
                                    <td>{this.state.campaign.dailyBudget}</td>

                                </tr>
                            </tbody></table>
                    </div>
                </div>
                <CampaignEditModal campaign={this.state.campaign} saveMethod="PUT" label="Edit Campaign"
                    postSave={this.postSave.bind(this)} successStatus="200" />
                <br />
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
                            <th>Adgroup Name</th>
                            {Object.keys(adgroupHeaders).map(header => <th key={header}>{header}</th>)}
                            <th>Active</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.campaign.adgroups.map((adgroup, idx) =>
                            <tr key={adgroup.id} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/advertiser/adgroups/' + adgroup.id + "/"}>
                                        {adgroup.name}
                                    </Link>
                                </td>
                                {Object.keys(adgroupHeaders).map(key => <td key={key}>{adgroup[adgroupHeaders[key]]}</td>)}

                                <td>
                                    <div className="switch">
                                        <label>
                                            <input type="checkbox"
                                                checked={adgroup.status ? "checked" : ""}
                                                onChange={e => this.setAdgroupStatus(idx, e.target.checked)} />
                                            <span className="lever"></span>
                                        </label>
                                    </div>
                                </td>
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>

                <AdgroupEditModal label="Create Adgroup" saveMethod="POST"
                    postSave={this.postAdgroupAddition.bind(this)} successStatus="201"
                    campaignId={this.state.campaign.id}
                    key={this.state.timestamp} />
            </div >
        );
    }
}
