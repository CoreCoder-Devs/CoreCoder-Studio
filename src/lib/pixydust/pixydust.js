/**
 * Pixydust - a pixel art editor for html fully based on Javascript
 * and html <canvas> dom element
 * 
 * written by Hanprogramer
 * dependency: https://www.npmjs.com/package/@simonwep/pickr
 * pixydust.css must be after pickr.css
 */

/**
 * 
                                 Apache License
                           Version 2.0, January 2004
                        http://www.apache.org/licenses/

   TERMS AND CONDITIONS FOR USE, REPRODUCTION, AND DISTRIBUTION

   1. Definitions.

      "License" shall mean the terms and conditions for use, reproduction,
      and distribution as defined by Sections 1 through 9 of this document.

      "Licensor" shall mean the copyright owner or entity authorized by
      the copyright owner that is granting the License.

      "Legal Entity" shall mean the union of the acting entity and all
      other entities that control, are controlled by, or are under common
      control with that entity. For the purposes of this definition,
      "control" means (i) the power, direct or indirect, to cause the
      direction or management of such entity, whether by contract or
      otherwise, or (ii) ownership of fifty percent (50%) or more of the
      outstanding shares, or (iii) beneficial ownership of such entity.

      "You" (or "Your") shall mean an individual or Legal Entity
      exercising permissions granted by this License.

      "Source" form shall mean the preferred form for making modifications,
      including but not limited to software source code, documentation
      source, and configuration files.

      "Object" form shall mean any form resulting from mechanical
      transformation or translation of a Source form, including but
      not limited to compiled object code, generated documentation,
      and conversions to other media types.

      "Work" shall mean the work of authorship, whether in Source or
      Object form, made available under the License, as indicated by a
      copyright notice that is included in or attached to the work
      (an example is provided in the Appendix below).

      "Derivative Works" shall mean any work, whether in Source or Object
      form, that is based on (or derived from) the Work and for which the
      editorial revisions, annotations, elaborations, or other modifications
      represent, as a whole, an original work of authorship. For the purposes
      of this License, Derivative Works shall not include works that remain
      separable from, or merely link (or bind by name) to the interfaces of,
      the Work and Derivative Works thereof.

      "Contribution" shall mean any work of authorship, including
      the original version of the Work and any modifications or additions
      to that Work or Derivative Works thereof, that is intentionally
      submitted to Licensor for inclusion in the Work by the copyright owner
      or by an individual or Legal Entity authorized to submit on behalf of
      the copyright owner. For the purposes of this definition, "submitted"
      means any form of electronic, verbal, or written communication sent
      to the Licensor or its representatives, including but not limited to
      communication on electronic mailing lists, source code control systems,
      and issue tracking systems that are managed by, or on behalf of, the
      Licensor for the purpose of discussing and improving the Work, but
      excluding communication that is conspicuously marked or otherwise
      designated in writing by the copyright owner as "Not a Contribution."

      "Contributor" shall mean Licensor and any individual or Legal Entity
      on behalf of whom a Contribution has been received by Licensor and
      subsequently incorporated within the Work.

   2. Grant of Copyright License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      copyright license to reproduce, prepare Derivative Works of,
      publicly display, publicly perform, sublicense, and distribute the
      Work and such Derivative Works in Source or Object form.

   3. Grant of Patent License. Subject to the terms and conditions of
      this License, each Contributor hereby grants to You a perpetual,
      worldwide, non-exclusive, no-charge, royalty-free, irrevocable
      (except as stated in this section) patent license to make, have made,
      use, offer to sell, sell, import, and otherwise transfer the Work,
      where such license applies only to those patent claims licensable
      by such Contributor that are necessarily infringed by their
      Contribution(s) alone or by combination of their Contribution(s)
      with the Work to which such Contribution(s) was submitted. If You
      institute patent litigation against any entity (including a
      cross-claim or counterclaim in a lawsuit) alleging that the Work
      or a Contribution incorporated within the Work constitutes direct
      or contributory patent infringement, then any patent licenses
      granted to You under this License for that Work shall terminate
      as of the date such litigation is filed.

   4. Redistribution. You may reproduce and distribute copies of the
      Work or Derivative Works thereof in any medium, with or without
      modifications, and in Source or Object form, provided that You
      meet the following conditions:

      (a) You must give any other recipients of the Work or
          Derivative Works a copy of this License; and

      (b) You must cause any modified files to carry prominent notices
          stating that You changed the files; and

      (c) You must retain, in the Source form of any Derivative Works
          that You distribute, all copyright, patent, trademark, and
          attribution notices from the Source form of the Work,
          excluding those notices that do not pertain to any part of
          the Derivative Works; and

      (d) If the Work includes a "NOTICE" text file as part of its
          distribution, then any Derivative Works that You distribute must
          include a readable copy of the attribution notices contained
          within such NOTICE file, excluding those notices that do not
          pertain to any part of the Derivative Works, in at least one
          of the following places: within a NOTICE text file distributed
          as part of the Derivative Works; within the Source form or
          documentation, if provided along with the Derivative Works; or,
          within a display generated by the Derivative Works, if and
          wherever such third-party notices normally appear. The contents
          of the NOTICE file are for informational purposes only and
          do not modify the License. You may add Your own attribution
          notices within Derivative Works that You distribute, alongside
          or as an addendum to the NOTICE text from the Work, provided
          that such additional attribution notices cannot be construed
          as modifying the License.

      You may add Your own copyright statement to Your modifications and
      may provide additional or different license terms and conditions
      for use, reproduction, or distribution of Your modifications, or
      for any such Derivative Works as a whole, provided Your use,
      reproduction, and distribution of the Work otherwise complies with
      the conditions stated in this License.

   5. Submission of Contributions. Unless You explicitly state otherwise,
      any Contribution intentionally submitted for inclusion in the Work
      by You to the Licensor shall be under the terms and conditions of
      this License, without any additional terms or conditions.
      Notwithstanding the above, nothing herein shall supersede or modify
      the terms of any separate license agreement you may have executed
      with Licensor regarding such Contributions.

   6. Trademarks. This License does not grant permission to use the trade
      names, trademarks, service marks, or product names of the Licensor,
      except as required for reasonable and customary use in describing the
      origin of the Work and reproducing the content of the NOTICE file.

   7. Disclaimer of Warranty. Unless required by applicable law or
      agreed to in writing, Licensor provides the Work (and each
      Contributor provides its Contributions) on an "AS IS" BASIS,
      WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or
      implied, including, without limitation, any warranties or conditions
      of TITLE, NON-INFRINGEMENT, MERCHANTABILITY, or FITNESS FOR A
      PARTICULAR PURPOSE. You are solely responsible for determining the
      appropriateness of using or redistributing the Work and assume any
      risks associated with Your exercise of permissions under this License.

   8. Limitation of Liability. In no event and under no legal theory,
      whether in tort (including negligence), contract, or otherwise,
      unless required by applicable law (such as deliberate and grossly
      negligent acts) or agreed to in writing, shall any Contributor be
      liable to You for damages, including any direct, indirect, special,
      incidental, or consequential damages of any character arising as a
      result of this License or out of the use or inability to use the
      Work (including but not limited to damages for loss of goodwill,
      work stoppage, computer failure or malfunction, or any and all
      other commercial damages or losses), even if such Contributor
      has been advised of the possibility of such damages.

   9. Accepting Warranty or Additional Liability. While redistributing
      the Work or Derivative Works thereof, You may choose to offer,
      and charge a fee for, acceptance of support, warranty, indemnity,
      or other liability obligations and/or rights consistent with this
      License. However, in accepting such obligations, You may act only
      on Your own behalf and on Your sole responsibility, not on behalf
      of any other Contributor, and only if You agree to indemnify,
      defend, and hold each Contributor harmless for any liability
      incurred by, or claims asserted against, such Contributor by reason
      of your accepting any such warranty or additional liability.

   END OF TERMS AND CONDITIONS

   APPENDIX: How to apply the Apache License to your work.

      To apply the Apache License to your work, attach the following
      boilerplate notice, with the fields enclosed by brackets "[]"
      replaced with your own identifying information. (Don't include
      the brackets!)  The text should be enclosed in the appropriate
      comment syntax for the file format. We also recommend that a
      file or class name and description of purpose be included on the
      same "printed page" as the copyright notice for easier
      identification within third-party archives.

   Copyright [yyyy] [name of copyright owner]

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
 */
var imgVersion = 1; // random number so that pixydust always load fresh image
/**
 * Icons for toolbar
 */
const icons = {
    'fit': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAAi0lEQVRYw+2WoRWAIBgGGcEBCIzgpg7gEA7gEASD0REIRsNZUfA9RQLhu3z8x4MAxgghIrCMLES8XhnjGehykiNwoygAsGUSTIlWHoAhlULVgH+Uft/k0xwFPs/hI8U7UUABBRRQoKmAnswGAnvVj9eaSnPVwJhKPUe1QMDmtJ75elBFgcCEM0KIiBNb3aiF/RQfegAAAABJRU5ErkJggg==',
    'pan': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABOUlEQVRYw+3Xv0oDQRDH8V9jBLWz8B3sLAVBEISgYCEKghaChVhYB58gqQKx9zkUCyHvoK1dzjrxD/5J/Fop8U5yN7c7jdx0e7vsh90ZbljJGNRokpDQpCaPoMV3tHyA3g/QczkRY+FyogyQOpFCk5oBUuPgpMYH0kmNDuRsmBlbq8oMWKvKDFirygxYc1IBFVAB/w2wRgVYAersM+8EMMMlAH3OmI4OMEd37Ps9O7GBq8xcl6WYwDKDzOyICxbi5WCFxz9W9GlEqyJWeSJypAtyjWdXQGKdF1dAos6rKyCxyZsrILHFuysgsc2HKyCxG4OY/JveYxi4/yCvExwEErf5zeaQUQDQLtLPjkoTQxaLtcxjPksBneLPwJMSubhmyvLS3ODBdDnnpu0liVlOuSHJK0zuaP+++y/VHzsCGG8vLwAAAABJRU5ErkJggg==',
    'zoom': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABSElEQVRYw+2Wu27CMBSGPTCCFOZ2jRg6snXgZeAZCOL6Au2Ul4m4iccAVIl3IOrAUL4OtU2SBiEHTsSQf4l8+z/7HMe2UpUqiQqfgIg9MTF7IgL8x5m3WZGnFe37zWuEnLmmMyG1e+ybrLmlNc3is0/aL+jiU6eOT5dFClFsFYTWYkfnX2uHnW0Pi6XWxH6Dl9vDY2Nz4Z5ulnb23tU+nl3F0tW+ZZefCg5AJlBGLTdAXw+bZ+ozAKWY6559N4DZJb2bgJ7ZZW6Abf7CcwAmmFs3wFEPa1yMs9ItDV08SgNi6RB9PVmS3bdpIP2jvckeFZHsYffDu+xx/SF74Zx4lbwyT/o7k7n0P3mxpemjny3RX2oTNUURqYfXNwciBpd9zyyBmMi8+6blIsYyiEm5iJEMYlwuYiiDGAkDLELKXimlGIraV6okp19bWkMpXxNyrQAAAABJRU5ErkJggg==',
    'zoomOut': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABQ0lEQVRYw+2WO27CQBCGt6AEydRJa1GkpEvhy8AZcMTzAknly1i8xDEARcodsFJQhC9F1hOjmDhrGCuF/8Za7/j/dnbWu2tMrVqqwickZk9Cwp6YEP925l1W5GlF93rzBhEnLulEROMa+zZrirSmXX70WfsFPXyaNPHpsThDlMuCSCx2BD96A3bSH5UrbTr3G7zcCI+N1MK93Cxl9N7FGE+yWLradyT94Ne4QOI6boCB/WxeGDm3kQM3QLpK+oWR/XSVuQG2f01cJnPrBjjYz1q2nSPb07LNgzYg0Z6i139WZPdlGmr/aA+6W0Wsu9l98Ki7XT/rHjhH7jWPzKN9znQO/RfupDW99bUl/ipt5k1ZxNnF6503Yp6+1z2zDGKic++bVosY6yAm1SJGOohxtYihDmKkDBCElr0xxjBUta9VS0+fx5ojSaWTvukAAAAASUVORK5CYII=',
    'brush': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA60lEQVRYw+2WMQrCQBAAT4SUVmJjYXq/YOUP/IJ9fEV6FfIAG58hESy0M4WC2KSxFxJLcSxEUXOpsguCNw+YuVtu4YxxOH4EOiy5MKWuo/dJeTBXSLzpNRJfeoCJrh4yXT2sdPUpHV297/RO7/R/qTeGWFVvvYGk3pKQ1n8lquvxGLEmJ2fNCO8jIaBvk3zMO6H9SsQSp08KLyZ53kIAAmwEcoGNNbCRC2TWgNRXhAboBgYlgZ2MvsmxJDCuLm8x5FSiv9KtHggpJ5IZUMjNql+IrRk9DoXhRIJbbAw1+szYciZnz1hg9g5HZe5QxxB0PNrWeQAAAABJRU5ErkJggg==',
    'bucket': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABJUlEQVRYw+2WIQ7CMBhGJxAIJAKBQCAQCCSCGyAQCA6A5AAcYgKBRCCQCAQSyREQSCQSMTnxEBDSjg3a9W8CST+5Le9l/b92i6IPYUwc+QtjUmDhCz8i5RE/CjpcISh+QtF9DduHggpb1Cz84mUVGv4sPosMviE87ixeuFF5eEFFEV5I8QkvoPiGd1SY4J0UzEzwb4qhueBkhs8o9uYLdKFMjuZvMC8lmJgLahyt8VsqNmO2VSh4poykFSq+T0pCV1Kh4uvPTp2oSim0tWfzuh7LzELHD5Q7KW13RaY5rLW7S9dGvRVTOTYAzm6lzek9SUlBjiJ3W3HQnlnZHeGqomDX0lN+zm40bT9CNeZcSIiLDwV6HEi4saMVhYT4CsIJgiD4I8Ed8YJbb6TxsxwAAAAASUVORK5CYII=',
    'magicwand': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAABaklEQVRYhe3XvU7CUBiA4S9lcHAvgzEQVrgDR6MxXoZXUFZY3YxGxxoXB29BN2PCZWjSeAEuldRur4OHpkXq+W1cOFs5J+9D6NcAItulFlPGjesx07DAhJKUWESEmJSSSVBAhBTImTMnB9LAeRH65KxWTn/TkQNPYlYBs03bCXDeGUCitpwJzUfEVbXpSGhvsh9hNKY+hOGDZkowYsGSSyLbN2JEMOJdnbnvgFD5L546Iar8CRF3wQmVLzgWEQlOsEsGFBxVr6yIC2ughTjjk8PGqYhH4MMBaCHitTOnlMCzE2AwUT/5N/YdAc1E+edFRLhtmahA+SEZ/CbYowifX5+o1/D5JrHTRb51osLlQxCavC9hkPchNPms7bkIlR96fXeb5EWcCdO8I2GTdyAY2OWtCRa2eUui9sPVOG9FcO2StyDo8eCS9yOM8u6EcX6N+OuPWI2wyteIRHesxw1LXhjY5RWhy2/XP6xvv3hQ17jKqCMAAAAASUVORK5CYII=',
    'eyedropper': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAQAAAD9CzEMAAAA60lEQVRYw+3VUQqCQBRG4QuzkNxUQYU7CHxrHbUIBXcRbcQ9RG9Kp4fE1JrK8V7oYf4FfAdmZBSJi/uDseDElSPOhk+oeCw3SPR4jQSOgpWXn5vAUQI1ay8/L0HREg1bLw9wCA0sqbvE3svDJfyQnolPO8+55uwrX7HQ+ijf80nkISfjZsk7EXajhC4v8pLIlPmXT7Zmqc078sEhhSQm8CGJH/mKrHtACgs+6d6ocsJDPYVvn8HCkLe52sgb8CLGvIgx3wukJnwv0LAx4HuBNqHMDwLQkCrzo4DWD/GHgBbvCejxbwOafFxc4O4G5wVIQ7zMcgAAAABJRU5ErkJggg=='
}

const Tools = {
    Brush: 0,
    Bucket: 1,
    Eyedropper: 2,
    MagicWand: 3,
    Zoom: 4,
    Zoomout: 5,
    Pan: 6,
    Fit: 7
}

const pixyTemplate = `<div class="pixy">
    <div class="pixytoolbar">
        <!-- The generated toolbar here -->
    </div>
    <canvas class="pixyeditor">
</div>`;
const Pickr = require('@simonwep/pickr');
/**
 * The pixy class
 */
class Pixy {
    /**
     * Construct a new Pixy editor instance, element can be accessed inside Pixy.elm
     * @param {Node} elm the element to create Pixy on
     * @param {String} imgPath path to the image
     */
    constructor(elm, imgPath) {

        // Appearance
        this.backgroundColor = "#292929";

        // Path to the actual image
        this.imgPath = imgPath;

        // Internal usage
        this.image = null;
        this.imageData = null;
        this.imageWidth = 0;
        this.imageHeight = 0;

        // For panning around (not implemented)
        this.offsetX = 0;
        this.offsetY = 0;
        this.zoom = 2;

        // For drawing
        this.canvas = null;
        this.rendererCanvas = null;

        // For drawing (data for a single pixel)
        this.pixelImageData = null;
        this.pixelData = null;

        // Tool selected
        this.selectedTool = Tools.Brush;
        this.imageCanvas = new OffscreenCanvas(1, 1);

        // HTML elements
        this.elm = createEditorElm(this, elm, imgPath);
        this.toolbarElm = this.elm.firstElementChild;
        this.setBrushColor(0, 0, 0, 255);

        // Events
        this.onedit = [];
    }
    /**
     * Add event listener to pixy editor
     * @param {String} eventName "edit" | "..."
     * @param {function(args)} callback the function callback
     */
    addEventListener(eventName, callback = (arg)=>{}){
        if(eventName == "edit")
            this.onedit.push(callback)
    }
    /**
     * Set the brush color of it
     * @param {Number} r 
     * @param {Number} g 
     * @param {Number} b 
     * @param {Number} a 
     */
    setBrushColor(r, g, b, a) {
        // Get context to draw
        var context = this.imageCanvas.getContext("2d");

        // Create new data
        if (this.pixelData == null || this.pixelImageData == null) {
            this.pixelImageData = context.createImageData(1, 1); // only do this once per page
            this.pixelData = this.pixelImageData.data;           // only do this once per page
        }

        // Set the pixel
        this.pixelData[0] = r;
        this.pixelData[1] = g;
        this.pixelData[2] = b;
        this.pixelData[3] = a;
    }

    /**
     * Set a pixel on the currently editing image
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     */
    setPixel(x, y) {
        // Get context to draw
        var context = this.imageCanvas.getContext("2d");
        // Put the pixel to the imageCanvas
        context.putImageData(this.pixelImageData, x, y);

        // Update the screen
        this.drawCanvas(this, this.rendererCanvas, this.rendererCanvas.getContext("2d"));

        // Trigger the event
        for(var callback of this.onedit){
            callback();
        }
    }
    /**
     * Set a pixel on the currently editing image
     * @param {Number} x x coordinate
     * @param {Number} y y coordinate
     * @param {Number} r Red value
     * @param {Number} g Green value
     * @param {Number} b Blue value
     * @param {Number} a Alpha value
     */
    setPixelColor(x, y, r, g, b, a) {
        // Get context to draw
        var context = this.imageCanvas.getContext("2d");

        // Create new data
        if (this.pixelData == null || this.pixelImageData == null) {
            this.pixelImageData = context.createImageData(1, 1); // only do this once per page
            this.pixelData = this.pixelImageData.data;           // only do this once per page
        }

        // Set the pixel
        this.pixelData[0] = r;
        this.pixelData[1] = g;
        this.pixelData[2] = b;
        this.pixelData[3] = a;

        // Put the pixel to the imageCanvas
        context.putImageData(this.pixelImageData, x, y);

        // Update the screen
        this.drawCanvas(this, this.rendererCanvas, this.rendererCanvas.getContext("2d"));
    }

    /**
     * Draw the renderer
     * @param {Pixy} instance The pixy instance
     * @param {Node} canvas the canvas element
     * @param {Context} ctx Context for drawing
     */
    drawCanvas(instance, canvas, ctx) {
        // Set canvas's width and height to full size of the HTML element
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
    }

    /**
     * Select a tool
     * @param {Number} toolId The tool id to select
     */
    selectTool(toolId) {
        var elms = this.toolbarElm.children;
        if (!elms) return;
        for (var elm of elms) {
            elm.classList.remove("selected");
        }

        var button = this.toolbarElm.querySelector(`.pixytoolbtn[data-toolid='${toolId}']`);
        button.classList.add("selected");

        this.selectedTool = toolId;
    }

    /**
     * Get image 
     */
    async getImageContent(elm) {
        var data = await this.imageCanvas.convertToBlob({
            type: "image/png",
            quality: 1
          });
        return data;
    }
}
/**
 * Create the toolbar
 * @param {Pixy} instance
 * @param {Node} elm The Pixy HTML element
 * @param {Node} toolbar The container HTML element
 */
function _generateToolbar(instance, elm, toolbar) {
    // Brush
    var toolBrush = document.createElement("img");
    toolBrush.src = icons.brush;
    toolBrush.classList.add("pixytoolbtn");
    toolBrush.classList.add("selected");
    toolBrush.title = "Brush";
    toolBrush.setAttribute("data-toolid", Tools.Brush);
    toolBrush.onclick = function (ev) { instance.selectTool(Tools.Brush) };

    // Bucket
    var toolBucket = document.createElement("img");
    toolBucket.src = icons.bucket;
    toolBucket.classList.add("pixytoolbtn");
    toolBucket.title = "Bucket";
    toolBucket.setAttribute("data-toolid", Tools.Bucket);
    toolBucket.onclick = function (ev) { instance.selectTool(Tools.Bucket) };

    var colorSelector = document.createElement("div");
    colorSelector.classList.add("pixytoolbtn");
    colorSelector.classList.add("colorpicker");
    colorSelector.title = "Primary Color";
    colorSelector.style.setProperty("--var-pixydust-primarycolor", 'black');
    // colorSelector.setAttribute("data-toolid", Tools.Bucket);

    // Simple example, see optional options for more configuration.
    instance.pickr = Pickr.create({
        el: colorSelector,
        useAsButton: true,
        theme: 'nano', // or 'monolith', or 'nano'

        swatches: [
            'rgba(244, 67, 54, 1)',
            'rgba(233, 30, 99, 0.95)',
            'rgba(156, 39, 176, 0.9)',
            'rgba(103, 58, 183, 0.85)',
            'rgba(63, 81, 181, 0.8)',
            'rgba(33, 150, 243, 0.75)',
            'rgba(3, 169, 244, 0.7)',
            'rgba(0, 188, 212, 0.7)',
            'rgba(0, 150, 136, 0.75)',
            'rgba(76, 175, 80, 0.8)',
            'rgba(139, 195, 74, 0.85)',
            'rgba(205, 220, 57, 0.9)',
            'rgba(255, 235, 59, 0.95)',
            'rgba(255, 193, 7, 1)'
        ],

        components: {

            // Main components
            preview: true,
            opacity: true,
            hue: true,

            // Input / output Options
            interaction: {
                hex: true,
                rgba: true,
                hsla: true,
                hsva: true,
                cmyk: true,
                input: true,
                clear: true,
                save: false
            }
        }
    }).on("change", (color, source, pickrinstance) => {
        var color = color.toRGBA()
        colorSelector.style.setProperty("--var-pixydust-primarycolor", color.toString());
        // instance.primaryColor = color.toString();
        console.log(color);
        instance.setBrushColor(color[0], color[1], color[2], color[3] * 255);
    });


    toolbar.appendChild(toolBrush);
    toolbar.appendChild(toolBucket);
    toolbar.appendChild(colorSelector);
}

/**
 * Generate a new editor
 * @returns A DOM element of Pixy Editor
 */
function _generateElm() {
    var div = document.createElement("div");
    div.innerHTML = pixyTemplate;
    var elm = div.firstChild;
    return elm;
}


/**
 * Create a new pixydust editor
 * @param {Pixy} instance the pixy instance
 * @param {Node} elm a DOM element to make PixyDust
 * @param {String} imgPath the path to the initial image to load
 * @returns The pixy editor element
 */
function createEditorElm(instance, elm, imgPath = "") {
    // Create the element
    var pixyElm = _generateElm();

    // Set value on the instance
    instance.elm = pixyElm;
    instance.zoom = 2;
    instance.backgroundColor = '#393939';

    // Get Drawing context
    var toolbar = pixyElm.firstElementChild;
    _generateToolbar(instance, pixyElm, toolbar);
    var ctx = pixyElm.lastChild.getContext("2d");

    // turn off image aliasing
    ctx.msImageSmoothingEnabled = false;
    ctx.mozImageSmoothingEnabled = false;
    ctx.webkitImageSmoothingEnabled = false;
    ctx.imageSmoothingEnabled = false;

    // Renderer canvas, to display on screen
    var rendererCanvas = pixyElm.lastChild;
    instance.rendererCanvas = rendererCanvas;

    rendererCanvas.onresize = function (ev) {
        // When element resize, redraw
        // Note: this event is inaccurate sometimes doesnt fire
        instance.drawCanvas(instance, rendererCanvas, ctx);
    }
    window.addEventListener("resize", function (ev) {
        // When window resize, redraw
        instance.drawCanvas(instance, rendererCanvas, ctx);
    });

    function onmousescroll(ev) {
        // zooming functionality
        instance.zoom -= (ev.deltaY / 100.0) / 1.0;
        instance.zoom = Math.min(Math.max(instance.zoom, 1), 40);
        instance.drawCanvas(instance, rendererCanvas, ctx);
    }

    function ondraw(ev) {
        if (instance.pickr.isOpen() == true) return;
        var x = ev.layerX / instance.zoom;
        var y = ev.layerY / instance.zoom;
        if (instance.selectedTool == Tools.Brush) {
            instance.setPixel(x, y);
        }
    }

    rendererCanvas.addEventListener("mousewheel", function (ev) {
        // Zooming on inside the canvas
        onmousescroll(ev);
    });

    pixyElm.addEventListener("mousewheel", function (ev) {
        // Zooming on outside the canvas
        onmousescroll(ev);
    });
    rendererCanvas.addEventListener("mousedown", function (ev) {
        // Mouse Down
        ondraw(ev);
    });

    rendererCanvas.addEventListener("mousemove", function (ev) {
        // Check if mouse dragged
        if (ev.buttons > 0) {
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
            instance.drawCanvas(instance, rendererCanvas, ctx);
        }
        image.src = imgPath + '?' + (imgVersion+=1025);
    }


    elm.appendChild(pixyElm);
    return pixyElm;
}

/**
 * Create a brand new editor
 * @param {Node} elm the element to create Pixy on
 * @param {String} imgPath path to the image
 * @returns {Pixy} the pixy editor instance
 */
function createEditor(elm, imgPath) {
    return new Pixy(elm, imgPath);
}

module.exports = {
    createEditor
};