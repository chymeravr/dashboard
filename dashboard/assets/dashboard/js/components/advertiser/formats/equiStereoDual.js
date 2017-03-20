var React = require('react')
import { Table, Button, Dimmer, Loader, Segment, Grid } from 'semantic-ui-react'
import { debug, dataURItoBlob } from '../../../lib'
import { ImgUploadColumn } from '../../imageUpload'

const imgWidth = 4096;
const imgHeight = 2048;

const INITIAL = 'initial';
const STARTED = 'started';
const CONVERTED = 'converted';

export class EquiStereoFormat extends React.Component {
    constructor(props) {
        super(props);
        this.onCreativeAddition = props.onCreativeAddition;
        this.state = { converted: false }
        this.stitchEye = this.stitchEye.bind(this);
        this.stitch = this.stitch.bind(this);
        this.setFile = this.setFile.bind(this);
        this.setFileName = this.setFileName.bind(this);
        this.getImageData = this.getImageData.bind(this);
        this.validateImageData = this.validateImageData.bind(this);
    }

    setFile(file, label) {
        const that = this;
        var oFReader = new FileReader();
        oFReader.readAsDataURL(file);
        oFReader.onload = function (oFREvent) {
            var image = new Image();
            image.src = oFREvent.target.result;
            image.onload = function () {
                if (this.height != 2048 || this.width != 4096) {
                    alert("Please upload 2048x4096 images")
                } else {
                    that.state[label + "ImageData"] = oFREvent.target.result;
                    that.setState(Object.assign({}, that.state), that.validateImageData)
                }
            };
        };

    }

    setFileName(label) {
        return e => {
            this.setFile(e.target.files[0], label);
            const fileObject = {}
            fileObject[label] = e.target.files[0];
            this.setState(Object.assign({}, this.state, fileObject))
        };
    }


    getImageData(context, canvas, label) {
        var img = new Image();
        img.src = this.state[label + "ImageData"];
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, imgWidth, imgHeight);
        return context.getImageData(0, 0, imgWidth, imgHeight);
    }


    validateImageData() {
        this.setState(Object.assign({}, this.state, { valid: this.state.leftImageData && this.state.rightImageData }));
    }


    stitchEye(eye, start_x, start_y) {
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");

        var imageData = this.getImageData(ctx, c, eye);
        var stitchedCanvas = document.getElementById("stitchedCanvas");
        var stitchedContext = stitchedCanvas.getContext("2d");

        stitchedContext.putImageData(imageData, start_x, start_y)
    }

    stitch() {
        this.setState(Object.assign({}, this.state, { conversion: STARTED }))

        this.stitchEye('left', 0, 0);
        this.stitchEye('right', 0, 2048);

        var c = document.getElementById("stitchedCanvas");
        var ctx = c.getContext("2d");

        var previewCanvas = document.getElementById("previewCanvas");
        var previewContext = previewCanvas.getContext("2d");
        var previewImg = new Image();
        previewImg.src = c.toDataURL();
        previewContext.drawImage(previewImg, 0, 0, 4096, 4096, 0, 0, 600, 600);

        var image = c.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        this.onCreativeAddition(dataURItoBlob(image));
        this.setState(Object.assign({}, this.state, { conversion: CONVERTED }))
    }

    render() {
        return (
            <div>
                <Grid>
                    <Grid.Row>
                        <Grid.Column>
                            <Table compact basic collapsing celled padded={false} style={{ padding: 0, margin: '0px auto' }} >
                                <Table.Body>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='3'>Left Eye</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Row textAlign='center'>
                                        <ImgUploadColumn label="left" onImgFileChange={e => this.setFileName("left")(e)} src={this.state.leftImageData} width='600px' height='300px' />
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row>
                        <Grid.Column>
                            <Table compact basic collapsing celled padded={false} style={{ padding: 0, margin: '0px auto' }} >
                                <Table.Body>
                                    <Table.Header>
                                        <Table.Row>
                                            <Table.HeaderCell colSpan='3'>Right Eye</Table.HeaderCell>
                                        </Table.Row>
                                    </Table.Header>
                                    <Table.Row textAlign='center'>
                                        <ImgUploadColumn label="right" onImgFileChange={e => this.setFileName("right")(e)} src={this.state.rightImageData} width='600px' height='300px' />
                                    </Table.Row>
                                </Table.Body>
                            </Table>
                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        <Grid.Column width={6} />
                        <Grid.Column width={4}>
                            <Button fluid positive content="Stitch" onClick={this.stitch} disabled={!this.state.valid} loading={this.state.conversion == STARTED} />
                        </Grid.Column>
                        <Grid.Column width={6} />
                    </Grid.Row>
                </Grid>
                <canvas id="workingCanvas" height="2048" width="4096" style={{ display: "none" }} />
                <canvas id="stitchedCanvas" height="4096" width="4096" style={{ display: "none" }} />
                <Segment basic textAlign="center">
                    <canvas className="ui" id="previewCanvas" height="600" width="600" style={this.state.conversion == CONVERTED ? {} : { display: 'none' }} />
                </Segment>
                <Dimmer active={this.state.converting} inverted>
                    <Loader>Converting File..</Loader>
                </Dimmer>
            </div>
        );
    }
}