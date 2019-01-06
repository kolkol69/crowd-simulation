const createGrid = (scene) => {
    const myMaterial = new BABYLON.StandardMaterial("myMaterial", globalScene);
    myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    let squaresAmount = Math.floor((GROUND_HEIGHT * GROUND_WIDTH) / (SQUARE_SIZE * SQUARE_SIZE));


    const grid = [];

    const square = BABYLON.MeshBuilder.CreateBox(`x`, {
        size: SQUARE_SIZE,
        height: 1
    }, scene);

    let yCounter = 0;
    for (let i = 0; i < squaresAmount; i++) {

        i % Math.floor((GROUND_WIDTH / SQUARE_SIZE)) === 0 ? yCounter++ : yCounter = yCounter;
        square.position.y = 0.5;
        square.position.x = i % Math.floor((GROUND_WIDTH / SQUARE_SIZE)) * SQUARE_SIZE;
        square.position.z = yCounter * SQUARE_SIZE;
        square.material = myMaterial;

        let newClone = square.clone("index: " + i);
        grid.push(newClone);

    }

    return grid;
}
