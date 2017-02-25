import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner, PageHeading } from '../common'
import { AdgroupEditModal } from './adgroupModal'
import { CampaignEditModal } from './campaignModal'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider } from 'semantic-ui-react'
import moment from 'moment'

/**
 * Store direct properties of campaigns which can be printed by map
 */

const adgroupHeaders = {
    // 'Name': 'name',
    'Total Budget': 'totalBudget',
    'Daily Budget': 'dailyBudget',
    'Start Date': 'startDate',
    'End Date': 'endDate',
    'Bid': 'bid',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Burn': 'burn'
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
                this.setState(Object.assign({}, this.state, { campaign: response }));
                document.title = response.name + " | Campaign";
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
                // throw error;
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
        $('.modal').modal();
        $('#agForm').modal('open');
        this.setState(Object.assign({}, this.state, { agModalIsOpen: true }));
    }

    postSave(campaign) {
        this.setState(Object.assign({}, this.state, { campaign: campaign }))
    }

    postAdgroupAddition(adgroup) {
        $('#agForm').modal('close');
        this.state.campaign.adgroups.unshift(adgroup);
        // To reset state of modal
        this.setState(Object.assign({}, this.state, { timestamp: Date.now() }));
    }

    setAdgroupStatus(index, status) {
        console.info(status);
        const adgroupId = this.state.campaign.adgroups[index].id;
        callApiWithJwt('/user/api/advertiser/adgroups/' + adgroupId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.campaign.adgroups[index].status = status
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                alert(error)
            },
        );
    }

    render() {
        if (!this.state.campaign) {
            return (
                spinner
            )
            // TODO : Spinner
        }
        var fabStyle = {
            bottom: '50px',
            right: '50px'
        }

        var heightStyle = {
            height: '100%',
            minHeight: '100%',
        }
        return (
            <main className="Site-content ui center aligned grid" style={{ height: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={1}>
                        <Grid centered stretched verticalAlign='middle' columns={16}>
                            <Grid.Row verticalAlign='middle'>
                                <Grid.Column verticalAlign='middle' width={10}>
                                    <Card fluid>
                                        <Card.Content>
                                            <Card.Header>
                                                <Grid>
                                                    <Grid.Row columns={16}>
                                                        <Grid.Column width={2}>{this.state.campaign.name}</Grid.Column>
                                                        <Grid.Column width={12} />
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
                            </Grid.Row>
                        </Grid>
                    </Grid.Row>
                    <PageHeading title="Campaign Detail" onClick={e => this.openAgModal()} buttonText="Adgroup" />
                    <div className="card blue-grey darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">
                                {this.state.campaign.name}
                                <a className="right" href="javascript:void(0);" onClick={e => this.openCampaignModal()}>
                                    <i className="material-icons white-text">edit</i>
                                </a>
                            </span>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Total Budget</th>
                                        <th>Daily Budget</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="white-text text-darken-1">
                                        <td>{this.state.campaign.totalBudget}</td>
                                        <td>{this.state.campaign.dailyBudget}</td>

                                    </tr>
                                </tbody></table>
                        </div>
                    </div>
                    <CampaignEditModal saveMethod="PUT" postSave={this.postSave.bind(this)} open={this.state.cmpModalIsOpen} closeModal={this.closeCampaignModal} campaign={this.state.campaign} />

                    <br />
                    <ReactCSSTransitionGroup
                        component="table"
                        transitionName="fadeTransitionFast"
                        transitionAppear={true}
                        transitionLeave={false}
                        transitionEnterTimeout={150}
                        transitionLeaveTimeout={150}
                        transitionAppearTimeout={150}
                        className="table highlight grey-text text-darken-4 col s12">
                        <thead>
                            <tr>
                                <th>Adgroup Name</th>
                                {Object.keys(adgroupHeaders).map(header => <th key={header}>{header}</th>)}
                                <th>Active</th>
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.campaign.adgroups.map((adgroup, idx) =>
                                <tr key={adgroup.id} className="grey-text text-darken-1">
                                    <td>
                                        <Link to={'/advertiser/adgroups/' + adgroup.id + "/"}>
                                            {adgroup.name}
                                        </Link>
                                    </td>
                                    {Object.keys(adgroupHeaders).map(key => <td key={key}>{adgroup[adgroupHeaders[key]]}</td>)}

                                    <td>
                                        <div className="switch">
                                            <label>
                                                <input type="checkbox"
                                                    checked={adgroup.status ? "checked" : ""}
                                                    onChange={e => this.setAdgroupStatus(idx, e.target.checked)} />
                                                <span className="lever"></span>
                                            </label>
                                        </div>
                                    </td>
                                </tr>)
                            }
                        </tbody>
                    </ReactCSSTransitionGroup>

                    <AdgroupEditModal label="Create Adgroup" saveMethod="POST"
                        postSave={this.postAdgroupAddition.bind(this)} successStatus="201"
                        campaignId={this.state.campaign.id}
                        key={this.state.timestamp} />
                </Grid >
            </main>
        );
    }
}
