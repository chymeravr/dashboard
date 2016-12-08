import React, { ReactDOM } from 'react'
import Modal from 'react-modal'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'
import { hashHistory } from 'react-router'
import { config } from '../../config'
import { CreateTargetingModal } from './createTargetingModal'

export class AdgroupEditModal extends React.Component {
    constructor(props) {
        super(props);
        this.state = Object.assign({
            targetingModalOpen: false,
            adgroup: {
                campaign: props.campaignId,
                pricing: config.defaultPricing,
                targeting: null
            }
        }, JSON.parse(JSON.stringify(props)));
        this.postSave = props.postSave;
        this.saveMethod = props.saveMethod;
        this.label = props.label;
        this.successStatus = props.successStatus;
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
        return function (e) {
            console.info("Updating", key, e.target.value);
            this.state.adgroup[key] = e.target.value;
            var newAdgroup = Object.assign({}, this.state.adgroup);
            newAdgroup[key] = e.target.value;
            // Required to update state
            this.setState(Object.assign({}, this.state, { adgroup: newAdgroup }));
            this.validateState();
            console.info(this.state);
        };
    }

    setDate(key, date) {
        var dateString = [date.year, date.month + 1, date.date].join('-');
        this.state.adgroup[key] = dateString;
        this.setState(Object.assign({}, this.state));
        this.validateState();
    }

    setPricing(id) {
        var newAdgroup = Object.assign(this.state.adgroup, {
            pricing: id
        });
        this.setState(Object.assign({}, this.state, { adgroup: newAdgroup }));
        this.validateState();
        $('.dropdown-button').dropdown('close')
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

        // Set end date element first. Swapping leads to loss of formatting
        $('#agEndDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onStart: () => {
                console.info("Endinggg");
                var endInput = $('#agEndDate').pickadate(),
                    endPicker = endInput.pickadate('picker')
                if (this.state.adgroup.agEndDate) {
                    endPicker.set('select', that.state.adgroup.agEndDate, { format: 'yyyy-mm-dd' });
                    console.info(endPicker.get('select'))
                }
            },
            onSet: function (arg) {
                if ('select' in arg) { // Do not close on selection of month/year
                    var toInput = $('#agEndDate').pickadate(),
                        toPicker = toInput.pickadate('picker');
                    var toDate = toPicker.get('select');
                    that.setDate('endDate', toDate);
                    toPicker.close();
                }
            }
        });

        $('#agStartDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onStart: () => {
                var fromInput = $('#agStartDate').pickadate(),
                    fromPicker = fromInput.pickadate('picker')
                if (this.state.adgroup.agStartDate) {
                    fromPicker.set('select', that.state.adgroup.agStartDate, { format: 'yyyy-mm-dd' });
                    console.info(fromPicker.get('select'))
                }
            },
            onSet: arg => {
                // Set minDate of agEndDate to agStartDate
                if ('select' in arg) {
                    var fromInput = $('#agStartDate').pickadate()
                    var fromPicker = fromInput.pickadate('picker')

                    var toInput = $('#agEndDate').pickadate()
                    var toPicker = toInput.pickadate('picker');

                    var fromDate = fromPicker.get('select');
                    toPicker.set('min', fromDate);
                    that.setDate('startDate', fromDate);
                    fromPicker.close();
                }
            }
        });

    }

    saveAdgroup() {
        const apiSuffix = this.saveMethod === 'PUT' ? this.state.adgroup.id : '';
        const apiPath = '/user/api/advertiser/adgroups/' + apiSuffix;
        console.info(apiPath);
        callApiWithJwt(
            apiPath,
            this.saveMethod,
            JSON.stringify(this.state.adgroup),
            (response) => {
                console.info(response);
                this.postSave(response);
                $('#agForm').modal('close');
            },
            (error) => {
                throw error;
                // alert(error);
            },
            this.successStatus
        );
    }

    openSelectTargetingModal() {
        $('.modal').modal();
        $('#selectTargetingForm').modal('open');
        this.setState(Object.assign({}, this.state, { targetingModalOpen: true }));
    }

    openCreateTargetingModal() {
        $('.modal').modal();
        $('#createTargetingForm').modal('open');
        this.setState(Object.assign({}, this.state, { targetingModalOpen: true }));
    }

    render() {
        console.info(this.state.adgroup);
        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text"
                    onClick={e => this.saveAdgroup()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text disabled"
                    onClick={e => this.saveAdgroup()}>
                    Save
                </a>
        }
        return (
            <div>
                <div id="agForm" className="modal modal-fixed-footer">
                    <div className="modal-content valign-wrapper">
                        <div className="container">
                            <div className="row">
                                <div className="col s8">
                                    <FormInput
                                        fieldName="name"
                                        label="Adgroup Name"
                                        value={this.state.adgroup.name}
                                        handleChange={this.handleChange('name').bind(this)} />
                                </div>
                                <div className="col s3 right">
                                    <a className='dropdown-button btn tooltipped'
                                        data-position="right" data-delay="50" data-tooltip="Pricing"
                                        onClick={e => $('.dropdown-button').dropdown('open')}
                                        data-activates='pricingDropdown'>
                                        {config.pricings[this.state.adgroup.pricing]}
                                    </a>
                                    <ul id='pricingDropdown' className='dropdown-content'>
                                        {Object.keys(config.pricings).map(id =>
                                            <li key={id}>
                                                <a onClick={e => this.setPricing(id)}>
                                                    {config.pricings[id]}
                                                </a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s4">
                                    <NumberInput
                                        fieldName="totalBudget"
                                        label="Total Budget ($)"
                                        value={this.state.adgroup.totalBudget}
                                        handleChange={this.handleChange('totalBudget').bind(this)} />
                                </div>
                                <div className="col s1">
                                </div>
                                <div className="col s4">
                                    <NumberInput
                                        fieldName="dailyBudget"
                                        label="Daily Budget ($)"
                                        value={this.state.adgroup.dailyBudget}
                                        handleChange={this.handleChange('dailyBudget').bind(this)} />
                                </div>
                                <div className="col s1">
                                </div>
                                <div className="col s2">
                                    <NumberInput
                                        fieldName="bid"
                                        label="Bid ($)"
                                        value={this.state.adgroup.bid}
                                        handleChange={this.handleChange('bid').bind(this)} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col s3">
                                    <div className="input-field row">
                                        <label htmlFor="agStartDate">Start Date</label>
                                        <input type="date" id="agStartDate" className="datepicker" label="Start Date" />
                                    </div>
                                </div>
                                <div className="col s1">
                                </div>
                                <div className="col s3">
                                    <div className="input-field row">
                                        <label htmlFor="agEndDate">End Date</label>
                                        <input type="date" id="agEndDate" className="datepicker" label="End Date" />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <a className="modal-action waves-effect waves-green btn-flat teal white-text"
                                    onClick={e => this.openSelectTargetingModal()}>
                                    ADD TARGETING
                                </a>
                                <a className="modal-action waves-effect waves-green btn-flat teal white-text"
                                    onClick={e => this.openCreateTargetingModal()}>
                                    CREATE NEW TARGETING
                                </a>
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {saveButton}
                    </div>
                </div >
                <CreateTargetingModal saveMethod="POST"  successStatus="201" />
            </div>
        )
    }
}