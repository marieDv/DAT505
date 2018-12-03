var renderer, scene, camera;
var cubes;
function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 25);
  camera.lookAt(scene.position);

  var ambientLight = new THREE.AmbientLight(0xFFFFFF, 1.2);
  ambientLight.position.set(0, 200, 0);
  scene.add(ambientLight);
7
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a new array that will store multiple cubes
  cubes = [];
  // for(let i=0; i<5; i++){
  //    var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
  //    var boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.2});
  //    var box = new THREE.Mesh(boxGeometry, boxMaterial);
  //
  //    box.position.x += i*8;
  //    scene.add(box)
  // }
let counter = 0;
for(;counter<10;){
  console.log("asdsad" +counter);
  counter++;
}



  for(let i=0; i<10;i+=1){
      for(let j=0; j<2;j+=1){

    var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
       var boxMaterial = new THREE.MeshLambertMaterial({color: 0xFFFFFF, transparent: true, opacity: 0.2});
       var box = new THREE.Mesh(boxGeometry, boxMaterial);

       box.position.x += i*8;
       box.position.y += j*8;
       scene.add(box)
    ///EXECUTED
  }
  }
  //Create a two dimensional grid of objects, and position them accordingly


  // for (var x = -30; x <= 30; x += 3) { // Start from -45 and sequentially add one every 5 pixels
  //   for (var y = -20; y <= 20; y += 10) {
  //     var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
  //     //The color of the material is assigned a random color
  //     var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
  //     var box = new THREE.Mesh(boxGeometry, boxMaterial);
  //
  //     //box.castShadow = true;
  //     // box.rotation.x = Math.random() *0.2*Math.PI;
  //     // box.rotation.y = Math.random() *2.9*Math.PI;
  //     // box.rotation.z = Math.random() *0.9*Math.PI;
  //     box.position.x = x;
  //     box.position.z = y;
  //     box.scale.y = 0.5;
  //
  //     scene.add(box);
  //     cubes.push(box);
  //   }
  //   box.rotation.x = 0.9;
  // }

  document.body.appendChild(renderer.domElement);
}

function drawFrame(){
  requestAnimationFrame(drawFrame);
  renderer.render(scene, camera);

  let factor = 8;
  for(let i=0; i<cubes.length; i++){
    cubes[i].rotation.x += 0.009*Math.PI;


  }

}

init();
drawFrame();
