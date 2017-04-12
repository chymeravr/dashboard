var React = require('react')
import { Link, hashHistory } from 'react-router'
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

        const footerLink = (content, href) => <List.Item as='a' style={{ fontSize: '1rem', color: '#fff' }}  href={'/#/' + href}>{content}</List.Item>;
        const footerLinkNewTab = (content, href) => <List.Item as='a' style={{ fontSize: '1rem', color: '#fff' }} href={href} target='_blank'>{content}</List.Item>;

        const iconTextStyle = {
            color: 'rgba(255, 255, 255, 0.5)',
            textAlign: 'left',
            fontSize: 'calc(13rem/16)',
            marginTop: '10px'
        };

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
                                    <List.Item href='/' style={iconTextStyle}>
                                        © Chymera VR, Inc.
                                    </List.Item>
                                    <List.Item ><Link to='/terms' style={iconTextStyle}>Terms of Service and Privacy Policy</Link></List.Item>
                                </List>
                            </Grid.Column>
                            <Grid.Column width={6} />
                            <Grid.Column width={4}>
                                <Table basic='very' unstackable style={{ backgroundColor: 'rgba(0, 0, 0, 0)' }}>
                                    <Table.Body>
                                        <Table.Row>
                                            <Table.Cell />
                                            <Table.Cell>
                                                <List link inverted>
                                                    <List.Item><Header as='h3' style={headingStyle}>Links</Header></List.Item>
                                                    {footerLink('Contact Us', 'contact/')}
                                                    {footerLinkNewTab('Blog', '')}
                                                    {footerLink('Careers', 'careers/')}
                                                </List>
                                            </Table.Cell>
                                            <Table.Cell>
                                                <List link inverted>
                                                    <List.Item><Header as='h3' style={headingStyle}>Socials</Header></List.Item>
                                                    {footerLinkNewTab('Twitter', 'https://twitter.com/ChymeraVR')}
                                                    {footerLinkNewTab('Facebook', 'https://www.facebook.com/ChymeraVR')}
                                                    {footerLinkNewTab('LinkedIn', 'https://www.linkedin.com/company/chymera-vr')}
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