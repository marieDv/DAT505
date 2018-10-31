var renderer, scene, camera;
var cubes;
function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);

  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
  ambientLight.position.set(0, 200, 0);
  scene.add(ambientLight);

  var spotLight = new THREE.SpotLight(0xFFFFFF, 1.2);
  spotLight.position.set(0, 200, 0);
  scene.add(spotLight);
  //spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a new array that will store multiple cubes
  cubes = [];

  //Create a two dimensional grid of objects, and position them accordingly
  for (var x = -15; x <= 15; x += 10) { // Start from -45 and sequentially add one every 5 pixels
    for (var y = -13; y <= 13; y += 10) {
      var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
      //The color of the material is assigned a random color
      var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
      var box = new THREE.Mesh(boxGeometry, boxMaterial);

      //box.castShadow = true;
      box.rotation.x = Math.random() *0.2*Math.PI;
      box.rotation.y = Math.random() *2.9*Math.PI;
      box.rotation.z = Math.random() *0.9*Math.PI;
      box.position.x = x;
      box.position.z = y;
      box.scale.y = 0.5;

      scene.add(box);
      cubes.push(box);
    }
  }

  document.body.appendChild(renderer.domElement);
}

function drawFrame(){
  requestAnimationFrame(drawFrame);
  renderer.render(scene, camera);

  let factor = 8;
  for(let i=0; i<cubes.length; i++){
    setTimeout(()=> {
    i % factor === 0 ? cubes[i].rotation.x += Math.random() * 0.2 :cubes[i].rotation.y += Math.random() * 0.2 ;
    if(i === 2){
      factor = Math.floor(Math.random * 10);
    }
  }, Math.random()* 3000);

  }

}

init();
drawFrame();
