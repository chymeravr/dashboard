var React = require('react')
import { Link, hashHistory } from 'react-router'
import { logout, debug } from '../lib'
import { config } from '../config'
import { Table, Segment, Image, Menu, Grid, Button, Accordion, Icon } from 'semantic-ui-react'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: props.showLogout,
            currentPath: props.currentPath,
            headerVisible: false,
        }
        this.toggleVisibility = this.toggleVisibility.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showHeader: nextProps.showLogout, currentPath: nextProps.currentPath, headerVisible: false });
    }

    handleLogout() {
        logout(hashHistory);
    }

    toggleVisibility() {
        this.setState(Object.assign({}, this.state, { headerVisible: !this.state.headerVisible }))
    }

    render() {
        debug("header", this.state);

        if (this.state.showHeader && localStorage.getItem(config.jwt.tokenKey)) {
            var logoutButton = <Menu.Item className="navbarButton navbarItem" position="right" name='logout' onClick={this.handleLogout} />
        } else {
            var logoutButton = <Menu.Item className="navbarButton navbarItem" position="right" name='Sign-in' onClick={() => hashHistory.push('/login')} />
        }


        const currentPath = this.state.currentPath
        var activeItem = '';
        if (currentPath.match('publisher')) {
            activeItem = 'publisher';
        } else if (currentPath.match('advertiser')) {
            activeItem = 'advertiser';
        } else if (currentPath.match('profile')) {
            activeItem = 'profile';
        }


        const getItem = (name, link) => <Menu.Item name={name} className={activeItem === name ? 'navbarActiveItem' : 'navbarItem'} as={Link} to={link} />

        return (
            <Grid columns={16}>
                <Grid.Row only='mobile' columns={2} className="navbarMobile">
                    <Grid.Column width={6}>
                        <Image size='tiny' src='/static/img/logo-simple.png' style={{ padding: '10px 20px 0px 15px' }} onClick={(e) => hashHistory.push('/')} />
                    </Grid.Column>
                    <Grid.Column width={10}>
                        <Accordion className='blueBg'>
                            <Accordion.Title style={{height:'4rem'}}>
                                <Icon inverted style={{ float: 'right', padding: '5px 30px 0px 0px' }} size='big' name='content' />
                            </Accordion.Title>
                            <Accordion.Content>
                                <Menu fluid vertical pointing secondary size='massive' floated='right' color='blue' className="navbarMenuMobile">
                                    {getItem('profile', '/profile/')}
                                    {getItem('advertiser', '/advertiser/')}
                                    {getItem('publisher', '/publisher/')}
                                    {getItem('careers', '/profile/')}
                                    {getItem('blog', '/profile/')}
                                    {logoutButton}
                                </Menu>
                            </Accordion.Content>
                        </Accordion>
                    </Grid.Column>
                </Grid.Row>
                <Grid.Row only='computer'>
                    <Table padded inverted color='blue' className="navbar">
                        <Table.Body>
                            <Table.Row>
                                <Table.Cell><Image src="/static/img/logo.png" size="tiny" href="/" style={{ paddingTop: '14px' }} /></Table.Cell>
                                <Table.Cell textAlign='right'>
                                    <Menu pointing secondary size='massive' floated='right' color='blue' className="navbarMenu">
                                        {getItem('profile', '/profile/')}
                                        {getItem('advertiser', '/advertiser/')}
                                        {getItem('publisher', '/publisher/')}
                                        {getItem('careers', '/profile/')}
                                        {getItem('blog', '/profile/')}
                                        {logoutButton}
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

module.exports = Header