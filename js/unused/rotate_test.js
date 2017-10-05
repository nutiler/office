let canvas, engine, scene, camera, loader;
let ground, sphere, box, light0, light1, light2, grid;
let createScene;

/*global BABYLON*/

window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);


    var dragPlane;
    var sphere;
    var previousMouseCoordinates;
    var currentMouseCoordinates;
    var observerPointerDown;
    var observerPointerMove;
    var observerPointerUp;
    var sphereCenter;

    var createScene = function() {

        // This creates a basic Babylon Scene object (non-mesh)
        var scene = new BABYLON.Scene(engine);

        // This creates and positions a free camera (non-mesh)
        var camera = new BABYLON.FreeCamera("camera1", new BABYLON.Vector3(0, 0, -10), scene);

        // This targets the camera to scene origin
        camera.setTarget(BABYLON.Vector3.Zero());

        // This creates a light, aiming 0,1,0 - to the sky (non-mesh)
        var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);

        // Default intensity is 1. Let's dim the light a small amount
        // light.intensity = 0.7;

        // // Our built-in 'sphere' shape. Params: name, subdivs, size, scene
        // sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 2, scene);
        // sphere.material = new BABYLON.StandardMaterial("texture1", scene);
        // sphere.material.diffuseTexture = new BABYLON.Texture("textures/rock.png", scene);

        // Load Coffee Object
        BABYLON.SceneLoader.ImportMesh("", "./assets/models/coffee/", "coffee.obj", scene, function(newMeshes) {
            newMeshes.forEach(function(sphere) {
                sphere.position.set(0,0,0)
                sphere.scaling = new BABYLON.Vector3(5,5,5);
                // sphere.checkCollisions = true;
                // coffee.position.z = -4;
                // coffee.position.y = 1.5;
                // sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
                // coffee.parent = camera;
                // coffee.position.set(0, 0, 2)

                var sphereAbsPos = sphere.getAbsolutePosition();
                var sphereBoundingBox = sphere.getBoundingInfo().boundingBox;
                var sphereHeight = sphereBoundingBox.vectorsWorld[1].y - sphereBoundingBox.vectorsWorld[0].y;
                sphereCenter = sphereBoundingBox.center;

                dragPlane = new BABYLON.MeshBuilder.CreatePlane("dragPlane", { size: 3 });
                dragPlane.visibility = .2;
                dragPlane.setAbsolutePosition(new BABYLON.Vector3(
                    sphereAbsPos.x, sphereAbsPos.y, (sphereAbsPos.z - sphereHeight)
                ));

                dragPlane.actionManager = new BABYLON.ActionManager(scene);
                dragPlane.actionManager.registerAction(new BABYLON.ExecuteCodeAction({
                    trigger: BABYLON.ActionManager.OnPickDownTrigger,
                    parameter: dragPlane
                }, function(e) {
                    onDragPlaneEvent(e);
                }));

                var onDragPlaneEvent = function(e) {
                    switch (e.sourceEvent.type) {
                        case "pointerdown":
                            var pickInfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) { return mesh === dragPlane; });
                            if (pickInfo.hit) {
                                previousMouseCoordinates = getGroundPosition(e);
                            }
                            observerPointerMove = scene.onPointerObservable.add(moveTarget, BABYLON.PointerEventTypes.POINTERMOVE);
                            observerPointerUp = scene.onPointerObservable.add(reset, BABYLON.PointerEventTypes.POINTERUP);

                            break;
                    }
                }
                var getGroundPosition = function(e) {
                    // Use a predicate to get position on the ground
                    var pickinfo = scene.pick(scene.pointerX, scene.pointerY, function(mesh) { return mesh == dragPlane; });
                    if (pickinfo.hit) {
                        return pickinfo.pickedPoint;
                    }
                    return null;
                }
                var moveTarget = function(e) {
                    var diff;
                    var newPos = new BABYLON.Vector3(0, 0, 0);

                    if (!previousMouseCoordinates) {
                        return;
                    }

                    currentMouseCoordinates = getGroundPosition();

                    if (!currentMouseCoordinates) {
                        return;
                    }

                    diff = currentMouseCoordinates.subtract(previousMouseCoordinates);

                    newPos.x = sphereCenter.x + diff.x;
                    newPos.y = sphereCenter.y + diff.y;

                    sphere.rotate(BABYLON.Axis.Y, -newPos.x, BABYLON.Space.WORLD);
                    sphere.rotate(BABYLON.Axis.X, newPos.y, BABYLON.Space.WORLD);

                    previousMouseCoordinates = currentMouseCoordinates;
                }
                var reset = function(e) {
                    //this._scene.onPointerObservable.remove(this._observerPointerDown);
                    scene.onPointerObservable.remove(observerPointerUp);
                    scene.onPointerObservable.remove(observerPointerMove);
                }
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