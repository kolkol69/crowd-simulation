const createAgentMeshes = (scene) => {
    const agents = new Array(AMOUNT_AGENTS)
    for (let i = 0; i < AMOUNT_AGENTS; i++) {
        agents[i] = BABYLON.MeshBuilder.CreateBox("", {
            height: 10,
            width: 3,
            depth: 3
        }, scene);
        agents[i].position.y = 5;
    }
    return agents;
}