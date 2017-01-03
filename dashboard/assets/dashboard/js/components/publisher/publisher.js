import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner, PageHeading } from '../common'
import { AppEditModal } from './appModal'

const headers = {
    //'Name': 'name',
    'Key': 'id',
    'URL': 'url',
    'Requests': 'requests',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Earnings': 'earnings'
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
                response = response.map(app => Object.assign(app, { key: app.id }));
                this.setState(Object.assign({}, this.state, { apps: response }));
                document.title = "Apps"
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    postSave(app) {
        app.key = app.id;
        this.state.apps.unshift(app);
        this.setState(Object.assign({}, this.state));
    }

    openModal() {
        $('.modal').modal();
        $('#appForm').modal('open');
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    render() {
        if (!this.state.apps) {
            return spinner;
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
                <PageHeading title="Apps" onClick={e => this.openModal()} buttonText="New App" />
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
                            <th>App Name</th>
                            <th>App Store</th>
                            {Object.keys(headers).map(header => <th key={header}>{header}</th>)}
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.apps.map(app =>
                            <tr key={app.key} className="grey-text text-darken-1">
                                <td>
                                    <Link to={'/publisher/apps/' + app.id + "/"}>
                                        {app.name}
                                    </Link>
                                </td>
                                <td>{config.appStores[app.appStore]}</td>
                                {Object.keys(headers).map(key => <td key={key}>{app[headers[key]]}</td>)}
                                <td>{app.status ? "Active" : "Paused"}</td>
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>
                <AppEditModal label="Create App" saveMethod="POST" postSave={this.postSave.bind(this)} successStatus="201" />
            </div >
        );
    }
}
