import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'

import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

export class CampaignEditModal extends React.Component {
    constructor(props) {
        super(props);
        var defaultCampaignType = '1';
        this.state = Object.assign({
            valid: false,
            campaign: {
                campaignType: config.defaultCampaignType,
            },
            open: false,
        }, JSON.parse(JSON.stringify(props)));

        if (this.state.campaign.startDate) {
            this.state.campaign.startDate = moment(this.state.campaign.startDate, 'YYYY-MM-DD');
        }

        if (this.state.campaign.endDate) {
            this.state.campaign.endDate = moment(this.state.campaign.endDate, 'YYYY-MM-DD');
        }

        this.postSave = props.postSave;
        this.closeModal = props.closeModal;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.successStatus = this.saveMethod === 'POST' ? 201 : 200;
        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateState = this.validateState.bind(this);
    }

    componentDidMount() {
        this.validateState();
    }

    componentWillReceiveProps(nextProps) {
        const campaign = nextProps.campaign;
        if (campaign.startDate) {
            campaign.startDate = moment(campaign.startDate, 'YYYY-MM-DD');
        }

        if (campaign.endDate) {
            campaign.endDate = moment(campaign.endDate, 'YYYY-MM-DD');
        }
        this.setState(Object.assign({}, this.state, nextProps));
    }

    onDatesChange({ startDate, endDate }) {
        var newCampaign = Object.assign({}, this.state.campaign, { startDate, endDate });
        const nextState = Object.assign({}, this.state, { campaign: newCampaign });
        delete nextState.focusedInput;
        this.setState(nextState, this.validateState);
    }

    onFocusChange(focusedInput) {
        this.setState(Object.assign({}, this.state, { focusedInput: focusedInput }), this.validateState);
    }

    handleChange(key) {
        return (e, d) => {
            this.state.campaign[key] = e.target.value;
            var newCampaign = Object.assign({}, this.state.campaign);
            newCampaign[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { campaign: newCampaign }), this.validateState);
        };
    }


    validateState() {
        var campaign = this.state.campaign;
        var valid = campaign;
        // Campaign fields should be present
        valid = campaign && campaign.name && campaign.startDate && campaign.endDate && campaign.totalBudget &&
            campaign.campaignType && campaign.dailyBudget;


        // Campaign fields should be in bounds
        valid = valid && (+campaign.totalBudget >= 0 && +campaign.dailyBudget >= 0 && campaign.name.length > 0);
        console.info("Setting state");
        console.info(valid);
        this.setState(Object.assign({}, this.state, { valid: valid }), console.info(this.state));
    }

    saveCampaign() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.campaign.id : '';
        const apiPath = '/user/api/advertiser/campaigns/' + apiSuffix;
        const campaignState = Object.assign({}, this.state.campaign);

        campaignState.startDate = campaignState.startDate.format('YYYY-MM-DD')
        campaignState.endDate = campaignState.endDate.format('YYYY-MM-DD')

        callApiWithJwt(
            apiPath,
            this.saveMethod,
            JSON.stringify(campaignState),
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
        const campaign = this.state.campaign;
        const appName = campaign.appName ? campaign.appName : '';
        const appUrl = campaign.appUrl ? campaign.appUrl : '';
        const title = this.saveMethod === 'PUT' ? "Edit Campaign" : "Create Campaign";

        return (
            <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                <Modal.Header>Create Campaign</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Campaign name' placeholder='Campaign name' onChange={this.handleChange('name')} value={campaign.name} />
                            <Form.Field control={Input} label='App name' placeholder='App name' onChange={this.handleChange('appName')} value={appName} />
                        </Form.Group>
                        <Form.Field control={Input} label='App URL' placeholder='URL of the Advertised App' onChange={this.handleChange('appUrl')} value={appUrl} />
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Total Budget' type='number' placeholder='Total Budget' onChange={this.handleChange('totalBudget')} value={campaign.totalBudget} />
                            <Form.Field control={Input} label='Daily Budget' type='number' placeholder='Daily Budget' onChange={this.handleChange('dailyBudget')} value={campaign.dailyBudget} />
                        </Form.Group>
                        <DateRangePicker
                            onDatesChange={this.onDatesChange}
                            onFocusChange={this.onFocusChange}
                            focusedInput={focusedInput}
                            startDate={startDate}
                            endDate={endDate}
                            numberOfMonths={2}
                            displayFormat="YYYY-MMM-DD"
                            />
                    </Form>
                </Modal.Content>
                <Modal.Actions>
                    <Button positive content="Create" disabled={!this.state.valid} onClick={this.saveCampaign.bind(this)} />
                </Modal.Actions>
            </Modal>
        )
    }
}