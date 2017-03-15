var React = require('react')
import { Table, Button } from 'semantic-ui-react'
import { debug } from '../../../lib'
import { ImgUploadColumn } from '../../imageUpload'

export class CubeMonoFormat extends React.Component {
    constructor(props) {
        super(props);
        this.onCreativeAddition = props.onCreativeAddition;
        this.state = {

        }
        this.convertToEqui = this.convertToEqui.bind(this);
        this.setFile = this.setFile.bind(this);
        this.setFileName = this.setFileName.bind(this);
    }

    setFile(file, label) {
        const that = this;
        var oFReader = new FileReader();
        oFReader.readAsDataURL(file);
        oFReader.onload = function (oFREvent) {
            document.getElementById(label).src = oFREvent.target.result;
            that.state[label + "ImageData"] = oFREvent.target.result;
            that.setState(Object.assign({}, this.state), this.validateState)
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

    convertToEqui() {
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");

        var img = new Image();
        img.src = this.state.topImageData;
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.drawImage(img, 0, 0, 1024, 1024);
        var topImageData = ctx.getImageData(0, 0, 1024, 1024).data;

        img = new Image();
        img.src = this.state.bottomImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        var bottomImageData = ctx.getImageData(0, 0, 1024, 1024).data;

        img = new Image();
        img.src = this.state.frontImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        var frontImageData = ctx.getImageData(0, 0, 1024, 1024).data;

        img = new Image();
        img.src = this.state.backImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        var backImageData = ctx.getImageData(0, 0, 1024, 1024).data;

        img = new Image();
        img.src = this.state.rightImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        var rightImageData = ctx.getImageData(0, 0, 1024, 1024).data;

        img = new Image();
        img.src = this.state.leftImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, 1024, 1024);
        var leftImageData = ctx.getImageData(0, 0, 1024, 1024).data;
        // console.info(data);

        // img.src = this.state.bottomImageData;
        // ctx.drawImage(img, 100, 0, 100, 100);
        // var data = ctx.getImageData(0, 0, 1024, 1024).data;

        const inverseSqrt2 = 0.70710676908493042;


        var width = 4096,
            height = 2048,
            buffer = new Uint8ClampedArray(width * height * 4);

        var total = 1024 * 1024 * 4;
        var min = 10000
        var max = 0
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
                if (fy >= fx && fy >= fz) {
                    origData = y < 0 ? rightImageData : leftImageData;
                    z = this.scaleToSize(z / fy);
                    x = this.scaleToSize(x / fy);
                    coordinate = y < 0 ? total - (z * 1024 - x) * 4 : total - (z * 1024 + x) * 4;
                } else if (fx >= fy && fx >= fz) {
                    origData = x < 0 ? frontImageData : backImageData;
                    z = this.scaleToSize(z / fx);
                    y = this.scaleToSize(y / fx);
                    coordinate = x < 0 ? total - (z * 1024 + y) * 4 : total - (z * 1024 - y) * 4;
                } else {
                    origData = z > 0 ? topImageData : bottomImageData;
                    y = this.scaleToSize(y / fz);
                    x = this.scaleToSize(x / fz);
                    coordinate = z > 0 ? total - (x * 1024 + y) * 4 : (x * 1024 - y) * 4;
                }

                buffer[canvasPosition] = origData[coordinate];
                buffer[canvasPosition + 1] = origData[coordinate + 1];
                buffer[canvasPosition + 2] = origData[coordinate + 2];
                buffer[canvasPosition + 3] = 255;           // set alpha channel

            }
        }
        console.info(min, max)
        // create imageData object
        var idata = ctx.createImageData(width, height);

        // set our buffer as source
        idata.data.set(buffer);
        ctx.putImageData(idata, 0, 0)

        var previewCanvas = document.getElementById("previewCanvas");
        var previewContext = previewCanvas.getContext("2d");
        var previewImg = new Image();
        previewImg.src = c.toDataURL();
        ctx.drawImage(previewImg, 0, 0, 4096, 4096, 0, 0, 4096, 4096)
        var image = c.toDataURL("image/png").replace("image/png", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        console.info(this.state)
    }

    render() {
        debug("equiMono", this.state);

        return (
            <div>
                <Table celled collapsing padded={false} style={{ padding: 0 }}>
                    <Table.Body>
                        <Table.Row>
                            <ImgUploadColumn label="top" onImgFileChange={e => this.setFileName("top")(e)} />
                            <ImgUploadColumn label="left" onImgFileChange={e => this.setFileName("left")(e)} />
                            <ImgUploadColumn label="front" onImgFileChange={e => this.setFileName("front")(e)} />
                        </Table.Row>
                        <Table.Row>
                            <ImgUploadColumn label="bottom" onImgFileChange={e => this.setFileName("bottom")(e)} />
                            <ImgUploadColumn label="right" onImgFileChange={e => this.setFileName("right")(e)} />
                            <ImgUploadColumn label="back" onImgFileChange={e => this.setFileName("back")(e)} />
                        </Table.Row>
                    </Table.Body>
                </Table>
                <Button positive content="Convert" onClick={this.convertToEqui} />
                <canvas id="workingCanvas" height="2048" width="4096" style={{ display: "none" }} />
                <canvas id="previewCanvas" height="600" width="600" />
            </div>
        );
    }
}