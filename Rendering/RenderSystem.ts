/**
 * Created by mvie on 07/11/14.
 */
var mat4; // Import the mat4 object from the glMatrix lib.
class RenderSystem {
    private static instance : RenderSystem;
    private renderQueue : Renderable[] = [];
    private vboQueue = [];
    private cboQueue = [];

    public addRenderable(r : Renderable) {
        this.renderQueue.push(r);
        this.vboQueue.push(this.gl.createBuffer());
        this.cboQueue.push(this.gl.createBuffer());
    }

    public static getInstance() : RenderSystem {
        return RenderSystem.instance;
    }

    private gl;
    private mvMatrix = mat4.create();
    private pMatrix = mat4.create();
    private shaderProgram;

    constructor(canvas : HTMLCanvasElement) {
        if(RenderSystem.instance != undefined) {
            throw new Error("Only one rendering system can be created");
        }
        RenderSystem.instance = this;
        this.initGL(canvas);
        this.initShaders();
    }

    private initGL(canvas : HTMLCanvasElement) {
        var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
        gl.viewportWidth = canvas.width;
        gl.viewportHeight = canvas.height;
        window.addEventListener("resize", () => {
            gl.viewportWidth = canvas.width;
            gl.viewportHeight = canvas.height;
        });
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        this.gl = gl;
    }

    private initShaders() {
        var gl = this.gl;
        var fragmentShader = this.getShader(gl, "shader-fs");
        var vertexShader = this.getShader(gl, "shader-vs");

        var shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            alert("Could not initialise shaders");
        }

        gl.useProgram(shaderProgram);

        shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
        gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

        shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
        shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");

        shaderProgram.colorAttribute = gl.getAttribLocation(shaderProgram, "aColor");
        gl.enableVertexAttribArray(shaderProgram.colorAttribute);
        this.shaderProgram = shaderProgram;
    }

    private getShader(gl, shaderId : string) {
        var shaderScript = <HTMLScriptElement>document.getElementById(shaderId);
        if (!shaderScript) {
            return null;
        }

        var str = "";
        var k = shaderScript.firstChild;
        while (k) {
            if (k.nodeType == 3)
                str += k.textContent;
            k = k.nextSibling;
        }

        var shader;
        if (shaderScript.type == "x-shader/x-fragment") {
            shader = gl.createShader(gl.FRAGMENT_SHADER);
        } else if (shaderScript.type == "x-shader/x-vertex") {
            shader = gl.createShader(gl.VERTEX_SHADER);
        } else {
            return null;
        }

        gl.shaderSource(shader, str);
        gl.compileShader(shader);

        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            alert(gl.getShaderInfoLog(shader));
            return null;
        }

        return shader;
    }

    public render(deltaTime: number) {
        var gl = this.gl;
        gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

        mat4.perspective(this.pMatrix, 45* (Math.PI/180), gl.viewportWidth/gl.viewportHeight, 0.1, 100);

        for(var i in this.renderQueue) {
            var target = this.renderQueue[i];
            var vbo = this.vboQueue[i];
            var cbo = this.cboQueue[i];
            var rO = target.collectDrawData(deltaTime);

            mat4.identity(this.mvMatrix);
            mat4.translate(this.mvMatrix, this.mvMatrix, [rO.pos.x, rO.pos.y, rO.pos.z]);

            gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
            gl.bufferData(gl.ARRAY_BUFFER, rO.vertices, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.shaderProgram.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

            gl.bindBuffer(gl.ARRAY_BUFFER, cbo);
            gl.bufferData(gl.ARRAY_BUFFER, rO.colors, gl.STATIC_DRAW);
            gl.vertexAttribPointer(this.shaderProgram.colorAttribute, 4, gl.FLOAT, false, 0, 0);
            this.setMatrixUniforms();


            gl.drawArrays(gl.LINES, 0, rO.count / 3);
        }
    }

    private setMatrixUniforms() {
        this.gl.uniformMatrix4fv(this.shaderProgram.pMatrixUniform, false, this.pMatrix);
        this.gl.uniformMatrix4fv(this.shaderProgram.mvMatrixUniform, false, this.mvMatrix);
    }
}