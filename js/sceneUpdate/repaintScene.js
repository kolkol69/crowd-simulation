function repaint_scene() {
    update_params();
    removeAgentMeshes();
    var createScene = function () {
        const scene = new BABYLON.Scene(engine);
        createCamera(scene, canvas);
        createLights(scene);
        createGround(scene);
        init(scene);

        return scene;
    };
    scene = createScene();
};