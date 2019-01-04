const createAgentMeshes = (scene) => {
    const agents = new Array(agentsAmount)
    for (let i = 0; i < agentsAmount; i++) {
        agents[i] = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT,
            width: WIDTH,
            depth: DEPTH
        }, scene);
        agents[i].position.y = HEIGHT / 2;
    }
    return agents;
}

const createTargets = (scene) => {
    TARGET_POSITIONS.forEach((obstacle) => {
        const place = BABYLON.MeshBuilder.CreateSphere("", {
            diameter: HEIGHT,
        }, scene);
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);
        
        place.position.y = HEIGHT / 2;
        place.position.x = obstacle.x;
        place.position.z = obstacle.y;
        place.material = myMaterial;
    });
}

const createTouristPlaces = (scene) => {
    OBSTACLE_POSITIONS.forEach((obstacle) => {
        const place = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT * 2,
            width: obstacle.width,
            depth: obstacle.depth
        }, scene);
        place.position.y = HEIGHT;
        place.position.x = obstacle.x;
        place.position.z = obstacle.y;
    });
}

const removeAgentMeshes = () => {
    for (let i = 0; i < agents.length; i++) {
        agents[i].dispose();
    }
}