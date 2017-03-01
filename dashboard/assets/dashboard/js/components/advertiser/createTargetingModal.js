import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'

export class CreateTargetingModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({
            hmd: '',
            os: '',
            ram: 0,
        }, props.initialState);

        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.successStatus = props.successStatus;
    }

    componentWillReceiveProps(props) {
        this.state = Object.assign({
            hmd: '',
            os: '',
            ram: 0,
        }, props.initialState);
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.successStatus = props.successStatus;
    }

    validateState() {
        // Targeting fields should be present
        var valid = +this.state.ram >= 0 && this.state.name;
        valid = valid ? true : false;
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return function (e) {
            var nextState = Object.assign({}, this.state);
            nextState[key] = e.target.value;
            this.setState(nextState, this.validateState.bind(this));
        };
    }


    setOs(id) {
        this.setState(Object.assign({}, this.state, { os: id }), this.validateState.bind(this));
    }

    setHmd(id) {
        this.setState(Object.assign({}, this.state, { hmd: id }), this.validateState.bind(this));
    }


    saveTargeting() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.id : '';
        const apiPath = '/user/api/advertiser/targetings/' + apiSuffix;
        callApiWithJwt(
            apiPath,
            this.saveMethod,
            JSON.stringify(this.state),
            (response) => {
                this.postSave(response);
            },
            (error) => {
                throw error;
                // alert(error);
            },
            this.successStatus
        );
    }



    render() {
        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text"
                    onClick={e => this.saveTargeting()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text disabled"
                    onClick={e => this.saveTargeting()}>
                    Save
                </a>
        }

        return (
            <div>
                <div id="createTargetingForm" className="modal bottom-sheet">
                    <div className="modal-content">
                        <div className="container">
                            <div className="row">
                                <div className="col s6">
                                    <FormInput
                                        fieldName="name"
                                        label="Targeting Name"
                                        value={this.state.name}
                                        handleChange={this.handleChange('name').bind(this)} />
                                </div>
                                <div className="col right">
                                    <a className='dropdown-button btn tooltipped'
                                        data-position="right" data-delay="50" data-tooltip="Head Mounted Displays"
                                        onClick={e => $('#hmdDropdown').dropdown('open')}
                                        data-activates='hmdDropdown'>
                                        {config.hmds[this.state.hmd] ? config.hmds[this.state.hmd] : "All"}
                                        <i className="material-icons col s1">expand_more</i>
                                    </a>

                                    <ul id='hmdDropdown' className='dropdown-content'>
                                        {Object.keys(config.hmds).map(id =>
                                            <li key={id}>
                                                <a onClick={e => this.setHmd(id)}>
                                                    {config.hmds[id] ? config.hmds[id] : "All"}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className="col right">
                                    <a className='dropdown-button btn tooltipped'
                                        data-position="right" data-delay="50" data-tooltip="Operating Systems"
                                        onClick={e => $('#osDropdown').dropdown('open')}
                                        data-activates='osDropdown'>
                                        {config.operatingSystems[this.state.os] ? config.operatingSystems[this.state.os] : "ALL"}
                                        <i className="material-icons col s1">expand_more</i>
                                    </a>
                                    <ul id='osDropdown' className='dropdown-content'>
                                        {Object.keys(config.operatingSystems).map(id =>
                                            <li key={id}>
                                                <a onClick={e => this.setOs(id)}>
                                                    {config.operatingSystems[id] ? config.operatingSystems[id] : "All"}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s2">
                                    <NumberInput
                                        fieldName="ram"
                                        label="Minimum Ram"
                                        value={this.state.ram}
                                        handleChange={this.handleChange('ram').bind(this)} />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="modal-content right">
                        <div className="container">
                            {saveButton}
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}