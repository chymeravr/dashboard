import { connect } from 'react-redux'
import { hashHistory } from 'react-router'
import { startLogin, loginSucceeded, loginFailed, logout } from '../redux/loginActions'
import { logout as logoutMethod } from '../lib'
import Header_P from './header_p'

const mapStateToProps = (state) => {
    return state;
}

const mapDispatchToProps = (dispatch) => {
    return {
        handleLogout: () => {
            console.error('Logout')
            logoutMethod(hashHistory);
            dispatch(logout())
        }
    }
}

const Header_C = connect(
    mapStateToProps,
    mapDispatchToProps
)(Header_P)

export default Header_C 