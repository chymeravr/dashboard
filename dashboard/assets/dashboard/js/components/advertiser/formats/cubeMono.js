var React = require('react')
import { Table, Button, Dimmer, Loader, Segment } from 'semantic-ui-react'
import { debug, dataURItoBlob } from '../../../lib'
import { ImgUploadColumn } from '../../imageUpload'

const imgWidth = 1024;

const INITIAL = 'initial';
const STARTED = 'started';
const CONVERTED = 'converted';

export class CubeMonoFormat extends React.Component {
    constructor(props) {
        super(props);
        this.onCreativeAddition = props.onCreativeAddition;
        this.state = { conversion: INITIAL }
        this.convertToEqui = this.convertToEqui.bind(this);
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
                console.info(this.height, this.width)
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
        const { topImageData, bottomImageData, leftImageData, rightImageData, frontImageData, backImageData } = this.state;
        this.setState(Object.assign({}, this.state, { valid: topImageData && bottomImageData && leftImageData && rightImageData && frontImageData && backImageData }));
    }

    convertToEquiWrapper() {
        this.setState(Object.assign({}, this.state, { conversion: STARTED }), this.convertToEqui)
    }

    convertToEqui() {
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");

        var topImageData = this.getImageData(ctx, c, "top")
        var bottomImageData = this.getImageData(ctx, c, "bottom")
        var leftImageData = this.getImageData(ctx, c, "left")
        var rightImageData = this.getImageData(ctx, c, "right")
        var frontImageData = this.getImageData(ctx, c, "front")
        var backImageData = this.getImageData(ctx, c, "back")

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
        var idata = ctx.createImageData(width, height);
        idata.data.set(buffer);
        ctx.putImageData(idata, 0, 0)

        var previewCanvas = document.getElementById("previewCanvas");
        var previewContext = previewCanvas.getContext("2d");
        var previewImg = new Image();
        previewImg.src = c.toDataURL();
        previewContext.drawImage(previewImg, 0, 0, 4096, 2048, 0, 0, 600, 300);

        var image = c.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");
        this.onCreativeAddition(dataURItoBlob(image));
        this.setState(Object.assign({}, this.state, { conversion: CONVERTED }))
    }

    render() {
        return (
            <div>
                <Table compact basic collapsing celled padded={false} style={{ padding: 0, margin: '0px auto' }} >
                    <Table.Body>
                        <Table.Row textAlign='center'>
                            <ImgUploadColumn label="top" onImgFileChange={e => this.setFileName("top")(e)} src={this.state.topImageData} />
                            <ImgUploadColumn label="left" onImgFileChange={e => this.setFileName("left")(e)} src={this.state.leftImageData} />
                            <ImgUploadColumn label="front" onImgFileChange={e => this.setFileName("front")(e)} src={this.state.frontImageData} />
                        </Table.Row>
                        <Table.Row textAlign='center'>
                            <ImgUploadColumn label="bottom" onImgFileChange={e => this.setFileName("bottom")(e)} src={this.state.bottomImageData} />
                            <ImgUploadColumn label="right" onImgFileChange={e => this.setFileName("right")(e)} src={this.state.rightImageData} />
                            <ImgUploadColumn label="back" onImgFileChange={e => this.setFileName("back")(e)} src={this.state.backImageData} />
                        </Table.Row>
                    </Table.Body>
                    <Table.Footer fullWidth>
                        <Table.Row>
                            <Table.HeaderCell colSpan='4'>
                                <Button floated="right" positive content="Convert" onClick={this.convertToEquiWrapper} disabled={!this.state.valid} />
                            </Table.HeaderCell>
                        </Table.Row>
                    </Table.Footer>
                </Table>
                <canvas id="workingCanvas" height="2048" width="4096" style={{ display: "none" }} />
                <Segment basic textAlign="center">
                    <canvas className="ui" id="previewCanvas" height="300" width="600" style={this.state.conversion == CONVERTED ? {} : { display: 'none' }} />
                </Segment>
                <Dimmer active={this.state.converting} inverted>
                    <Loader>Converting File..</Loader>
                </Dimmer>
            </div>
        );
    }
}