import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { FormInput, spinner, PageHeading } from '../common'
import { AdgroupEditModal } from './adgroupModal'
import { AdModal } from './adModal'
import { Grid, Card, Table, Checkbox, Button, Icon, Header, Modal, Form, Input, Select, Radio, Divider, Statistic } from 'semantic-ui-react'
import moment from 'moment';



/**
 * Store direct properties of campaigns which can be printed by map
 */

const adHeaders = {
    // 'Name': 'name',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Total Burn': 'totalBurn',
    'Today Burn': 'todayBurn'
}

export class AdgroupDetailView extends React.Component {
    constructor(props) {
        super(props);

        this.state = Object.assign({
            adgroupId: this.props.params.adgroupId,
            targeting: []
        });
        this.openAdModal = this.openAdModal.bind(this);
        this.openAgModal = this.openAgModal.bind(this);
        this.closeAdModal = this.closeAdModal.bind(this);
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
        callApiWithJwt('/user/api/advertiser/adgroups/view/' + this.state.adgroupId,
            'GET',
            null,
            (response) => {
                var pricingId = response.pricing.id;
                response.pricing = pricingId;
                response.startDate = moment(response.startDate, 'YYYY-MM-DD');
                response.endDate = moment(response.endDate, 'YYYY-MM-DD');
                this.setState(Object.assign({}, this.state, { adgroup: response }))
                document.title = response.name + " | Adgroup";
            },
            (error) => {
                console.info(error)
                throw error;
            },
        );
    }

    setAdStatus(index, status) {
        const adId = this.state.adgroup.ads[index].id;
        callApiWithJwt('/user/api/advertiser/ad/' + adId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.adgroup.ads[index].status = status
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                alert(error)
            },
        );
    }

    openAgModal() {
        this.setState(Object.assign({}, this.state, { agModalIsOpen: true }));
    }

    openAdModal() {
        this.setState(Object.assign({}, this.state, { adModalIsOpen: true }));
    }

    closeAgModal() {
        this.setState(Object.assign({}, this.state, { agModalIsOpen: false }));
    }

    closeAdModal() {
        this.setState(Object.assign({}, this.state, { adModalIsOpen: false }));
    }


    postAdgroupEdit(adgroup) {
        adgroup.startDate = moment(adgroup.startDate, 'YYYY-MM-DD');
        adgroup.endDate = moment(adgroup.endDate, 'YYYY-MM-DD')
        adgroup['ads'] = this.state.adgroup.ads;
        this.setState(Object.assign({}, this.state, { adgroup: adgroup }), this.closeAgModal)
    }

    postAdAddition(ad) {
        this.state.adgroup.ads.unshift(ad);
        this.setState(Object.assign({}, this.state), this.closeAdModal);
    }

    render() {
        debug("adgroupDetail", this.state);
        if (!this.state.adgroup) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={3}>
                        <Grid.Column width={4} />
                        <Grid.Column width={2}>
                            <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Advertisement' onClick={this.openAdModal} />
                        </Grid.Column >
                        <Grid.Column width={10} />
                    </Grid.Row>
                    <Grid.Row verticalAlign='middle' columns={3}>
                        <Grid.Column width={4} />
                        <Grid.Column verticalAlign='middle' width={8}>
                            <Card fluid>
                                <Card.Content>
                                    <Card.Header>
                                        <Grid>
                                            <Grid.Row columns={16}>
                                                <Grid.Column width={6}>{this.state.adgroup.name}</Grid.Column>
                                                <Grid.Column width={6} />
                                                <Grid.Column width={1}><Button color='blue' onClick={this.openAgModal}>Edit</Button></Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Header>
                                    <Divider />
                                    <Card.Description>
                                        <Statistic>
                                            <Statistic.Value>{this.state.adgroup.dailyBudget}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Total Budget</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.adgroup.dailyBudget}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Daily Budget</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.adgroup.impressions}</Statistic.Value>
                                            <Statistic.Label>Impressions</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.adgroup.clicks}</Statistic.Value>
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
                                        <Table.HeaderCell>Ad Name</Table.HeaderCell>
                                        {Object.keys(adHeaders).map(header => <th key={header}>{header}</th>)}
                                        <Table.HeaderCell>Active</Table.HeaderCell>
                                        <Table.HeaderCell>Creative</Table.HeaderCell>
                                        <Table.HeaderCell>Landing URL</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.adgroup.ads.map((ad, idx) =>
                                        <Table.Row key={ad.id} className="grey-text text-darken-1">
                                            <Table.Cell>{ad.name}</Table.Cell>
                                            {Object.keys(adHeaders).map(key => <Table.Cell key={key}>{ad[adHeaders[key]]}</Table.Cell>)}
                                            <Table.Cell>
                                                <Checkbox toggle
                                                    checked={ad.status}
                                                    onChange={(e, d) => { this.setAdStatus(idx, d.checked) } } />

                                            </Table.Cell>
                                            <Table.Cell><img src={ad.creative} width="100px" /></Table.Cell>
                                            <Table.Cell><a href={"http://" + ad.landingPage} target='_blank' ><Icon name="external" /></a></Table.Cell>
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <AdgroupEditModal postSave={this.postAdgroupEdit.bind(this)} campaignId={this.state.adgroup.campaignId}
                        open={this.state.agModalIsOpen} closeModal={this.closeAgModal} adgroup={this.state.adgroup} />
                    <AdModal postSave={this.postAdAddition.bind(this)} adgroupId={this.state.adgroup.id} open={this.state.adModalIsOpen} closeModal={this.closeAdModal} />
                </Grid >
            </main>


        );
    }
}
