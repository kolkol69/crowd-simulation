const createAgentMeshes = (scene) => {
    const agents = new Array(agentsAmount)
    for (let i = 0; i < agentsAmount; i++) {
        agents[i] = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT,
            width: WIDTH,
            depth: DEPTH
        }, scene);
        agents[i].position.y = 5;
    }
    return agents;
}

const removeAgentMeshes = () => {
    for (let i = 0; i < agents.length; i++) {
        agents[i].dispose();
    }
}