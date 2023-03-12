import * as THREE from 'https://unpkg.com/three/build/three.module.js';

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({color:0x50fa7b});
const cube = new THREE.Mesh(geometry,material);
cube.position.set(-1,1,0);
scene.add(cube);

let positions = [
    [-1,0,0],
    [-1,-1,0],
    [0,-1,0],
    [0,-2,0],
    [1,-2,0],
    [1,-3,0],
    [2,-3,0],
    [2,-4,0],
    [2,-4,1],
    [2,-5,1],
    [2,-5,2]
];

const staircaseMaterial = new THREE.MeshBasicMaterial({color:0x50fa7b,wireframe:true});
for (let i=0; i <positions.length; i++){
    const staircaseElement = new THREE.Mesh(geometry,staircaseMaterial);
    staircaseElement.position.fromArray(positions[i]);
    scene.add(staircaseElement);
}

/**
 * Sizes
 */
 const sizes = {
    width: 0.25*window.innerWidth,
    height: window.innerHeight
}

window.addEventListener('resize', () =>
{
    sizes.width = 0.25*window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width,sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
})

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(35,sizes.width/sizes.height,0.1,100);
const cameraDistance = 8;
camera.position.set(cameraDistance,cameraDistance,cameraDistance);
camera.lookAt(0,-2.5,0);

/**
 * Renderer
 */	
const renderer = new THREE.WebGLRenderer({
    canvas : canvas,
    alpha: true,
    antialias: true,
});

renderer.setSize(sizes.width,sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio,2))
document.body.appendChild(renderer.domElement);

// Clock
const clock = new THREE.Clock();

/**
 * Animate
 */
let step = 0;
let direction = 1;
let theta = 0;
const angularSpeed = 2;

function animate() {
    requestAnimationFrame(animate);

    let dt = clock.getDelta();

    if (step >= 0 && step <= 4){

        theta = theta+angularSpeed*dt > Math.PI? Math.PI: theta+angularSpeed*dt;

        let start = new THREE.Vector3(-1,1,0);
        let pivot = new THREE.Vector3(-0.5,0.5,0.5);
        let axis = new THREE.Vector3(0,0,0);

        if (step < 3){
            start.addScaledVector(new THREE.Vector3(1,-1,0),step);
            pivot.addScaledVector(new THREE.Vector3(1,-1,0),step);
            axis.z = 1;
        } else {
            start.addScaledVector(new THREE.Vector3(1,-1,0),3).addScaledVector(new THREE.Vector3(0,-1,1),step-3);
            pivot.addScaledVector(new THREE.Vector3(1,-1,0),3).addScaledVector(new THREE.Vector3(0,-1,1),step-3);
            axis.x = 1;
        }

        cube.position.copy(start);
        cube.position.sub(pivot);
        cube.position.applyAxisAngle(axis,Math.pow(-1,step<3)*direction*theta+(direction==-1)*Math.PI);
        cube.position.add(pivot);
        cube.setRotationFromAxisAngle(axis,Math.pow(-1,step<3)*direction*theta+(direction==-1)*Math.PI);
    }

    if (theta == Math.PI){
        theta = 0;
        step += direction;
    }

    // Reset
    if (step == 5){
        step = 4;
        direction = -1;
    }

    if (step == -1){
        step = 0;
        direction = 1;
    }

    renderer.render(scene,camera);
}

animate();