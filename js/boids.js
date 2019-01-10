var boids;
var agents = new Array(agentsAmount);

const width = GROUND_WIDTH;
const height = GROUND_HEIGHT;

//calculate new speed and direction
function modify_speed_and_direction() {
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
					/**
					 * boids[i].vx += 0.005 * (((boids[j].x - boids[i].x) * (dist - boids[i].mean_d)) / dist);
					 * czym mensza wartosc weightNeighbourDistance (0.005) tym bilshe grupujutsja agenty
					 * ale i tym bilsh stabilno wygladaje systema
					 * agenty ne "diorgajutsja" jaksho probujut' wyrwatysja z grupy
					 */
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

//move and display boids
function move_and_display() {
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

        
        let area = isWithinTargetArea(boids[i].x, boids[i].y)
        if (area != -1) {/*
            if (~~(Math.random() * chanceToLeaveTarget) == 0) {
                boids[i].recently_visited_target_id = area;
            }*/
            boids[i].recently_visited_target_id = area;
			//console.log("odwiedzony:" + area);
			boids[i].preferences[area] = 1;
        }
	}

	setBoidsPosition(boids);
	animationID = requestAnimationFrame(move_and_display);
}

const isHittingObstacle = (boid_next_pos_x, boid_next_pos_y) => {
	for (let i = 0; i < OBSTACLE_POSITIONS.length; i++) {
		if ((boid_next_pos_x >= OBSTACLE_POSITIONS[i].x - OBSTACLE_POSITIONS[i].width / 2 && boid_next_pos_x <= OBSTACLE_POSITIONS[i].x + OBSTACLE_POSITIONS[i].width / 2) &&
			(boid_next_pos_y >= OBSTACLE_POSITIONS[i].y - OBSTACLE_POSITIONS[i].depth / 2 && boid_next_pos_y <= OBSTACLE_POSITIONS[i].y + OBSTACLE_POSITIONS[i].depth / 2)) {
			return true;
		}
	}
	return false;
}

const isWithinTargetArea = (boid_x, boid_y) => {
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
    return Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
}


const setBoidsTargets = (boids) => {
    for (i = 0; i < agentsAmount; i++) {
        /*
		if (Math.floor(Math.random() * chanceToGetToTarget) == 0) { // for 3 there is 33.3% chance that agent will move towards defined target
			// console.log(i % Math.floor(Math.random() * 2) + 2)
			// const diagonal = Math.sqrt(Math.pow((boids[i].x - TARGET_POSITIONS[0].x), 2) + Math.pow((boids[i].y - TARGET_POSITIONS[0].y), 2)); //d^2 = (x0-xt)^2 + (y0-yt)^2 => d = sqrt((x0-xt)^2 + (y0-yt)^2)
			const targetId = ~~(Math.random() * TARGET_POSITIONS.length);
			const xDirection = boids[i].x - TARGET_POSITIONS[targetId].x > 0 ? -1 : 1;
			const yDirection = boids[i].y - TARGET_POSITIONS[targetId].y > 0 ? -1 : 1;
			// if (Math.pow(boids[i].x, 2) + Math.pow(boids[i].y, 2) - diagonal != 100) {
			boids[i].vx = xDirection * (Math.random() * speedToTarget); // maxVelocity
			boids[i].vy = yDirection * (Math.random() * speedToTarget);
			// }
            */

        //console.log(isWithinTargetArea(boids[i].x, boids[i].y));

        //let prev_target = boids[i].current_target_id;

        boids[i].current_target_id = getNextTarget(boids[i]);

        //if (prev_target != boids[i].current_target_id) console.log("target changed: " + prev_target +" to " +  boids[i].current_target_id);
        //else console.log("target not changed" + boids[i].current_target_id);
        //boids[i].current_target_id = getNextTarget(boids[i].x, boids[i].y, boids[i].recently_visited_target_id, boids[i].current_target_id);
		console.log(boids[i].preferences);
        if (boids[i].current_target_id == -1) {
            console.log("bez celu");
            if (Math.floor(Math.random() * chanceToGetToTarget) == 0) { // for 3 there is 33.3% chance that agent will move towards defined target
                // console.log(i % Math.floor(Math.random() * 2) + 2)
                // const diagonal = Math.sqrt(Math.pow((boids[i].x - TARGET_POSITIONS[0].x), 2) + Math.pow((boids[i].y - TARGET_POSITIONS[0].y), 2)); //d^2 = (x0-xt)^2 + (y0-yt)^2 => d = sqrt((x0-xt)^2 + (y0-yt)^2)
                //const targetId = ~~(Math.random() * TARGET_POSITIONS.length);
                let targetId;
                do { targetId = ~~(Math.random() * TARGET_POSITIONS.length); } while (targetId == boids[i].recently_visited_target_id);
                const xDirection = boids[i].x - TARGET_POSITIONS[targetId].x > 0 ? -1 : 1;
                const yDirection = boids[i].y - TARGET_POSITIONS[targetId].y > 0 ? -1 : 1;

                

                // if (Math.pow(boids[i].x, 2) + Math.pow(boids[i].y, 2) - diagonal != 100) {
                boids[i].vx = xDirection * (Math.random() * speedToTarget ); // maxVelocity
                boids[i].vy = yDirection * (Math.random() * speedToTarget );
                // }
            }
        }
        else {
            console.log(boids[i].current_target_id);
            const xDirection = boids[i].x - TARGET_POSITIONS[boids[i].current_target_id].x > 0 ? -1 : 1;
            const yDirection = boids[i].y - TARGET_POSITIONS[boids[i].current_target_id].y > 0 ? -1 : 1;
            // if (Math.pow(boids[i].x, 2) + Math.pow(boids[i].y, 2) - diagonal != 100) {
            boids[i].vx = xDirection * (Math.random() * speedToTarget); // maxVelocity
            boids[i].vy = yDirection * (Math.random() * speedToTarget);
                // }
            
        }
	}
}



const getNextTarget = (boid) => {  

    //gets first proper target to compare others to
    let startingIndex = 0;
    while (getDistance(boid.x, TARGET_POSITIONS[startingIndex].x, boid.y, TARGET_POSITIONS[startingIndex].y) > TARGET_POSITIONS[startingIndex].attraction_range ||
        boid.preferences[startingIndex] == 1){
        startingIndex = startingIndex + 1;
        if (startingIndex == TARGET_POSITIONS.length) return -1;
    }

    let targetId = startingIndex;
    let currdist = getDistance(boid.x, TARGET_POSITIONS[targetId].x, boid.y, TARGET_POSITIONS[targetId].y);
    if (targetId == boid.current_target_id) currdist = currdist * currentTargetPriority;
	currdist = currdist * boid.preferences[j];
    for (let j = startingIndex + 1; j < TARGET_POSITIONS.lenght; j++) {
        if (boid.preferences[startingIndex] < 1) {
            let dist = getDistance(boid.x, TARGET_POSITIONS[targetId].x, boid.y, TARGET_POSITIONS[targetId].y);
            if (dist <= TARGET_POSITIONS[j].attraction_range) {
				if (j == boid.current_target_id) dist = dist * currentTargetPriority;
				dist = dist * boid.preferences[j];
                if (dist < currdist) {
                    currdist = dist;
                    targetId = j;
                }
            }
        }
    }
    return targetId;
}



function createMoreMeshes(agents) {
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
const init = (scene) => {
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
        /*
        let targetId = 0;//~~(Math.random() * TARGET_POSITIONS.length);
        let x1 = boids[i].x;
        let y1 = boids[i].y;
        let x2 = TARGET_POSITIONS[0].x;
        let y2 = TARGET_POSITIONS[0].y;
        let currdist = sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
        for (let j = 1; j < TARGET_POSITIONS.lenght; j++) {
            x1 = boids[i].x;
            y1 = boids[i].y;
            x2 = TARGET_POSITIONS[j].x;
            y2 = TARGET_POSITIONS[j].y;
            let dist = sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
            if (dist < currdist) {
                currdist = dist;
                targetId = j;
            }
        }
        boids[i].current_target_id = targetId;
        */
		boids[i].current_target_id =  ~~(Math.random() * (TARGET_POSITIONS.length + 1)) - 1;
		boids[i].preferences = new Array(TARGET_POSITIONS.length).fill(Math.random());
        //console.log(boids[i].current_target_id);
        //let dist = getDistance(boids[i].x, boids[i].y, TARGET_POSITIONS[0].x, TARGET_POSITIONS[0].y);
        //if (dist < 200) { boids[i].current_target_id = 0; }

	}
	intervalID = setInterval(() => {
		setBoidsTargets(boids);
	}, timeToTarget);
}

function start() {
	init();
	move_and_display();
}