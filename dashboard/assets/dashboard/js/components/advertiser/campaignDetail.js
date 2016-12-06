import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory } from 'react-router'
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
        // marginRight: '-20%',
        // transform: 'translate(-20%, -20%)'
    }
};

/**
 * Store direct properties of campaigns which can be printed by map
 */
const headers = {
    'Name': 'name',
    'Total Budget': 'totalBudget',
    'Daily Budget': 'dailyBudget',
    'Start Date': 'startDate',
    'End Date': 'endDate'
}

export class CampaignDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            modalIsOpen: false,
            campaignId: this.props.params.campaignId
        };
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
        callApiWithJwt('/user/api/advertiser/campaigns/' + this.state.campaignId,
            'GET',
            null,
            (response) => this.setState(Object.assign({}, this.state, { campaign: response })),
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    openModal() {
        $('.modal').modal();
        $('#cmpForm').modal('open');
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    postSave(campaign) {
        this.setState(Object.assign({}, this.state, { campaign: campaign }))
    }

    render() {
        if (!this.state.campaign) {
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
            <div className="">
                <div className="row">
                    <div className="col s12">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">
                                    {this.state.campaign.name}
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
                            <div className="card-action">
                                <a onClick={e => this.openModal()}>Edit</a>
                                <a >Add Adgroup</a>
                            </div>
                        </div>
                    </div>
                </div>
                <CampaignEditModal campaign={this.state.campaign} saveMethod="PUT" label="Edit Campaign"
                    postSave={this.postSave.bind(this)} successStatus="200" />
            </div>
            // <div className="row" style={heightStyle} >
            //     <SideBar />
            //     <div></div>
            //     <ReactCSSTransitionGroup
            //         component="table"
            //         transitionName="fadeTransitionFast"
            //         transitionAppear={true}
            //         transitionLeave={false}
            //         transitionEnterTimeout={150}
            //         transitionLeaveTimeout={150}
            //         transitionAppearTimeout={150}
            //         className="table highlight grey-text text-darken-4 col s9 offset-s3">
            //         <thead>
            //             <tr>
            //                 {Object.keys(headers).map(header => <th key={header}>{header}</th>)}
            //                 <th>Campaign Type</th>
            //                 <th>Status</th>
            //             </tr>
            //         </thead>
            //         <tbody>
            //             {this.state.campaigns.map(campaign =>
            //                 <tr key={campaign.id} className="grey-text text-darken-1">
            //                     {Object.keys(headers).map(key => <td key={key}>{campaign[headers[key]]}</td>)}
            //                     <td>{campaign.campaignType.name}</td>
            //                     <td>{campaign.status ? "Active" : "Paused"}</td>
            //                 </tr>)
            //             }
            //         </tbody>
            //     </ReactCSSTransitionGroup>

            //     <div className="fixed-action-btn" style={fabStyle}>
            //         <a className="btn-floating btn-large orange" onClick={this.openModal}>
            //             <i className="large material-icons">add</i>
            //         </a>
            //     </div>

            // </div >
        );
    }
}
