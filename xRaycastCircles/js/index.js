var container, stats;
var camera, scene, renderer;
var raycaster;
var mouse;
var PI2 = Math.PI * 2;
/*
function programFill( context ) {
  context.fillRect( - 0.5, - 0.5, 1, 1 );
}
function programStroke( context ) {
  context.lineWidth = 0.025;
  context.strokeRect( - 0.5, - 0.5, 1, 1 );
}
*/
function programFill( context ) {
  context.beginPath();
  context.arc( 0, 0, 0.5, 0, PI2, true );
  context.fill();
}

function programStroke( context ) {
  context.lineWidth = 0.025;
  context.beginPath();
  context.arc( 0, 0, 0.5, 0, PI2, true );
  context.stroke();
}

var INTERSECTED;

init();
animate();

function init() {
  container = document.createElement( 'div' );
  document.body.appendChild( container );

  var info = document.createElement( 'div' );
  info.style.position = 'absolute';
  info.style.top = '10px';
  info.style.width = '100%';
  info.style.textAlign = 'center';
  //info.innerHTML = '<a href="http://threejs.org" target="_blank" rel="noopener">three.js</a> canvas - interactive sprites';
  container.appendChild( info );
  camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
  camera.position.set( 0, 300, 500 );
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0xf0f0f0 );

  for ( var i = 0; i < 100; i ++ ) {
    var material = new THREE.SpriteCanvasMaterial( {
      color: Math.random() * 0x808080 + 0x808080,
      program: programStroke
    } );

    var sprite = new THREE.Sprite( material );

    sprite.position.x = Math.random() * 800 - 400;
    sprite.position.y = Math.random() * 800 - 400;
    sprite.position.z = Math.random() * 800 - 400;
    sprite.scale.setScalar( Math.random() * 20 + 20 );

    scene.add( sprite );
  }
  //
  raycaster = new THREE.Raycaster();
  mouse = new THREE.Vector2();
  renderer = new THREE.CanvasRenderer();
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  container.appendChild( renderer.domElement );
  //stats = new Stats();
  //container.appendChild( stats.dom );
  document.addEventListener( 'mousemove', onDocumentMouseMove, false );
  //
  window.addEventListener( 'resize', onWindowResize, false );
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}

function onDocumentMouseMove( event ) {
  event.preventDefault();
  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
}

function animate() {
  requestAnimationFrame( animate );
  render();
  //stats.update();
}

var radius = 600;
var theta = 0;

function render() {
  // rotate camera
  theta += 0.1;
  camera.position.x = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.y = radius * Math.sin( THREE.Math.degToRad( theta ) );
  camera.position.z = radius * Math.cos( THREE.Math.degToRad( theta ) );
  camera.lookAt( scene.position );
  camera.updateMatrixWorld();
  // find intersections
  raycaster.setFromCamera( mouse, camera );
  var intersects = raycaster.intersectObjects( scene.children );
  if ( intersects.length > 0 ) {
    var object = intersects[ 0 ].object;
    if ( INTERSECTED !== object ) {
      if ( INTERSECTED ) INTERSECTED.material.program = programStroke;
      INTERSECTED = object;
      INTERSECTED.material.program = programFill;
    }
  } else if ( INTERSECTED ) {
    INTERSECTED.material.program = programStroke;
    INTERSECTED = null;
  }
  renderer.render( scene, camera );
}
