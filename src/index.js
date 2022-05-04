console.clear();

// import { HDRCubeTextureLoader } from 'https://cdn.jsdelivr.net/npm/three@0.114.0/examples/jsm/loaders/HDRCubeTextureLoader.js';
// import { RoughnessMipmapper } from "https://cdn.jsdelivr.net/npm/three@0.113.0/examples/jsm/utils/RoughnessMipmapper.js";
import { RGBELoader } from "https://cdn.jsdelivr.net/npm/three@0.113.0/examples/jsm/loaders/RGBELoader.js";

//====================================================== canvas

const model1 = document.querySelector("#model1");
var renderer = new THREE.WebGLRenderer({ alpha: true, antialiase: true });
renderer.setSize(window.innerWidth, window.innerHeight);
model1.appendChild(renderer.domElement);

//===================================================== scene
var scene = new THREE.Scene();

//===================================================== camera
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 5;
camera.position.y = 0;

//===================================================== lights
// var light2 = new THREE.DirectionalLight(0xefefff, 1);
// light2.position.set(-4, 4, 0).normalize();
// scene.add(light2);
// var light = new THREE.DirectionalLight(0xffffff, 1);
// light.position.set(0, -4, 4).normalize();
// scene.add(light);

//===================================================== model
var model;
new THREE.GLTFLoader().load("./v3.gltf", function (gltf) {
    gltf.scene.traverse(function (node) {
        if (node instanceof THREE.Mesh) {
            node.castShadow = true;
            node.material.side = THREE.DoubleSide;
        }
    });

    model = gltf.scene;
    model.scale.set(0.75, 0.75, 0.75);
    scene.add(model);
});

// ==================================================== hdr
const params = {
    exposure: 2.0,
};
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = params.exposure;
renderer.outputEncoding = THREE.sRGBEncoding;
new RGBELoader().load("https://raw.githubusercontent.com/mrdoob/three.js/master/examples/textures/equirectangular/royal_esplanade_1k.hdr"),
    function (texture) {
        const material = new THREE.MeshBasicMaterial({ map: texture });
        const quad = new THREE.PlaneGeometry((1.5 * textureData.width) / textureData.height, 1.5);
        const mesh = new THREE.Mesh(quad, material);
        scene.add(mesh);
        render();
    };
//===================================================== resize
window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//@@@@@@@@@@@@@@@@@@@@@@@@scroll trigger@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@scroll trigger@@@@@@@@@@@@@@@@@@@@@@
//@@@@@@@@@@@@@@@@@@@@@@@@scroll trigger@@@@@@@@@@@@@@@@@@@@@@
gsap.registerPlugin(ScrollTrigger);

let rotation = 0;

function init() {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            yPercent: 25,
            onUpdate: function () {
                console.log("do a flip");
                if (model) model.rotation.y += 0.05;
            },
            scrollTrigger: {
                trigger: section.querySelector("img"),
                start: "top bottom-=200",
                end: "top center",
                toggleActions: "restart none reverse none",
                scrub: false,
            },
        });
    });
}
init();

//@@@@@@@@@@@@@@@@@@@@@@@@scroll trigger@@@@@@@@@@@@@@@@@@@@@@

var clock = new THREE.Clock();
function render() {
    requestAnimationFrame(render);
    var delta = clock.getDelta();
    if (model) model.rotation.x += 0.0015;
    // if (model) model.rotation.y += 0.0015;
    renderer.render(scene, camera);
}

render();
