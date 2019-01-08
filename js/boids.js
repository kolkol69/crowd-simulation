var boids;
var agents = new Array(agentsAmount);

const width = GROUND_WIDTH;
const height = GROUND_HEIGHT;

// calculate new speed and direction
function modify_speed_and_direction() {
	let dist = 0.0;
	let deg = 0.0;

	for (i = 0; i < agentsAmount; i++) {
		boids[i].mean_vx = boids[i].vx;
		boids[i].mean_vy = boids[i].vy;
		boids[i].mean_d = 0;
		boids[i].num = 1;
		for (j = 0; j < agentsAmount; j++) {a
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

// move and display boids
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

const isHittingObstacle = (boid_next_pos_x, boid_next_pos_y) => {
	for (let i = 0; i < OBSTACLE_POSITIONS.length; i++) {
		if ((boid_next_pos_x >= OBSTACLE_POSITIONS[i].x - OBSTACLE_POSITIONS[i].width / 2 && boid_next_pos_x <= OBSTACLE_POSITIONS[i].x + OBSTACLE_POSITIONS[i].width / 2) &&
			(boid_next_pos_y >= OBSTACLE_POSITIONS[i].y - OBSTACLE_POSITIONS[i].depth / 2 && boid_next_pos_y <= OBSTACLE_POSITIONS[i].y + OBSTACLE_POSITIONS[i].depth / 2)) {
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
		boids[i].current_target_id = getNextTarget(boids[i]);

		if (Math.floor(Math.random() * chanceToGetToTarget) == 0) { // for 3 there is 33.3% chance that agent will move towards defined target
			if (boids[i].current_target_id == -1) {
				let targetId;
				do {
					targetId = ~~(Math.random() * TARGET_POSITIONS.length);
				} while (boids[i].recently_visited_target_id.indexOf(targetId) !== -1);
				setBoidSpeed(boids[i], targetId);
			} else {
				console.log('id:', boids[i].current_target_id, '>>>> ', TARGET_POSITIONS[boids[i].current_target_id]);
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

const getNextTarget = (boid) => {
	console.log('Visited places: ', ...boid.recently_visited_target_id);

	const amountOfTargets = TARGET_POSITIONS.length;
	const targetDistances = TARGET_POSITIONS.map(_target => ~~getDistance(boid.x, _target.x, boid.y, _target.y) - _target.attraction_range);
	let target;
	let targetsAchieved = 0;

	// find next POI
	do {
		targetID = targetDistances.indexOf(Math.min(...targetDistances)) + targetsAchieved;
		target = TARGET_POSITIONS[targetID];
		++targetsAchieved;
	} while (boid.recently_visited_target_id.indexOf(targetID) !== -1 && targetsAchieved < amountOfTargets);

	if (boid.recently_visited_target_id.length === amountOfTargets) {
		console.log('%c >>> ALL TARGETS ACHIEVED <<<', 'background: #222; color: #b70037');
		boid.recently_visited_target_id = [];
		return -1;
	}

	const distanceToTarget = getDistance(boid.x, target.x, boid.y, target.y) - target.attraction_range;
	const isMovingToTarget = distanceToTarget > 0;
	const isNotAlreadyVisited = boid.recently_visited_target_id.indexOf(targetID) === -1;

	// Target achived and can be added to "visited"
	if (!isMovingToTarget && isNotAlreadyVisited) {
		boid.recently_visited_target_id.push(targetID);
	}

	return targetID;
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
}

function start() {
	init();
	move_and_display();
}