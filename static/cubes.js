// Need function to map over cuubeMe and change colors for kicks
// or index into cuube with coordinates from blinkycube editor

/* global THREE */

// scene size
var WIDTH = window.innerWidth;
var HEIGHT = window.innerHeight;
// camera
var VIEW_ANGLE = 45;
var ASPECT = WIDTH / HEIGHT;
var NEAR = 1;
var FAR = 500;

//objects
const cubespace = [8,8,8];
const cubeDims = [8,8,8];
var spacing = 10;
var colorArray = [];

window.wobble = true;
window.hypercube = new THREE.Object3D();

var camera, scene, renderer;
var clock = new THREE.Clock();
var cameraControls;

// create cubespace
const cuube = new Array(cubespace[0]).fill(
				new Array(cubespace[1]).fill(
				  new Array(cubespace[2]).fill('cubes')));


//access a single cube within cubespace
const closure = function(cb){
   var i, j, k;

	for (i = 0; i < cubespace[0]; i++) {
	  for (j = 0; j < cubespace[1]; j++) {
		for (k = 0; k < cubespace[2]; k++) {
		  cb(i,j,k);
		}
	  }
	}
};


var init = function() {
	'use strict';

	//Scene
	scene = new THREE.Scene();

	//Render
	renderer = new THREE.WebGLRenderer();
	renderer.setSize(WIDTH, HEIGHT);
	document.body.appendChild(renderer.domElement);

	//Camera
	camera = new THREE.PerspectiveCamera(75, WIDTH / HEIGHT, NEAR, FAR);
	camera.position.set( 0, 75, 160 );
	//z is for zooooom bitch!
	camera.position.z = 300;

	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set( 0, 40, 0);
	cameraControls.maxDistance = 400;
	cameraControls.minDistance = 10;
	cameraControls.update();

	buildScene();
};

const buildScene = function () {

	const geometry = new THREE.CubeGeometry(...cubeDims);
	const translate = new THREE.Vector3(1,1,1);

	// build the epi-cube
	scene.add(hypercube);
	//move the cube towards the center of the canvas
	hypercube.translateOnAxis(translate, -8);

	//find random color from JSON file
	let randomColor = new THREE.Color();
	const colorChange = function(){
		randomColor = colorArray[Math.random() * colorArray.length | 0];
		return randomColor;
	}
	// load colors
	const loader = new THREE.FileLoader();
	var loaderCallback = function(colors) {
		var color = JSON.parse(colors);
		for(var x in color) {
			colorArray.push(color[x].hex);
		}

		// create and index the materials, add meshes to hypercube
		closure(function(x,y,z){
			// every cube
			cuube[x,y,z] = new THREE.MeshLambertMaterial({
				color: colorChange(),
				transparent: true,
				opacity: 0.7
			});
			const cube = new THREE.Mesh(geometry, cuube[x,y,z]);

			// move cubes based on dimensions and some spacing
			cube.position.set(
				x * (cubeDims[0] + spacing),
				y * (cubeDims[1] + spacing),
				z * (cubeDims[2] + spacing)
			);
			hypercube.add(cube);
		});
	}
	loader.load('colors.json', loaderCallback);

	// array of materials
	window.cuubeMe = [];
	closure((x,y,z) => cuubeMe.push(cuube[x,y,z]));

	// Lighting
	var pointLight = new THREE.PointLight(0xFFFFFF);
		pointLight.position.set(10,50,130);
		scene.add(pointLight);

	var light = new THREE.AmbientLight( 0x404040, 0.6 ); // soft white light
		scene.add( light );
};

var render = function() {
	renderer.render(scene, camera);
}

var update = function() {
	var reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
	reqAnimFrame(update);

	let delta = clock.getDelta() * (0.04 - 0.02) + 0.005;
	var timer = Date.now() * 0.01;

	if (wobble) {
		hypercube.rotation.x += delta;
		hypercube.rotation.y += delta;
		hypercube.rotation.z -= delta;

		hypercube.position.set(
			Math.cos( timer * 0.1 ) * 30,
			Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
			Math.sin( timer * 0.1 ) * 30
		);
		hypercube.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
		// hypercube.rotation.z = timer * 0.8;
	}
	render();
}

init();
buildScene();
update();