var renderer, scene, camera, warpVector, extrudePath,
    frequencyData, audio, analyser, plane, geometry, material, points, pipeSpline, direction, composer,lyrics,tempWord,countWords=0
;
var startedAudio = false;
var wait = false;
//shader related variables
var occlusionComposer, occlusionRenderTarget, occlusionBox, lightSphere,

    angle = 0,
    DEFAULT_LAYER = 0,
    OCCLUSION_LAYER = 1;

var time = 0;
var frequencyCounter = 0;
const planeVertices = 32; //128
var counter = -10; //-70
var creationCounter = 0;
var group = new THREE.Object3D();
var shadowGroup = new THREE.Object3D();

function init() {

    scene = new THREE.Scene();
    var W = window.innerWidth,
        H = window.innerHeight;
    camera = new THREE.PerspectiveCamera(45, W / H, .1, 800);
    camera.position.set(0, 55, 85);
    camera.lookAt(scene.position);
    var ambientLight = new THREE.AmbientLight(0xd2dae0, 0.5);

    var directionalLight = new THREE.PointLight(0xffffff, 1);
    directionalLight.rotation.x = 90;
    directionalLight.position.set(0, -90, -70);

    var pointLightHelper = new THREE.PointLightHelper(directionalLight, 2);
    // scene.add(pointLightHelper);
    scene.add(ambientLight);
    scene.add(directionalLight);
    scene.fog = new THREE.Fog( "#737373", 1, 1000 );


    var pointTwo = new THREE.PointLight(0xffffff, 8.0);
    pointTwo.rotation.x = 90;
    pointTwo.position.set(0, -90, -150);

    var pointLightHelperTwo = new THREE.PointLightHelper(pointTwo, 2);
    // scene.add(pointLightHelperTwo);
    scene.add(pointTwo)

    renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setClearColor("#060606");
    renderer.setSize(W, H);
    renderer.shadowMap.enabled = true;

    addShaderLights();
    initializeAudio();
    for (let i = 0; i < planeVertices / 2; i++) {
        loadBasicSurface();
    }
    scene.add(group);
    scene.add(shadowGroup);
    group.position.set(-45, 30, 100)
    shadowGroup.position.set(-45, 30, 100)
    document.body.appendChild(renderer.domElement);
    addComposer();
    createLyrics();
}
function addShaderLights() {
    // let shaderGeometry = new THREE.SphereGeometry(200, 80, 16);
    let shaderGeometry = new THREE.SphereGeometry(20, 80, 16);
    let shaderMaterial = new THREE.MeshBasicMaterial({color: "#ff0000", transparent: true, opacity: 0.9});
    lightSphere = new THREE.Mesh(shaderGeometry, shaderMaterial);
    lightSphere.position.set(20, -380, -580);
    lightSphere.rotation.x += 1.9;
    // lightSphere.visible = false;
    lightSphere.layers.set(OCCLUSION_LAYER); //TODO: blend in

    // scene.add(lightSphere);
}
function loadBasicSurface() {

    createLines();
    extrudePath = pipeSpline;
    var params = {
        scale: 10,
        extrusionSegments: 1,
        radiusSegments: 1,
    };
    var tubeGeometry = new THREE.TubeBufferGeometry(extrudePath, params.extrusionSegments, 2, params.radiusSegments);
    tubeGeometry.vertices = pipeSpline.getPoints(50);

    var geom = new THREE.BoxGeometry(4.5, 16, 16);
    var material = new THREE.MeshLambertMaterial({
        color: 0x111111,
        side: THREE.DoubleSide,
        specular: 0x2d2d2d,
        wireframeLinewidth: 1,
    });
    var shadowMaterial = new THREE.MeshLambertMaterial({
        color: "#f1f1f1",
        side: THREE.DoubleSide,
        specular: 0x2d2d2d,
        wireframeLinewidth: 1,
    });

    var plane = new THREE.Mesh(tubeGeometry, material);//150, 300, Math.PI/2, Math.PI, 25, 25
    var copyMesh = new THREE.Mesh(geom, shadowMaterial);//150, 300, Math.PI/2, Math.PI, 25, 25
    // addShaderBoxes(tubeGeometry)

    setupCopy(plane);
    setupCopy(copyMesh);
    copyMesh.layers.set(OCCLUSION_LAYER);
    // plane.layers.set( OCCLUSION_LAYER );
    shadowGroup.add(copyMesh);
    group.add(plane);
    counter += 8;

}
function setupCopy(mObject) {
    mObject.curve = pipeSpline;
    mObject.rotation.x += 2.9; //2.5 flach 1.5 winkel 1 flach horizontal
    // if(creationCounter >= planeVertices/2){
    mObject.position.set(counter, -100, -200);
    // }else{
    //     plane.position.set(counter, -100+(counter/2), -200);
    // }
    creationCounter++;
    mObject.receiveShadow = true;
    mObject.castShadow = true;
    mObject.geometry.dynamic = true;
    mObject.material.needsUpdate = true;
    mObject.geometry.colorsNeedUpdate = true;
}
function addComposer() {
    var pass,
        occlusionRenderTarget = new THREE.WebGLRenderTarget(window.innerWidth * 0.3, window.innerHeight * 0.3);
    occlusionComposer = new THREE.EffectComposer(renderer, occlusionRenderTarget);
    occlusionComposer.addPass(new THREE.RenderPass(scene, camera));
    pass = new THREE.ShaderPass(THREE.VolumetericLightShader);

    pass.uniforms.weight.value = 0.9;//decay density weight
    pass.uniforms.decay.value = 0.95;
    pass.uniforms.density.value = 0.95;
    pass.needsSwap = false;
    occlusionComposer.addPass(pass);

    composer = new THREE.EffectComposer(renderer);
    composer.addPass(new THREE.RenderPass(scene, camera));
    pass = new THREE.ShaderPass(THREE.AdditiveBlendingShader);
    pass.uniforms.tAdd.value = occlusionRenderTarget.texture;


    var passBlur = new THREE.ShaderPass(THREE.VolumetericLightShader);
    passBlur.uniforms.weight.value = 0.4;
    passBlur.uniforms.density.value = 0.7;
    composer.addPass(passBlur);
    // passAI.renderToScreen = true;

    var passAI = new THREE.AfterimagePass(THREE.AfterimageShader);
    passAI.uniforms.damp.value = 0.6;
    composer.addPass(passAI);

    // var passTex = new THREE.BloomPass(THREE.ColorifyShader);
    // composer.addPass(passTex);


    composer.addPass(pass);
    pass.renderToScreen = true;
}
function createLines() {
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

function createLyrics(){
    let templyrics = document.getElementById("lyrics");
    lyrics = templyrics.innerHTML.split(" ");
    console.log(lyrics);

    for(let i=0; i<lyrics.length;i++){
        let temp = document.createElement("span");
        if(!(lyrics[i] === null) || !(lyrics[i] === " ")){
        temp.innerHTML = lyrics[i]+" "}
        temp.className = "line";
        document.getElementById("animatedLyrics").appendChild(temp);
    }

}
function mapLyrics(fd, i, child){
    let word = document.getElementsByClassName("line");
        word[countWords].style.top = (child.scale.x*30*Math.random()) +"px";
        word[countWords].style.left = (child.scale.z*100*Math.random()) +"px";
        word[countWords].style.fontSize = Math.random() * (5 - 1)+1+"rem";
        word[countWords].style.visibility = "visible";
        word[countWords].className += " toRemove";
        countWords++;
        setTimeout(function(){
            // word[countWords].style.visibility = "hidden";
            for(let j=0; j< word.length;j++){
                if(word[j].classList.contains("toRemove")){
                    word[j].style.color = "#ff0000"
                    word[j].style.visibility = "hidden";
                }
            }
        },1500)

}
function mapAudioInformation() {

    for (let i = 0; i < planeVertices; i++) {
        if (frequencyData[i] > 0) {
            group.children[i].scale.y = 2 * (frequencyData[i] / 100);//frequencyData[i] / 60
            group.children[i].scale.z = frequencyData[i] / 80;
            group.children[i].scale.x = frequencyData[i] / 70;
            shadowGroup.children[i].scale.y = 2 * (frequencyData[i] / 100);//frequencyData[i] / 60
            shadowGroup.children[i].scale.z = frequencyData[i] / 80;
            shadowGroup.children[i].scale.x = frequencyData[i] / 70;

            if (frequencyData[10] > 50) {
                lightSphere.scale.y = frequencyData[10] / 20;

            } else {
                lightSphere.scale.y = frequencyData[10] / 20;
            }

            if (frequencyData[i] > 20 && frequencyData[i] < 100) { //bass
                let updateColor = new THREE.Color("rgb(" + 255 + "%, " + 230 + "%, " + 50 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 85 && frequencyData[i] < 90) { //bass
                let updateColor = new THREE.Color("rgb(" + 100 + "%, " + 255 + "%, " + 0 + "%)");//30 80
                group.children[i].material.color = updateColor;
                if(!wait){
                    wait = true;
                    mapLyrics(frequencyData[i], i, group.children[i]);
                }else{
                    setTimeout(()=> {
                      wait = false;
                    },2000);
                }

            }
            if (frequencyData[i] > 190 && frequencyData[i] < 240) { //SNARE
                let updateColor = new THREE.Color("rgb(" + 0 + "%, " + 30 + "%, " + 150 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 240 && frequencyData[i] < 440) { //SNARE
                let updateColor = new THREE.Color("rgb(" + 70 + "%, " + 0 + "%, " + 180 + "%)");//30 80
                group.children[i].material.color = updateColor;
            }
            if (frequencyData[i] > 400) {
                let updateColor = new THREE.Color("rgb(" + 50 + "%, " + 50 + "%, " + 60 + "%)");
                group.children[i].material.color = updateColor;
            }
        }

    }

    for (var i = 0; i < group.children.length; i++) {
        var curveLine = group.children[i];

        curveLine.curve.points[0].x = (frequencyData[i - 1] / 70);
        curveLine.curve.points[1].x = (frequencyData[i - 2] / 70);
        curveLine.curve.points[2].x = (frequencyData[i - 3] / 70);
        curveLine.curve.points[3].x = (frequencyData[i - 4] / 70);
        curveLine.curve.points[4].x = (frequencyData[i - 4] / 70);

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
        startedAudio = true;
        this.style.visibility ="hidden";
    });


}

function drawFrame(ts) {
    setTimeout(function () {
        requestAnimationFrame(drawFrame);
    }, 1 / 40);

    camera.layers.set(OCCLUSION_LAYER);
    // renderer.setClearColor(0x000000);
    occlusionComposer.render();

    camera.layers.set(DEFAULT_LAYER);
    renderer.setClearColor("#050505");
    composer.render();


    var bufferLength = analyser.frequencyBinCount;
    frequencyData = new Uint8Array(bufferLength);
    void analyser.getByteFrequencyData(frequencyData);
    if (startedAudio) {
        mapAudioInformation(ts);
    }
}

//TODO:
//getByTimeDomainData() -> WAVEFORM
//beziercurves
// group.children[i].geometry.computeVertexNormals();
//interpolation
//effect.uniforms['amount'].value = true;
// occlusionBox.position.copy(box.position);
init();
drawFrame();
