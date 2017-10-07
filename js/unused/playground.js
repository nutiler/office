let scene, camera;
let ground, light0;
let pickup, green, red, yellow, blue, purple, box;
var controls = [
    q = false,
    e = false,
    w = false,
    s = false
];

var createScene = function() {

    // Scene
    scene = new BABYLON.Scene(engine);
    scene.enablePhysics(new BABYLON.Vector3(0, -90.81, 0), new BABYLON.OimoJSPlugin());
    scene.collisionsEnabled = true;
    scene.clearColor = BABYLON.Color3.Black();

    // Camera
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 2.6, -10), scene);
    camera.rotationQuaternion = new BABYLON.Quaternion();
    camera.attachControl(canvas, true);
    camera.checkCollisions = true;
    camera.applyGravity = true;
    camera.speed = 0.4;
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
    ground.material = new BABYLON.StandardMaterial("texture", scene);
    ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    ground.checkCollisions = true;
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);

    // Center Box
    box = BABYLON.Mesh.CreateBox("box", 4, scene);
    box.material = blue;
    box.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
    box.checkCollisions = true;
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.9 }, scene);

    // Grabbable Object
    pickup = BABYLON.Mesh.CreateBox("pickup", 1, scene);
    pickup.material = new BABYLON.StandardMaterial("texture", scene);
    pickup.position.set(0, 10, 0);
    pickup.checkCollisions = true;
    pickup.actionManager = new BABYLON.ActionManager(scene);
    pickup.physicsImpostor = new BABYLON.PhysicsImpostor(pickup, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 3, restitution: 0.1, friction: 0.2 }, scene);

    // Pick Up Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
        pickup.material = green;
        pickup.isPicked = true;
        pickup.billboardMode = BABYLON.Mesh.BILLBOARDMODE_ALL;
    }));

    // Release Object
    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
        pickup.material = red;
        pickup.isPicked = false;
        pickup.physicsImpostor._physicsBody.linearVelocity.set(0,0,0);
        pickup.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE; 
    }));

    pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        pickup.material = yellow;
        pickup.isPicked = false;
        pickup.physicsImpostor._physicsBody.linearVelocity.set(0,0,0);
        pickup.billboardMode = BABYLON.Mesh.BILLBOARDMODE_NONE;

    }));

    // Detect when the block is trying to go inside... like a bad physics object.
    scene.registerBeforeRender(function () {
        if (pickup.intersectsMesh(box, false)) {
            pickup.material = purple;
        } else {
            pickup.material = green;
        }
    });
        
    //Distance from the camera (Z-axis/direction)
    var distanceFromCamera = 6;
    scene.registerBeforeRender(function(){
        if(pickup.isPicked){
            if(controls.q){
                pickup.addRotation(0,0.04,0);
            }
            if(controls.e){
                pickup.addRotation(0,-0.04,0);
            }
            if(controls.w){
                distanceFromCamera += 0.05;
            }
            if(controls.s){
                distanceFromCamera -= 0.05;
            }

            //Clone of the camera's quaternion
            var cameraQuaternion = camera.rotationQuaternion.clone();
            //Vector3 (Z-axis/direction)
            var directionVector = new BABYLON.Vector3(0,0,distanceFromCamera); 
            //Quaternion/Vector3 multiplication. Function shamelessly stolen from CannonJS's Quaternion class 
            var rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);
            //New position based on camera position and direction vector
            pickup.position.set(camera.position.x + rotationVector.x, camera.position.y + rotationVector.y, camera.position.z + rotationVector.z);
         }
    });

    function multiplyQuaternionByVector(quaternion, vector){
    var target = new BABYLON.Vector3();

    var x = vector.x,
        y = vector.y,
        z = vector.z;
 
    var qx = quaternion.x,
        qy = quaternion.y,
        qz = quaternion.z,
        qw = quaternion.w;
 
    // q*v
    var ix =  qw * x + qy * z - qz * y,
    iy =  qw * y + qz * x - qx * z,
    iz =  qw * z + qx * y - qy * x,
    iw = -qx * x - qy * y - qz * z;
 
    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;
 
    return target;


 };

    return scene;
};

document.addEventListener("keydown", keyHandlerDown);
document.addEventListener("keyup", keyHandlerUp);

function keyHandlerDown(event){
    if(event.key === "q" && !controls.q){
        controls.q = true;
    } 
    if(event.key === "e" && !controls.e){
        controls.e = true;
    } 
    if(event.key === "w" && !controls.w){
        controls.w = true;
    } 
    if(event.key === "s" && !controls.s){
        controls.s = true;
    } 
 }

 function keyHandlerUp(event){
    if(event.key === "q" && controls.q){
        controls.q = false;
    } 
    if(event.key === "e" && controls.e){
        controls.e = false;
    } 
    if(event.key === "w" && controls.w){
        controls.w = false;
    } 
    if(event.key === "s" && controls.s){
        controls.s = false;
    } 
 }