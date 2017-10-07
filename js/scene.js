let scene, camera;
let ground, light0;
let pickup, grid, green, red, yellow, blue;
let controls = {};
controls.q = false;
controls.e = false;
controls.w = false;
controls.s = false;

let createScene = function() {

    // Scene
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    scene.collisionsEnabled = true;
    scene.clearColor = BABYLON.Color3.Black();
    
    // Fog
    scene.fogMode = BABYLON.Scene.FOGMODE_LINEAR;
    scene.fogColor = BABYLON.Color3.Black();
    scene.fogDensity = 0.01;
    scene.fogStart = 0;
    scene.fogEnd = 40.0;

    // Camera
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.6, -30), scene);
    camera.rotationQuaternion = new BABYLON.Quaternion();
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.ellipsoid = new BABYLON.Vector3(1.3, 1.3, 1.3);
    camera.speed = 0.2;

    light0 = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 10, 0), scene);
    light0.intensity = 2;

    /*
    Materials
    */

    // Grid Material
    grid = new BABYLON.GridMaterial("grid", scene);
    grid.gridRatio = 1;
    grid.majorUnitFrequency = 5;
    grid.mainColor = new BABYLON.Color3(0, 0, 0);
    grid.lineColor = new BABYLON.Color3(1, 1, 1);

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
    ground = BABYLON.Mesh.CreatePlane("ground", 100.0, scene);
    ground.material = grid;
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);

    //dummy
    var dummy = new BABYLON.Mesh("dummy", scene);
    dummy.rotationQuaternion = new BABYLON.Quaternion();

    // Grabbable Object
    pickup = BABYLON.Mesh.CreateBox("hover", 1, scene);
    pickup.material = green;
    pickup.position.set(0, 2, -18);
    pickup.checkCollisions = true;
    pickup.actionManager = new BABYLON.ActionManager(scene);
    pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 5, restitution: 0.1, friction: 0.2 }, scene);


    for (var i = 0; i < 10; i++) {
        var box = BABYLON.Mesh.CreateBox("box" + 1, 1, scene);
        box.material = new BABYLON.StandardMaterial("boxMat", scene);
        box.material.diffuseColor = new BABYLON.Color3(1, 1, 1);
        box.position.set(i + i * 0.3, 2, -18);
        box.checkCollisions = true;
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);
    }

    // Pick Up Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
        pickup.material = green;
        distanceFromCamera = BABYLON.Vector3.Distance(pickup.position, camera.position);
        pickup.isPicked = true;

    }));

    // Release Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
        pickup.material = red;
        pickup.isPicked = false;
        pickup.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);

    }));

    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        pickup.material = yellow;
        pickup.isPicked = false;
        pickup.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);

    }));
    
    scene.registerBeforeRender(function(){
        var distanceFromCamera = 6;
        if(pickup.isPicked){
            if(controls.q){
                pickup.addRotation(0,0.04,0);
            }
            if(controls.e){
                pickup.addRotation(0,-0.04,0);
            }
            if(controls.w){
                pickup.addRotation(0.04,0,0);
            }
            if(controls.s){
                pickup.addRotation(-0.04,0,0);
            }

            //Clone of the camera's quaternion
            var cameraQuaternion = camera.rotationQuaternion.clone();
            //Vector3 (Z-axis/direction)
            var directionVector = new BABYLON.Vector3(0,0,distanceFromCamera); 
            //Quaternion/Vector3 multiplication. Function shamelessly stolen from CannonJS's Quaternion class 
            var rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);
            //New position based on camera position and direction vector
            dummy.position.set(camera.position.x + rotationVector.x, camera.position.y + rotationVector.y, camera.position.z + rotationVector.z);
            var pos = dummy.position.subtract(pickup.position);
            pickup.physicsImpostor._physicsBody.linearVelocity.set(pos.x*10,pos.y*10,pos.z*10);
            pickup.physicsImpostor._physicsBody.angularVelocity.set(0,0,0);
         }
    });

    return scene;
};

/*global BABYLON*/
/*global engine*/
/*global canvas*/
/*global multiplyQuaternionByVector*/