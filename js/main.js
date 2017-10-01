let canvas, engine, scene, camera, light, loader;
let ground, sphere;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    createScene = function() {
        scene = new BABYLON.Scene(engine);
        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;

        // create a FreeCamera, and set its position to (x:0, y:5, z:-10)
        camera = new BABYLON.FreeCamera('camera1', new BABYLON.Vector3(0, 5, -10), scene);
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, false);

        // create a basic light, aiming 0,1,0 - meaning, to the sky
        light = new BABYLON.HemisphericLight('light1', new BABYLON.Vector3(0, 1, 0), scene);

        // create a built-in "sphere" shape; its constructor takes 5 params: name, width, depth, subdivisions, scene
        sphere = BABYLON.Mesh.CreateSphere('sphere1', 16, 2, scene);
        sphere.position.y = 1;

        loader = new BABYLON.AssetsManager(scene);
        loader.addMeshTask("name", "", "./assets/models/", "office_with_objects.obj");
        loader.load();

        // var text;
        // BABYLON.SceneLoader.ImportMesh("", "./models/", "office_with_objects.obj", scene, function(newMeshes) {
        //     // text = newMeshes[0];
        //     // text.material = new BABYLON.StandardMaterial("skull", scene);
        //     // text.material.diffuseColor = new BABYLON.Color3(0, 1, 0);
        //     // text.position.x = -500;
        // });

        // create a built-in "ground" shape; its constructor takes the same 5 params as the sphere's one
        ground = BABYLON.Mesh.CreateGround('ground1', 6, 6, 2, scene);

        // return the created scene
        return scene;
    }

    // call the createScene function
    scene = createScene();

    engine.runRenderLoop(function() {
        scene.render();
    });

    window.addEventListener('resize', function() {
        engine.resize();
    });
});