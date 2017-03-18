var React = require('react')
import { Table, Button, Dimmer, Loader, Segment, Grid } from 'semantic-ui-react'
import { debug, dataURItoBlob } from '../../../lib'
import { ImgUploadColumn } from '../../imageUpload'

const imgWidth = 1024;
const INITIAL = 'initial';
const STARTED = 'started';
const CONVERTED = 'converted';

export class CubeStereoFormat extends React.Component {
    constructor(props) {
        super(props);
        this.onCreativeAddition = props.onCreativeAddition;
        this.state = { conversion: INITIAL }
        this.convertToEqui = this.convertToEqui.bind(this);
        this.convertToEquiEye = this.convertToEquiEye.bind(this);
        this.convertToEquiWrapper = this.convertToEquiWrapper.bind(this);
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
                if (this.height != 1024 || this.width != 1024) {
                    alert("Please upload 1024x1024 images")
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

    scaleToSize(x) {
        x = Math.round((1 + x) * 512);
        x = Math.min(x, 1023);
        x = Math.max(0, x);
        return x;
    }

    getImageData(context, canvas, label) {
        var img = new Image();
        img.src = this.state[label + "ImageData"];
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.drawImage(img, 0, 0, imgWidth, imgWidth);
        return context.getImageData(0, 0, imgWidth, imgWidth).data;
    }


    validateImageData() {
        const labels = ['bottomImageData', 'topImageData', 'leftImageData', 'rightImageData', 'frontImageData', 'backImageData']
        const l_labels = labels.map(e => 'l_' + e)
        const r_labels = labels.map(e => 'r_' + e)

        const l_valid = l_labels.every(e => this.state[e])
        const r_valid = r_labels.every(e => this.state[e])
        this.setState(Object.assign({}, this.state, { valid: l_valid && r_valid }));
    }

    convertToEquiWrapper() {
        this.setState(Object.assign({}, this.state, { conversion: STARTED }), this.convertToEqui)
    }

    convertToEquiEye(eye, start_x, start_y) {
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");

        var topImageData = this.getImageData(ctx, c, eye + "_top")
        var bottomImageData = this.getImageData(ctx, c, eye + "_bottom")
        var leftImageData = this.getImageData(ctx, c, eye + "_left")
        var rightImageData = this.getImageData(ctx, c, eye + "_right")
        var frontImageData = this.getImageData(ctx, c, eye + "_front")
        var backImageData = this.getImageData(ctx, c, eye + "_back")

        var width = imgWidth * 4,
            height = imgWidth * 2,
            buffer = new Uint8ClampedArray(width * height * 4);

        var total = imgWidth * imgWidth * 4;
        for (var j = 0; j < height; j++) {
            for (var i = 0; i < width; i++) {
                var x = 2 * i / width;
                var y = j / height;

                var phi = x * Math.PI
                var theta = y * Math.PI

                const cos_phi = Math.cos(phi)
                const sin_phi = Math.sin(phi)
                const cos_theta = Math.cos(theta)
                const sin_theta = Math.sin(theta)

                x = cos_phi * sin_theta
                y = sin_phi * sin_theta
                var z = cos_theta

                var fx = Math.abs(x);
                var fy = Math.abs(y);
                var fz = Math.abs(z);

                const pi = Math.PI;

                var canvasPosition = (j * width + i) * 4; // position in buffer based on x and y
                var coordinate;
                var origData;
                var max = Math.max(fx, fy, fz);
                if (fy === max) {
                    origData = y < 0 ? rightImageData : leftImageData;
                    z = this.scaleToSize(z / fy);
                    x = this.scaleToSize(x / fy);
                    coordinate = y < 0 ? total - 4 - ((z + 1) * imgWidth - x) * 4 : total - 4 - (z * imgWidth + x) * 4;
                } else if (fx == max) {
                    origData = x < 0 ? frontImageData : backImageData;
                    z = this.scaleToSize(z / fx);
                    y = this.scaleToSize(y / fx);
                    coordinate = x < 0 ? total - 4 - (z * imgWidth + y) * 4 : total - 4 - ((z + 1) * imgWidth - y) * 4;
                } else {
                    origData = z > 0 ? topImageData : bottomImageData;
                    y = this.scaleToSize(y / fz);
                    x = this.scaleToSize(x / fz);
                    coordinate = z > 0 ? total - 4 - (x * imgWidth + y) * 4 : ((x + 1) * imgWidth - y) * 4;
                }

                buffer[canvasPosition] = origData[coordinate];
                buffer[canvasPosition + 1] = origData[coordinate + 1];
                buffer[canvasPosition + 2] = origData[coordinate + 2];
                buffer[canvasPosition + 3] = 255;           // set alpha channel
            }
        }

        var stitchedCanvas = document.getElementById("stitchedCanvas");
        var stitchedContext = stitchedCanvas.getContext("2d");

        var idata = stitchedContext.createImageData(width, height);
        idata.data.set(buffer);
        stitchedContext.putImageData(idata, start_x, start_y)
    }

    convertToEqui() {
        this.convertToEquiEye('l', 0, 0);
        this.convertToEquiEye('r', 0, 2048);

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
                                        <ImgUploadColumn label="l_top" onImgFileChange={e => this.setFileName("l_top")(e)} src={this.state.l_topImageData} />
                                        <ImgUploadColumn label="l_left" onImgFileChange={e => this.setFileName("l_left")(e)} src={this.state.l_leftImageData} />
                                        <ImgUploadColumn label="l_front" onImgFileChange={e => this.setFileName("l_front")(e)} src={this.state.l_frontImageData} />
                                    </Table.Row>
                                    <Table.Row textAlign='center'>
                                        <ImgUploadColumn label="l_bottom" onImgFileChange={e => this.setFileName("l_bottom")(e)} src={this.state.l_bottomImageData} />
                                        <ImgUploadColumn label="l_right" onImgFileChange={e => this.setFileName("l_right")(e)} src={this.state.l_rightImageData} />
                                        <ImgUploadColumn label="l_back" onImgFileChange={e => this.setFileName("l_back")(e)} src={this.state.l_backImageData} />
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
                                        <ImgUploadColumn label="r_top" onImgFileChange={e => this.setFileName("r_top")(e)} src={this.state.r_topImageData} />
                                        <ImgUploadColumn label="r_left" onImgFileChange={e => this.setFileName("r_left")(e)} src={this.state.r_leftImageData} />
                                        <ImgUploadColumn label="r_front" onImgFileChange={e => this.setFileName("r_front")(e)} src={this.state.r_frontImageData} />
                                    </Table.Row>
                                    <Table.Row textAlign='center'>
                                        <ImgUploadColumn label="r_bottom" onImgFileChange={e => this.setFileName("r_bottom")(e)} src={this.state.r_bottomImageData} />
                                        <ImgUploadColumn label="r_right" onImgFileChange={e => this.setFileName("r_right")(e)} src={this.state.r_rightImageData} />
                                        <ImgUploadColumn label="r_back" onImgFileChange={e => this.setFileName("r_back")(e)} src={this.state.r_backImageData} />
                                    </Table.Row>
                                </Table.Body>
                            </Table>

                        </Grid.Column>
                    </Grid.Row>
                    <Grid.Row columns={3}>
                        <Grid.Column width={6} />
                        <Grid.Column width={4}>
                            <Button fluid positive content="Convert" onClick={this.convertToEquiWrapper} disabled={!this.state.valid} />
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