/* global THREE */


// const cubespace = [2,2,2];
const cubespace = [8,8,8];
const cubeDims = [8,8,8];
var spacing = 10;
var far = 500;
var near = .005;
var cameraControls;
var colorArray = [];

window.wobble = true;
window.hypercube = new THREE.Object3D();
var clock = new THREE.Clock();

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

// Need function to map over cuubeMe and change colors for kicks
// or index into cuube with coordinates from blinkycube editor
const colorChange = function(){

	var randomColor = new THREE.Color();

	randomColor = colorArray[Math.random() * colorArray.length | 0];
	return randomColor;
}


const buildScene = function (scene) {
	const geometry = new THREE.CubeGeometry(...cubeDims);
	const translate = new THREE.Vector3(1,1,1);
	
	scene.add(hypercube);
	//move the cube towards the center of the canvas
	hypercube.translateOnAxis(translate, -8);

	
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

	// array of materials
	window.cuubeMe = [];
	closure((x,y,z) => cuubeMe.push(cuube[x,y,z]));


};

// function update() {
// 				requestAnimationFrame( update );
// 				var delta = clock.getDelta();
// 				var timer = Date.now() * 0.01;
// 				hypercube.position.set(
// 					Math.cos( timer * 0.1 ) * 30,
// 					Math.abs( Math.cos( timer * 0.2 ) ) * 20 + 5,
// 					Math.sin( timer * 0.1 ) * 30
// 				);
// 				hypercube.rotation.y = ( Math.PI / 2 ) - timer * 0.1;
// 				hypercube.rotation.z = timer * 0.8;
// 				nue();
// 			}


var nue = (function() {
	'use strict';

	//Scene
	var scene = new THREE.Scene();

	//render
	var renderer = new THREE.WebGLRenderer();
	renderer.setSize(window.innerWidth, window.innerHeight);
	document.body.appendChild(renderer.domElement);

	//Camera 
	var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, near, far);
	camera.position.set( 0, 75, 160 );
	cameraControls = new THREE.OrbitControls(camera, renderer.domElement);
	cameraControls.target.set( 0, 40, 0);
	cameraControls.maxDistance = 400;
	cameraControls.minDistance = 10;
	cameraControls.update();

	// load colors
	var loader = new THREE.FileLoader();
	
	var loaderCallback = function(colors) {
		var color = JSON.parse(colors);

		for(var x in color) {
			colorArray.push(color[x].hex);
		} 
		buildScene(scene); 
	}

	// load a resource
	loader.load('colors.json', loaderCallback);

	// Lighting 
	//z is for zooooom bitch! 
	camera.position.z = 300;
	
	var pointLight = new THREE.PointLight(0xFFFFFF);

	pointLight.position.x = 10;
	pointLight.position.y = 50;
	pointLight.position.z = 130;

	scene.add(pointLight);



	var reqAnimFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;

	var render = function() {
		reqAnimFrame(render);
		
		if (wobble) {
		  var delta = Math.random() * (0.04 - 0.02) + 0.005;
		 
		  hypercube.rotation.x += delta;
		  hypercube.rotation.y += delta;
		  hypercube.rotation.z -= delta;
		} //no rotate for you?

		renderer.render(scene, camera);
	};

	render();

});

nue();