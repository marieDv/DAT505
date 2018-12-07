var renderer, scene, camera, warpVector, extrudePath,
    frequencyData, audio, analyser, plane, geometry, material, points, pipeSpline, direction,composer,renderPass
;

var time = 0;
var frequencyCounter = 0;
const planeVertices = 32; //128
var counter = -10; //-70
var group = new THREE.Object3D();

function init() {

    scene = new THREE.Scene();
    var W = window.innerWidth,
        H = window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, W / H, .1, 800);
    camera.position.set(0, 55, 85);
    camera.lookAt(scene.position);
    var ambientLight = new THREE.AmbientLight(0xd2dae0, 0.4);

    var directionalLight = new THREE.PointLight(0xffffff, 1.0);
    directionalLight.rotation.x = 90;
    directionalLight.position.set(0, -90, -70);

    var pointLightHelper = new THREE.PointLightHelper( directionalLight, 2 );
    scene.add( pointLightHelper );
    scene.add(ambientLight);
    scene.add(directionalLight);


    var pointTwo = new THREE.PointLight(0xffffff, 8.0);
    pointTwo.rotation.x = 90;
    pointTwo.position.set(0, -90, -150);

    var pointLightHelperTwo = new THREE.PointLightHelper( pointTwo, 2 );
    scene.add( pointLightHelperTwo );
    scene.add(pointTwo)

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor(0x000000);
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;


    initializeAudio();
    for (let i = 0; i < planeVertices / 2; i++) {
        loadBasicSurface();
    }
    scene.add(group);
    group.position.set(-45, 30, 100)
    document.body.appendChild(renderer.domElement);
    addComposer();
}
function addComposer(){
    composer =new THREE.EffectComposer(renderer);
    renderPass = new THREE.RenderPass(scene, camera);
    composer.addPass(renderPass);

    var passOne = new THREE.ShaderPass(THREE.FocusShader);
    composer.addPass(passOne);
    // passOne.uniforms.fstop = 1;
    // passOne.uniforms.maxblur = 1;
    renderPass.renderToScreen = true;
//https://threejs.org/examples/webgl_postprocessing_dof2.html
}


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

    var material = new THREE.MeshLambertMaterial({
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
function mapAudioInformation() {

    for (let i = 0; i < planeVertices; i++) {
        if (frequencyData[i] > 0) {
            group.children[i].scale.y = 2 * (frequencyData[i] / 100);//frequencyData[i] / 60
            group.children[i].scale.z = frequencyData[i] / 80;
            group.children[i].scale.x = frequencyData[i] / 70;
            // group.children[i].curve.points[6].x += frequencyData[i]/200;
            if (frequencyData[i] > 50) {
                let updateColor = new THREE.Color("rgb(" + 10 + "%, " + 10 + "%, " + 10 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 100) {
                let updateColor = new THREE.Color("rgb(" + 30 + "%, " + 30 + "%, " + 30 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 200) {
                let updateColor = new THREE.Color("rgb(" + 80 + "%, " + 80 + "%, " + 80 + "%)");
                group.children[i].material.color = updateColor;
            }
        }

    }

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
            // }, 1/30);
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

    composer.render(scene, camera);
    var bufferLength = analyser.frequencyBinCount;
    frequencyData = new Uint8Array(bufferLength);
    void analyser.getByteFrequencyData(frequencyData);
    mapAudioInformation(ts);
}

//TODO:
//getByTimeDomainData() -> WAVEFORM
//beziercurves
// group.children[i].geometry.computeVertexNormals();
//interpolation

init();
drawFrame();
