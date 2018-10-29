//Global variables
var scene, camera, renderer;
var geometry, material, mesh,
goldMesh, goldMat, goldGeom,
stoneMesh, stoneMat, stoneGeom,
bStoneMesh, bStoneMat, bStoneGeom,
woodMesh, woodMat, woodGeom,
group;

function init(){

  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(35, window.innerWidth / window.innerHeight, 300, 10000 );
  renderer = new THREE.WebGLRenderer({antialias:true});
  renderer.setClearColor("#000000");
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
}

function geometry(){
  // Configure lights -------------------------------
  var light1 = new THREE.AmbientLight(0x002c9e, 0.5);
  scene.add(light1);
  var light2 = new THREE.PointLight(0xffedf6, 1.7);
  var pointLightHelper = new THREE.PointLightHelper( light2, 300 );
  light2.position.z = -100;
  light2.position.x = -40;

  scene.add(light2);
  scene.add(pointLightHelper);


  group = new THREE.Object3D();
  // Create a Cube Mesh with basic material ---------
  var geometry = new THREE.SphereGeometry(30, 100, 100, 0, 3, 0, 3);
  bStoneGeom = new THREE.SphereGeometry(30, 9, 9, 0, 3.2, 0, 3);
  goldGeom = new THREE.CylinderGeometry( 30.1, 30.1, 1.3, 20 );
  woodGeom = new THREE.CylinderGeometry( 30.1, 30.1, 10, 50 );
  stoneGeom = new THREE.CylinderGeometry( 32, 32, 1.3, 20 );
  //SphereGeometry( radius, widthSegments, heightSegments, phiStart, phiLength, thetaStart, thetaLength )


  // MATERIAL 1:
  //var material = new THREE.MeshBasicMaterial( { color: "#433F81" } );

  //MATERIAL 2:
  var material = new THREE.MeshNormalMaterial({
       side: THREE.DoubleSide,
  });

  // material = new THREE.ShaderMaterial( {
  // 		uniforms: {
  // 			time: { type: "f", value: 0 },
  //       tExplosion: {
  //         type: "t",
  //         value: 0xF3FFE2,
  //       }
  // 		},
  // 		vertexShader: document.getElementById( 'vertexShader' ).textContent,
  //     vertexColors: THREE.VertexColors,
  // 		fragmentShader: document.getElementById( 'fragmentShader' ).textContent
  // 	} );

  goldMat = new THREE.MeshPhongMaterial({
      shininess: 1,
      color: "#d8ce72",
  })

  //MATERIAL 3:

  // var material = new THREE.MeshLambertMaterial({
  // color: "#e2e2e2",
  // transparent: true,
  // opacity: 1,
  //  side: THREE.DoubleSide
  // });


  //MATERIAL 4:
  //var material = new THREE.MeshPhongMaterial({shininess: 1});

  //MATERIAL 5 (non-shiny material):
  /*
  var material = new THREE.MeshLambertMaterial({
  color: 0xF3FFE2,
  lightMap: null,
  lightMapIntensity: 1,
  emissive: 0x000000,
  emissiveMap: null,
  emissiveIntensity: 1,
  specularMap: null
  });
  */



  var bmap =  THREE.ImageUtils.loadTexture("../img/bStone.jpg")
  var wmap =  THREE.ImageUtils.loadTexture("../img/wood.jpg")
  wmap.repeat.y = 1.1;
  wmap.rotation.y = 5.6;
  bStoneMat = new THREE.MeshPhongMaterial({
  color: 0x42413e,
  specular: 0x42413e,
  shininess: 1,
  lightMap: null,
  lightMapIntensity: 0.1,
  bumpMap: bmap,
  bumpScale:2,
  normalMap: null,
  normalScale: 1,
  displacementMap: null,
  displacementScale: 1,
  displacementBias: 0,
  specularMap: null,
  flatShading: true,
  });


  woodMat = new THREE.MeshPhongMaterial({
  // color: 0x42413e,
  specular: 0x42413e,
  shininess: 1,
  lightMap: null,
  lightMapIntensity: 0.1,
  bumpMap: bmap,
  bumpScale:10,
  map: wmap,
  mapScale: 20,
  normalScale: 1,
  // displacementMap: bmap,
  // displacementScale: 1,
  // displacementBias: 0,
  specularMap: null,
  flatShading: true,
  });
  /*
  //MATERIAL 7 (combination of shiny + non-shinny):
  var material = new THREE.MeshStandardMaterial({
  color: 0xF3FFE2,
  roughness: 0.5,
  metalness: 0.5
  });
  */

  /*
  //MATERIAL 8 (physical-based material)
  var material = new THREE.MeshPhysicalMaterial({
  color: 0xF3FFE2,
  roughness: 0,
  metalness: 0.5,
  reflectivity: 0.5,
  clearCoat: 0,
  claerCoatRoughness: 0
  });
  */
  createSpiral();
function createSpiral(){

  var distance = 4;
  let height = 7;
  var mmaterial = new THREE.MeshBasicMaterial({color:0x00ff44, wireframe: true,});
  let spiralGroup = new THREE.Object3D();
  //initial offset so does not start in middle.
  var xOffset = -80;

  for(var i = 0; i < 6; i++){
      for(var j = 0; j < 5; j++){
              let mgeometry = new THREE.CylinderGeometry( height, height, 2, 3 );
              var mesh  = new THREE.Mesh(mgeometry, mmaterial);
              mesh.position.x = (distance * i) + xOffset;
              mesh.position.z = -400;
              mesh.rotation.z +=1.57;
              height -=0.97;
              distance +=0.1;
              spiralGroup.add(mesh);
      }
  };
  spiralGroup.position.x = 35;
  scene.add(spiralGroup);

}

  mesh = new THREE.Mesh( geometry, material );
  goldMesh = new THREE.Mesh(goldGeom, goldMat);
  stoneMesh = new THREE.Mesh(stoneGeom, stoneMat);
  bStoneMesh = new THREE.Mesh(bStoneGeom, bStoneMat);
  woodMesh = new THREE.Mesh(woodGeom, woodMat);
  mesh.position.z = -400;
  goldMesh.position.z = -400;
  woodMesh.position.z = -400;
  woodMesh.position.x =-30;
  woodMesh.rotation.z = 1.58;
  goldMesh.position.x = 4;
  stoneMesh.position.z = -400;
  bStoneMesh.position.z = -400;
  bStoneMesh.rotation.x = 1.1;
  stoneMesh.rotation.x +=2.9;
  bStoneMesh.rotation.y +=1.6;
  bStoneMesh.position.x = 4;
  mesh.position.x = -4;
  mesh.rotation.y +=30;
  // goldMesh.rotation.y +=90;
  goldMesh.rotation.x +=30;
  goldMesh.rotation.z +=7.9;
  // group.geometry.center();

  // ------------------------------------------------

  // Add mesh to scene
  // group.add( mesh );
  group.add( goldMesh );
  // group.add( stoneMesh );
  group.add( bStoneMesh );
  group.add(woodMesh)
  scene.add(group)
}

// Render Loop
function render() {
  requestAnimationFrame( render );

  bStoneMesh.rotation.x += 0.001; //Continuously rotate the mesh
  goldMesh.rotation.x += 0.001; //Continuously rotate the mesh
  woodMesh.rotation.x -=0.002;
  // mesh.rotation.y += 0.01;

  // Render the scene
  renderer.render(scene, camera);
};

init();
geometry();
render();
