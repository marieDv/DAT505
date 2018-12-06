var config = {
    frequenz: 0.7, //1.4 for wobble waves 0.2 for sublte rings 0.1 for extreme rings
    speed: 120, // + slower
    radius: 28,
    widthSeg: 100, //resolution x
    heightSeg: 100, // resolution y
    magnitude: 8,
    waveDepth: 0.01
};

var renderer, scene, camera, warpVector, orientationCylinder, extrudePath,
    frequencyData, audio, analyser, plane, curveObject, geometry, material, points, pipeSpline, direction
;

var time = 0;
var lastPoint = 0;
var frequencyCounter = 0;
const planeVertices = 32; //128
// var counter=-200;
var counter = -10; //-70
var group = new THREE.Object3D();

function init() {

    scene = new THREE.Scene();
    var W = window.innerWidth,
        H = window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, W / H, .1, 800);
    camera.position.set(0, 55, 85);
    camera.lookAt(scene.position);
    var ambientLight = new THREE.AmbientLight(0xb3f442, 0.2);
    ambientLight.position.set(0, 200, 0);
    var directionalLight = new THREE.PointLight(0xffffff, 0.9);
    directionalLight.rotation.x = 90;
    directionalLight.position.set(0, 30, -20)

    scene.add(directionalLight);
    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;


    initializeAudio();
    for (let i = 0; i < planeVertices / 2; i++) {
        loadBasicSurface();
    }
    // createCurves();

    console.log(group.children[9])
    scene.add(group);
    group.position.set(-45, 30, 100)

    document.body.appendChild(renderer.domElement);
}

// function loadBasicSurface() {
//     var cylinderGeometry = new THREE.CylinderGeometry( 10, 10, 40, 20,20 );
//     var cylinderMaterial = new THREE.MeshBasicMaterial({
//         color: 0xf2f2f2,
//         vertexColors: THREE.FaceColors,
//         side: THREE.DoubleSide,
//         wireframe: true,
//         specular: 1.5,
//         shading: THREE.FlatShading,
//     });
//     orientationCylinder = new THREE.Mesh(cylinderGeometry, cylinderMaterial);
//     orientationCylinder.position.set(0,0,-25);
//     // scene.add(orientationCylinder);
//
//
//     var geometry = new THREE.CylinderGeometry( 4, 4, 200, 15,3 );//new THREE.BoxGeometry(10, 580, 30);
//     var material = new THREE.MeshPhongMaterial({
//         color: 0xf2f2f2,
//         vertexColors: THREE.FaceColors,
//         side: THREE.DoubleSide,
//         specular: 0x050505,
//         shininess: 100,
//         // shading: THREE.FlatShading,
//         // wireframe: true,
//         wireframeLinewidth: 1,
//     });
//     plane = new THREE.Mesh(geometry, material);//150, 300, Math.PI/2, Math.PI, 25, 25
//     plane.rotation.x += 2.9; //2.5 flach 1.5 winkel 1 flach horizontal
//     plane.position.set(counter, -400, -700);
//     plane.receiveShadow = true;
//     plane.sortParticles = true;
//     plane.castShadow = true;
//     plane.geometry.dynamic = true;
//     plane.material.needsUpdate = true;
//     plane.geometry.colorsNeedUpdate = true;
//     warpVector = new THREE.Vector3(0, 50, 0); //50
//     group.add(plane);
//     counter += 20;
//     distortGeometry();
// }

function GrannyKnot() {
    pipeSpline = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -10, 0),
        new THREE.Vector3(0, -9, 0),
        new THREE.Vector3(0, -7, 0),
        new THREE.Vector3(0, -5, 0),
        new THREE.Vector3(0, 0, 0),
        new THREE.Vector3(0, 5, 0),
        new THREE.Vector3(0, 7, 0),
        new THREE.Vector3(0, 10, 0)
        // new THREE.Vector3( 0, 0, 40 )
    ]);
}

function loadBasicSurface() {

    GrannyKnot();
    extrudePath = pipeSpline;
    var params = {
        scale: 10,
        extrusionSegments: 6,
        radiusSegments: 6,
    };
    var tubeGeometry = new THREE.TubeBufferGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments);
    tubeGeometry.vertices = pipeSpline.getPoints(50);

    var material = new THREE.MeshPhongMaterial({
        color: 0x111111,
        // vertexColors: THREE.FaceColors,
        side: THREE.DoubleSide,
        specular: 0x2d2d2d,
        shininess: 100,
        wireframeLinewidth: 1,
    });
    plane = new THREE.Mesh(tubeGeometry, material);//150, 300, Math.PI/2, Math.PI, 25, 25
    plane.curve = pipeSpline;
    plane.rotation.x += 2.9; //2.5 flach 1.5 winkel 1 flach horizontal
    plane.position.set(counter, -100, -200);
    plane.receiveShadow = true;
    plane.sortParticles = true;
    plane.castShadow = true;
    plane.geometry.dynamic = true;
    // plane.geometry.attributes.color.needsUpdate = true;

    plane.material.needsUpdate = true;
    plane.geometry.colorsNeedUpdate = true;
    // plane.geometry.attributes.color.needsUpdate = true;

    warpVector = new THREE.Vector3(0, 50, 0); //50
    group.add(plane);
    counter += 7;

}

function distortGeometry() {
    var width = 200 * 2 * Math.PI;
    // var geom = new THREE.CylinderGeometry(width, height, horizontalSegments, verticalSegments);
    var index = 0;//new THREE.CylinderGeometry( 4, 4, 200, 15,3 )

    for (var i = 0; i <= plane.geometry.vertices.length; i++) {
        let t = 10;
        var angle = t * 2.0 * Math.PI;
        /*
          float angle = t * 2.0 * PI;
          vec2 rot = vec2(cos(angle), sin(angle));
          float z = t * 2.0 - 1.0;
         */
        if (plane.geometry.vertices[index]) {
            // plane.geometry.vertices[index].z = t*2.0*Math.PI;
            plane.geometry.vertices[index].x = Math.cos(angle);
            // plane.geometry.vertices[index].y = Math.sin(angle);
            index++;
        }
    }

    return plane;
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
function mapAudioInformation() {

    for (let i = 0; i < planeVertices; i++) {
        if (frequencyData[i] > 0) {
            group.children[i].scale.y = 2 * (frequencyData[i] / 100);//frequencyData[i] / 60
            group.children[i].scale.z = frequencyData[i] / 80;
            group.children[i].scale.x = frequencyData[i] / 120;
            // group.children[i].curve.points[6].x += frequencyData[i]/200;
            if (frequencyData[i] > 50) {
                let updateColor = new THREE.Color("rgb(" + 20 + "%, " + 20 + "%, " + 20 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 100) {
                let updateColor = new THREE.Color("rgb(" + 40 + "%, " + 40 + "%, " + 40 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 200) {
                let updateColor = new THREE.Color("rgb(" + 60 + "%, " + 60 + "%, " + 60 + "%)");
                group.children[i].material.color = updateColor;
            }
        }

    }

    let countBeats = 0;
    for (var i = 0; i < group.children.length; i++) {
        var curveLine = group.children[i];

        curveLine.curve.points[0].x = (frequencyData[i - 1] / 80);
        curveLine.curve.points[1].x = (frequencyData[i - 2] / 80);
        curveLine.curve.points[2].x = (frequencyData[i - 3] / 80);
        curveLine.curve.points[3].x = (frequencyData[i - 4] / 80);
        curveLine.curve.points[4].x = (frequencyData[i - 4] / 80);

        frequencyCounter++;
        curveLine.geometry.vertices = curveLine.curve.getPoints(10);
        curveLine.geometry.verticesNeedUpdate = true;
        if (frequencyData[0] > 10 && group.children[i]) {
            // setTimeout(function(){
            group.children[i].geometry = new THREE.TubeBufferGeometry(extrudePath, 12, 2, 20);
            // },0.000004);
        }
        group.children[i].geometry.computeVertexNormals();
        group.children[i].geometry.computeFaceNormals();
        group.children[i].geometry.verticesNeedUpdate = true;
    }

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
    setTimeout(function () {
        requestAnimationFrame(drawFrame);
    }, 1 / 20);

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
