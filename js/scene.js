let scene, camera, ground, box, light0, dummy;
let pickup, green, red, yellow, blue, purple;
let controls = {};
controls.q = false;
controls.e = false;
controls.w = false;
controls.s = false;
controls.space = false;


let createScene = function() {

    // Scene
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -9.81, 0), new BABYLON.OimoJSPlugin());
    scene.collisionsEnabled = true;
    scene.clearColor = BABYLON.Color3.Black();

    // Camera
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.6, -30), scene);
    camera.rotationQuaternion = new BABYLON.Quaternion();
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;

    // Ellipsoid on Camera
    camera.ellipsoid = new BABYLON.Vector3(1.3, 1.3, 1.3);

    // Lighting
    light0 = new BABYLON.HemisphericLight('light0', new BABYLON.Vector3(0, 10, 0), scene);

    // Basic Colors
    green = new BABYLON.StandardMaterial("green", scene);
    green.diffuseColor = new BABYLON.Color3(0, 1, 0);

    red = new BABYLON.StandardMaterial("red", scene);
    red.diffuseColor = new BABYLON.Color3(1, 0, 0);

    blue = new BABYLON.StandardMaterial("blue", scene);
    blue.diffuseColor = new BABYLON.Color3(0, 0, 1);

    purple = new BABYLON.StandardMaterial("purple", scene);
    purple.diffuseColor = new BABYLON.Color3(1, 0, 1);

    yellow = new BABYLON.StandardMaterial("yellow", scene);
    yellow.diffuseColor = new BABYLON.Color3(1, 1, 0);

    // Ground
    ground = BABYLON.Mesh.CreatePlane("ground", 75.0, scene);
    ground.material = new BABYLON.StandardMaterial("white", scene);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);

    //dummy
    dummy = new BABYLON.Mesh("dummy", scene);
    dummy.rotationQuaternion = new BABYLON.Quaternion();

    // Grabbable Object
    pickup = BABYLON.Mesh.CreateBox("hover", 1, scene);
    pickup.material = red;
    pickup.position.set(0, 2, -18);
    pickup.checkCollisions = true;
    pickup.actionManager = new BABYLON.ActionManager(scene);
    pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    for (let i = 0; i < 5; i++) {
        box = BABYLON.Mesh.CreateBox("box" + 1, 1, scene);
        box.material = new BABYLON.StandardMaterial("boxMat", scene);
        box.material.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
        box.position.set(0, i, 0);
        box.checkCollisions = true;
        box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    }

    // Pick Up Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
        pickup.material = green;
        pickup.isPicked = true;

    }));

    // Release Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
        pickup.material = red;
        pickup.isPicked = false;
        // Without conditionals upon release it'll fall straight down, could be useful in a type of puzzle game?
        if (controls.space) {
            pickup.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);
        }
    }));

    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        pickup.material = yellow;
        pickup.isPicked = false;
        if (controls.space) {
            pickup.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);
        }
    }));

    //Distance from the camera (Z-axis/direction)
    scene.registerBeforeRender(function() {
        let distanceFromCamera = 6;
        if (pickup.isPicked) {
            if (controls.q) {
                pickup.addRotation(0, 0.04, 0);
            }
            if (controls.e) {
                pickup.addRotation(0, -0.04, 0);
            }
            if (controls.w) {
                pickup.addRotation(0.04, 0, 0);
            }
            if (controls.s) {
                pickup.addRotation(-0.04, 0, 0);
            }

            //Clone of the camera's quaternion
            let cameraQuaternion = camera.rotationQuaternion.clone();
            //Vector3 (Z-axis/direction)
            let directionVector = new BABYLON.Vector3(0, 0, distanceFromCamera);
            //Quaternion/Vector3 multiplication.
            let rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);
            //New position based on camera position and direction vector
            dummy.position.set(camera.position.x + rotationVector.x, camera.position.y + rotationVector.y, camera.position.z + rotationVector.z);
            let velocityDirectionVector = dummy.position.subtract(pickup.position);
            pickup.physicsImpostor._physicsBody.linearVelocity.set(velocityDirectionVector.x * 10, velocityDirectionVector.y * 10, velocityDirectionVector.z * 10);
            pickup.physicsImpostor._physicsBody.angularVelocity.set(0, 0, 0);

            // Enabling this line breaks rotation but makes the object look at the player.
            // pickup.rotationQuaternion = camera.rotationQuaternion.clone();

            // Throw the object!
            if (controls.space) {
                pickup.physicsImpostor._physicsBody.linearVelocity.set(rotationVector.x, 8, rotationVector.z);
                pickup.material = purple;
                pickup.isPicked = false;
            }
        }
    });

    return scene;
};

/*global BABYLON*/
/*global engine*/
/*global canvas*/
/*global multiplyQuaternionByVector*/
