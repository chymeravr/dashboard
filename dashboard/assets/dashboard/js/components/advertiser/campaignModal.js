import React, { ReactDOM } from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug, addHttp } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'

import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio, Message, Dropdown } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

export class CampaignEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.isEditModal = props.campaign;

        this.state = Object.assign({
            valid: false,
            validAppUrl: true,
            campaign: {
                campaignType: config.defaultCampaignType,
                hmd: config.defaultHmd,
                os: config.defaultOperatingSystem,
                ram: 0,
            },
            open: false,
        }, props);

        this.postSave = props.postSave;
        this.closeModal = props.closeModal;

        this.label = this.isEditModal ? "Edit Campaign" : "Create Campaign";
        this.saveMethod = this.isEditModal ? "PUT" : "POST";
        this.successStatus = this.isEditModal ? 200 : 201;

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.validateState = this.validateState.bind(this);
        this.setOs = this.setOs.bind(this);
        this.setHmd = this.setHmd.bind(this);
    }

    componentDidMount() {
        this.validateState();
    }

    componentWillReceiveProps(nextProps) {
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
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    saveCampaign() {
        fetch(addHttp(this.state.campaign.appUrl), {
            method: 'HEAD',
            mode: 'no-cors'
        }).then(
            () => {
                const apiSuffix = this.isEditModal ? this.state.campaign.id : '';
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
                    },
                    (error) => {
                        throw error;
                    },
                    this.successStatus
                );
            }).catch((ex) => { this.setState(Object.assign({}, this.state, { valid: false, validAppUrl: false })) });
    }

    setHmd(e, d) {
        const updatedCampaign = Object.assign({}, this.state.campaign, { hmd: d.value });
        this.setState(Object.assign({}, this.state, { campaign: updatedCampaign }))
    };

    setOs(e, d) {
        const updatedCampaign = Object.assign({}, this.state.campaign, { os: d.value });
        this.setState(Object.assign({}, this.state, { campaign: updatedCampaign }))
    };


    render() {
        debug("campaignModal", this.state);
        const { startDate, endDate } = this.state.campaign;
        const { focusedInput } = this.state;
        const campaign = this.state.campaign;
        const appName = campaign.appName ? campaign.appName : '';
        const appUrl = campaign.appUrl ? campaign.appUrl : '';

        const hmds = config.hmds;
        const hmdOptions = Object.keys(hmds).map(hmdId => {
            return { key: hmdId, text: hmds[hmdId] ? hmds[hmdId] : 'All', value: hmdId };
        });

        const operatingSystems = config.operatingSystems;
        const osOptions = Object.keys(operatingSystems).map(osId => {
            return { key: osId, text: operatingSystems[osId] ? operatingSystems[osId] : 'All', value: osId };
        });

        console.info(hmds);
        console.info(hmds[this.state.campaign.hmd])
        return (
            <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                <Modal.Header>{this.label}</Modal.Header>
                <Modal.Content>
                    <Form>
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Campaign name' placeholder='Campaign name' onChange={this.handleChange('name')} value={campaign.name} />
                            <Form.Field control={Input} label='App name' placeholder='App name' onChange={this.handleChange('appName')} value={appName} />
                        </Form.Group>
                        <Form.Field control={Input} error={!this.state.validAppUrl} label='App URL' placeholder='URL of the Advertised App'
                            onChange={this.handleChange('appUrl')} value={appUrl} />
                        {this.state.validAppUrl ? '' : (
                            <Message negative>
                                <p>URL does not exist</p>
                            </Message>
                        )}
                        <Form.Group widths='equal'>
                            <Form.Field control={Input} label='Total Budget ($)' type='number' placeholder='Total Budget' onChange={this.handleChange('totalBudget')} value={campaign.totalBudget} />
                            <Form.Field control={Input} label='Daily Budget ($)' type='number' placeholder='Daily Budget' onChange={this.handleChange('dailyBudget')} value={campaign.dailyBudget} />
                        </Form.Group>

                        <Form.Group widths='equal'>
                            <Form.Field control={Dropdown} selection label='Hmd' options={hmdOptions} placeholder='Hmd'
                                onChange={this.setHmd} value={this.state.campaign.hmd + ''} />
                            <Form.Field control={Dropdown} selection label='Os' options={osOptions} placeholder='Os'
                                onChange={this.setOs} value={this.state.campaign.os + ''} />
                        </Form.Group>


                        <Form.Field>
                            <label>Schedule</label>
                        </Form.Field>
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
                    <Button positive content="Save" disabled={!this.state.valid} onClick={this.saveCampaign.bind(this)} />
                </Modal.Actions>
            </Modal>
        )
    }
}