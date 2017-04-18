var React = require('react')
import { Link, hashHistory } from 'react-router'
import { logout, debug } from '../lib'
import { config } from '../config'
import { Table, Segment, Image, Menu, Grid, Button, Accordion, Icon } from 'semantic-ui-react'
import { ATTEMPT_LOGIN, LOGIN_SUCCEEDED, LOGIN_FAILED } from '../redux/loginActions'

class Header_P extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            currentPath: props.currentPath,
            headerVisible: false,
            transparent: props.transparent,
            loginState: props.loginState,
        }
        this.handleLogout = props.handleLogout;
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            currentPath: nextProps.currentPath,
            headerVisible: false,
            transparent: nextProps.transparent,
            loginState: nextProps.loginState
        });
    }

    render() {
        debug("header", this.state);

        if (this.state.loginState === LOGIN_SUCCEEDED) {
            var button = <Menu.Item className="navbarButton navbarItem" position="right" name='logout' onClick={this.handleLogout} />
        } else {
            var button = <Menu.Item className="navbarButton navbarItem" position="right" name='Sign-in' onClick={() => hashHistory.push('/login/')} />
        }


        const currentPath = this.state.currentPath
        var activeItem = '';
        if (currentPath === '/publisher/') {
            activeItem = 'publishers';
        } else if (currentPath === '/advertiser/') {
            activeItem = 'advertisers';
        } else if (currentPath === '/careers/') {
            activeItem = 'careers';
        }

        const transparent = this.state.transparent;

        const getItem = (name, link) => <Menu.Item name={name} className={activeItem === name ? 'navbarActiveItem' : 'navbarItem'} as={Link} to={link} />

        return (
            <Grid columns={16}>
                <Grid.Row only='mobile' columns={2} className={"navbarMobile " + (transparent ? "transparent" : "blueBg")}>
                    <Grid.Column width={6}>
                        <Image size='tiny' src='/static/img/logo-simple.png' style={{ padding: '15px 20px 0px 15px' }} onClick={(e) => hashHistory.push('/')} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Accordion>
                            <Accordion.Title style={{ height: '4rem' }}>
                                <Icon inverted style={{ float: 'right', padding: '5px 30px 0px 0px' }} size='big' name='content' />
                            </Accordion.Title>
                            <Accordion.Content>
                                <Menu fluid vertical pointing secondary size='massive' floated='right' color='blue' className="navbarMenuMobile">
                                    {getItem('advertisers', '/advertiser/')}
                                    {getItem('publishers', '/publisher/')}
                                    {getItem('careers', '/careers/')}
                                    {button}
                                    {this.state.loginState === LOGIN_SUCCEEDED ? <Button color="teal" position="right" content='Profile' onClick={(e, d) => hashHistory.push('/profile/')} /> : ''}
                                </Menu>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row only='computer'>
                    <Table padded inverted className={"navbar " + (transparent ? "transparent" : "blueBg")}>
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell><Image src="/static/img/logo.png" size="tiny" href="/" style={{ paddingTop: '14px' }} /></Table.Cell>
                                <Table.Cell textAlign='right'>
                                    <Menu pointing secondary size='massive' floated='right' color='blue' className="navbarMenu">
                                        {getItem('advertisers', '/advertiser/')}
                                        {getItem('publishers', '/publisher/')}
                                        {getItem('careers', '/careers/')}
                                        <Menu.Item only='computer' />
                                        {button}
                                        {this.state.loginState === LOGIN_SUCCEEDED ? <Button color="teal" position="right" content='Profile' onClick={(e) => hashHistory.push('/profile/')} /> : ''}
                                    </Menu>
                                </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>
                </Grid.Row>
            </Grid>
        );
    }
}

module.exports = Header_P