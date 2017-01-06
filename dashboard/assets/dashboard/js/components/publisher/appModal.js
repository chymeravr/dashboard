import React, { ReactDOM } from 'react'
import Modal from 'react-modal'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'



export class AppEditModal extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({
            valid: false,
            app: {
                appStore: config.defaultAppStore
            },
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.successStatus = props.successStatus;
    }


    validateState() {
        var valid = this.state.app;

        // App should be present
        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }
        var app = this.state.app;

        // App fields should be present
        valid = app.name && app.url && app.appStore;

        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }

        // App fields should be in bounds
        valid = app.name.length > 0 && app.url.length > 0;
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return function (e) {
            this.state.app[key] = e.target.value;
            var newApp = Object.assign({}, this.state.app);
            newApp[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { app: newApp }));
            this.validateState();
        };
    }


    setAppStore(type) {
        var app = Object.assign(this.state.app, {
            appStore: type
        });
        this.setState(Object.assign({}, this.state, { app: app }));
        this.validateState();
        $('#appStoreDropdown').dropdown('close')
    }


    componentDidMount() {
        const that = this;
        $('.dropdown-button').dropdown({
            inDuration: 300,
            outDuration: 225,
            constrain_width: true, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });

        $('.tooltipped').tooltip({ delay: 50 });

        $('select').material_select();
        $('#appStoreSelect').on('change', e => this.setAppStore(e.target.value)).bind(this);
    }


    saveApp() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.app.id : '';
        const apiPath = '/user/api/publisher/apps/' + apiSuffix;
        callApiWithJwt(
            apiPath,
            this.saveMethod,
            JSON.stringify(this.state.app),
            (response) => {
                this.postSave(response);
                $('#appForm').modal('close');
            },
            (error) => {
                alert(error);
            },
            this.successStatus
        );
    }

    render() {
        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn white-text"
                    onClick={e => this.saveApp()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn white-text disabled"
                    onClick={e => this.saveApp()}>
                    Save
                </a>
        }

        const title = this.saveMethod == "PUT" ? 'Edit App' : 'Create App';
        return (
            <div id="appForm" className="modal modal-fixed-footer">
                <div className="modal-content valign-wrapper">
                    <div className="container">
                        <h5 className="center">{title}</h5>
                        <br />
                        <br />
                        <div className="row">
                            <FormInput
                                fieldName="name"
                                label="App Name"
                                value={this.state.app.name}
                                handleChange={this.handleChange('name').bind(this)} />
                        </div>
                        <div className="row">
                            <div className="input-field">
                                <select id="appStoreSelect" defaultValue={config.appStores}>
                                    {Object.keys(config.appStores).map(id =>
                                        <option key={id} value={id}>{config.appStores[id]}</option>
                                    )}
                                </select>
                                <label>App Store</label>
                            </div>
                        </div>
                        <div className="row">
                            <FormInput
                                fieldName="url"
                                label="App URL"
                                value={this.state.app.url}
                                handleChange={this.handleChange('url').bind(this)} />
                        </div>
                    </div>
                </div>
                <div className="modal-footer">
                    {saveButton}
                </div>
            </div >
        )
    }
}