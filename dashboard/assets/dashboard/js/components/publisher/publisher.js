import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput } from '../common'


const customStyles = {
    content: {
        top: '20%',
        left: '20%',
        right: '20%',
        bottom: '20%',
    }
};

const headers = {
    //'Name': 'name',
    'Name': 'name',
    'Key': 'id',
    'URL': 'url',
    'App Store': 'appStoreName'
}

export class PublisherView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
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
        callApiWithJwt('/user/api/publisher/apps/',
            'GET',
            null,
            (response) => {
                response = response.map(app => Object.assign(app, { key: app.id, appStoreName: config.appStores[app.appStore] }));
                this.setState(Object.assign({}, this.state, { apps: response }))
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
        if (!this.state.apps) {
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
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.apps.map(app =>
                            <tr key={app.key} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/advertiser/apps/' + app.id + "/"}>
                                        {app.name}
                                    </Link>
                                </td>
                                {Object.keys(headers).map(key => <td key={key}>{app[headers[key]]}</td>)}
                                <td>{app.status ? "Active" : "Paused"}</td>
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>

                <div className="fixed-action-btn" style={fabStyle}>
                    <a className="btn-floating btn-large orange" onClick={this.openModal}>
                        <i className="large material-icons">add</i>
                    </a>
                </div>
{//}
                // <CampaignEditModal label="Create Campaign" saveMethod="POST" postSave={this.postSave.bind(this)} successStatus="201" />
}
            </div >
        );
    }
}
