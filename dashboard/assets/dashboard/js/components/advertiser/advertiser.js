import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { FormInput, spinner, PageHeading } from '../common'
import { CampaignEditModal } from './campaignModal'
import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio } from 'semantic-ui-react'
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import moment from 'moment'


/**
 * Store direct properties of campaigns which can be printed by map
 */
const headers = {
    'Total Budget ($)': 'totalBudget',
    'Daily Budget ($)': 'dailyBudget',
    'Start Date': 'startDate',
    'End Date': 'endDate',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Total Burn ($)': 'totalBurn',
    'Today Burn ($)': 'todayBurn'
}

export class AdvertiserView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { modalIsOpen: false };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }


    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        };
    }

    componentWillMount() {
        callApiWithJwt('/user/api/advertiser/campaigns/',
            'GET',
            null,
            (response) => {
                response = response.map(cmp => Object.assign(cmp, { key: cmp.id }));
                this.setState(Object.assign({}, this.state, { campaigns: response }))
            },
            (error) => {
                // alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    componentDidMount() {
        document.title = "Campaigns"
    }

    postSave(campaign) {
        campaign.key = campaign.id;
        this.state.campaigns.unshift(campaign);
        this.setState(Object.assign({}, this.state), this.closeModal);

    }

    openModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    closeModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: false }));
    }

    setCampaignStatus(index, status) {
        const campaignId = this.state.campaigns[index].id;
        callApiWithJwt('/user/api/advertiser/campaigns/' + campaignId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.campaigns[index].status = status
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                alert(error)
            },
        );
    }

    render() {
        debug("advertiser", this.state);
        if (!this.state.campaigns) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        const campaigns = this.state.campaigns;

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={1}>
                        <Grid.Column width={2}>
                            <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Add Campaign' onClick={this.openModal} />
                        </Grid.Column>
                        <Grid.Column width={11} />
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={13}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Campaign Name</Table.HeaderCell>
                                        {Object.keys(headers).map(header => <Table.HeaderCell key={header}>{header}</Table.HeaderCell>)}
                                        <Table.HeaderCell>Campaign Type</Table.HeaderCell>
                                        <Table.HeaderCell>Campaign Active</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.campaigns.map((campaign, idx) =>
                                        <Table.Row key={campaign.key}>
                                            <Table.Cell>
                                                <Link to={'/advertiser/campaigns/' + campaign.id + "/"}>
                                                    {campaign.name}
                                                </Link>
                                            </Table.Cell>
                                            {Object.keys(headers).map(key => <Table.Cell key={key}>{campaign[headers[key]]}</Table.Cell>)}
                                            <Table.Cell>{config.campaignTypes[campaign.campaignType]}</Table.Cell>
                                            <Table.Cell>
                                                <Checkbox toggle
                                                    checked={campaign.status}
                                                    onChange={(e, d) => { this.setCampaignStatus(idx, d.checked) } } />

                                            </Table.Cell>
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <CampaignEditModal saveMethod="POST" postSave={this.postSave.bind(this)} open={this.state.modalIsOpen} closeModal={this.closeModal} />
            </main>

        );
    }
}