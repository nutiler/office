let canvas, engine;

/*global BABYLON*/

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

document.getElementById('settings').addEventListener('click', function(e) {
    scene.debugLayer.show({
        popup: false,
        initialTab: 2,
        parentElement: document.getElementById('#mydiv'),
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