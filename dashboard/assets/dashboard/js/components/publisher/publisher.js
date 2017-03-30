import React from 'react'
import { debug, callApiWithJwt } from '../../lib'
import { config } from '../../config.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { hashHistory, Link } from 'react-router'
import { FormInput, spinner, PageHeading } from '../common'
import { AppEditModal } from './appModal'
import { Image as ImageComponent, Item, Grid, Card, Statistic, Icon, Button, Divider, Table, Checkbox, Menu, Input } from 'semantic-ui-react'

const APPS = 'apps'
const TEST_DEVICES = 'testDevices'

export class PublisherView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { activeItem: APPS };
        this.openModal = this.openModal.bind(this);
        this.closeModal = this.closeModal.bind(this);
        this.toggleTabs = this.toggleTabs.bind(this);
        this.addTestDevice = this.addTestDevice.bind(this);
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
                // alert(error);
                hashHistory.push('/login/')
            },
        );

        callApiWithJwt('/user/api/testDevices/',
            'GET',
            null,
            (response) => {
                response = response.map(testDevice => Object.assign(testDevice, { key: testDevice.id }));
                this.setState(Object.assign({}, this.state, { testDevices: response }));
            },
            (error) => {
                // alert(error);
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

    toggleTabs(tab) {
        this.setState(Object.assign({}, this.state, { activeItem: tab }));
    }

    addTestDevice() {
        callApiWithJwt('/user/api/testDevices/',
            'POST',
            JSON.stringify({ deviceId: this.state.testDeviceId }),
            (response) => {
                response.key = response.id
                this.state.testDevices.unshift(response);
                this.setState(Object.assign({}, this.state, { testDeviceId: '' }));
            },
            (error) => {
                throw error;
            },
            201
        );
    }

    setTestDeviceStatus(index, status) {
        const testDeviceId = this.state.testDevices[index].id;
        callApiWithJwt('/user/api/testDevices/' + testDeviceId,
            'PATCH',
            JSON.stringify({ status: status }),
            (response) => {
                this.state.testDevices[index].status = status
                this.setState(Object.assign({}, this.state));
            },
            (error) => {
                throw error;
            },
        );
    }

    render() {
        if (!this.state.apps) {
            return <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }} />
        }

        const activeItem = this.state.activeItem;
        var content;
        var addButton;

        switch (activeItem) {
            case APPS:
                content = (
                    <Grid.Column width={13}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>App Name</Table.HeaderCell>
                                    <Table.HeaderCell>App Store</Table.HeaderCell>
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
                                        <Table.Cell>{app.approved ? "Pending Approval" : "Approved"}</Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                )
                addButton = (
                    <Grid.Column width={13}>
                        <Button positive icon={<Icon inverted name="add" />} labelPosition='right' content='Add App' onClick={this.openModal} />
                    </Grid.Column>
                )
                break;
            case TEST_DEVICES:
                content = (
                    <Grid.Column width={4}>
                        <Table>
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Device Id</Table.HeaderCell>
                                    <Table.HeaderCell collapsing>Device Status</Table.HeaderCell>
                                </Table.Row>
                            </Table.Header>

                            <Table.Body>
                                {this.state.testDevices.map((testDevice, idx) =>
                                    <Table.Row key={idx}>
                                        <Table.Cell>{testDevice.deviceId}</Table.Cell>
                                        <Table.Cell collapsing>
                                            <Checkbox toggle
                                                checked={testDevice.status}
                                                onChange={(e, d) => { this.setTestDeviceStatus(idx, d.checked) } } />
                                        </Table.Cell>
                                    </Table.Row>)
                                }
                            </Table.Body>
                        </Table>
                    </Grid.Column>
                )
                const submitButton = <Button color='orange' onClick={this.addTestDevice} disabled={!this.state.testDeviceId || this.state.testDeviceId.length <= 0}><Icon name="add" /></Button>;
                addButton = (
                    <Grid.Column width={5}>
                        <Input fluid action={submitButton} placeholder='Add New Test Device Id' onChange={this.handleChange('testDeviceId').bind(this)} value={this.state.testDeviceId} />
                    </Grid.Column>
                )
                break;
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ minHeight: '100vh' }}>
                <Grid centered columns={16} style={{ margin: 0 }} >
                    <Grid.Row columns={1}>
                        <Menu compact>
                            <Menu.Item name='Apps' active={activeItem === APPS} onClick={() => this.toggleTabs(APPS)} />
                            <Menu.Item name='Test Devices' active={activeItem === TEST_DEVICES} onClick={() => this.toggleTabs(TEST_DEVICES)} />
                        </Menu>
                    </Grid.Row>
                    <Grid.Row>
                        {addButton}
                    </Grid.Row>
                    <Grid.Row>
                        {content}
                    </Grid.Row>
                </Grid>
                <AppEditModal label="Create App" saveMethod="POST" postSave={this.postSave.bind(this)} successStatus="201" closeModal={this.closeModal} open={this.state.modalIsOpen} />
            </main>
        );
    }
}
