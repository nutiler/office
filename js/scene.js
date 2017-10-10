let scene, camera, controls = {};
let ground, box, lightSky, posHelper, pickup;
let grid, green, red, yellow, blue, purple;

// controls.q = false;
// controls.e = false;
// controls.w = false;
// controls.s = false;
// controls.space = false;

let createScene = function() {

    // Initialize Scene.
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    scene.collisionsEnabled = true;
    scene.clearColor = BABYLON.Color3.White();

    // First Person Camera.
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.6, -30), scene);
    camera.rotationQuaternion = new BABYLON.Quaternion();
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.5;
    camera.ellipsoid = new BABYLON.Vector3(1.3, 1.3, 1.3);

    // Fog.
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = BABYLON.Color3.White();
    scene.fogDensity = 0.01;
    scene.fogStart = 20.0;
    scene.fogEnd = 60.0;

    // Lighting.
    lightSky = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 10, 0), scene);
    lightSky.intensity = 1.0;

    /* ==================
          Materials
    =================== */

    // Grid Material.
    grid = new BABYLON.GridMaterial("grid", scene);
    grid.gridRatio = 2;
    grid.majorUnitFrequency = 5;
    grid.mainColor = new BABYLON.Color3(1, 1, 1);
    grid.lineColor = new BABYLON.Color3(0, 0, 0);


    // Basic Color Materials.
    red = new BABYLON.StandardMaterial("red", scene);
    red.diffuseColor = new BABYLON.Color3(1, 0, 0);

    yellow = new BABYLON.StandardMaterial("yellow", scene);
    yellow.diffuseColor = new BABYLON.Color3(1, 1, 0);

    green = new BABYLON.StandardMaterial("green", scene);
    green.diffuseColor = new BABYLON.Color3(0, 1, 0);

    blue = new BABYLON.StandardMaterial("blue", scene);
    blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

    purple = new BABYLON.StandardMaterial("purple", scene);
    purple.diffuseColor = new BABYLON.Color3(1, 0, 1);

    /* ==================
           Objects
    =================== */

    // Ground.
    ground = BABYLON.Mesh.CreatePlane("ground", 200.0, scene);
    ground.material = grid;
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);

    // Position Helper.
    posHelper = new BABYLON.Mesh("posHelper", scene);
    posHelper.rotationQuaternion = new BABYLON.Quaternion();


    // Grabbable Object
    pickup = BABYLON.Mesh.CreateBox("hover", 1, scene);
    pickup.material = red;
    pickup.position.set(0, 2, -18);
    pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);
    setupInteract(pickup);


    // Boxes
    for (let i = 0; i < 5; i++) {
        box = BABYLON.Mesh.CreateBox("box" + 1, 1, scene);
        box.material = new BABYLON.StandardMaterial("boxMat", scene);
        box.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        box.position.set(0, i, 0);
        box.checkCollisions = true;
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);
    }

    /* ==================
            Pre-Render
    =================== */
    
    scene.registerBeforeRender(function() {
        
        makeInteract(pickup);

    });

    return scene;

};

/*global BABYLON, engine, canvas*/
/*global setupInteract, makeInteract*/
