/*
*INDEX.JS FILE
* contains three.js related logic and event listeners
*
*/


var renderer, scene, camera, extrudePath,
    frequencyData, audio, analyser, geometry, material, points, pipeSpline, direction, composer,lyrics,tempWord,countWords=0
;

var toggleSong = false;
var startedAudio = false;
var wait = false;
//shader related variables
var occlusionComposer, lightSphere,

    angle = 0,
    DEFAULT_LAYER = 0,
    OCCLUSION_LAYER = 1;
//variables for a random animation
var time = 0;
var cRot = 0.3;
var tRot = 0.8;


var frequencyCounter = 0;
const planeVertices = 32; //128
var counter = -10; //-70
var creationCounter = 0;
var group = new THREE.Object3D();
var shadowGroup = new THREE.Object3D();

var groupSec = new THREE.Object3D();
var shadowGroupSec = new THREE.Object3D();



/*
// CHANGE THE SONG and rewrite the related variables in the code after a user has pressed the back or forth buttons
 */
function changeSong(direction){

    let temp = camera.rotation.y;
    let tempRot = camera.rotation.y;
    direction === "right" ? toggleSong = true : toggleSong = false;
    direction === "left" ? TweenMax.to(camera.position, 2, {x:temp-1}) : TweenMax.to(camera.position, 2, {x:temp+260});
    direction === "left" ? TweenMax.to(camera.rotation, 2, {y:tempRot+0.001}) : TweenMax.to(camera.rotation, 2, {y:tempRot-0.003});
    direction === "left" ? document.getElementById("left").style.visibility = "hidden" : document.getElementById("right").style.visibility = "hidden" ;
    direction === "left" ? document.getElementById("right").style.visibility = "visible" : document.getElementById("left").style.visibility = "visible" ;
    direction === "left" ? document.getElementById("songTitle").innerHTML = "Ta Reine" : document.getElementById("songTitle").innerHTML = "La Loi de Murphy";
    direction === "left" ? document.getElementById("songTitle").style.marginLeft = "-4px" : document.getElementById("songTitle").style.marginLeft = "-57px";

        console.log(toggleSong)
    initializeAudio();
}
/*
// handles the basic setup of the scene and the event listeners
 */
function init() {
    window.addEventListener( 'resize', onWindowResize, false );

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
        // loadBasicSurface(group, shadowGroup);
        loadBasicSurface(groupSec, shadowGroupSec);
    }
    for (let i = 0; i < planeVertices / 2; i++) {
        // loadBasicSurface(groupSec, shadowGroupSec);
        loadBasicSurface(group, shadowGroup);
    }
    scene.add(groupSec);
    scene.add(shadowGroupSec);

    groupSec.position.set(208, 40, 130);
    shadowGroupSec.position.set(208, 40, 130);

    scene.add(group);
    scene.add(shadowGroup);

    group.position.set(-180, 30, 100)
    shadowGroup.position.set(-180, 30, 100)


    document.body.appendChild(renderer.domElement);
    addComposer();
    createLyrics();
    document.getElementById('toggleBio').addEventListener('click', function(){toggleBio()}, false);
    document.getElementById('toggleBack').addEventListener('click', function(){toggleBack()}, false);
    document.getElementById('left').addEventListener('click', function(){changeSong("left")}, false);
    document.getElementById('right').addEventListener('click', function(){changeSong("right")}, false);
}
/*
// handles the back-event
 */
function toggleBack(){
    audio.pause();
    audio.currentTime = 0;
    document.getElementById("introBox").style.display ="block";
    toggleSong === true ? resetModel(group) : resetModel(groupSec);
}
/*
// toggles the bio that is shown as introduction on the page
 */
function toggleBio(){
    document.getElementById("greetings").style.display = "none";
}
/*
// adds a light sphere to the background, that is then rendered with the rest of the occlusion layer
 */
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
/*
// builds meshes for each relevant part of the frequence - depend on the number of planeVertices that is given
 */
function loadBasicSurface(group, shadowGroup) {

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
        wireframeLinewidth: 1,
    });
    var shadowMaterial = new THREE.MeshLambertMaterial({
        color: "#f1f1f1",
        side: THREE.DoubleSide,
        wireframeLinewidth: 1,
    });

    var plane = new THREE.Mesh(tubeGeometry, material);//150, 300, Math.PI/2, Math.PI, 25, 25
    var copyMesh = new THREE.Mesh(geom, shadowMaterial);//150, 300, Math.PI/2, Math.PI, 25, 25

    setupCopy(plane);
    setupCopy(copyMesh);
    copyMesh.layers.set(OCCLUSION_LAYER);
    shadowGroup.add(copyMesh);
    group.add(plane);
    counter += 8;

}
/*
// helper methods for loadBasicSurface
 */
function setupCopy(mObject) {
    mObject.curve = pipeSpline;
    mObject.rotation.x += 2.9; //2.5 flach 1.5 winkel 1 flach horizontal
    // if(creationCounter >= planeVertices/2){
    mObject.position.set(counter, -100, -200);
    creationCounter++;
    mObject.receiveShadow = true;
    mObject.castShadow = true;
    mObject.geometry.dynamic = true;
    mObject.material.needsUpdate = true;
    mObject.geometry.colorsNeedUpdate = true;
}
/*
// contains composers for postprocessing - this project renders two different layers seperately to minimize the render time
 */
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
/*
// creates basic lines for the extruded geometry
 */
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
/*
// get's content of the lyrics object (WAS LATER REMOVED DUE TO DESIGN REASONS)
 */
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
/*
// maps Lyrics to the currently animated geometry (WAS LATER REMOVED DUE TO DESIGN REASONS)
 */
function mapLyrics(fd, i, child){
    let word = document.getElementsByClassName("line");
        word[countWords].style.top = (child.scale.x*30*Math.random()) +"px";
        word[countWords].style.left = (child.scale.z*100*Math.random()) +"px";
        word[countWords].style.fontSize = Math.random() * (5 - 1)+1+"rem";
        word[countWords].style.visibility = "visible";
        word[countWords].className += " toRemove text-md";
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
/*
// changes the color of the geometry depending on the frequence that is currently played
 */
function colorChange(frequencyData, i, group){

    if (frequencyData[i] > 20 && frequencyData[i] < 100) { //middletones
        let updateColor = new THREE.Color("rgb(" + 40 + "%, " + 40 + "%, " + 40 + "%)");//30 80
        group.children[i].material.color = updateColor;
    }
    if (frequencyData[i] > 85 && frequencyData[i] < 90) { //female lead
        let updateColor = new THREE.Color("rgb(" + 180 + "%, " + 180 + "%, " + 180 + "%)");//30 80
        group.children[i].material.color = updateColor;
        if(!wait){
            wait = true;
            // mapLyrics(frequencyData[i], i, group.children[i]);
        }else{
            setTimeout(()=> {
                wait = false;
            },2000);
        }
    }
    if (frequencyData[i] > 190 && frequencyData[i] < 240) { //bass
        let updateColor = new THREE.Color("rgb(" + 20 + "%, " + 20 + "%, " + 20 + "%)");//30 80
        group.children[i].material.color = updateColor;
    }
    if (frequencyData[i] > 240 && frequencyData[i] < 440) { //SNARE
        let updateColor = new THREE.Color("rgb(" + 50 + "%, " + 50 + "%, " + 50 + "%)");//30 80
        group.children[i].material.color = updateColor;
    }
    if (frequencyData[i] > 400) {
        let updateColor = new THREE.Color("rgb(" + 50 + "%, " + 50 + "%, " + 60 + "%)");
        group.children[i].material.color = updateColor;
    }
}
/*
// reset model after the user changes song
 */
function resetModel(group){

    for(let i=0; i<planeVertices;i++){
        if(group.children[i]){
            console.log("reset?")
        group.children[i].scale.y = 1;//frequencyData[i] / 60
        group.children[i].scale.z = 1;
        group.children[i].scale.x = 1;
        shadowGroup.children[i].scale.y = 1;//frequencyData[i] / 60
        shadowGroup.children[i].scale.z = 1;
        shadowGroup.children[i].scale.x = 1;
        }
    }
}
/*
// scale and vertice transformation of the models depending on the current frequencies of the song
 */
function mapAudioInformation(group, shadowGroup) {

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
            colorChange(frequencyData, i, group);

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
/*
// contains all methods that should be called after a song has started
 */
function initializeAudio() {
    var ctx = new AudioContext();
    toggleSong === false ? document.getElementById("audioFileOne").src = "./audio/tareine.m4r"  : document.getElementById("audioFileOne").src = "./audio/laLoideMurphy.mp3" ;
    audio = document.getElementById("audioFileOne");
    var audioSrc = ctx.createMediaElementSource(audio);
    analyser = ctx.createAnalyser();
    analyser.fftSize = planeVertices;
    audioSrc.connect(analyser);
    audioSrc.connect(ctx.destination);
    document.getElementById("playbutton").addEventListener('click', function () {
        audio.play();
        startedAudio = true;
        document.getElementById("introBox").style.display ="none";
    });


}
function drawFrame(ts) {
    setTimeout(function () {
        requestAnimationFrame(drawFrame);
    }, 1 / 40);

    camera.layers.set(OCCLUSION_LAYER);
    occlusionComposer.render();

    camera.layers.set(DEFAULT_LAYER);
    renderer.setClearColor("#050505");
    composer.render();



    var bufferLength = analyser.frequencyBinCount;
    frequencyData = new Uint8Array(bufferLength);
    void analyser.getByteFrequencyData(frequencyData);
    if (startedAudio) {
        animateCamera();
        wakov();
        // toggleSong === false ? mapAudioInformation(group, shadowGroup) : mapAudioInformation(groupSec, shadowGroupSec);
        mapAudioInformation(group, shadowGroup)
    }
}
/*
// slightly moves camera on the z and x axis for effect
 */
function animateCamera(){
    if(tRot > 1.5){
        camera.position.z += 0.05*cRot;//85
        camera.rotation.y += 0.0002*cRot;
    }else{
        camera.rotation.y -= 0.00008*cRot;
        camera.position.z -= 0.009*cRot;//85
    }

    // camera.position.y -= 0.2;

}


//HELPER FUNCTIONS
/*
// computes a random value that is responsible for the camera animation
 */
function wakov(){
    if(Math.floor(Math.random()< 0.01)){
        if(tRot > 1.5){
            tRot = 0.3;
        }else{
            tRot += Math.floor(Math.random() * .1) + 0.25;

        }
    }
    cRot+=(tRot-cRot)/100;
}
/*
// handles canvas size after the window has been resized
 */
function onWindowResize(){

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );

}
init();
drawFrame();
