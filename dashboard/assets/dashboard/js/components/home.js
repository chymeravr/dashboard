var React = require('react');
var Link = require('react-router').Link
import { debug, callApiWithJwt } from '../lib.js'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Grid, Form, Button, Header, Input } from 'semantic-ui-react'

class HomeView extends React.Component {
    constructor(props) {
        super(props);
        this.state = { next: '/login' };
    }

    componentWillMount() {
        callApiWithJwt('/user/api/view_profile',
            'GET',
            {},
            (response) => this.setState({ next: '/profile/' }),
            (error) => ({})
        );
    }

    componentDidMount() {
        document.title = "Chymera VR"
    }

    render() {
        var style = {
            fontWeight: "lighter",
            color: '#555',
        }

        return (
            <Grid centered stretched verticalAlign='middle' columns={4}>
                <Grid.Row verticalAlign='middle'>
                    <Header as='h1'>Cross Promotion Network For VR</Header>
                </Grid.Row>
                <Grid.Row>
                    <Grid.Column verticalAlign='middle' centered>
                        <Form>
                            <Input action='Search' placeholder='Search' />
                        </Form>
                    </Grid.Column>
                </Grid.Row>
            </Grid>
        );
    }
}

module.exports = HomeView 