const createGrid = (scene) => {
    const myMaterial = new BABYLON.StandardMaterial("myMaterial", globalScene);
    myMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);

    let squareSize = 15;
    let squaresAmount = Math.floor((GROUND_HEIGHT * GROUND_WIDTH) / (squareSize * squareSize));


    const grid = [];

    console.log(squaresAmount)
    let yCounter = 0;
    for (let i = 0; i < squaresAmount; i++) {
        const square = BABYLON.MeshBuilder.CreateBox(`x`, {
            size: squareSize,
            height: 1
        }, scene);
        i % Math.floor((GROUND_WIDTH / squareSize)) === 0 ? yCounter++ : yCounter = yCounter;
        square.position.y = 0.5;
        square.position.x = i % Math.floor((GROUND_WIDTH / squareSize)) * squareSize;
        square.position.z = yCounter * squareSize;
        square.material = myMaterial;
        grid.push(square);
    }

    return grid;
}
