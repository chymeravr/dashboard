import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider, Table, Checkbox, Form, Input, Dropdown, Modal } from 'semantic-ui-react'



export class AppEditModal extends React.Component {

    constructor(props) {
        super(props);

        this.state = Object.assign({
            valid: false,
            open: props.open,
            app: {
                appStore: config.defaultAppStore
            },
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.closeModal = props.closeModal;
        this.successStatus = props.successStatus;
        this.handleChange = this.handleChange.bind(this);
        this.validateState = this.validateState.bind(this);
        this.setAppStore = this.setAppStore.bind(this);
        this.saveApp = this.saveApp.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, { open: nextProps.open }))
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
        return (e, d) => {
            this.state.app[key] = e.target.value;
            var newApp = Object.assign({}, this.state.app);
            newApp[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { app: newApp }), this.validateState);
        };
    }


    setAppStore(e, d) {
        var app = Object.assign(this.state.app, {
            appStore: d.value
        });
        this.setState(Object.assign({}, this.state, { app: app }), this.validateState);
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
            },
            (error) => {
                alert(error);
            },
            this.successStatus
        );
    }

    render() {
        debug("appModal", this.state);
        const appStores = config.appStores;
        const appStoreOptions = Object.keys(appStores).map(appStoreId => {
            return { key: appStoreId, text: appStores[appStoreId], value: appStoreId };
        });

        const app = this.state.app;
        const title = this.saveMethod == "PUT" ? 'Edit App' : 'Create App';
        return (
            <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                <Modal.Header>{this.label}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Field control={Input} label='App name' placeholder='App name' onChange={this.handleChange('name')} value={app.name} />
                        <Form.Field control={Dropdown} selection label='AppStore' options={appStoreOptions} placeholder='AppStore' onChange={this.setAppStore} value={app.appStore + ''} />
                        <Form.Field control={Input} label='App Url' placeholder='Market Url' onChange={this.handleChange('url')} value={app.url} />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive content="Create" disabled={!this.state.valid} onClick={this.saveApp} />
                </Modal.Actions>
            </Modal>
        )
    }
}