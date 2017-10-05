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




// Mouse Exit
// pickup.actionManager.registerAction(new BABYLON.ExecuteCodeAction(BABYLON.ActionManager.OnPointerOutTrigger, function(ev) {
//     ev.meshUnderPointer.material.emissiveColor = BABYLON.Color3.Yellow();
// }));