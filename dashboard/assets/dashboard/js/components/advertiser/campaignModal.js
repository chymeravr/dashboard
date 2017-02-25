import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'

import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';

import 'react-dates/lib/css/_datepicker.css';

export class CampaignEditModal extends React.Component {
    constructor(props) {
        super(props);
        var defaultCampaignType = '1';

        this.state = Object.assign({
            valid: false,
            campaign: {
                campaignType: config.defaultCampaignType,
                open: props.open
            }
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.successStatus = props.successStatus;
        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    onDatesChange({ startDate, endDate }) {
        var newCampaign = Object.assign({}, this.state.campaign, { startDate, endDate });
        const nextState = Object.assign({}, this.state, { campaign: newCampaign });
        delete nextState.focusedInput;
        console.info("Next state");
        console.info(nextState)
        this.setState(nextState);
    }

    onFocusChange(focusedInput) {
        this.setState(Object.assign({}, this.state, { focusedInput: focusedInput }));
    }


    validateState() {
        var campaign = this.state.campaign;
        var valid = campaign;
        // Campaign fields should be present
        valid = campaign && campaign.name && campaign.startDate && campaign.endDate && campaign.totalBudget &&
            campaign.campaignType && campaign.dailyBudget;


        // Campaign fields should be in bounds
        valid = valid && (+campaign.totalBudget >= 0 && +campaign.dailyBudget >= 0 && campaign.name.length > 0);
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return (e, d) => {
            this.state.campaign[key] = e.target.value;
            var newCampaign = Object.assign({}, this.state.campaign);
            newCampaign[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { campaign: newCampaign }));
            this.validateState();
        };
    }


    componentDidMount() {

    }

    setCampaignType(type) {
        var campaign = Object.assign(this.state.campaign, {
            campaignType: type
        });
        this.setState(Object.assign({}, this.state, { campaign: campaign }));
        this.validateState();
        $('.dropdown-button').dropdown('close')
    }

    saveCampaign() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.campaign.id : '';
        const apiPath = '/user/api/advertiser/campaigns/' + apiSuffix;
        callApiWithJwt(
            apiPath,
            this.saveMethod,
            JSON.stringify(this.state.campaign),
            (response) => {
                this.postSave(response);
                $('#cmpForm').modal('close');
            },
            (error) => {
                alert(error);
            },
            this.successStatus
        );
    }

    render() {
        console.info(this.state);
        const { startDate, endDate } = this.state.campaign;
        const { focusedInput } = this.state;

        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text"
                    onClick={e => this.saveCampaign()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text disabled"
                    onClick={e => this.saveCampaign()}>
                    Save
                </a>
        }


        const title = this.saveMethod === 'PUT' ? "Edit Campaign" : "Create Campaign";

        return (
            <Modal open={true} onClose={this.close}>
                <Modal.Header>Create Campaign</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Campaign name' placeholder='Campaign name' onChange={this.handleChange('name')} />
                            <Form.Field control={Input} label='App name' placeholder='App name' onChange={this.handleChange('appName')} />
                        </Form.Group>
                        <Form.Field control={Input} label='App URL' placeholder='URL of the Advertised App' onChange={this.handleChange('appUrl')} />
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Total Budget' type='number' placeholder='Total Budget' onChange={this.handleChange('totalBudget')} />
                            <Form.Field control={Input} label='Daily Budget' type='number' placeholder='Daily Budget' onChange={this.handleChange('dailyBudget')} />
                        </Form.Group>
                        <DateRangePicker
                            onDatesChange={this.onDatesChange}
                            onFocusChange={this.onFocusChange}
                            focusedInput={focusedInput}
                            startDate={startDate}
                            endDate={endDate}
                            numberOfMonths={1}
                            displayFormat="YYYY-MMM-DD"
                            />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button color='black' onClick={this.close}>Nope</Button>
                    <Button positive icon='checkmark' labelPosition='right' content="Yep, that's me" onClick={this.close} />
                </Modal.Actions>
            </Modal>
        )
    }
}