let canvas, engine, scene, camera, loader;
let ground, sphere, box, light0, light1, light2, grid;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    createScene = function() {
        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
        // BABYLON.SceneLoader.ShowLoadingScreen = false;

        // Scene
        scene = new BABYLON.Scene(engine);
        scene.gravity = new BABYLON.Vector3(0, -0.981, 0);
        scene.collisionsEnabled = true;
        scene.clearColor = BABYLON.Color3.Black();

        // Camera
        camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.4, 0), scene);
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.applyGravity = true;
        
        // WASD Camera Controls
        camera.keysUp.push(87);
        camera.keysLeft.push(65);
        camera.keysDown.push(83);
        camera.keysRight.push(68);

        // Ellipsoid on Camera
        camera.ellipsoid = new BABYLON.Vector3(1, 1, 1);

        // Lighting
        light0 = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 10, 0), scene);
        light0.intensity = 1.5;

        // Grid Material
        grid = new BABYLON.GridMaterial("grid", scene);
        grid.gridRatio = 1;
        grid.majorUnitFrequency = 5;

        // Ground
        ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        ground.material = grid;
        ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        ground.checkCollisions = true;

        // Coffee Object
        BABYLON.SceneLoader.ImportMesh("", "./assets/models/coffee/", "coffee.obj", scene, function(newMeshes) {
            newMeshes.forEach(function(coffee) {
                coffee.checkCollisions = true;
                coffee.position.z = 5;
                coffee.position.y = 1.5;
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


// BABYLON.SceneLoader.ImportMesh("", "./assets/models/Office_full/", "Office_full.obj", scene, function(newMeshes) {
//     newMeshes.forEach(function(element) {
//         element.scaling = new BABYLON.Vector3(0.09, 0.09, 0.09);
//         element.checkCollisions = true;
//     });
// });
