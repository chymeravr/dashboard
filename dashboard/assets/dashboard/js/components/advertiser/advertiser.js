import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { SideBar } from './sidebar'
import Modal from 'react-modal'
import { FormInput } from '../common'
import { CampaignEditModal } from './campaignModal'


const customStyles = {
    content: {
        top: '20%',
        left: '20%',
        right: '20%',
        bottom: '20%',
    }
};

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
            (response) => this.setState(Object.assign({}, this.state, { campaigns: response })),
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    postSave(campaign) {
        this.setState(Object.assign({}, this.state, { campaigns: this.state.campaigns.push(campaign) }))
    }

    openModal() {
        $('.modal').modal();
        $('#cmpForm').modal('open');
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    render() {
        if (!this.state.campaigns) {
            return <div></div> // TODO : Spinner
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
            <div className="container" style={heightStyle} >
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
                            <th>Name</th>
                            {Object.keys(headers).map(header => <th key={header}>{header}</th>)}
                            <th>Campaign Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.campaigns.map(campaign =>
                            <tr key={campaign.id} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/advertiser/campaigns/' + campaign.id + "/"}>
                                        {campaign.name}
                                    </Link>
                                </td>
                                {Object.keys(headers).map(key => <td key={key}>{campaign[headers[key]]}</td>)}
                                <td>{config.campaignTypes[campaign.campaignType].label}</td>
                                <td>{campaign.status ? "Active" : "Paused"}</td>
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>

                <div className="fixed-action-btn" style={fabStyle}>
                    <a className="btn-floating btn-large orange" onClick={this.openModal}>
                        <i className="large material-icons">add</i>
                    </a>
                </div>

                <CampaignEditModal label="Create Campaign" saveMethod="POST" postSave={() => { } } successStatus="201" />
            </div >
        );
    }
}
