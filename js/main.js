let canvas, engine;

// Initialize Canvas Render.
window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

    createScene();

    // Render Loop for Scene.
    scene = createScene();
    engine.runRenderLoop(function() {
        scene.render();
    });

    // Resize the scene on Window Change.
    window.addEventListener('resize', function() {
        engine.resize();
    });

});



// Open Debug Menu
document.getElementById('settings').addEventListener('click', function(e) {
    scene.debugLayer.show({
        popup: false,
        initialTab: 2,
        newColors: {
            backgroundColor: '#eee',
            backgroundColorLighter: '#fff',
            backgroundColorLighter2: '#fff',
            backgroundColorLighter3: '#fff',
            color: '#333',
            colorTop: 'red',
            colorBottom: 'blue'
        }
    });
}, false);



// Keyboard Controls.
document.addEventListener("keydown", keyHandlerDown);
document.addEventListener("keyup", keyHandlerUp);

function keyHandlerDown(event) {
    if (event.key === "q" && !controls.q) {
        controls.q = true;
    }
    if (event.key === "e" && !controls.e) {
        controls.e = true;
    }
    if (event.key === "w" && !controls.w) {
        controls.w = true;
    }
    if (event.key === "s" && !controls.s) {
        controls.s = true;
    }
    if (event.key === " " && !controls.space) {
        controls.space = true;
    }
}

function keyHandlerUp(event) {
    if (event.key === "q" && controls.q) {
        controls.q = false;
    }
    if (event.key === "e" && controls.e) {
        controls.e = false;
    }
    if (event.key === "w" && controls.w) {
        controls.w = false;
    }
    if (event.key === "s" && controls.s) {
        controls.s = false;
    }
    if (event.key === " " && controls.space) {
        controls.space = false;
    }
}



// ActionManager and Properties setup for mesh.
let setupInteract = function(mesh) {

    // Initialize mesh properties.
    mesh.isPicked = false;
    mesh.checkCollisions = true;
    mesh.actionManager = new BABYLON.ActionManager(scene);

    // Allow Object to be Clicked.
    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickDownTrigger, function(ev) {
        mesh.material = green;
        mesh.isPicked = true;

    }));

    // Release Object triggers.
    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickUpTrigger, function(ev) {
        mesh.material = red;
        mesh.isPicked = false;
        // Without conditionals upon release it'll fall straight down, could be useful in a type of puzzle game?
        if (controls.space) {
            mesh.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);
        }
    }));

    mesh.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPickOutTrigger, function(ev) {
        mesh.material = yellow;
        mesh.isPicked = false;
        if (controls.space) {
            mesh.physicsImpostor._physicsBody.linearVelocity.set(0, 0, 0);
        }
    }));

    console.log("hi");
};



// Interact with the object when selected.
let cameraQuaternion, directionVector, rotationVector, velocityDirectionVector;
let distanceFromCamera = 1; // Distance from the camera (Z-axis/direction).

let makeInteract = function(mesh) {

    if (mesh.isPicked) {

        // Rotate the mesh.
        if (controls.q) {
            mesh.addRotation(0, 0.04, 0);
        }
        if (controls.e) {
            mesh.addRotation(0, -0.04, 0);
        }
        if (controls.w) {
            mesh.addRotation(0.04, 0, 0);
        }
        if (controls.s) {
            mesh.addRotation(-0.04, 0, 0);
        }

        // Clone of the camera's quaternion.
        cameraQuaternion = camera.rotationQuaternion.clone();

        // Vector3 (Z-axis/direction).
        directionVector = new BABYLON.Vector3(0, 0, distanceFromCamera);

        // Quaternion/Vector3 multiplication.
        rotationVector = multiplyQuaternionByVector(cameraQuaternion, directionVector);

        // New position based on camera position and direction vector.
        posHelper.position.set(camera.position.x + rotationVector.x, camera.position.y + rotationVector.y, camera.position.z + rotationVector.z);
        velocityDirectionVector = posHelper.position.subtract(mesh.position);
        mesh.physicsImpostor._physicsBody.linearVelocity.set(velocityDirectionVector.x * 10, velocityDirectionVector.y * 10, velocityDirectionVector.z * 10);
        mesh.physicsImpostor._physicsBody.angularVelocity.set(0, 0, 0);

        // Enabling this line breaks rotation but makes the object look at the player.
        // mesh.rotationQuaternion = camera.rotationQuaternion.clone();

        if (controls.space) {
            mesh.physicsImpostor._physicsBody.linearVelocity.set(rotationVector.x, 8, rotationVector.z);
            mesh.material = purple;
            mesh.isPicked = false;
        }
    }

};




// schteppe.github.io/cannon.js/docs/classes/Quaternion.html
let multiplyQuaternionByVector = function(quaternion, vector) {

    var target = new BABYLON.Vector3();
    var x = vector.x,
        y = vector.y,
        z = vector.z;

    var qx = quaternion.x,
        qy = quaternion.y,
        qz = quaternion.z,
        qw = quaternion.w;

    // q*v
    var ix = qw * x + qy * z - qz * y,
        iy = qw * y + qz * x - qx * z,
        iz = qw * z + qx * y - qy * x,
        iw = -qx * x - qy * y - qz * z;

    target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy;
    target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz;
    target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx;

    return target;

};

/*global BABYLON, scene, camera, controls, posHelper, createScene*/
