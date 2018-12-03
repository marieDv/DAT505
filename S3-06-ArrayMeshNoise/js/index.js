var renderer, scene, camera;
var cubes = [];
var generator = new Simple1DNoise(); //import of perlin noise

function init() {
  scene = new THREE.Scene();

  var W = window.innerWidth,
      H = window.innerHeight;

  camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
  camera.position.set(0, 55, 85);
  camera.lookAt(scene.position);

  var spotLight = new THREE.SpotLight(0xFFFFFF);
  spotLight.position.set(0, 1000, 0);
  scene.add(spotLight);
  //spotLight.castShadow = true;

  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor(0x17293a);
  renderer.setSize(W, H);
  //renderer.shadowMapEnabled = true;

  //Create a two dimensional grid of objects, and position them accordingly
  for (var x = -45; x <= 45; x += 5) { // Start from -45 and sequentially add one every 5 pixels
    for (var y = -30; y <= 30; y += 5) {
      var boxGeometry = new THREE.BoxGeometry(3, 6, 3);
      //The color of the material is assigned a random color
      var boxMaterial = new THREE.MeshLambertMaterial({color: Math.random() * 0xFFFFFF});
      var box = new THREE.Mesh(boxGeometry, boxMaterial);

      //box.castShadow = true;

      box.position.x = x;
      box.position.z = y;
      box.scale.y = 0.5;

      scene.add(box);
      cubes.push(box);
    }
  }

  document.body.appendChild(renderer.domElement);
}

var rot = 0;

function drawFrame(ts){
  requestAnimationFrame(drawFrame);
  rot += 0.01;

  cubes.forEach(function(c, i) {
    //c.rotation.x = rot;
    //c.rotation.y = rot;
    c.scale.y = generator.getVal(ts/1000 * Math.PI + c.position.x * 4.95) + 1;
    //c.scale.y = Math.sin(ts/500*Math.PI + c.position.x*4.95 + c.position.z/10) + 1;
  });

  renderer.render(scene, camera);
}

init();
drawFrame();
