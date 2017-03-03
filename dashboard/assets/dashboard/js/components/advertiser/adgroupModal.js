import React from 'react'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'
import { CreateTargetingModal } from './createTargetingModal'
import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio } from 'semantic-ui-react'
import { DateRangePicker } from 'react-dates';
import moment from 'moment';
import 'react-dates/lib/css/_datepicker.css';

export class AdgroupEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.isEditModal = props.adgroup;

        this.state = Object.assign({
            open: false,
            targetingModalOpen: false,
            adgroup: {
                campaign: props.campaignId,
                pricing: config.defaultPricing,
            }
        });

        Object.assign(this.state, props.adgroup);
        this.campaignId = props.campaignId;
        this.successStatus = props.successStatus;
        this.closeModal = props.closeModal;
        this.postSave = props.postSave;

        this.label = this.isEditModal ? "Edit Adgroup" : "Create Adgroup";
        this.saveMethod = this.isEditModal ? "PUT" : "POST"
        this.successStatus = this.isEditModal ? 200 : 201

        this.onDatesChange = this.onDatesChange.bind(this);
        this.onFocusChange = this.onFocusChange.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentWillReceiveProps(nextProps) {
        this.setState(Object.assign({}, this.state, nextProps));
    }

    onDatesChange({ startDate, endDate }) {
        var newAdgroup = Object.assign({}, this.state.adgroup, { startDate, endDate });
        const nextState = Object.assign({}, this.state, { adgroup: newAdgroup });
        delete nextState.focusedInput;
        this.setState(nextState, this.validateState);
    }

    onFocusChange(focusedInput) {
        this.setState(Object.assign({}, this.state, { focusedInput: focusedInput }), this.validateState);
    }

    validateState() {
        var valid = this.state.adgroup;

        // Adgroup should be present
        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }
        var adgroup = this.state.adgroup;

        // Adgroup fields should be present
        valid = adgroup.name && adgroup.startDate && adgroup.endDate
            && adgroup.totalBudget && adgroup.dailyBudget && adgroup.bid;

        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }

        // Adgroup fields should be in bounds
        valid = +adgroup.totalBudget >= 0 && +adgroup.dailyBudget >= 0
            && adgroup.name.length > 0 && +adgroup.bid > 0;
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return (e, d) => {
            this.state.adgroup[key] = e.target.value;
            var newAdgroup = Object.assign({}, this.state.adgroup);
            newAdgroup[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { adgroup: newAdgroup }));
            this.validateState();
        };
    }


    setPricing(id) {
        var newAdgroup = Object.assign(this.state.adgroup, {
            pricing: id
        });
        this.setState(Object.assign({}, this.state, { adgroup: newAdgroup }));
        this.validateState();
    }


    saveAdgroup() {
        const apiSuffix = this.isEditModal ? this.state.adgroup.id : '';
        const apiPath = '/user/api/advertiser/adgroups/' + apiSuffix;
        const adgroup = Object.assign({}, this.state.adgroup);

        adgroup.startDate = adgroup.startDate.format('YYYY-MM-DD');
        adgroup.endDate = adgroup.endDate.format('YYYY-MM-DD');

        var body = JSON.stringify(adgroup);

        callApiWithJwt(
            apiPath,
            this.saveMethod,
            body,
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
        debug("adgroupModal", this.state);
        const { startDate, endDate } = this.state.adgroup;
        const { focusedInput } = this.state;

        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text"
                    onClick={e => this.saveAdgroup()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-light btn white-text disabled"
                    onClick={e => this.saveAdgroup()}>
                    Save
                </a>
        }

        const title = this.saveMethod == "PUT" ? "Edit Adgroup" : "Create Adgroup";
        const adgroup = this.state.adgroup;

        return (
            <div>
                <Modal open={this.state.open} onClose={this.closeModal} dimmer='blurring'>
                    <Modal.Header>{this.label}</Modal.Header>
                    <Modal.Content>
                        <Form>
                            <Form.Group widths='equal'>
                                <Form.Field control={Input} label='Adgroup name' placeholder='Adgroup name' onChange={this.handleChange('name')} value={adgroup.name} />
                            </Form.Group>
                            <Form.Group widths='equal'>
                                <Form.Field control={Input} label='Total Budget ($)' type='number' placeholder='Total Budget' onChange={this.handleChange('totalBudget')} value={adgroup.totalBudget} />
                                <Form.Field control={Input} label='Daily Budget ($)' type='number' placeholder='Daily Budget' onChange={this.handleChange('dailyBudget')} value={adgroup.dailyBudget} />
                                <Form.Field control={Input} label='Cost Per Click ($)' type='number' placeholder='Cost Per Click' onChange={this.handleChange('bid')} value={adgroup.bid} />
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
                        <Button positive content="Save" disabled={!this.state.valid} onClick={this.saveAdgroup.bind(this)} />
                    </Modal.Actions>
                </Modal>
            </div>
        )
    }
}