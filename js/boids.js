var boids;
var agents = new Array(agentsAmount);

const width = GROUND_WIDTH;
const height = GROUND_HEIGHT;

// calculate new speed and direction
const modify_speed_and_direction = () => {
	let dist = 0.0;
	let deg = 0.0;

	for (i = 0; i < agentsAmount; i++) {
		boids[i].mean_vx = boids[i].vx;
		boids[i].mean_vy = boids[i].vy;
		boids[i].mean_d = 0;
		boids[i].num = 1;
		for (j = 0; j < agentsAmount; j++) {
			if (j == i) continue;
			dist = Math.sqrt(Math.pow(boids[i].x - boids[j].x, 2) + Math.pow(boids[i].y - boids[j].y, 2));
			deg = Math.acos(
				boids[i].vx / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) *
				((boids[j].x - boids[i].x) / dist) +
				boids[i].vy / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) *
				((boids[j].y - boids[i].y) / dist));
			deg = Math.abs((180 * deg) / Math.PI);
			if (dist < neighbourRadius && deg < observDegree) {
				boids[i].num++;
				boids[i].mean_vx += boids[j].vx;
				boids[i].mean_vy += boids[j].vy;
				boids[i].mean_d += dist;
			}
		}
	}

	for (i = 0; i < agentsAmount; i++) {
		//adjust speed to neighbours speed
		boids[i].vx += (weightNeighbourVelocity * ((boids[i].mean_vx / boids[i].num) - boids[i].vx));
		boids[i].vy += (weightNeighbourVelocity * ((boids[i].mean_vy / boids[i].num) - boids[i].vy));

		//perturbation
		boids[i].vx += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
		boids[i].vy += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));

		if (boids[i].num > 1) boids[i].mean_d /= (boids[i].num - 1);
		for (j = 0; j < agentsAmount; j++) {
			if (j == i) continue;
			dist = Math.sqrt(Math.pow(boids[i].x - boids[j].x, 2) + Math.pow(boids[i].y - boids[j].y, 2));
			deg = Math.acos(
				boids[i].vx / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) *
				((boids[j].x - boids[i].x) / dist) +
				boids[i].vy / Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) *
				((boids[j].y - boids[i].y) / dist));
			deg = Math.abs((180 * deg) / Math.PI);
			if (dist < neighbourRadius && deg < observDegree) {
				if (Math.abs(boids[j].x - boids[i].x) > minDistance) {
					boids[i].vx += (weightNeighbourDistance / boids[i].num) * (((boids[j].x - boids[i].x) * (dist - boids[i].mean_d)) / dist);
					boids[i].vy += (weightNeighbourDistance / boids[i].num) * (((boids[j].y - boids[i].y) * (dist - boids[i].mean_d)) / dist);

				} else //neighbours are too close
				{
					boids[i].vx -= (weightMinimalDistance / boids[i].num) * ((((boids[j].x - boids[i].x) * (minDistance)) / dist) - (boids[j].x - boids[i].x));
					boids[i].vy -= (weightMinimalDistance / boids[i].num) * ((((boids[j].y - boids[i].y) * (minDistance)) / dist) - (boids[j].y - boids[i].y));
				}
			}
		}

		//check speed is not too high
		if (Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) > maxVelocity) {
			boids[i].vx *= 0.75;
			boids[i].vy *= 0.75;
		}
	}
}

// move and display boids
const move_and_display = () => {
	//first modify speed and direction
	modify_speed_and_direction();
	for (i = 0; i < agents.length; i++) {
		const boid_next_pos_x = boids[i].x + boids[i].vx;
		const boid_next_pos_y = boids[i].y + boids[i].vy;
		// check if hitting the obstacles
		if (isHittingObstacle(boid_next_pos_x, boid_next_pos_y)) {
			// console.log('x,y:\n', boids[i].vy, boids[i].vx);
			boids[i].vx = (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
			boids[i].vy = (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
		}

		// move boid
		boids[i].x += boids[i].vx;
		boids[i].y += boids[i].vy;

		// check if outside window
		if (boids[i].x > width) boids[i].x -= width;
		else if (boids[i].x < 0) boids[i].x += width;
		if (boids[i].y > height) boids[i].y -= height;
		else if (boids[i].y < 0) boids[i].y += height;

		// display new position of boid
		if (boids[i].vx < 0) {
			boids[i].rotate = 90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
		} else {
			boids[i].rotate = -90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
		}

	}

	setBoidsPosition(boids);
	animationID = requestAnimationFrame(move_and_display);
}

function move_and_display_bw() {
    //first modify speed and direction
    modify_speed_and_direction();
    for (i = 0; i < agents.length; i++) {
        const boid_next_pos_x = boids[i].x + boids[i].vx;
        const boid_next_pos_y = boids[i].y + boids[i].vy;
        // check if hitting the obstacles
        if (isHittingObstacle(boid_next_pos_x, boid_next_pos_y)) {
            boids[i].vx = (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
            boids[i].vy = (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
        }

        //move boid
        boids[i].x += boids[i].vx;
        boids[i].y += boids[i].vy;

        //check if outside window
        if (boids[i].x > width) boids[i].x -= width;
        else if (boids[i].x < 0) boids[i].x += width;
        if (boids[i].y > height) boids[i].y -= height;
        else if (boids[i].y < 0) boids[i].y += height;

        //display new position of boid
        if (boids[i].vx < 0) {
            boids[i].rotate = 90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
        } else {
            boids[i].rotate = -90.0 + Math.atan(boids[i].vy / boids[i].vx) * 180.0 / Math.PI;
        }


        let area = isWithinTargetArea_bw(boids[i].x, boids[i].y)
        if (area != -1) {
            boids[i].recently_visited_target_id = area;
            boids[i].preferences[area] = 1;
        }
    }

    setBoidsPosition(boids);
    animationID = requestAnimationFrame(move_and_display_bw);
}

const isWithinTargetArea_bw = (boid_x, boid_y) => {
	for (let i = 0; i < TARGET_POSITIONS.length; i++) {
		if (TARGET_POSITIONS[i].depth == 0) {
			let dist = getDistance(boid_x, TARGET_POSITIONS[i].x, boid_y, TARGET_POSITIONS[i].y);
			if (dist < width) return i;
		}
		if ((boid_x >= TARGET_POSITIONS[i].x - TARGET_POSITIONS[i].width / 2 && boid_x <= TARGET_POSITIONS[i].x + TARGET_POSITIONS[i].width / 2) &&
			(boid_y >= TARGET_POSITIONS[i].y - TARGET_POSITIONS[i].depth / 2 && boid_y <= TARGET_POSITIONS[i].y + TARGET_POSITIONS[i].depth / 2)) {
			return i;
		}
	}
	return -1;
}

const getNumberOfBoidsInArea_bw = (index) => {
	let number = 0;
	for (i = 0; i < agents.length; i++) {
		if (TARGET_POSITIONS[index].depth == 0) {
			let dist = getDistance(boids[i].x, TARGET_POSITIONS[index].x, boids[i].y, TARGET_POSITIONS[index].y);
			if (dist < width) number = number + 1;
		}
		if ((boids[i].x >= TARGET_POSITIONS[index].x - TARGET_POSITIONS[index].width / 2 && boids[i].x <= TARGET_POSITIONS[index].x + TARGET_POSITIONS[index].width / 2) &&
			(boids[i].y >= TARGET_POSITIONS[index].y - TARGET_POSITIONS[index].depth / 2 && boids[i].y <= TARGET_POSITIONS[index].y + TARGET_POSITIONS[index].depth / 2)) {
			number = number + 1;
		}
	}
	return number;
}

const setBoidsTargets_bw = (boids) => {
    for (let i = 0; i < agentsAmount; i++) {

        boids[i].current_target_id = getNextTarget_bw(boids[i]);

        if (boids[i].current_target_id == -1) {
            const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
            myMaterial.diffuseColor = new BABYLON.Color3(0.4, 0.4, 0.4);
            agents[i].material = myMaterial;
            if (Math.floor(Math.random() * chanceToGetToTarget) == 0) { // for 3 there is 33.3% chance that agent will move towards defined target
                let targetId;
                do {
                    targetId = ~~(Math.random() * TARGET_POSITIONS.length);
                } while (targetId == boids[i].recently_visited_target_id);
                const xDirection = boids[i].x - TARGET_POSITIONS[targetId].x > 0 ? -1 : 1;
                const yDirection = boids[i].y - TARGET_POSITIONS[targetId].y > 0 ? -1 : 1;

                boids[i].vx = xDirection * (Math.random() * speedToTarget); // maxVelocity
                boids[i].vy = yDirection * (Math.random() * speedToTarget);
            }
        } else {
            const myMaterial = new BABYLON.StandardMaterial("myMaterial", scene);
            myMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);
            agents[i].material = myMaterial;

            const xDirection = boids[i].x - TARGET_POSITIONS[boids[i].current_target_id].x > 0 ? -1 : 1;
            const yDirection = boids[i].y - TARGET_POSITIONS[boids[i].current_target_id].y > 0 ? -1 : 1;
            boids[i].vx = xDirection * (Math.random() * speedToTarget); // maxVelocity
            boids[i].vy = yDirection * (Math.random() * speedToTarget);
        }
    }
}

const getNextTarget_bw = (boid) => {
    let crowdThreshold = 50;
    //gets first proper target to compare others to
    let startingIndex = 0;
    while (getDistance(boid.x, TARGET_POSITIONS[startingIndex].x, boid.y, TARGET_POSITIONS[startingIndex].y) > TARGET_POSITIONS[startingIndex].attraction_range ||
        boid.preferences[startingIndex] == 1 || getNumberOfBoidsInArea_bw(startingIndex) >= crowdThreshold) {
        startingIndex = startingIndex + 1;
        if (startingIndex == TARGET_POSITIONS.length) return -1;
    }

    let targetId = startingIndex;
    let currdist = getDistance(boid.x, TARGET_POSITIONS[targetId].x, boid.y, TARGET_POSITIONS[targetId].y);
    if (targetId == boid.current_target_id) currdist = currdist * currentTargetPriority;
    currdist = currdist * boid.preferences[j] * (0.5 + (getNumberOfBoidsInArea_bw(startingIndex) / (2 * crowdThreshold)));
    for (let j = startingIndex + 1; j < TARGET_POSITIONS.lenght; j++) {
        if (boid.preferences[startingIndex] < 1) {
            let crowd = getNumberOfBoidsInArea_bw(j);
            let dist = getDistance(boid.x, TARGET_POSITIONS[targetId].x, boid.y, TARGET_POSITIONS[targetId].y);
            if (dist <= TARGET_POSITIONS[j].attraction_range || crowd < crowdThreshold) {
                if (j == boid.current_target_id) dist = dist * currentTargetPriority;
                dist = dist * boid.preferences[j] * (0.5 + (crowd / (2 * crowdThreshold)));
                if (dist < currdist) {
                    currdist = dist;
                    targetId = j;
                }
            }
        }
    }
    return targetId;
}

const isHittingObstacle = (boid_next_pos_x, boid_next_pos_y) => {
	for (let i = 0; i < OBSTACLE_POSITIONS.length; i++) {
		if ((boid_next_pos_x + WIDTH > OBSTACLE_POSITIONS[i].x - OBSTACLE_POSITIONS[i].width / 2 && boid_next_pos_x - WIDTH < OBSTACLE_POSITIONS[i].x + OBSTACLE_POSITIONS[i].width / 2) &&
			(boid_next_pos_y + WIDTH > OBSTACLE_POSITIONS[i].y - OBSTACLE_POSITIONS[i].depth / 2 && boid_next_pos_y - WIDTH < OBSTACLE_POSITIONS[i].y + OBSTACLE_POSITIONS[i].depth / 2)) {
			return true;
		}
	}
	return false;
}

const setBoidsPosition = (boids) => {
	if (agentsAmount > agents.length) {
		createMoreMeshes(agents);
	}
	for (let i = 0; i < agentsAmount; i++) {
		agents[i].position.x = boids[i].x;
		agents[i].position.z = boids[i].y;
	}
}

const getDistance = (x1, x2, y1, y2) => {
	return Math.sqrt(Math.pow((x1 - x2), 2) + Math.pow((y1 - y2), 2));
}

const setBoidsTargets = (boids) => {
	for (i = 0; i < agentsAmount; i++) {
		boids[i].current_target_id = getNextTarget(boids[i], i);

		if (Math.floor(Math.random() * chanceToGetToTarget) == 0) { // for 3 there is 33.3% chance that agent will move towards defined target
			if (boids[i].current_target_id == -1) {
				let targetId;
				do {
					targetId = ~~(Math.random() * TARGET_POSITIONS.length);
				} while (boids[i].recently_visited_target_id.indexOf(targetId) !== -1);
				setBoidSpeed(boids[i], targetId);
			} else {
				setBoidSpeed(boids[i], boids[i].current_target_id);
			}
		}
	}
}

const setBoidSpeed = (boid, id) => {
	const xDirection = boid.x - TARGET_POSITIONS[id].x > 0 ? -1 : 1;
	const yDirection = boid.y - TARGET_POSITIONS[id].y > 0 ? -1 : 1;

	boid.vx = xDirection * (Math.random() * speedToTarget); // maxVelocity
	boid.vy = yDirection * (Math.random() * speedToTarget);
}

const getNextTarget = (boid, index) => {

	const amountOfTargets = TARGET_POSITIONS.length;
	// FINISH
	if (boid.recently_visited_target_id.length === amountOfTargets) {
		agents[index].material.diffuseColor = new BABYLON.Color3(1, 0, 0);
		boid.recently_visited_target_id = [];
		return -1;
	}

	const targetDistances = TARGET_POSITIONS.map(_target => ~~getDistance(boid.x, _target.x, boid.y, _target.y) - _target.attraction_range);

	let targetDistancesFiltered = TARGET_POSITIONS.map((_target, index) => {
		if (boid.recently_visited_target_id.indexOf(index) === -1) {
			return ~~getDistance(boid.x, _target.x, boid.y, _target.y) - _target.attraction_range;
		}
	}).filter(el => typeof el !== 'undefined');

	targetID = targetDistances.indexOf(Math.min(...targetDistancesFiltered));

	const distanceToTarget = getDistance(boid.x, TARGET_POSITIONS[targetID].x, boid.y, TARGET_POSITIONS[targetID].y) - TARGET_POSITIONS[targetID].attraction_range;
	const isMovingToTarget = distanceToTarget < 0;
	const isNotAlreadyVisited = boid.recently_visited_target_id.indexOf(targetID) === -1;

	// Target achived and can be added to "visited"
	if (isMovingToTarget && isNotAlreadyVisited) {
		boid.recently_visited_target_id.push(targetID);
	}

	return targetID;
}

const createMoreMeshes = (agents) => {
	for (let i = agents.length - 1; i < agentsAmount - 1; i++) {
		agents.push(BABYLON.MeshBuilder.CreateBox("", {
			height: 10,
			width: 3,
			depth: 3
		}, scene));
		agents[i].position.y = 5;
	}
}

//initialize data
const initFirstAlgo = (scene) => {
	agents = createAgentMeshes(scene);
	boids = new Array(agentsAmount);
	let vx;
	let vy;
	for (i = 0; i < agentsAmount; i++) {
		boids[i] = {};
		boids[i].x = Math.floor(Math.random() * width);
		boids[i].y = Math.floor(Math.random() * height);
		do {
			vx = Math.random() * 4.0 - 2.0;
			vy = Math.random() * 4.0 - 2.0;
		} while (isHittingObstacle(vx, vy))
		boids[i].vx = vx;
		boids[i].vy = vy;

		boids[i].recently_visited_target_id = [];
		boids[i].current_target_id = ~~(Math.random() * TARGET_POSITIONS.length);

	}
	intervalID = setInterval(() => {
		setBoidsTargets(boids);
	}, timeToTarget);
	move_and_display();
}

const initSecondAlgo_bw = (scene) => {
    agents = createAgentMeshes(scene);
    boids = new Array(agentsAmount);
    for (i = 0; i < agentsAmount; i++) {
        let vx;
        let vy;
        boids[i] = {};
        boids[i].x = Math.floor(Math.random() * width);
        boids[i].y = Math.floor(Math.random() * height);
        do {
            vx = Math.random() * 4.0 - 2.0;
            vy = Math.random() * 4.0 - 2.0;
        } while (isHittingObstacle(vx, vy))
        boids[i].vx = vx;
        boids[i].vy = vy;

        boids[i].recently_visited_target_id = -1;
        boids[i].current_target_id = ~~(Math.random() * (TARGET_POSITIONS.length + 1)) - 1;
        boids[i].preferences = new Array(TARGET_POSITIONS.length).fill(Math.random());

    }
    intervalID = setInterval(() => {
        setBoidsTargets_bw(boids);
    }, timeToTarget);
    move_and_display_bw();
}

const start = () => {

	switch (algorythmID) {
		case 0:
			if (intervalID) clearInterval(intervalID);
			if (animationID) cancelAnimationFrame(animationID);
			initFirstAlgo();
			break;
		case 1:
			if (intervalID) clearInterval(intervalID);
			if (animationID) cancelAnimationFrame(animationID);
			initSecondAlgo_bw();
			break;
	}

}