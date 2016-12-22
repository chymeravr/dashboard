import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner } from '../common'
import { AppEditModal } from './appModal'




export class AppDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: this.props.params.appId,
            newPlacement: '',
        };
        this.openAppModal = this.openAppModal.bind(this);

    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/publisher/apps/' + this.state.appId,
            'GET',
            null,
            (response) => this.setState(Object.assign({}, this.state, { app: response })),
            (error) => {
                alert(error);
                hashHistory.push('/login/')
                // throw error;
            },
        );


    }

    openAppModal() {
        $('.modal').modal();
        $('#appForm').modal('open');
    }

    openPmModal() {
        $('.modal').modal();
        $('#placementForm').modal('open');
    }

    postSave(app) {
        this.setState(Object.assign({}, this.state, { app: app }))
    }

    postPlacementAddition(placement) {
        this.state.app.placements.unshift(placement);
        this.state.newPlacement = '';
        this.setState(Object.assign({}, this.state));
    }

    savePlacement() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.app.id : '';
        const apiPath = '/user/api/publisher/placements/' + apiSuffix;
        callApiWithJwt(
            apiPath,
            'POST',
            JSON.stringify({
                name: this.state.newPlacement,
                app: this.state.appId
            }),
            (response) => {
                $('#placementForm').modal('close');
                this.postPlacementAddition(response);
            },
            (error) => {
                alert(error);
            },
            201
        );
    }

    render() {
        if (!this.state.app) {
            return spinner
        }

        if (this.state.newPlacement && this.state.newPlacement.length > 0) {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text"
                    onClick={e => this.savePlacement()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text disabled"
                    onClick={e => this.savePlacement()}>
                    Save
                </a>
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
                <div className="row">
                    <div className="col s12">
                        <div className="card blue-grey darken-1">
                            <div className="card-content white-text">
                                <span className="card-title">
                                    {this.state.app.name}
                                </span>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>Total Earnings</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="white-text text-darken-1">
                                            <td>0</td>
                                        </tr>
                                    </tbody></table>
                            </div>
                            <div className="card-action">
                                <a onClick={e => this.openAppModal()}>Edit</a>
                            </div>
                        </div>
                    </div>
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
                            <th>Name</th>
                            <th>Key</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.app.placements.map(placement =>
                            <tr key={placement.id} className="grey-text text-darken-1">
                                <td>
                                    {placement.name}
                                </td>
                                <td>
                                    {placement.id}
                                </td>
                            </tr>)
                        }
                    </tbody>
                </ReactCSSTransitionGroup>

                <AppEditModal label="Create App" saveMethod="POST"
                    postSave={this.postSave.bind(this)} successStatus="200" app={this.state.app} />

                <div id="placementForm" className="modal modal-fixed-footer">
                    <div className="modal-content valign-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col s8">
                                    <FormInput
                                        fieldName="newPlacement"
                                        label="Placement Name"
                                        value={this.state.newPlacement.name}
                                        handleChange={this.handleChange('newPlacement').bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {saveButton}
                    </div >
                </div >
                <div className="fixed-action-btn" style={fabStyle}>
                    <a className="btn-floating btn-large orange" onClick={e => this.openPmModal()}>
                        <i className="large material-icons">add</i>
                    </a>
                </div>
            </div>
        );
    }
}
