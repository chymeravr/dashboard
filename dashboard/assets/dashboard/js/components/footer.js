var React = require('react')
import { Link } from 'react-router'
import { Grid, Segment, List, Menu, Image, Header, Icon, Dimmer } from 'semantic-ui-react'


class Footer extends React.Component {
    render() {
        var style = {
            color: '#ffffff',
        }

        return (
            <footer style={style}>
                <Segment inverted attached padded>
                    <Grid columns={16}>
                        <Grid.Row>
                            <Grid.Column width={1} />
                            <Grid.Column width={6} verticalAlign='bottom'>
                                <List inverted>
                                    <List.Item>
                                        <Image src='/static/img/Logo.png' size='small' inline={true}>
                                        </Image>
                                    </List.Item>
                                    <List.Item disabled  href='/'>© Chymera VR, Inc.</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={4} />
                            <Grid.Column width={2}>
                                <List link inverted>
                                    <List.Item><Header>Links</Header></List.Item>
                                    <List.Item as='a'>Contact Us</List.Item>
                                    <List.Item as='a'>Blog</List.Item>
                                    <List.Item as='a'>Careers</List.Item>
                                    <List.Item as='a'>Press</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={2}>
                                <List link inverted>
                                    <List.Item><Header>Socials</Header></List.Item>
                                    <List.Item as='a'>
                                        <Icon name='facebook' /> Facebook
                                    </List.Item>
                                    <List.Item as='a'>
                                        <Icon name='linkedin' /> LinkedIn
                                    </List.Item>
                                    <List.Item as='a'>
                                        <Icon name='twitter' /> Twitter
                                    </List.Item>
                                </List>
                            </Grid.Column>
                        </Grid.Row>
                        
                    </Grid>
                </Segment>
            </footer>
        );
    }
}

module.exports = Footer