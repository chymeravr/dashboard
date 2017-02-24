var React = require('react')
import { hashHistory } from 'react-router'
import { logout } from '../lib'
import { config } from '../config'
import { Menu, Segment } from 'semantic-ui-react'

class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = { showHeader: props.showLogout, activeItem: 'home' }
        this.handleItemClick = this.handleItemClick.bind(this);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({ showHeader: nextProps.showLogout });
    }

    handleItemClick(e, name) {
        this.setState({ activeItem: name })
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

            <Menu secondary>
                <Menu.Item name='home' active={activeItem === 'home'} onClick={() => hashHistory.push('/')} />
                <Menu.Item name='messages' active={activeItem === 'messages'} onClick={this.handleItemClick} />
                <Menu.Item name='friends' active={activeItem === 'friends'} onClick={this.handleItemClick} />
                <Menu.Menu position='right'>
                    {logoutButton}
                </Menu.Menu>
            </Menu>

        );
    }
}

module.exports = Header