let canvas, engine;

/*global BABYLON*/

// Initialize Canvas Render
window.addEventListener('DOMContentLoaded', function() {
    canvas = document.getElementById('renderCanvas');
    engine = new BABYLON.Engine(canvas, true);

    createScene();

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

// Keyboard Controls
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

// schteppe.github.io/cannon.js/docs/classes/Quaternion.html
function multiplyQuaternionByVector(quaternion, vector) {
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

}

/*global scene*/
/*global controls*/
/*global createScene*/