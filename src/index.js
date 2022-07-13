console.clear();
import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.113.2/build/three.module.js";
// import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.113.0/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "https://cdn.jsdelivr.net/npm/three@0.113.0/examples/jsm/loaders/GLTFLoader.js";

// import * as dat from "https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js";

/** * Loaders */

const progressBar = document.getElementById("progressbar");
const progressBarWrapper = document.getElementById("progressbarwrapper");
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = function (url, item, total) {
    console.log(`Started ${url}`);
};

loadingManager.onProgress = function (url, loaded, total) {
    progressBar.value = (loaded / total) * 100;
};

loadingManager.onLoad = function (url, item, total) {
    progressBarWrapper.style.display = "none";
};

const gltfLoader = new GLTFLoader(loadingManager);
const cubeTextureLoader = new THREE.CubeTextureLoader();
// Debug
// const gui = new dat.GUI();
const debugObject = {};

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// @@@@@@@@ UPDATE MATS @@@@@@@@
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            // child.material.envMap = environmentMap
            child.material.envMapIntensity = debugObject.envMapIntensity;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Environment map
 */
const environmentMap = cubeTextureLoader.load([
    "./02.jpg", //
    "./03.jpg", //
    "./04.jpg", //
    "./05.jpg", //
    "./00.jpg", //
    "./01.jpg",
]); //
//pos-x, neg-x, pos-y, neg-y, pos-z, neg-z.
// skybox_image_000.tif - Front (+Z)
// skybox_image_001.tif - Back (-Z)
// skybox_image_002.tif - Left (+X)
// skybox_image_003.tif - Right (-X)
// skybox_image_004.tif - Up (+Y)
// skybox_image_005.tif - Down (-Y)

environmentMap.encoding = THREE.sRGBEncoding;

// scene.background = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 2.5;
// gui.add(debugObject, "envMapIntensity").min(0).max(10).step(0.001).onChange(updateAllMaterials);

/** * Models */
var model;

// gltfLoader.load("https://raw.githubusercontent.com/a-ortega04/ojo.gltf/main/ojo%20gltf/scene.gltf",
gltfLoader.load("./v3.gltf", (gltf) => {
    gltf.scene.scale.set(0.75, 0.75, 0.75);
    gltf.scene.position.set(0, 0, 0);
    // gltf.scene.rotation.y = Math.PI * 0.5;
    scene.add(gltf.scene);

    // gui.add(gltf.scene.rotation, "y").min(-Math.PI).max(Math.PI).step(0.001).name("rotation");

    updateAllMaterials();
    model = gltf.scene;
});

// @@@@@@@@@ LIGHTS @@@@@@@@@
const directionalLight = new THREE.DirectionalLight("#ffffff", 3);
directionalLight.castShadow = true;
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(512, 512);
directionalLight.shadow.normalBias = 0.05;
directionalLight.position.set(5, 0.3, 0.075);
scene.add(directionalLight);

// gui.add(directionalLight, "intensity").min(0).max(10).step(0.001).name("lightIntensity");
// gui.add(directionalLight.position, "x").min(-5).max(5).step(0.001).name("lightX");
// gui.add(directionalLight.position, "y").min(-5).max(5).step(0.001).name("lightY");
// gui.add(directionalLight.position, "z").min(-5).max(5).step(0.001).name("lightZ");

// @@@@@@@@@ SIZES @@@@@@@@@
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener("resize", () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

// @@@@@@@@@ CAM @@@@@@@@@
const camera = new THREE.PerspectiveCamera(35, sizes.width / sizes.height, 0.1, 100);
camera.position.set(0, 0, 8);
scene.add(camera);

// Controls
// const controls = new OrbitControls(camera, canvas);
// controls.enableDamping = true;

// @@@@@@@@@ RENDERER @@@@@@@@@
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true,
});
renderer.setClearColor(0x000000, 0);
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ReinhardToneMapping;
renderer.toneMappingExposure = 2.3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// @@@@@@@@@ GUI @@@@@@@@@
// gui.add(renderer, "toneMapping", {
//     No: THREE.NoToneMapping,
//     Linear: THREE.LinearToneMapping,
//     Reinhard: THREE.ReinhardToneMapping,
//     Cineon: THREE.CineonToneMapping,
//     ACESFilmic: THREE.ACESFilmicToneMapping,
// });
// gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

// @@@@@@@@@ ANIMATE @@@@@@@@@
const tick = () => {
    // Update controls
    // controls.update();

    // Render
    renderer.render(scene, camera);
    if (model) model.rotation.x += 0.0015;

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();

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
            // yPercent: 25,
            onUpdate: function () {
                console.log("do a flip");
                if (model) model.rotation.y += 0.05;
            },
            scrollTrigger: {
                trigger: section.querySelector("h1"),
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
    renderer.render(scene, camera);
}

render();
