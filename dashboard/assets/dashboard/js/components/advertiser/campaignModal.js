import React, { ReactDOM } from 'react'
import Modal from 'react-modal'
import { FormInput, NumberInput } from '../common'
import { callApiWithJwt, debug } from '../../lib.js'


const campaignTypes = {
    '1': {
        label: 'Image 360',
        name: 'IMG_360'
    },
    '2': {
        label: 'Video 360',
        name: 'VID_360'
    }
}


export class CampaignEditModal extends React.Component {
    constructor(props) {
        super(props);
        var defaultCampaignType= '1';
        this.state = {
            valid: false,
            campaign: {
                campaignType: {
                    id: defaultCampaignType,
                    name: campaignTypes[defaultCampaignType].name
                }
            }
        };
    }


    validateState() {
        console.info("Validating");
        var valid =
            this.state.campaign;

        // Campaign should be present
        if (!valid) {
            console.info("oh no");
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }
        var campaign = this.state.campaign;

        // Campaign fields should be present
        valid = campaign.name && campaign.startDate && campaign.endDate
            && campaign.totalBudget &&
            campaign.campaignType && campaign.dailyBudget;

        if (!valid) {
            console.info("oh shit");
            this.setState(Object.assign({}, this.state, { valid: false }));
            return;
        }

        // Campaign fields should be in bounds
        valid = +campaign.totalBudget >= 0 && +campaign.dailyBudget >= 0
            && campaign.name.length > 0;
        this.setState(Object.assign({}, this.state, { valid: true }));
    }

    handleChange(key) {
        console.info(key);
        return function (e) {
            this.state.campaign[key] = e.target.value;
            this.setState(Object.assign({}, this.state));
            this.validateState();
        };
    }

    setDate(key, date) {
        var dateString = [date.year, date.month, date.date].join('-');
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
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left' // Displays dropdown with edge aligned to the left of button
        });

        $('#startDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onSet: function (arg) {
                // Set minDate of endDate to startDate
                if ('select' in arg) {
                    var fromInput = $('#startDate').pickadate(),
                        fromPicker = fromInput.pickadate('picker')

                    var toInput = $('#endDate').pickadate(),
                        toPicker = toInput.pickadate('picker');
                    var fromDate = fromPicker.get('select');
                    toPicker.set('min', fromDate);
                    toPicker.set('select', fromDate);
                    that.setDate('startDate', fromDate);
                    this.close();
                }
            }
        });

        $('#endDate').pickadate({
            selectMonths: true,
            selectYears: 5,
            format: 'yyyy-mm-dd',
            min: new Date(),
            onSet: function (arg) {
                if ('select' in arg) { // Do not close on selection of month/year
                    var toInput = $('#endDate').pickadate(),
                        toPicker = toInput.pickadate('picker');
                    var toDate = toPicker.get('select');
                    that.setDate('endDate', toDate);
                    this.close();
                }
            }
        });
    }

    setCampaignType(type) {
        var campaign = Object.assign(this.state.campaign, {
            campaignType: {
                id: type,
                name: campaignTypes[type].name
            }
        });
        this.setState(Object.assign({}, this.state, { campaign: campaign }));
        this.validateState();
        $('.dropdown-button').dropdown('close')
    }

    saveCampaign() {
        console.info(this.state.campaign);
        callApiWithJwt('/user/api/advertiser/campaigns',
            'POST',
            JSON.stringify(this.state.campaign),
            (response) => alert(response.id),
            (error) => {
                alert(error);
            }
        );
    }
    render() {
        console.info(this.state);
        if (this.state.valid) {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text" onClick={e => this.saveCampaign()}>
                    Save
                </a>
        } else {
            var saveButton =
                <a className="modal-action waves-effect waves-green btn-flat teal white-text disabled" onClick={e => this.saveCampaign()}>
                    Save
            </a>
        }

        return (
            <div id="modal1" className="modal modal-fixed-footer">
                <div className="modal-content">
                    <h4>Create Campaign</h4>
                    <div className="row">
                        <div className="col s8">
                            <FormInput
                                fieldName="name"
                                label="Campaign Name"
                                value={this.state.campaign.name}
                                handleChange={this.handleChange('name').bind(this)} />
                        </div>
                        <div className="col s3 right">
                            <a className='dropdown-button btn'
                                onClick={e => $('.dropdown-button').dropdown('open')}
                                data-activates='dropdown1'>
                                {campaignTypes[this.state.campaign.campaignType.id].label}
                            </a>
                            <ul id='dropdown1' className='dropdown-content'>
                                <li><a onClick={e => this.setCampaignType('1')}>Image 360</a></li>
                                <li><a onClick={e => this.setCampaignType('2')}>Video 360</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s6">
                            <NumberInput
                                fieldName="totalBudget"
                                label="Total Budget ($)"
                                value={this.state.campaign.totalBudget}
                                handleChange={this.handleChange('totalBudget').bind(this)} />
                        </div>
                        <div className="col s6">
                            <NumberInput
                                fieldName="dailyBudget"
                                label="Daily Budget ($)"
                                value={this.state.campaign.dailyBudget}
                                handleChange={this.handleChange('dailyBudget').bind(this)} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col s6">
                            <label htmlFor="startDate">Start Date</label>
                            <input type="date" id="startDate" className="datepicker" label="Start Date" />
                        </div>
                        <div className="col s6">
                            <label htmlFor="endDate">End Date</label>
                            <input type="date" id="endDate" className="datepicker" label="End Date" />
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