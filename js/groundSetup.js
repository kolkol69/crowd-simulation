const createGround = (scene, GROUND_WIDTH, GROUND_HEIGHT, INIT_POS_X, INIT_POS_Z) => {
    const ground = BABYLON.MeshBuilder.CreateGround("ground", {
        width: GROUND_WIDTH,
        height: GROUND_HEIGHT,
        subdivsions: 4
    }, scene);

    var groundColor = new BABYLON.StandardMaterial(scene);
    groundColor.alpha = 1;
    groundColor.diffuseColor = new BABYLON.Color3(0.3, 0.2, 0.7);
    ground.material = groundColor;

    ground.position.x = INIT_POS_X;
    ground.position.z = INIT_POS_Z;
}