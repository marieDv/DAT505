var config = {
    frequenz: 0.7, //1.4 for wobble waves 0.2 for sublte rings 0.1 for extreme rings
    speed: 120, // + slower
    radius: 28,
    widthSeg:100, //resolution x
    heightSeg: 100, // resolution y
    magnitude:8,
    waveDepth: 0.01
};

var renderer, scene, camera,warpVector,orientationCylinder,
    frequencyData, audio, analyser, plane, curveObject, geometry, material
;
var time = 0;
var lastPoint = 0;
var frequencyCounter = 0;
const planeVertices = 64; //128
// var counter=-200;
var counter = -10; //-70
var group = new THREE.Object3D();

function init() {

    scene = new THREE.Scene();
    var W = window.innerWidth,
        H = window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, W / H, .1, 1000);
    camera.position.set(0, 55, 85);
    camera.lookAt(scene.position);
    var ambientLight = new THREE.AmbientLight(0xb3f442, 1.2);
    ambientLight.position.set(0, 200, 0);
    var directionalLight = new THREE.PointLight(0xffffff, 1.9);
    directionalLight.rotation.x = 90;
    directionalLight.position.set(0, 30, -20)

    scene.add(directionalLight);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;



    initializeAudio();
    for (let i = 0; i < planeVertices/2; i++) {
        loadBasicSurface();
    }
    // createCurves();

    console.log(group.children[9])
    scene.add(group);
    group.position.set(-300, -30, 20)

    document.body.appendChild(renderer.domElement);
}

function loadBasicSurface() {
    var cylinderGeometry = new THREE.CylinderGeometry( 10, 10, 40, 20,20 );
    var cylinderMaterial = new THREE.MeshBasicMaterial({
        color: 0xf2f2f2,
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        wireframe: true,
        specular: 1.5,
        shading: THREE.FlatShading,
    });
    orientationCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
    orientationCylinder.position.set(0,0,-25);
    // scene.add(orientationCylinder);


    var geometry = new THREE.CylinderGeometry( 10, 10, 280, 15,3 );//new THREE.BoxGeometry(10, 580, 30);
    var material = new THREE.MeshPhongMaterial({
        color: 0xf2f2f2,
        vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        specular: 0x050505,
        shininess: 100,
        // shading: THREE.FlatShading,
        // wireframe: true,
        wireframeLinewidth: 1,
    });
    plane = new THREE.Mesh(geometry, material);
    plane.rotation.x += 2.9; //2.5 flach 1.5 winkel 1 flach horizontal
    plane.position.set(counter, -400, -700);
    plane.receiveShadow = true;
    plane.sortParticles = true;
    plane.castShadow = true;
    plane.geometry.dynamic = true;
    plane.material.needsUpdate = true;
    plane.geometry.colorsNeedUpdate = true;
    warpVector = new THREE.Vector3(0, 50, 0); //50
    group.add(plane);
    counter += 20;

}


function createCurves() {
    var curve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(-10, 0, 10),
        new THREE.Vector3(-5, 5, 5),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(5, -5, 5),
        new THREE.Vector3(10, 0, 10)
    ]);

    var points = curve.getPoints(50);
    // var geometry = new THREE.BufferGeometry().setFromPoints( points );
    geometry = new THREE.TubeBufferGeometry(curve, 6, 2, 6);

    material = new THREE.MeshBasicMaterial({color: 0xff0000, wireframe: false});
    var curveObject = new THREE.Line(geometry, material);


    curveObject.position.x += counter;
    curveObject.curve = curve;
    counter++;
    curveObject.geometry.verticesNeedUpdate = true;
    group.add(curveObject);

    // group.add(curveObject);
}


// group.children[0].geometry.attributes.position.array[0]
// group.children[0].curve
function mapAudioInformation(ts) {

    for (let i = 0; i < planeVertices; i++) {
        if (frequencyData[i] > 0) {
            group.children[i].scale.z = frequencyData[i] / 70;
            if(frequencyData[i] > 50){
                let updateColor = new THREE.Color("rgb("+30+"%, "+80+"%, "+(frequencyData[i])+"%)");
                group.children[i].material.color = updateColor;
                frequencyCounter++;
            }
            if(frequencyData[i] > 100){
                let updateColor = new THREE.Color("rgb("+0+"%, "+(frequencyData[i])+"%, "+(frequencyData[i])+"%)");
                group.children[i].material.color = updateColor;
                frequencyCounter++;
            }
            if(frequencyData[i] > 200){
                let updateColor = new THREE.Color("rgb("+90+"%, "+80+"%, "+190+"%)");
                group.children[i].material.color = updateColor;
                frequencyCounter++;
            }
        }

    }

    // for (var i = 0, l = group.children[0].geometry.vertices.length; i<l; i+=3) {
    //
    //     group.children[0].geometry.vertices[i].x += -10 +orientationCylinder.geometry.vertices[i].x;
    //     group.children[0].geometry.vertices[i].y += -10 +orientationCylinder.geometry.vertices[i].y;
    //     group.children[0].geometry.vertices[i].z += -10 +orientationCylinder.geometry.vertices[i].z;
    //     // console.log(orientationCylinder.geometry.vertices[i].x);
    // }

    // group.forEach(function(c, i) {
    //     //frequency       //distance          //amplitude
    //     c.scale.y = Math.sin(ts/1900*Math.PI + c.position.x*8.95 + c.position.z/10) + 1;
    // });
    for (let i = 0; i < group.children.length; i++) {
       group.children[i].scale.y = Math.cos(ts/190000*Math.PI + group.children[i].position.y*frequencyData[i]/35000 + group.children[i].position.y/10) + 1;
        // var waveToUse = group.children[i].scale.y = Math.sin(ts/1900*Math.PI + group.children[i].position.x*8.95 + group.children[i].position.z/10) + 1;

    }
    for (let i = 0; i < group.children[0].geometry.vertices.length; i++) {

        group.children[0].geometry.vertices[i] = orientationCylinder.geometry.vertices[5].x;
        group.children[0].geometry.verticesNeedUpdate = true;


        group.children[0].geometry.verticesNeedUpdate = true;


        // group.children[0].geometry.attributes.position.needsUpdate = true;

        // const dist = v.distanceTo(warpVector);
        // let waveToUse = (10 + (waveDepth) * Math.sin(dist / -frequenz + (time/speed*magnitude))) * radius;
        //
        // v.normalize().multiplyScalar(waveToUse);

    }

    group.children[0].geometry.computeVertexNormals();
    group.children[0].geometry.computeFaceNormals();
    group.children[0].geometry.verticesNeedUpdate = true;
    time++;




}

function initializeAudio() {
    var ctx = new AudioContext();
    audio = document.getElementById("audioFile");
    var audioSrc = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = planeVertices;
    audioSrc.connect(analyser);
    audioSrc.connect(ctx.destination);
    document.getElementById("playbutton").addEventListener('click', function () {
        audio.play();
    });


}


function drawFrame(ts) {
    requestAnimationFrame(drawFrame);
    renderer.render(scene, camera);
    var bufferLength = analyser.frequencyBinCount;
    frequencyData = new Uint8Array(bufferLength);
    void analyser.getByteFrequencyData(frequencyData);
    mapAudioInformation(ts);

    // plane.rotation.y <= 0.5 ? plane.rotation.y +=0.0002 : plane.rotation.y =0.002;
}

//TODO:
//getByTimeDomainData() -> WAVEFORM
//beziercurves
// group.children[i].geometry.computeVertexNormals();
//interpolation

init();
drawFrame();
