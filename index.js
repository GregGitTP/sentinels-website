import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from 'https://unpkg.com/three@0.127.0/examples/jsm/controls/OrbitControls.js';
//import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.121.1/examples/jsm/loaders/GLTFLoader.js";
import { GLTFLoader } from "./vendor_mods/three/examples/jsm/controls/GLTFLoader.js";

var renderer,camera,controls,scene,clock,bglight,spotlight,loader,world,canvasdiv,renderscene,bloompass,composer,material,geometry,elap;
var zoom=true;

function init(){

    // CANVAS DIV
    canvasdiv=document.querySelector('#canvasdiv');
    
    // RENDERER
    renderer = new THREE.WebGLRenderer({
        alpha:true,
        antialias:true,
        canvas:document.querySelector('canvas')
    });
    renderer.toneMapping=THREE.ReinhardToneMapping;
    renderer.toneMappingExposure=2.7;
    renderer.setSize( canvasdiv.offsetWidth, canvasdiv.offsetHeight );
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));

    // CAMERA
    camera = new THREE.PerspectiveCamera( 75, canvasdiv.offsetWidth / canvasdiv.offsetHeight, 0.1, 1000 );
    camera.position.set( 0, 0, 300);

    // ORBIT CONTROLS
    controls = new OrbitControls( camera, renderer.domElement )
    controls.target.set(0, 0, 0);
    controls.enablePan=false;
    controls.enableZoom=false;
    controls.enableRotate=false;
    controls.update();

    // SCENE
    scene = new THREE.Scene();

    // CLOCK
    clock=new THREE.Clock();

    // BGLIGHT
    bglight=new THREE.HemisphereLight(0xffeeb1,0x080820,6);
    bglight.position.set(0,0,0);
    scene.add(bglight);

    // SPOT LIGHT
    spotlight=new THREE.SpotLight(0xffffff,4);
    scene.add(spotlight);

    // MODEL
    loader=new GLTFLoader();
    loader.load('./mostbeautifulworld.glb',function(glb){
        world=glb.scene;
        world.rotation.y=91;
        world.position.set(80,0,0);
        scene.add(world);
        animate();
    }, undefined,  function(err){
        console.error(err);
    });

    // //STARS
    const starGeometry = new THREE.BufferGeometry()
    const starMaterial = new THREE.PointsMaterial({
        size: 1.3,
        color: 0xffffff
    })

    const starVertices = []
    for(let i = 0; i< 10000; i++){
        const rdm=Math.floor(Math.random() * 2) + 1
        var x,y,z =0
        if(rdm==1){
            x = (Math.random() - 0.5) * 2000
            y = (Math.random() - 0.5) * 2000
            z = (Math.random() - 0.5) * 2000
        }else{
            x = (Math.random() - 0.5) * 2000
            y = (Math.random() - 0.5) * 2000
            z = -(Math.random() - 0.5) * 2000
        }
        if((x>180||x<-180)||(y>180||y<-180)||(z>180||z<-180)){
            starVertices.push(x,y,z)
        }
    }

    starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3))
    const stars = new THREE.Points(starGeometry, starMaterial)
    scene.add(stars)
    setTimeout(()=>{
        zoom=false;
        controls.enableRotate=true;
    },3500)
}

function windowResize(){
    camera.aspect=canvasdiv.offsetWidth/canvasdiv.offsetHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvasdiv.offsetWidth,canvasdiv.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
    window.addEventListener('resize', windowResize, false)
}

function animate(){
    window.requestAnimationFrame(animate);
    world.rotation.y+=.0025;
    if(zoom) camera.position.z-=1.5;
    spotlight.position.set(camera.position.x+10,camera.position.y+10,camera.position.z+10)
    renderer.render(scene,camera); 
}



init();
windowResize();