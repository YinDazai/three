let container;
let scene;
let camera;
let controls;
let renderer;

const mixers = [];
const clock = new THREE.Clock();

function init() {

    container = document.getElementById("a");

    //escena
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xdddddd);

    //camara
    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 5000);
    camera.position.x = 350;
    camera.position.z = 250;
    camera.position.y = 150;

    //controles
    controls = new THREE.OrbitControls(camera, container);

    //luz
    light = new THREE.AmbientLight(0x404040);
    scene.add(light);

    // LIGHTS
    hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    hemiLight.color.setHSL(0.6, 1, 0.6);
    hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    hemiLight.position.set(0, 50, 0);
    scene.add(hemiLight);

    hemiLightHelper = new THREE.HemisphereLightHelper(hemiLight, 10);
    scene.add(hemiLightHelper);

    dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    dirLight.color.setHSL(0.1, 1, 0.95);
    dirLight.position.set(- 1, 1.75, 1);
    dirLight.position.multiplyScalar(30);
    scene.add(dirLight);

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

    dirLightHeper = new THREE.DirectionalLightHelper(dirLight, 10);
    scene.add(dirLightHeper);

    //Suelo
    var groundGeo = new THREE.PlaneBufferGeometry(10000, 10000);
    var groundMat = new THREE.MeshLambertMaterial({ color: 0xffffff });
    groundMat.color.setHSL(0.095, 1, 0.75);

    var ground = new THREE.Mesh(groundGeo, groundMat);
    ground.position.y = - 105;
    ground.rotation.x = - Math.PI / 2;
    ground.receiveShadow = true;
    scene.add(ground);

    //modelos
    let loader = new THREE.GLTFLoader();
    loader.load('robot/scene.gltf', function (gltf) {
        robot = gltf.scene.children[0];
        robot.scale.set(0.5, 0.5, 0.5);
        scene.add(gltf.scene);
    });

    //render
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.shadowMap.enabled = true;
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(window.innerWidth, window.innerHeight);
    container.appendChild(renderer.domElement);

    renderer.setAnimationLoop(() => {

        update();
        render();

    });

}

function update() {

    const delta = clock.getDelta();

    for (const mixer of mixers) {

        mixer.update(delta);

    }

}

function render() {

    renderer.render(scene, camera);

}

function onWindowResize() {

    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);

}

window.addEventListener('resize', onWindowResize);

init();


