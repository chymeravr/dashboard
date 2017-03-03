import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { FormInput, spinner, PageHeading } from '../common'
import { AdgroupEditModal } from './adgroupModal'
import { CampaignEditModal } from './campaignModal'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider, Table, Checkbox } from 'semantic-ui-react'
import moment from 'moment'

/**
 * Store direct properties of campaigns which can be printed by map
 */

const adgroupHeaders = {
    // 'Name': 'name',
    'Total Budget ($)': 'totalBudget',
    'Daily Budget ($)': 'dailyBudget',
    'Bid ($)': 'bid',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Burn ($)': 'totalBurn'
}

export class CampaignDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            cmpModalIsOpen: false,
            agModalIsOpen: false,
            campaignId: this.props.params.campaignId
        };
        this.openCampaignModal = this.openCampaignModal.bind(this);
        this.closeCampaignModal = this.closeCampaignModal.bind(this);
        this.openAgModal = this.openAgModal.bind(this);
        this.closeAgModal = this.closeAgModal.bind(this);

    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/advertiser/campaigns/' + this.state.campaignId,
            'GET',
            null,
            (response) => {
                response.startDate = moment(response.startDate, 'YYYY-MM-DD');
                response.endDate = moment(response.endDate, 'YYYY-MM-DD');
                response.adgroups.forEach(adgroup => {
                    adgroup.startDate = moment(adgroup.startDate, 'YYYY-MM-DD');
                    adgroup.endDate = moment(adgroup.endDate, 'YYYY-MM-DD');
                })
                this.setState(Object.assign({}, this.state, { campaign: response }));
                document.title = response.name + " | Campaign";
            },
            (error) => {
                alert(error);
                throw error;
            },
        );
    }


    openCampaignModal() {
        this.setState(Object.assign({}, this.state, { cmpModalIsOpen: true }));
    }

    closeCampaignModal() {
        this.setState(Object.assign({}, this.state, { cmpModalIsOpen: false }));
    }

    openAgModal() {
        this.setState(Object.assign({}, this.state, { agModalIsOpen: true }));
    }

    closeAgModal() {
        this.setState(Object.assign({}, this.state, { agModalIsOpen: false }));
    }

    postSave(campaign) {
        campaign.startDate = moment(campaign.startDate, 'YYYY-MM-DD');
        campaign.endDate = moment(campaign.endDate, 'YYYY-MM-DD');
        campaign.adgroups.forEach(adgroup => {
            adgroup.startDate = moment(adgroup.startDate, 'YYYY-MM-DD');
            adgroup.endDate = moment(adgroup.endDate, 'YYYY-MM-DD');
        })
        this.setState(Object.assign({}, this.state, { campaign: campaign }), this.closeCampaignModal)
    }

    postAdgroupAddition(adgroup) {
        adgroup.startDate = moment(adgroup.startDate, 'YYYY-MM-DD');
        adgroup.endDate = moment(adgroup.endDate, 'YYYY-MM-DD')
        this.state.campaign.adgroups.unshift(adgroup);
        this.setState(Object.assign({}, this.state), this.closeAgModal);
    }

    setAdgroupStatus(index, status) {
        const adgroupId = this.state.campaign.adgroups[index].id;
        callApiWithJwt('/user/api/advertiser/adgroups/' + adgroupId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.campaign.adgroups[index].status = status
                this.state.campaign.adgroups.forEach(adgroup => {
                    adgroup.startDate = moment(adgroup.startDate, 'YYYY-MM-DD');
                    adgroup.endDate = moment(adgroup.endDate, 'YYYY-MM-DD');
                })
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                throw error;
            },
        );
    }

    render() {
        debug("campaignDetail", this.state);
        if (!this.state.campaign) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={3}>
                        <Grid.Column width={4} />
                        <Grid.Column width={2}>
                            <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Add Adgroup' onClick={this.openAgModal} />
                        </Grid.Column >
                        <Grid.Column width={10} />
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' columns={3}>
                        <Grid.Column width={4} />
                        <Grid.Column verticalAlign='middle' width={8}>
                            <Card fluid >
                                <Card.Content>
                                    <Card.Header>
                                        <Grid>
                                            <Grid.Row columns={16}>
                                                <Grid.Column width={4}>{this.state.campaign.name}</Grid.Column>
                                                <Grid.Column width={8} />
                                                <Grid.Column width={1}><Button color='blue' onClick={this.openCampaignModal}>Edit</Button></Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Header>
                                    <Divider />
                                    <Card.Description>
                                        <Statistic>
                                            <Statistic.Value>{this.state.campaign.dailyBudget}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Total Budget</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.campaign.dailyBudget}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Daily Budget</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.campaign.impressions}</Statistic.Value>
                                            <Statistic.Label>Impressions</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.campaign.clicks}</Statistic.Value>
                                            <Statistic.Label>Clicks</Statistic.Label>
                                        </Statistic>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column width={4} />
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={13}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>Adgroup Name</Table.HeaderCell>
                                        <Table.HeaderCell>Start Date</Table.HeaderCell>
                                        <Table.HeaderCell>End Date</Table.HeaderCell>
                                        {Object.keys(adgroupHeaders).map(header => <th key={header}>{header}</th>)}
                                        <Table.HeaderCell>Active</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.campaign.adgroups.map((adgroup, idx) =>
                                        <Table.Row key={adgroup.id}>
                                            <Table.Cell>
                                                <Link to={'/advertiser/adgroups/' + adgroup.id + "/"}>
                                                    {adgroup.name}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{adgroup.startDate.format('YYYY-MM-DD')}</Table.Cell>
                                            <Table.Cell>{adgroup.endDate.format('YYYY-MM-DD')}</Table.Cell>
                                            {Object.keys(adgroupHeaders).map(key => <Table.Cell key={key}>{adgroup[adgroupHeaders[key]]}</Table.Cell>)}
                                            <Table.Cell>
                                                <Checkbox toggle
                                                    checked={adgroup.status}
                                                    onChange={(e, d) => { this.setAdgroupStatus(idx, d.checked) } } />
                                            </Table.Cell>
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <CampaignEditModal postSave={this.postSave.bind(this)} open={this.state.cmpModalIsOpen} closeModal={this.closeCampaignModal} campaign={this.state.campaign} />
                    <AdgroupEditModal postSave={this.postAdgroupAddition.bind(this)} campaignId={this.state.campaign.id} open={this.state.agModalIsOpen} closeModal={this.closeAgModal} />
                </Grid >
            </main>
        );
    }
}
