const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl');

if (!gl) {
  throw new Error('WebGL not supported');
}

// vertexData
const vertexData = [
  // A square side is composed of two triangles

  // Side: colorful
  -0.5, -0.5, 0.5,
  -0.5, 0.5, 0.5,
  0.5, -0.5, 0.5,
  // 
  -0.5, 0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, 0.5, 0.5,

  // Side: black
  -0.5, -0.5, -0.5,
  -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  //
  -0.5, 0.5, -0.5,
  0.5, -0.5, -0.5,
  0.5, 0.5, -0.5,

  // Side: gray
  -0.5, -0.5, 0.5,
  0.5, -0.5, 0.5,
  0.5, -0.5, -0.5,
  //
  0.5, -0.5, -0.5,
  -0.5, -0.5, -0.5,
  -0.5, -0.5, 0.5,
];

const colorData = [
  1, 0, 0, // v1.color red
  0, 1, 0, // v2.color green
  0, 0, 1, // v3.color blue
  0, 0, 1,
  0, 1, 0,
  1, 0, 0,
  
  0, 0, 0, // black
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,
  0, 0, 0,

  0.5, 0.5, 0.5, // gray
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
  0.5, 0.5, 0.5,
];

// create position buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexData), gl.STATIC_DRAW); // load vertex data into buffer

// create color buffer
const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorData), gl.STATIC_DRAW); // load color data into buffer

// create vertex shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
// Gets a `position` (a vector of 3 components),
// outputs to gl_Position a vector of 4 components: the 3 from position and a 1.
gl.shaderSource(vertexShader, `
precision mediump float;

attribute vec3 position;
attribute vec3 color;
varying vec3 vColor;

uniform mat4 rot;

void main() {
  vColor = color;
  gl_Position = rot * vec4(position, 1);
}`);
gl.compileShader(vertexShader);

// create fragment shader
const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, `
precision mediump float;

varying vec3 vColor;

void main() {
  gl_FragColor = vec4(vColor, 1);
}
`); // vec4(rbga) the `a` is related to opacity
gl.compileShader(fragmentShader);

// create program
const program = gl.createProgram();

// attach shaders to program
gl.attachShader(program, vertexShader);
gl.attachShader(program, fragmentShader);
gl.linkProgram(program);

// enable vertex attributes
//
// The the buffer has all sorts of data
// We created a program with an attribute called `position`
// We need to tell openGL the value of this `position`
// The value of `position` is stored in the buffer (just like every data that is consumed by our program) 
// We need to tell the GPU how to get that attribute from the buffer (where to find it)
const positionLocation = gl.getAttribLocation(program, `position`);
gl.enableVertexAttribArray(positionLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
// 3 because the attribute is composed of 3 "things": x, y, z
// each of these things are floats
// false (normalize)
// 0 (stride)
// 0 (offset)
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

const colorLocation = gl.getAttribLocation(program, `color`);
gl.enableVertexAttribArray(colorLocation);
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

gl.useProgram(program);

const uniformLocations = {
    rot: gl.getUniformLocation(program, 'rot'),
};
const rot = glMatrix.mat4.create();
console.log(rot)

function animate() {
  requestAnimationFrame(animate);
  //glMatrix.mat4.rotateZ(rot, rot, Math.PI/2 / 70);
  glMatrix.mat4.rotateX(rot, rot, Math.PI/2 / 700);
  glMatrix.mat4.rotateY(rot, rot, Math.PI/2 / 700);
  gl.uniformMatrix4fv(uniformLocations.rot, false, rot);
  // Can draw points, triangles, lines, etc...
  // 0 (starting vertex)
  // 3 (how many vertices to draw)
  gl.drawArrays(gl.TRIANGLES, 0, vertexData.length/3);
}

animate()
