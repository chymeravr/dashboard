import React from 'react'
import { debug, callApiWithJwt } from '../../lib.js'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import Modal from 'react-modal'
import { FormInput, spinner, PageHeading } from '../common'
import { AppEditModal } from './appModal'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider, Table, Checkbox } from 'semantic-ui-react'

const headers = {
    //'Name': 'name',
    'Key': 'id',
    'URL': 'url',
    'Requests': 'requests',
    'Impressions': 'impressions',
    'Clicks': 'clicks',
    'Earnings': 'earnings'
}

export class PublisherView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
    }

    handleChange(key) {
        return function (e) {
            var state = {};
            state[key] = e.target.value;
            this.setState(Object.assign({}, this.state, state));
        }.bind(this);
    }

    componentWillMount() {
        callApiWithJwt('/user/api/publisher/apps/',
            'GET',
            null,
            (response) => {
                response = response.map(app => Object.assign(app, { key: app.id }));
                this.setState(Object.assign({}, this.state, { apps: response }));
                document.title = "Apps"
            },
            (error) => {
                alert(error);
                hashHistory.push('/login/')
            },
        );


    }

    postSave(app) {
        app.key = app.id;
        this.state.apps.unshift(app);
        this.setState(Object.assign({}, this.state), this.closeModal);
    }

    openModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: true }));
    }

    closeModal() {
        this.setState(Object.assign({}, this.state, { modalIsOpen: false }));
    }

    render() {
        if (!this.state.apps) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={1}>
                        <Grid.Column width={2}>
                            <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Add App' onClick={this.openModal} />
                        </Grid.Column>
                        <Grid.Column width={11} />
                    </Grid.Row>
                    <Grid.Row columns={1}>
                        <Grid.Column width={13}>
                            <Table>
                                <Table.Header>
                                    <Table.Row>
                                        <Table.HeaderCell>App Name</Table.HeaderCell>
                                        <Table.HeaderCell>App Store</Table.HeaderCell>
                                        {Object.keys(headers).map(header => <Table.HeaderCell key={header}>{header}</Table.HeaderCell>)}
                                        <Table.HeaderCell>App Status</Table.HeaderCell>
                                    </Table.Row>
                                </Table.Header>

                                <Table.Body>
                                    {this.state.apps.map((app, idx) =>
                                        <Table.Row key={app.key}>
                                            <Table.Cell>
                                                <Link to={'/publisher/apps/' + app.id + "/"}>
                                                    {app.name}
                                                </Link>
                                            </Table.Cell>
                                            <Table.Cell>{config.appStores[app.appStore]}</Table.Cell>
                                            {Object.keys(headers).map(key => <Table.Cell key={key}>{app[headers[key]]}</Table.Cell>)}
                                            <Table.Cell>{app.approved ? "Pending Approval" : "Approved"}</Table.Cell>
                                        </Table.Row>)
                                    }
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
                <AppEditModal label="Create App" saveMethod="POST" postSave={this.postSave.bind(this)} successStatus="201" closeModal={this.closeModal} open={this.state.modalIsOpen} />
            </main>
        );
    }
}
