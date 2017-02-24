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
            fontWeight: "bold",
            color: '#FFFFFF',
        }

        return (
            <main className="Site-content ui center aligned grid" style={{ backgroundColor: '#2185d0' }}>
                <Grid centered columns={16} style={{ margin: 0 }} verticalAlign='middle'>
                    <Grid.Row columns={16} verticalAlign='middle' style={{ height: '91vh' }}>
                        <Grid.Column width={16}>
                            <Grid centered verticalAlign='middle'>
                                <Grid.Row>
                                
                                </Grid.Row>
                                <Grid.Row>
                                    <Grid.Column wdith={8} />
                                    <Grid.Column width={4}>
                                        <Header as='h1' style={style}>Cross Promotion Network For VR</Header>
                                    </Grid.Column>
                                    <Grid.Column wdith={8} />

                                </Grid.Row>
                                <Grid.Row>
                                    <Form>
                                        <Input action='Search' placeholder='Search' style={{ paddingRight: '80px' }} />
                                    </Form>
                                </Grid.Row>
                            </Grid>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={16} style={{ backgroundColor: '#FFFFFF' }}>
                        <Grid.Row>
                            <Header as='h1' style={style}>Cross Promotion Network For VR</Header>
                        </Grid.Row>
                        <Grid.Row>
                            <Form>
                                <Input action='Search' placeholder='Search' style={{ paddingRight: '0px' }} />
                            </Form>
                        </Grid.Row>
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}

module.exports = HomeView 