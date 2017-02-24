var React = require('react')
import { hashHistory } from 'react-router'
import { logout } from '../lib'
import { config } from '../config'
import { Menu, Segment } from 'semantic-ui-react'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showHeader: props.showLogout, activeItem: 'home' }
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showHeader: nextProps.showLogout });
    }

    handleNavigation(name, path) {
        return () => {
            this.setState({ activeItem: name }, hashHistory.push(path))
        }
    }

    handleLogout() {
        logout(hashHistory);
    }
    render() {
        var style = {
            fontWeight: "lighter",
            // fontFamily: 'Cantora One'
        }

        if (this.state.showHeader && localStorage.getItem(config.jwt.tokenKey)) {
            var logoutButton = <Menu.Item name='logout' onClick={this.handleLogout} />
        } else {
            var logoutButton = ""
        }


        var Links = (
            <div>
                {// <li><a href="sass.html">Sass</a></li>
                    // <li><a href="badges.html">Components</a></li>
                    // <li><a href="collapsible.html">Javascript</a></li>
                    // <li><a href="mobile.html">Mobile</a></li>
                }
                {logoutButton}
            </div>
        );

        const { activeItem } = this.state

        return (
            <Segment inverted color='blue'>
                <Menu inverted borderless size='massive' color='blue'>
                    <Menu.Item header onClick={this.handleNavigation('home', '/')}>Chymera VR</Menu.Item>
                    <Menu.Item name='profile' active={activeItem === 'profile'} onClick={this.handleNavigation('profile', '/profile/')} />
                    <Menu.Item name='advertisers' active={activeItem === 'advertisers'}onClick={this.handleNavigation('advertisers', '/advertiser/')} />
                    <Menu.Item name='publishers' active={activeItem === 'publishers'} onClick={this.handleNavigation('publishers', '/publisher/')} />
                    <Menu.Menu position='right'>
                        {logoutButton}
                    </Menu.Menu>
                </Menu>
            </Segment>

        );
    }
}

module.exports = Header