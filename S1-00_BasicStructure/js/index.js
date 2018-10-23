//Global variables
var scene, camera, renderer;
var geometry, material, mesh, sphere, rotationSphere, group;

function init(){
  // Create an empty scene --------------------------
  scene = new THREE.Scene();

  // Create a basic perspective camera --------------
  camera = new THREE.PerspectiveCamera(35, window.innerWidth/window.innerHeight, 300, 10000 );

  // Create a renderer with Antialiasing ------------
  renderer = new THREE.WebGLRenderer({antialias:true});

  // Configure renderer clear color
  renderer.setClearColor("#000000");

  // Configure renderer size
  renderer.setSize( window.innerWidth, window.innerHeight );

  // Append Renderer to DOM
  document.body.appendChild( renderer.domElement );
}

function geometry(){
  // Create a Cube Mesh with basic material ---------
  group = new THREE.Group();
  geometry = new THREE.BoxGeometry(100, 100, 100);
  let sphereGeometry = new THREE.SphereGeometry(50, 50, 10);
  let sphereGeometryRot = new THREE.SphereGeometry(500, 500, 10);
  material = new THREE.MeshBasicMaterial( { color: "#e5e5e2", wireframe: true} );
  mesh = new THREE.Mesh( geometry, material );
  sphere = new THREE.Mesh( sphereGeometry, material );
  rotationSphere = new THREE.Mesh( sphereGeometryRot, material );
  mesh.position.z = -1000;
  sphere.position.z = -1100;
  rotationSphere.position.z = -1100;
  sphere.position.x = -200;
  // Add mesh to scene
  group.add(sphere);
  group.add(rotationSphere);
  scene.add( mesh );
  scene.add(group)
}

// Render Loop
var render = function () {
  requestAnimationFrame( render );

  //mesh.rotation.x += 0.01; //Continuously rotate the mesh
  //mesh.rotation.y += 0.01;
  mesh.rotation.x +=0.02;
  mesh.rotation.z +=0.02;
  rotationSphere.rotation.y += 0.003;
  rotationSphere.rotation.z += 0.003;
  renderer.setClearColor("#000000");

  // Render the scene
  renderer.render(scene, camera);
};

init();
geometry();
render();
