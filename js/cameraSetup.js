const createCamera = (scene, canvas, cameraAngle, cameraZoom, cameraXasis, cameraYasis) => {
    const camera = new BABYLON.ArcRotateCamera("Camera", cameraAngle, 1, cameraZoom, new BABYLON.Vector3(cameraXasis, 10, cameraYasis), scene);
    camera.attachControl(canvas, true);
}