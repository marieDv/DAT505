# Angèle
## purpose
Angèle is dedicated to an uprising belgian singer. Her unique style of music can be discovered 
through multiple Three.js models that bend and transform to the frequency of her voice. The mapping is constructed in a way 
that emphasizes the sound the female voice rate to underline her performance. The user has the possibility to choose between
two of her most popular songs, but other songs could be added quite easily later on. 

## setup
The website doesn't require any server communication and can easily be opened through any localhost. 

## implementation progress

## scene setup
… is handled inside the init function. The scene contains a PerspectiveCamera, an Ambient- and an Directionallight and subtle fog. The function also contains the event-handlers of the page that redirect to helper functions. This includes a function solemnly responsible for the resizing of the window to make the page responive. 


## model
To achive the desired bending effect of the model the THREE.TubeBufferGeometry had to be implemented. This geometry requires a THREE.CatmullRomCurve3 as parameter (createLines). Along this path a geometry can be extruded several times. This is very helpfull when it comes to the animation of the project, since instead of updating each vertice of a model, only the line get's regenerated and extruded. It's worth mentioning that every implemented model also contains a "shadow" sibling, another object created through boxgeometry, that mirrors size and scale and is applied to the occlusion layer to enable the godray effect. (loadBasicSurface) 

### postprocessing
The basic setup of this application contains two render layers which undergo a different manipulation in the postprocessing. 
Both layers are extended through a mixture of manipulations due to the VolumetricLightShader, the AdditiveBlendingShader and the AfterimageShader. This process happens in the addComposer function inside the main JavaScript file of the project.

### animation
Both the group models and the shadow-siblings go through various manipulations while the animation is running. They are being scaled and the color is modified. But the most important and tricky part is the recalculation of the line, that is responsible for the extrusion of the THREE.TubeBufferGeometry. Each point of the THREE.CatmullRomCurve3 is calculated by taking a corresponding part of the frequence choosen in a way that shows the frequence-change in the bending of the geometry.


The project is not uploaded on Codepen since it surcharged the allowed file size and count. It will be published soon on my personal website. 
https://github.com/marieDv/DAT505/tree/master/DAT505_project_dvorzak
