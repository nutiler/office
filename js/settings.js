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