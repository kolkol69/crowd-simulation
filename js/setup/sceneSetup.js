const createAgentMeshes = (scene) => {
    const agents = new Array(agentsAmount)
    for (let i = 0; i < agentsAmount; i++) {
        agents[i] = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT,
            width: WIDTH,
            depth: DEPTH
        }, scene);
        agents[i].position.y = HEIGHT/2;
    }
    return agents;
}

// const createTouristPlaces = (scene) => {
//     const place = BABYLON.MeshBuilder.CreateBox("", {
//         height: HEIGHT*2,
//         width: OBSTACLE_POSITIONS[0].width,
//         depth: OBSTACLE_POSITIONS[0].depth
//     }, scene);
//     place.position.y = HEIGHT;
//     place.position.x = OBSTACLE_POSITIONS[0].x;
//     place.position.z = OBSTACLE_POSITIONS[0].y;
// }

const createTouristPlaces = (scene) => {
    OBSTACLE_POSITIONS.forEach((obstacle)=>{
        const place = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT*2,
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