/**
 * Pixydust - a pixel art editor for html fully based on Javascript
 * and html <canvas> dom element
 * 
 * written by Hanprogramer
 */


class Pixy {
    constructor(elm, imgPath) {
        this.backgroundColor = "#292929";
        this.imgPath = imgPath;

        this.image = null;
        this.imageData = null;
        this.imageWidth = 0;
        this.imageHeight = 0;

        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 2;

        this.canvas = null;
        this.rendererCanvas = null;

        this.elm = createEditorElm(this, elm, imgPath);
    }

    setPixel(x, y, r, g, b) {
        // var off = (y * this.imageData.width + x) * 4;
        // var pixels = this.imageData.data;
        // pixels[off] = r;
        // pixels[off + 1] = g;
        // pixels[off + 2] = b;
        // pixels[off + 3] = 255;
        // this.imageCanvas.getContext("2d").putImageData(this.imageData,0,0);
        var context = this.imageCanvas.getContext("2d");
        var id = context.createImageData(1, 1); // only do this once per page
        var d = id.data;                        // only do this once per page
        d[0] = r;
        d[1] = g;
        d[2] = b;
        d[3] = 255;
        context.putImageData(id, x, y);

        this.drawCanvas(this, this.rendererCanvas, this.rendererCanvas.getContext("2d"), this.elm);
    }

    /**
     * Draw the renderer
     * @param {Pixy} instance The pixy instance
     * @param {Node} canvas the canvas element
     * @param {Context} ctx Context for drawing
     * @param {Node} pixyElm the pixy DOM element
     */
    drawCanvas(instance, canvas, ctx, pixyElm) {

        var rect = canvas.getBoundingClientRect();
        canvas.width = rect.width / instance.zoom;
        canvas.height = rect.height / instance.zoom;

        // Fill in the rest of background
        ctx.fillStyle = instance.backgroundColor;
        ctx.fillRect(instance.imageWidth, 0, canvas.width, canvas.height);
        ctx.fillRect(instance.imageWidth, instance.imageHeight, canvas.width, canvas.height);
        ctx.fillRect(0, instance.imageHeight, canvas.width, canvas.height);

        // Draw the image
        ctx.drawImage(instance.imageCanvas, 0, 0);
        // ctx.putImageData(instance.imageData, 0, 0);
    }
}

/**
 * Generate a new editor
 * @returns A DOM element of Pixy Editor
 */
function _generateElm() {
    var template = `<div class="pixy">
        <div class="pixytoolbar">
            <!-- The toolbar here -->
        </div>
        <canvas class="pixyeditor">
    </div>`;
    var div = document.createElement("div");
    div.innerHTML = template;
    return div.firstChild;
}


/**
 * Create a new pixydust editor
 * @param {Pixy} instance the pixy instance
 * @param {Node} elm a DOM element to make PixyDust
 * @param {String} imgPath the path to the initial image to load
 * @returns The pixy editor element
 */
function createEditorElm(instance, elm, imgPath = "") {
    var pixyElm = _generateElm();
    instance.elm = pixyElm;
    instance.zoom = 2;
    instance.backgroundColor = '#393939';
    var ctx = pixyElm.lastChild.getContext("2d");

    // turn off image aliasing
    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    var rendererCanvas = pixyElm.lastChild;
    instance.rendererCanvas = rendererCanvas;

    rendererCanvas.onresize = function (ev) {
        instance.drawCanvas(instance, rendererCanvas, ctx, pixyElm);
    }
    window.addEventListener("resize", function (ev) {
        instance.drawCanvas(instance, rendererCanvas, ctx, pixyElm);
    });

    function onmousescroll(ev) {
        instance.zoom -= (ev.deltaY / 100.0) / 2.0;
        instance.zoom = Math.min(Math.max(instance.zoom, 0.5), 40);
        instance.drawCanvas(instance, rendererCanvas, ctx, pixyElm);
    }

    function ondraw(ev) {
        // var imgCtx = instance.imageCanvas.getContext("2d");
        // imgCtx.imageSmoothingEnabled = false;
        // var r = 255, g = 200, b = 200, a = 255;
        // imgCtx.fillStyle = "rgba(" + r + "," + g + "," + b + "," + (a / 255) + ")";
        var x = ev.layerX / instance.zoom;
        var y = ev.layerY / instance.zoom;
        instance.setPixel(x, y, 255, 0, 0);
    }

    rendererCanvas.addEventListener("mousewheel", function (ev) {
        onmousescroll(ev);
    });

    pixyElm.addEventListener("mousewheel", function (ev) {
        onmousescroll(ev);
    });
    pixyElm.addEventListener("mousedown", function (ev) {
        ondraw(ev);
    });

    pixyElm.addEventListener("mousemove", function (ev) {
        if(ev.buttons > 0){
            ondraw(ev);
        }
    });

    if (imgPath != "") {
        // If we have image, then laod it
        var image = new Image();

        image.onload = function () {
            if (image.width <= 48 || image.height <= 48) {
                instance.zoom = 6;
            }
            //  Save the image data
            instance.image = image;
            instance.imageWidth = image.width;
            instance.imageHeight = image.height;

            // Draw the image to offscreen canvas
            instance.imageCanvas = new OffscreenCanvas(image.width, image.height);
            instance.imageCanvas.width = image.width;
            instance.imageCanvas.height = image.height;
            instance.imageCanvas.getContext("2d").drawImage(instance.image, 0, 0);

            // instance.imageData = rendererCanvas.createImageData(image.width, image.height);
            instance.imageData = instance.imageCanvas.getContext("2d").getImageData(0, 0, image.width, image.height);
            instance.drawCanvas(instance, rendererCanvas, ctx, pixyElm);
        }
        image.src = imgPath;
    }


    elm.appendChild(pixyElm);
    return pixyElm;
}

function createEditor(elm, imgPath) {
    return new Pixy(elm, imgPath);
}

module.exports = {
    createEditor
};