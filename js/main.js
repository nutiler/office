let canvas, engine, scene, camera, loader;
let ground, sphere, box, light0, light1, light2;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    createScene = function() {
        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
        BABYLON.SceneLoader.ShowLoadingScreen = false;

        // Scene
        scene = new BABYLON.Scene(engine);
        scene.gravity = new BABYLON.Vector3(0, -0.981, 0);
        scene.collisionsEnabled = true;

        // Camera
        camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.4, 0), scene);
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.applyGravity = true;
        // Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(1.3, 1.3, 1.3);

        // Lights
        light0 = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 1, 0), scene);
        // light1 = new BABYLON.PointLight("light1", new BABYLON.Vector3(-1, 1, 1), scene);
        // light2 = new BABYLON.DirectionalLight("light2", new BABYLON.Vector3(1, 1, -1), scene);

        //Ground
        // ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        // ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        // ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // ground.material.backFaceCulling = false;
        // ground.position = new BABYLON.Vector3(0, 0, 0);
        // ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        // ground.checkCollisions = true;


        BABYLON.SceneLoader.ImportMesh("", "./assets/models/Office_full/", "Office_full.obj", scene, function(newMeshes) {
            newMeshes.forEach(function(element) {
                element.scaling = new BABYLON.Vector3(0.09, 0.09, 0.09);
                element.checkCollisions = true;
            });
        });

        return scene;
    };


    scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });


    window.addEventListener('resize', function() {
        engine.resize();
    });
});



// Unused Loader
// loader = new BABYLON.AssetsManager(scene);
// loader.addMeshTask("name", "", "./assets/models/office_test/", "office.obj");
// loader
// .forEach(function(element) {
//     element.checkCollisions = true;
// });
// loader.load();