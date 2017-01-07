import React, { ReactDOM } from 'react'
import Modal from 'react-modal'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'



export class CampaignEditModal extends React.Component {
    constructor(props) {
        super(props);
        var defaultCampaignType = '1';
        // Initialise state if not initialised in props

        this.state = Object.assign({
            valid: false,
            campaign: {
                campaignType: config.defaultCampaignType,
            }
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.successStatus = props.successStatus;

    }


    validateState() {
        var valid = this.state.campaign;

        // Campaign should be present
        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }
        var campaign = this.state.campaign;

        // Campaign fields should be present
        valid = campaign.name && campaign.startDate && campaign.endDate
            && campaign.totalBudget &&
            campaign.campaignType && campaign.dailyBudget;

        if (!valid) {
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }

        // Campaign fields should be in bounds
        valid = +campaign.totalBudget >= 0 && +campaign.dailyBudget >= 0
            && campaign.name.length > 0;
        this.setState(Object.assign({}, this.state, { valid: valid }));
    }

    handleChange(key) {
        return function (e) {
            this.state.campaign[key] = e.target.value;
            var newCampaign = Object.assign({}, this.state.campaign);
            newCampaign[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { campaign: newCampaign }));
            this.validateState();
        };
    }

    setDate(key, date) {
        var dateString = [date.year, date.month + 1, date.date].join('-');
        this.state.campaign[key] = dateString;
        this.setState(Object.assign({}, this.state));
        this.validateState();
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
        // Set end date element first. Swapping leads to loss of formatting
        $('#endDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onStart: () => {
                var endInput = $('#endDate').pickadate(),
                    endPicker = endInput.pickadate('picker')
                if (this.state.campaign.endDate) {
                    endPicker.set('select', that.state.campaign.endDate, { format: 'yyyy-mm-dd' });
                }
            },
            onSet: function (arg) {
                if ('select' in arg) { // Do not close on selection of month/year
                    var toInput = $('#endDate').pickadate(),
                        toPicker = toInput.pickadate('picker');
                    var toDate = toPicker.get('select');
                    that.setDate('endDate', toDate);
                    toPicker.close();
                }
            }
        });

        $('#startDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onStart: () => {
                var fromInput = $('#startDate').pickadate(),
                    fromPicker = fromInput.pickadate('picker')
                if (this.state.campaign.startDate) {
                    fromPicker.set('select', that.state.campaign.startDate, { format: 'yyyy-mm-dd' });
                }
            },
            onSet: arg => {
                // Set minDate of endDate to startDate
                if ('select' in arg) {
                    var fromInput = $('#startDate').pickadate()
                    var fromPicker = fromInput.pickadate('picker')

                    var toInput = $('#endDate').pickadate()
                    var toPicker = toInput.pickadate('picker');

                    var fromDate = fromPicker.get('select');
                    toPicker.set('min', fromDate);
                    that.setDate('startDate', fromDate);
                    fromPicker.close();
                }
            }
        });

        $('select').material_select();
        $('#campaignTypeSelect').on('change', e => this.setCampaignType(e.target.value)).bind(this);

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
            <div id="cmpForm" className="modal modal-fixed-footer">
                <div className="modal-content valign-wrapper">
                    <div className="container">
                        <h5 className="center">{title}</h5>
                        <br />
                        <br />
                        <div>
                            <div className="row">
                                <div className="col s4">
                                    <div className="input-field">
                                        <select id="campaignTypeSelect" defaultValue={config.defaultCampaignType}>
                                            {Object.keys(config.campaignTypes).map(id =>
                                                <option key={id} value={id}>{config.campaignTypes[id]}</option>
                                            )}
                                        </select>
                                        <label>Campaign Type</label>
                                    </div>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s8">
                                    <FormInput
                                        fieldName="name"
                                        label="Campaign Name"
                                        value={this.state.campaign.name}
                                        handleChange={this.handleChange('name').bind(this)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s5">
                                    <NumberInput
                                        fieldName="totalBudget"
                                        label="Total Budget ($)"
                                        value={this.state.campaign.totalBudget}
                                        handleChange={this.handleChange('totalBudget').bind(this)} />
                                </div>
                                <div className="col s1">
                                </div>
                                <div className="col s5">
                                    <NumberInput
                                        fieldName="dailyBudget"
                                        label="Daily Budget ($)"
                                        value={this.state.campaign.dailyBudget}
                                        handleChange={this.handleChange('dailyBudget').bind(this)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s5">
                                    <div className="input-field">
                                        <label htmlFor="startDate">Start Date</label>
                                        <input type="date" id="startDate" className="datepicker" label="Start Date" />
                                    </div>
                                </div>
                                <div className="col s1">
                                </div>
                                <div className="col s5">
                                    <div className="input-field">
                                        <label htmlFor="endDate">End Date</label>
                                        <input type="date" id="endDate" className="datepicker" label="End Date" />
                                    </div>
                                </div>
                            </div>
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