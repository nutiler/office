let scene, camera, loader, createScene;
let ground, sphere, box, light0, light1, light2;
let hover, pickup, clickable, click, grid, green, red, yellow, blue;

/*global BABYLON*/

createScene = function() {
    BABYLON.OBJFileLoader.OPTIMIZE_WITH_UV = true;
    BABYLON.SceneLoader.ShowLoadingScreen = false;

    // Scene
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    scene.gravity = new BABYLON.Vector3(0, -0.981, 0); //un
    scene.collisionsEnabled = true;
    scene.clearColor = BABYLON.Color3.White();

    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = BABYLON.Color3.White();
    scene.fogDensity = 0.01;
    scene.fogStart = 20.0;
    scene.fogEnd = 60.0;

    // Camera
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.6, -30), scene);
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

    /*
    Materials
    */

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

    blue = new BABYLON.StandardMaterial("blue", scene);
    blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

    yellow = new BABYLON.StandardMaterial("yellow", scene);
    yellow.diffuseColor = new BABYLON.Color3(1, 1, 0);

    /*
    Mesh Objects
    */


    // Ground
    ground = BABYLON.Mesh.CreatePlane("ground", 200.0, scene);
    ground.material = grid;
    // ground.position = new BABYLON.Vector3(0, 0, 0);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);


    // Sphere
    sphere = BABYLON.Mesh.CreateSphere("sphere", 16, 2, scene);
    sphere.position.y = 2;
    sphere.actionManager = new BABYLON.ActionManager(scene);
    sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 3, restitution: 0.9 }, scene);


    // Load Coffee Object
    BABYLON.SceneLoader.ImportMesh("", "./assets/models/coffee/", "coffee.obj", scene, function(newMeshes) {
        newMeshes.forEach(function(coffee) {
            coffee.checkCollisions = true;
            coffee.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: 1, restitution: 0.9 }, scene);
            // coffee.parent = camera;
            coffee.position.set(0, 1, -4);
        });
    });


    // On Click Event
    click = BABYLON.Mesh.CreateBox("hover", 0.1, scene);
    click.material = yellow;
    click.position = new BABYLON.Vector3(0, 0, -0.1);
    click.checkCollisions = true;

    //When pointer down event is raised
    scene.onPointerDown = function(evt, pickResult) {
        if (pickResult.hit) {
            click.position.x = pickResult.pickedPoint.x;
            click.position.y = pickResult.pickedPoint.y + 0.1;
            click.position.z = pickResult.pickedPoint.z;
        }
    };

    // Hover Events
    hover = BABYLON.Mesh.CreateBox("hover", 4, scene);
    hover.material = new BABYLON.StandardMaterial("texture", scene);
    hover.position.set(-18, 2, -18);
    hover.isPickable = true;
    hover.actionManager = new BABYLON.ActionManager(scene);
    hover.checkCollisions = true;

    // Mouse Enter
    hover.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOverTrigger, function(ev) {
        ev.meshUnderPointer.material.emissiveColor = BABYLON.Color3.Red();
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
        ev.meshUnderPointer.material = blue;
    }));


    // Grabbable Object
    pickup = BABYLON.Mesh.CreateBox("hover", 1, scene);
    pickup.material = new BABYLON.StandardMaterial("texture", scene);
    pickup.position.set(0, 2, -18);
    // pickup.checkCollisions = true;
    pickup.actionManager = new BABYLON.ActionManager(scene);
    pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    // Pick Up Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
        pickup.material = green;
        pickup.parent = camera;
        pickup.position.set(0, 0, 4);
        pickup.physicsImpostor.dispose();

    }));

    // Release Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
        pickup.material = red;
        pickup.setParent(null);
        pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    }));

    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        pickup.material = blue;
        pickup.setParent(null);
        pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    }));

    return scene;
};