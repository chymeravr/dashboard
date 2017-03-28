var React = require('react')
import { Link } from 'react-router'
import { Grid, Segment, List, Menu, Image, Header, Icon, Dimmer, Table } from 'semantic-ui-react'


class Footer extends React.Component {
    render() {
        var style = {
            color: '#ffffff',
            backgroundColor: '#003045',
            backgroundImage: 'url(static/img/footer-arts-dark.png)',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'bottom',
            minHeight: '40vh',
        }

        var headingStyle = {
            color: '#008fcb',
            fontFamily: 'Roboto'
        }

        const footerLink = (content, href) => <List.Item as='a' style={{ fontSize: '1rem', color: '#fff' }} href={href}>{content}</List.Item>

        return (
            <footer>
                <Segment inverted attached padded style={style}>
                    <Grid stackable reversed='mobile' columns={16}>
                        <Grid.Row style={{ minHeight: '10vh' }} />
                        <Grid.Row>
                            <Grid.Column width={2} />
                            <Grid.Column only='computer' width={2} verticalAlign='middle'>
                                <List style={{ textAlign: 'left' }}>
                                    <List.Item>
                                        <Image src='/static/img/logo-simple.png' size='tiny' ></Image>
                                    </List.Item>
                                    <List.Item href='/' style={{
                                        color: '#fff', textAlign: 'left', fontSize: 'calc(13rem/16)'
                                    }}>© Chymera VR, Inc.</List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={6} />
                            <Grid.Column width={4}>
                                <Table unstackable style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell />
                                            <Table.Cell>
                                                <List link inverted>
                                                    <List.Item><Header as='h3' style={headingStyle}>Links</Header></List.Item>
                                                    {footerLink('Contact Us', '/#/contact')}
                                                    {footerLink('Blog', '')}
                                                    {footerLink('Careers', '')}
                                                </List>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <List link inverted>
                                                    <List.Item><Header as='h3' style={headingStyle}>Socials</Header></List.Item>
                                                    {footerLink('Twitter', 'https://twitter.com/ChymeraVR')}
                                                    {footerLink('Facebook', 'https://www.facebook.com/ChymeraVR')}
                                                    {footerLink('LinkedIn', 'https://www.linkedin.com/company/chymera-vr')}
                                                </List>
                                            </Table.Cell>
                                        </Table.Row>
                                    </Table.Body>
                                </Table>
                            </Grid.Column>
                            <Grid.Column width={2} />
                        </Grid.Row>
                    </Grid>
                </Segment>
            </footer >
        );
    }
}

module.exports = Footer