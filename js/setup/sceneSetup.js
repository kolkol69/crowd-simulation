const createAgentMeshes = (scene) => {
    const agents = new Array(agentsAmount)

    agents[0] = BABYLON.MeshBuilder.CreateBox("", {
        height: HEIGHT,
        width: WIDTH,
        depth: DEPTH,
    }, scene);
    agents[0].position.y = HEIGHT / 2;

    for (let i = 1; i < agentsAmount; i++) { //klonowanie/instancjonowanie podobno zwieksza wydajnosc
        agents[i] = agents[0].createInstance("index: " + i);
    }
    return agents;
}

const createTargets = (scene) => {
    TARGET_POSITIONS.forEach((obstacle, i) => {
        const place = BABYLON.MeshBuilder.CreateSphere(`${i}`, {
            diameter: HEIGHT,
        }, scene);
        const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
        myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 1);

        // drag'n'drop START

        var pointerDragBehavior = new BABYLON.PointerDragBehavior({
            dragPlaneNormal: new BABYLON.Vector3(0, 1, 0)
        });

        // Use drag plane in world space
        pointerDragBehavior.useObjectOrienationForDragging = false;

        // Listen to drag events
        pointerDragBehavior.onDragStartObservable.add((event) => {
            // console.log("dragStart");
            // console.log(event);
        })
        pointerDragBehavior.onDragObservable.add((event) => {
            // console.log("drag");
            // console.log(event);
        })
        pointerDragBehavior.onDragEndObservable.add((event) => {
            // console.log("dragEnd");
            // console.log('id:', place.id, '\nevent:\n',event);
            TARGET_POSITIONS[place.id] = {
                x: event.dragPlanePoint.x,
                y: event.dragPlanePoint.z,
            }
        })

        place.addBehavior(pointerDragBehavior);

        // drag'n'drop END

        place.position.y = HEIGHT * 2;
        place.position.x = obstacle.x;
        place.position.z = obstacle.y;
        place.material = myMaterial;
    });
}

const drawTouristPlacesPOIRadius = (scene) => {

    TARGET_POSITIONS.forEach((target)=>{
        const place = BABYLON.MeshBuilder.CreateSphere("mySphere", {diameterX: target.attraction_range, diameterZ: target.attraction_range, diameterY: 1}, scene);
        var greenMat = new BABYLON.StandardMaterial("greenMat", scene);

        greenMat.diffuseColor = new BABYLON.Color3(0, 1, 0);
        greenMat.alpha = 0.2;

        place.position.y = 3*HEIGHT;
        place.position.x = target.x; // x
        place.position.z = target.y; // y
        place.material = greenMat;
    });
}

const createTouristPlaces = (scene) => {

    drawTouristPlacesPOIRadius(scene);

    OBSTACLE_POSITIONS.forEach((obstacle) => {
        var textureResolution = 1024;
        var textureGround = new BABYLON.DynamicTexture("dynamic texture", {width:1024, height:512}, scene);   
        var textureContext = textureGround.getContext();
        
        var materialGround = new BABYLON.StandardMaterial("Mat", scene);    				
        materialGround.diffuseTexture = textureGround;
        
        //Add text to dynamic texture
        var font = "bold 104px monospace";
        textureGround.drawText(obstacle.name, 75, 155, font, "black", "white", true, true);

        const place = BABYLON.MeshBuilder.CreateBox("", {
            height: HEIGHT * 2,
            width: obstacle.width,
            depth: obstacle.depth
        }, scene);
        place.position.y = HEIGHT;
        place.position.x = obstacle.x;
        place.position.z = obstacle.y;
        place.rotation.y = obstacle.rotation;
        place.material = materialGround;
    });
}

const resetTimers = () => {
    clearInterval(intervalID);
    cancelAnimationFrame(animationID);
}

const removeAgentMeshes = () => {
    for (let i = 0; i < agents.length; i++) {
        agents[i].dispose();
    }
}