import React from 'react'
import { debug, callApiWithJwt } from '../lib.js'
import { config } from '../config.js'
import { hashHistory, Link } from 'react-router';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group' // ES6
import { Button, Form, Container, Grid, Message, Card, Image, Statistic, Icon, Header, Input, Flag, Table, Item, Divider } from 'semantic-ui-react'

export class TermsView extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        document.title = 'Terms of Service & Privacy Policy'
    }

    render() {

        var style = {
            color: '#008fcb',
            fontSize: '60px',
            textAlign: 'center',
            fontWeight: 300,
        }

        return (
            <main className="Site-content centre ui aligned" style={{ backgroundColor: '#FFF', minHeight: '100vh' }}>
                <Grid stackable columns={10} verticalAlign='top' style={{ paddingTop: '100px', paddingLeft: '20px' }}>
                    <Grid.Row centered columns={1}>
                        <Grid.Column width={12}>
                            <h2 className='blue'>Terms of Service</h2>

                            <p className='smallText'>By accessing the website at <a href="http://chymeravr.com">http://chymeravr.com</a>, you are agreeing to be bound by these terms of service, all applicable laws and regulations, and agree that you are responsible for compliance with any applicable local laws. If you do not agree with any of these terms, you are prohibited from using or accessing this site. The materials contained in this website are protected by applicable copyright and trademark law.</p>

                            <h3>1. Use License</h3>

                            <ol type="a" className='smallText'>
                                <li>
                                    Permission is granted to temporarily download one copy of the materials (information or software) on Chimera Labs, Inc.'s website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:

      <ol type="i">
                                        <li>modify or copy the materials;</li>
                                        <li>use the materials for any commercial purpose, or for any public display (commercial or non-commercial);</li>
                                        <li>attempt to decompile or reverse engineer any software contained on Chimera Labs, Inc.'s website;</li>
                                        <li>remove any copyright or other proprietary notations from the materials; or</li>
                                        <li>transfer the materials to another person or "mirror" the materials on any other server.</li>
                                    </ol>
                                </li>
                                <li>This license shall automatically terminate if you violate any of these restrictions and may be terminated by Chimera Labs, Inc. at any time. Upon terminating your viewing of these materials or upon the termination of this license, you must destroy any downloaded materials in your possession whether in electronic or printed format.</li>
                            </ol>

                            <h3>2. Disclaimer</h3>

                            <ol type="a" className='smallText'>
                                <li>The materials on Chimera Labs, Inc.'s website are provided on an 'as is' basis. Chimera Labs, Inc. makes no warranties, expressed or implied, and hereby disclaims and negates all other warranties including, without limitation, implied warranties or conditions of merchantability, fitness for a particular purpose, or non-infringement of intellectual property or other violation of rights.</li>
                                <li>Further, Chimera Labs, Inc. does not warrant or make any representations concerning the accuracy, likely results, or reliability of the use of the materials on its website or otherwise relating to such materials or on any sites linked to this site.</li>
                            </ol>

                            <h3>3. Limitations</h3>

                            <p className='smallText'>In no event shall Chimera Labs, Inc. or its suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on Chimera Labs, Inc.'s website, even if Chimera Labs, Inc. or a Chimera Labs, Inc. authorized representative has been notified orally or in writing of the possibility of such damage. Because some jurisdictions do not allow limitations on implied warranties, or limitations of liability for consequential or incidental damages, these limitations may not apply to you.</p>

                            <h3>4. Accuracy of materials</h3>

                            <p className='smallText'>The materials appearing on Chimera Labs, Inc.'s website could include technical, typographical, or photographic errors. Chimera Labs, Inc. does not warrant that any of the materials on its website are accurate, complete or current. Chimera Labs, Inc. may make changes to the materials contained on its website at any time without notice. However Chimera Labs, Inc. does not make any commitment to update the materials.</p>

                            <h3>5. Links</h3>

                            <p className='smallText'>Chimera Labs, Inc. has not reviewed all of the sites linked to its website and is not responsible for the contents of any such linked site. The inclusion of any link does not imply endorsement by Chimera Labs, Inc. of the site. Use of any such linked website is at the user's own risk.</p>

                            <h3>6. Modifications</h3>

                            <p className='smallText'>Chimera Labs, Inc. may revise these terms of service for its website at any time without notice. By using this website you are agreeing to be bound by the then current version of these terms of service.</p>

                            <h3>7. Governing Law</h3>

                            <p className='smallText'>These terms and conditions are governed by and construed in accordance with the laws of California and you irrevocably submit to the exclusive jurisdiction of the courts in that State or location.</p>
                            <Divider />
                            <h2 className='blue'>Privacy Policy</h2>

                            <p className='smallText'>Your privacy is important to us.</p>

                            <p className='smallText'>It is Chimera Labs, Inc.'s policy to respect your privacy regarding any information we may collect while operating our website. Accordingly, we have developed this privacy policy in order for you to understand how we collect, use, communicate, disclose and otherwise make use of personal information. We have outlined our privacy policy below.</p>

                            <ul className='smallText'>
                                <li>We will collect personal information by lawful and fair means and, where appropriate, with the knowledge or consent of the individual concerned.</li>
                                <li>Before or at the time of collecting personal information, we will identify the purposes for which information is being collected.</li>
                                <li>We will collect and use personal information solely for fulfilling those purposes specified by us and for other ancillary purposes, unless we obtain the consent of the individual concerned or as required by law.</li>
                                <li>Personal data should be relevant to the purposes for which it is to be used, and, to the extent necessary for those purposes, should be accurate, complete, and up-to-date.</li>
                                <li>We will protect personal information by using reasonable security safeguards against loss or theft, as well as unauthorized access, disclosure, copying, use or modification.</li>
                                <li>We will make readily available to customers information about our policies and practices relating to the management of personal information.</li>
                                <li>We will only retain personal information for as long as necessary for the fulfilment of those purposes.</li>
                            </ul>

                            <p className='smallText'>We are committed to conducting our business in accordance with these principles in order to ensure that the confidentiality of personal information is protected and maintained. Chimera Labs, Inc. may change this privacy policy from time to time at Chimera Labs, Inc.'s sole discretion.</p>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row only='computer' style={{ height: '80px' }} />
                </Grid>
            </main >
        );
    }
}
