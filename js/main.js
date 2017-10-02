let canvas, engine, scene, camera, loader;
let ground, sphere, box, light0, light1, light2;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    createScene = function() {
        // BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
        // BABYLON.SceneLoader.ShowLoadingScreen = false;

        scene = new BABYLON.Scene(engine);
        //Set gravity for the scene (G force like, on Y-axis)
        scene.gravity = new BABYLON.Vector3(0, -0.981, 0);
        // Enable Collisions
        scene.collisionsEnabled = true;


        // Need a free camera for collisions
        camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.4, 0), scene);
        camera.attachControl(canvas, true);
        //Then apply collisions and gravity to the active camera
        camera.checkCollisions = true;
        camera.applyGravity = true;
        //Set the ellipsoid around the camera (e.g. your player's size)
        camera.ellipsoid = new BABYLON.Vector3(1.2, 1.2, 1.2);
        // var cam = this.scene.cameras[0];cam.animations = []var a = new BABYLON.Animation(    "a",    "position.y", 20,    BABYLON.Animation.ANIMATIONTYPE_FLOAT,    BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);// Animation keysvar keys = [];keys.push({ frame: 0, value: cam.position.y });keys.push({ frame: 10, value: cam.position.y + 2 });keys.push({ frame: 20, value: cam.position.y });a.setKeys(keys);var easingFunction = new BABYLON.CircleEase();easingFunction.setEasingMode(BABYLON.EasingFunction.EASINGMODE_EASEINOUT);a.setEasingFunction(easingFunction);cam.animations.push(a);this.scene.beginAnimation(cam, 0, 20, false);

        // Lights
        light0 = new BABYLON.DirectionalLight("Omni", new BABYLON.Vector3(-2, 16, 2), scene);
        light1 = new BABYLON.PointLight("Omni", new BABYLON.Vector3(2, 16, -2), scene);
        light2 = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        //Ground
        // ground = BABYLON.Mesh.CreatePlane("ground", 50.0, scene);
        // ground.material = new BABYLON.StandardMaterial("groundMat", scene);
        // ground.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        // ground.material.backFaceCulling = false;
        // ground.position = new BABYLON.Vector3(0, 0, 0);
        // ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);

        // // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        // sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        // sphere.position.x = 10;
        // sphere.position.y = 2;

        // //Simple crate
        // box = BABYLON.Mesh.CreateBox("crate", 2, scene);
        // box.material = new BABYLON.StandardMaterial("Mat", scene);
        // // box.material.diffuseTexture = new BABYLON.Texture("textures/crate.png", scene);
        // // box.material.diffuseTexture.hasAlpha = true;
        // box.position = new BABYLON.Vector3(0, 2, 0);

        // loader = new BABYLON.AssetsManager(scene);
        // loader.addMeshTask("name", "", "./assets/models/office_test/", "office.obj");
        // loader
        // .forEach(function(element) {
        //     element.checkCollisions = true;
        // });
        // loader.load();

        BABYLON.SceneLoader.ImportMesh("", "./assets/models/office_test/", "office.obj", scene, function(newMeshes) {
            newMeshes.forEach(function(element) {
                element.scaling = new BABYLON.Vector3(.01,.01,.01);
                element.checkCollisions = true;
            });
            console.log(newMeshes)
        });

        //finally, say which mesh will be collisionable
        // ground.checkCollisions = true;
        // box.checkCollisions = true;
        // sphere.checkCollisions = true;

        return scene;
    };

    // call the createScene function
    scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});

// text = newMeshes[0];
// text.material = new BABYLON.StandardMaterial("skull", scene);
// text.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
// text.position.x = -500;