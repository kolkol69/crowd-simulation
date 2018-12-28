const createCamera = (scene, canvas) => {
    const camera = new BABYLON.ArcRotateCamera("Camera", CAMERA_ANGLE, CAMERA_VIEW_TYPE, CAMERA_ZOOM, new BABYLON.Vector3(CAMERA_POS_X, 10, CAMERA_POS_Y), scene);
    camera.attachControl(canvas, true);
}
// const createCamera = (scene, canvas) => {
//     const camera = new BABYLON.ArcRotateCamera("Camera", CAMERA_ANGLE, 1, CAMERA_ZOOM, new BABYLON.Vector3(CAMERA_POS_X, 10, CAMERA_POS_Y), scene);
//     camera.attachControl(canvas, true);
// }