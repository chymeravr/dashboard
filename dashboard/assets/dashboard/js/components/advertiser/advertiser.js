import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory } from 'react-router'
import { SideBar } from './sidebar'
import Modal from 'react-modal'
import { FormInput } from '../common'


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
    'Total Budget': 'total_budget',
    'Daily Budget': 'daily_budget',
    'Start Date': 'start_date',
    'End Date': 'end_date'
}

export class AdvertiserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalIsOpen: false };
        this.openModal = this.openModal.bind(this);
        this.afterOpenModal = this.afterOpenModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
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
            {},
            (response) => this.setState(Object.assign({}, this.state, { campaigns: response })),
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );
    }

    openModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    afterOpenModal() {
        // references are now sync'd and can be accessed.
        this.refs.subtitle.style.color = '#f00';
    }

    closeModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: false }));
    }

    saveCampaign() {
        var campaign_type = {

        }
        var campaign = {
            name: this.state.newCampaignName,

        }
        callApiWithJwt('/user/api/advertiser/campaigns',
            'POST',
            {},
            (response) => this.setState(response),
            (error) => {
                hashHistory.push('/login/');
            }
        );
    }

    render() {
        debug("Advertiser View", this.state);
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
            <div className="row" style={heightStyle} >
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
                            {Object.keys(headers).map(header => <th key={header}>{header}</th>)}
                            <th>Campaign Type</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.campaigns.map(campaign =>
                            <tr key={campaign.id} className="grey-text text-darken-1">
                                {Object.keys(headers).map(key => <td key={key}>{campaign[headers[key]]}</td>)}
                                <td>{campaign.campaign_type.name}</td>
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

                <Modal
                    isOpen={this.state.modalIsOpen}
                    onAfterOpen={this.afterOpenModal}
                    onRequestClose={this.closeModal}
                    style={customStyles}
                    contentLabel="Example Modal"
                    >
                    <ReactCSSTransitionGroup
                        component="table"
                        transitionName="fadeTransition"
                        transitionAppear={true}
                        transitionLeave={true}
                        transitionEnterTimeout={500}
                        transitionLeaveTimeout={500}
                        transitionAppearTimeout={500}>
                        <h2 ref="subtitle">Hello</h2>
                        <button onClick={this.closeModal}>close</button>
                        <div>I am a modal</div>
                        <form className="row">
                            <div className="col s6 offset-s3">
                                <FormInput
                                    fieldName="username"
                                    label="Username"
                                    value={this.state.username}
                                    handleChange={this.handleChange('username').bind(this)} />
                                <FormInput
                                    fieldName="password"
                                    label="Password"
                                    value={this.state.password}
                                    handleChange={this.handleChange('password').bind(this)}
                                    type="password"/>
                                <a className="waves-effect waves-light btn right" onClick={(event) => alert('yaya')}>
                                    Save
                            </a>
                            </div>
                        </form>
                    </ReactCSSTransitionGroup>

                </Modal>
            </div >
        );
    }
}
