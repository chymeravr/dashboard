import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { FormInput, spinner, PageHeading } from '../common'
import { AppEditModal } from './appModal'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider, Table, Checkbox, Form, Input, Modal } from 'semantic-ui-react'


const placementHeaders = {
    'Placement Name': 'name',
    'Placement Id': 'id',
    'Requests': 'requests',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Earnings': 'earnings'
}

export class AppDetailView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            appId: this.props.params.appId,
            newPlacement: '',
        };
        this.openAppModal = this.openAppModal.bind(this);
        this.closeAppModal = this.closeAppModal.bind(this);
        this.openPmModal = this.openPmModal.bind(this);
        this.closePmModal = this.closePmModal.bind(this);
        this.savePlacement = this.savePlacement.bind(this);
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/publisher/apps/' + this.state.appId,
            'GET',
            null,
            (response) => {
                this.setState(Object.assign({}, this.state, { app: response }));
                document.title = response.name + " | App"
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
                // throw error;
            },
        );


    }

    openAppModal() {
        this.setState(Object.assign({}, this.state, { isAppModalOpen: true }))
    }

    closeAppModal() {
        this.setState(Object.assign({}, this.state, { isAppModalOpen: false }))
    }

    openPmModal() {
        this.setState(Object.assign({}, this.state, { isPmModalOpen: true }))
    }

    closePmModal() {
        this.setState(Object.assign({}, this.state, { isPmModalOpen: false }))
    }

    postSave(app) {
        this.setState(Object.assign({}, this.state, { app: app }), this.closeAppModal)
    }

    postPlacementAddition(placement) {
        this.state.app.placements.unshift(placement);
        this.state.newPlacement = '';
        this.setState(Object.assign({}, this.state), this.closePmModal);
    }

    savePlacement() {
        const apiPath = '/user/api/publisher/placements/';
        callApiWithJwt(
            apiPath,
            'POST',
            JSON.stringify({
                name: this.state.newPlacement,
                app: this.state.appId
            }),
            (response) => {
                this.postPlacementAddition(response);
            },
            (error) => {
                throw error;
            },
            201
        );
    }

    render() {
        debug("appDetail", this.state);
        if (!this.state.app) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={3}>
                        <Grid.Column width={4} />
                        <Grid.Column width={2}>
                            <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Add Placement' onClick={this.openPmModal} />
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
                                                <Grid.Column width={6}>{this.state.app.name}</Grid.Column>
                                                <Grid.Column width={6} />
                                                <Grid.Column width={1}><Button color='blue' onClick={this.openAppModal}>Edit</Button></Grid.Column>
                                            </Grid.Row>
                                        </Grid>
                                    </Card.Header>
                                    <Divider />
                                    <Card.Description>
                                        <Statistic>
                                            <Statistic.Value>{this.state.app.earnings}<Icon name="dollar" size="mini" /></Statistic.Value>
                                            <Statistic.Label>Earnings</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.app.impressions}</Statistic.Value>
                                            <Statistic.Label>Impressions</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.app.clicks}</Statistic.Value>
                                            <Statistic.Label>Clicks</Statistic.Label>
                                        </Statistic>
                                        <Statistic>
                                            <Statistic.Value>{this.state.app.requests}</Statistic.Value>
                                            <Statistic.Label>Requests</Statistic.Label>
                                        </Statistic>
                                    </Card.Description>
                                </Card.Content>
                            </Card>
                        </Grid.Column>
                        <Grid.Column width={4} />
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={13} >
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        {Object.keys(placementHeaders).map(header => <Table.HeaderCell key={header}>{header}</Table.HeaderCell>)}
                                    </Table.Row>
                                </Table.Header>
                                <Table.Body>
                                    {this.state.app.placements.map(placement =>
                                        <Table.Row key={placement.id}>
                                            {Object.keys(placementHeaders).map(key => <Table.Cell key={key}>{placement[placementHeaders[key]]}</Table.Cell>)}
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <AppEditModal label="Edit App" saveMethod="PUT" postSave={this.postSave.bind(this)} successStatus="200"
                        closeModal={this.closeAppModal} open={this.state.isAppModalOpen} app={this.state.app} />

                    <Modal size="small" open={this.state.isPmModalOpen} onClose={this.closePmModal} dimmer='blurring'>
                        <Modal.Header>Add Placement</Modal.Header>
                        <Modal.Content>
                            <Form>
                                <Form.Field control={Input} label='Placement name' placeholder='Placement name' onChange={this.handleChange('newPlacement')} value={this.state.newPlacement} />
                            </Form>
                        </Modal.Content>
                        <Modal.Actions>
                            <Button positive icon='checkmark' labelPosition='right' content='Create' onClick={this.savePlacement} />
                        </Modal.Actions>
                    </Modal>
                </Grid >
            </main>
        );
    }
}
