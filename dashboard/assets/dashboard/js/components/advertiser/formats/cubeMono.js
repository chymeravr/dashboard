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

    dataURItoBlob(dataURI) {
        // convert base64 to raw binary data held in a string
        // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
        var byteString = atob(dataURI.split(',')[1]);

        // separate out the mime component
        var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

        // write the bytes of the string to an ArrayBuffer
        var ab = new ArrayBuffer(byteString.length);
        var ia = new Uint8Array(ab);
        for (var i = 0; i < byteString.length; i++) {
            ia[i] = byteString.charCodeAt(i);
        }

        //Old Code
        //write the ArrayBuffer to a blob, and you're done
        //var bb = new BlobBuilder();
        //bb.append(ab);
        //return bb.getBlob(mimeString);

        //New Code
        return new Blob([ab], { type: mimeString });


    }

    convertToEqui() {
        const imgWidth = 1024;
        var c = document.getElementById("workingCanvas");
        var ctx = c.getContext("2d");

        var img = new Image();
        img.src = this.state.topImageData;
        ctx.clearRect(0, 0, c.width, c.height);

        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var topImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        img = new Image();
        img.src = this.state.bottomImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var bottomImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        img = new Image();
        img.src = this.state.frontImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var frontImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        img = new Image();
        img.src = this.state.backImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var backImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        img = new Image();
        img.src = this.state.rightImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var rightImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        img = new Image();
        img.src = this.state.leftImageData;
        ctx.clearRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, imgWidth, imgWidth);
        var leftImageData = ctx.getImageData(0, 0, imgWidth, imgWidth).data;

        var width = 4096,
            height = 2048,
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

        var image = c.toDataURL("image/jpeg").replace("image/jpeg", "image/octet-stream");  // here is the most important part because if you dont replace you will get a DOM 18 exception.
        console.info(this.state);
        window.open(image, "toDataURL() image", "width=600, height=200");
        this.onCreativeAddition(this.dataURItoBlob(image));
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