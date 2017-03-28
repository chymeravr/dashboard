var React = require('react')
import { Link, hashHistory } from 'react-router'
import { logout, debug } from '../lib'
import { config } from '../config'
import { Table, Segment, Image, Menu } from 'semantic-ui-react'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: props.showLogout,
            currentPath: props.currentPath
        }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showHeader: nextProps.showLogout, currentPath: nextProps.currentPath });
    }

    handleLogout() {
        logout(hashHistory);
    }
    render() {
        debug("header", this.state);
        var style = {
            fontWeight: "lighter",
            // fontFamily: 'Cantora One'
        }

        if (this.state.showHeader && localStorage.getItem(config.jwt.tokenKey)) {
            var logoutButton = <Menu.Item className="navbarButton" position="right" name='logout' onClick={this.handleLogout} />
        } else {
            var logoutButton = <Menu.Item className="navbarButton" position="right" name='Sign-in' onClick={() => hashHistory.push('/login')} />
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
            <Table inverted color='blue' className="navbar">
                <Table.Body>
                    <Table.Row>
                        <Table.Cell><Image src="/static/img/logo.png" size="tiny" href="/"  style={{paddingTop:'14px'}}/></Table.Cell>
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
        );
    }
}

module.exports = Header