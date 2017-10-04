let canvas, engine, scene, camera, loader;
let ground, sphere, box, light0, light1, light2;
let hover, clickable, click, grid, green, red, yellow;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    // Setup for Scene
    createScene = function() {

        BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
        BABYLON.SceneLoader.ShowLoadingScreen = false;

        // Scene
        scene = new BABYLON.Scene(engine);
        scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
        scene.gravity = new BABYLON.Vector3(0, -0.981, 0); //un
        scene.collisionsEnabled = true;
        scene.clearColor = BABYLON.Color3.Black();


        // Camera
        camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2, -30), scene);
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.applyGravity = true;
        camera.speed = 0.5;

        // WASD Camera Controls
        camera.keysUp.push(87);
        camera.keysLeft.push(65);
        camera.keysDown.push(83);
        camera.keysRight.push(68);

        // Ellipsoid on Camera
        camera.ellipsoid = new BABYLON.Vector3(1.3, 1.3, 1.3);


        // Lighting
        light0 = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 10, 0), scene);
        light0.intensity = 1.5;


        // Grid Material
        grid = new BABYLON.GridMaterial("grid", scene);
        grid.gridRatio = 1;
        grid.majorUnitFrequency = 5;
        grid.mainColor = new BABYLON.Color3(0, 0, 0);
        grid.lineColor = new BABYLON.Color3(0.5, 1, 1);

        // Basic Colors
        green = new BABYLON.StandardMaterial("green", scene);
        green.diffuseColor = new BABYLON.Color3(0, 1, 0);

        red = new BABYLON.StandardMaterial("red", scene);
        red.diffuseColor = new BABYLON.Color3(1, 0, 0);

        yellow = new BABYLON.StandardMaterial("yellow", scene);
        yellow.diffuseColor = new BABYLON.Color3(0, 0, 1);


        // Ground
        ground = BABYLON.Mesh.CreatePlane("ground", 200.0, scene);
        ground.material = grid;
        // ground.position = new BABYLON.Vector3(0, 0, 0);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        ground.checkCollisions = true;


        // Sphere
        sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
        sphere.position.y = 2;


        // Apply Physics
        sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 3, restitution: 0.9 }, scene);
        ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);


        // Load Coffee Object
        // BABYLON.SceneLoader.ImportMesh("", "./assets/models/coffee/", "coffee.obj", scene, function(newMeshes) {
        //     newMeshes.forEach(function(coffee) {
        //         coffee.checkCollisions = true;
        //         coffee.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
        //         coffee.parent = camera;
        //         coffee.position.set(0, 0, 2);
        //     });
        // });


        // // On Click Event
        // click = BABYLON.Mesh.CreateBox("hover", 1, scene);
        // click.material = new BABYLON.StandardMaterial("texture", scene);
        // click.position = new BABYLON.Vector3(0, 0, -0.1);
        // click.checkCollisions = true;

        // //When pointer down event is raised
        // scene.onPointerDown = function(evt, pickResult) {
        //     if (pickResult.hit) {
        //         click.position.x = pickResult.pickedPoint.x;
        //         click.position.y = pickResult.pickedPoint.y + 1;
        //         click.position.z = pickResult.pickedPoint.z;
        //     }
        // };


        // Hover Events
        hover = BABYLON.Mesh.CreateBox("hover", 4, scene);
        hover.material = new BABYLON.StandardMaterial("texture", scene);
        hover.position.set(-18, 2, -18);
        hover.isPickable = true;
        hover.actionManager = new BABYLON.ActionManager(scene);
        hover.checkCollisions = true;

        // Mouse Enter
        hover.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev) {
            ev.meshUnderPointer.material.emissiveColor = BABYLON.Color3.Blue();
        }));

        // Mouse Exit
        hover.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev) {
            ev.meshUnderPointer.material.emissiveColor = BABYLON.Color3.Black();
        }));


        // Clickable Events
        clickable = BABYLON.Mesh.CreateBox("hover", 4, scene);
        clickable.material = new BABYLON.StandardMaterial("texture", scene);
        clickable.position.set(-8, 2, -18);
        clickable.checkCollisions = true;
        clickable.actionManager = new BABYLON.ActionManager(scene);

        // On Click
        clickable.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickTrigger, function(ev) {
            ev.meshUnderPointer.material = green;
        }));


        // Grabbable Object
        pickup = BABYLON.Mesh.CreateBox("hover", 1, scene);
        pickup.material = new BABYLON.StandardMaterial("texture", scene);
        pickup.position.set(0, 2, -18);
        pickup.checkCollisions = true;
        pickup.actionManager = new BABYLON.ActionManager(scene);

        // Pick Up Object
        pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
            ev.meshUnderPointer.material = green;
            ev.meshUnderPointer.parent = camera;
            ev.meshUnderPointer.position.set(0, 0, 4);
        }));

        // Release Object
        pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
            ev.meshUnderPointer.material = red;
            ev.meshUnderPointer.setParent(null);
        }));

        // Mouse Exit
        // pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev) {
        //     ev.meshUnderPointer.material.emissiveColor = BABYLON.Color3.Yellow();
        // }));


        // pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        //     console.log(ev)
        //     ev.meshUnderPointer.material = yellow;
        //     // ev.meshUnderPointer.parent = ev.meshUnderPointer;
        //     ev.meshUnderPointer.position.set(0, 0, 4);
        // }));


        return scene;
    };


    // Render Loop for Scene
    scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the scene on Window Change
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


// // Events Drag'n'Drop
// var startingPoint;
// var currentMesh;

// var getGroundPosition = function() {
//     // Use a predicate to get position on the ground
//     var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) { return mesh == ground; });
//     if (pickinfo.hit) {
//         return pickinfo.pickedPoint;
//     }

//     return null;
// }

// var onPointerDown = function(evt) {
//     if (evt.button !== 0) {
//         return;
//     }

//     // check if we are under a mesh
//     var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) { return (mesh !== ground && !mesh.name.startsWith("struct")); });
//     if (pickInfo.hit) {
//         currentMesh = pickInfo.pickedMesh;
//         startingPoint = getGroundPosition(evt);

//         if (startingPoint) { // we need to disconnect camera from canvas
//             setTimeout(function() {
//                 //   camera.detachControl(canvas);
//             }, 0);
//         }
//     }
// }

// var onPointerUp = function() {
//     if (startingPoint) {
//         //   camera.attachControl(canvas, true);
//         startingPoint = null;
//         return;
//     }
// }

// var onPointerMove = function(evt) {
//     if (!startingPoint) {
//         return;
//     }

//     var current = getGroundPosition(evt);

//     if (!current) {
//         return;
//     }

//     var diff = current.subtract(startingPoint);
//     //currentMesh.position.addInPlace(diff);
//     currentMesh.moveWithCollisions(diff);

//     startingPoint = current;

// }

// canvas.addEventListener("pointerdown", onPointerDown, false);
// canvas.addEventListener("pointerup", onPointerUp, false);
// canvas.addEventListener("pointermove", onPointerMove, false);

// scene.onDispose = function() {
//     canvas.removeEventListener("pointerdown", onPointerDown);
//     canvas.removeEventListener("pointerup", onPointerUp);
//     canvas.removeEventListener("pointermove", onPointerMove);
// }