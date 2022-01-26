console.clear();

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
// var light = new THREE.DirectionalLight(0xefefff, 3);
// light.position.set(1, 1, 1).normalize();
// scene.add(light);
var light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(0, -4, 4).normalize();
scene.add(light);

//===================================================== resize
window.addEventListener("resize", function () {
    let width = window.innerWidth;
    let height = window.innerHeight;
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
});

//===================================================== model
var loader = new THREE.GLTFLoader();
var mixer;
var model;
loader.load("https://assets.codepen.io/246465/smaller.gltf", function (gltf) {
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

//@@@@@@@@@@@@@@@@@@@@@@@@scroll trigger@@@@@@@@@@@@@@@@@@@@@@
gsap.registerPlugin(ScrollTrigger);

let rotation = 0;

function init() {
    const sections = document.querySelectorAll("section");
    sections.forEach((section) => {
        gsap.from(section, {
            opacity: 0,
            yPercent: 5,
            onUpdate: function () {
                // console.log("do a flip");
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
    // if (model) model.rotation.y += 0.0015;
    renderer.render(scene, camera);
}

render();
