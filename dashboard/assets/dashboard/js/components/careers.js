import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Header, Accordion, List } from 'semantic-ui-react'

export class CareerView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = 'Careers | Chymera VR'
    }

    render() {

        var style = {
            color: '#008fcb',
            fontSize: '60px',
            textAlign: 'center',
            fontWeight: 300,
        }

        const getListItem = (content) => <List.Item><p className='smallText'>{content}</p></List.Item>;

        return (
            <main className="Site-content centre ui aligned" style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
                <Grid stackable columns={10} verticalAlign='top' style={{ paddingTop: '100px', paddingLeft: '20px' }}>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={8}>
                            <Header as='h1' style={Object.assign({}, style, { textAlign: 'left' })}>We are hiring!</Header>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={8}>
                            <Accordion fluid styled defaultActiveIndex={0}>
                                <Accordion.Title><Header as='h3'>Graphics Engineer</Header></Accordion.Title>
                                <Accordion.Content>
                                    <p className='smallText'>
                                        You will be a part of our SDK team which ensures seamless user experience
                                        in ad viewing across different platforms and VR Headsets. The team regularly deals with
                                        performance optimisation on mobile and dealing with a large variety of headsets
                                    </p>
                                    <Header as='h4'>Responsibilities</Header>
                                    <List bulleted>
                                        {getListItem('Be a part of a small and passionate team')}
                                        {getListItem('Abstract out various VR Headsets and OS and create a common extensible platform')}
                                        {getListItem('Shipping thoroughly tested SDKs to our publishers')}
                                    </List>
                                    <Header as='h4'>Requirements</Header>
                                    <List bulleted>
                                        {getListItem('Working knowledge of C/C++')}
                                        {getListItem('Interested in system level coding')}
                                        {getListItem('Strong understanding of Computer Graphics')}
                                    </List>
                                </Accordion.Content>

                                <Accordion.Title><Header as='h3'>Backend Engineer</Header></Accordion.Title>
                                <Accordion.Content>
                                    <p className='smallText'>
                                        You will be a part of our Ad Serving team which is core to our business
                                        and is responsible for handling all the ad requests received on our platform.
                                        Each ad request has to be served with the most appropriate
                                        ad available. And doing that in milliseconds makes it all the more difficult.
                                    </p>
                                    <Header as='h4'>Responsibilities</Header>
                                    <List bulleted>
                                        {getListItem('Be a part of a small and passionate team')}
                                        {getListItem('Work on highly scalable infrastructure we are trying to build up')}
                                        {getListItem('Architect, develop and test new modules that would come up')}
                                        {getListItem('Coordinate with SDK team and develop APIs')}
                                    </List>
                                    <Header as='h4'>Requirements</Header>
                                    <List bulleted>
                                        {getListItem('Must have production experience with Java')}
                                        {getListItem('Comfortable with agile and fast pace development environment')}
                                        {getListItem('Experience developing scalable systems')}
                                        {getListItem('Willingness to debug difficult systems')}
                                    </List>
                                </Accordion.Content>

                                <Accordion.Title><Header as='h3'>Data Scientist</Header></Accordion.Title>
                                <Accordion.Content>
                                    <p className='smallText'>
                                        You will be a part of our Data Science team which works on Ad-Relevance and User-Segmentation.
                                        VR generates huge amount of data and our DS team is working on different models to use that data
                                        and match advertisers with the best possible users.
                                    </p>
                                    <Header as='h4'>Responsibilities</Header>
                                    <List bulleted>
                                        {getListItem('Be a part of a small and passionate team')}
                                        {getListItem('Work independently to build machine learning models')}
                                        {getListItem('Establish business metrics for evaluation')}
                                    </List>
                                    <Header as='h4'>Requirements</Header>
                                    <List bulleted>
                                        {getListItem('Experience of working in a Data Science team handling data in TBs')}
                                        {getListItem('Basic knowledge of working with BigData tools like Spark, MapReduce, Pig')}
                                        {getListItem('Experience creating production grade and optimised models')}
                                    </List>
                                </Accordion.Content>

                            </Accordion>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row centered columns={1} >
                        <Grid.Column width={8}>
                            <Header as='h3' className='boldText greyText'>Reach out to us</Header>
                            <Header as='a' >
                                <a style={{ color: '#008fcb', fontWeight: '300' }} href="mailto:jobs@chymeravr.com" target="_top">jobs@chymeravr.com</a>
                            </Header>
                        </Grid.Column>
                    </Grid.Row>
                </Grid>
            </main >
        );
    }
}
