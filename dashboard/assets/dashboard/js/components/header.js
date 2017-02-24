var React = require('react')
import { Link, hashHistory } from 'react-router'
import { logout } from '../lib'
import { config } from '../config'
import { Menu, Segment, Image } from 'semantic-ui-react'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHeader: props.showLogout,
            currentPath: props.currentPath
        }
        console.info(this.state)
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showHeader: nextProps.showLogout, currentPath: nextProps.currentPath });
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

        const currentPath = this.state.currentPath
        console.info(currentPath)
        var activeItem = '';
        if (currentPath.match('publisher')) {
            activeItem = 'publisher';
        } else if (currentPath.match('advertiser')) {
            activeItem = 'advertiser';
        } else if (currentPath.match('profile')) {
            activeItem = 'profile';
        }

        return (
            <Segment>
                <Image size='tiny' src='/static/img/Logo.png' href='/' />
                <Menu borderless size='massive' floated='right'>
                    <Menu.Item />
                    <Menu.Item name='profile' active={activeItem === 'profile'} as={Link} to='/profile/' />
                    <Menu.Item name='advertisers' active={activeItem === 'advertiser'} as={Link} to='/advertiser/' />
                    <Menu.Item name='publishers' active={activeItem === 'publisher'} as={Link} to='/publisher/' />
                    <Menu.Menu position='right'>
                        {logoutButton}
                    </Menu.Menu>
                </Menu>
            </Segment>

        );
    }
}

module.exports = Header