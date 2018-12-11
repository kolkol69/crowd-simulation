var boids;
var agents = new Array(AMOUNT_AGENTS);

const width = GROUND_WIDTH;
const height = GROUND_HEIGHT;

//calculate new speed and direction
function modify_speed_and_direction() {
	let dist = 0.0;
	let deg = 0.0;

	for (i = 0; i < AMOUNT_AGENTS; i++) {
		boids[i].mean_vx = boids[i].vx;
		boids[i].mean_vy = boids[i].vy;
		boids[i].mean_d = 0;
		boids[i].num = 1;
		for (j = 0; j < AMOUNT_AGENTS; j++) {
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

	for (i = 0; i < AMOUNT_AGENTS; i++) {
		//adjust speed to neighbours speed
		boids[i].vx += (weightNeighbourVelocity * ((boids[i].mean_vx / boids[i].num) - boids[i].vx));
		boids[i].vy += (weightNeighbourVelocity * ((boids[i].mean_vy / boids[i].num) - boids[i].vy));

		//perturbation
		boids[i].vx += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));
		boids[i].vy += (weightPerturbation * ((Math.random() - 0.5) * maxVelocity));

		if (boids[i].num > 1) boids[i].mean_d /= (boids[i].num - 1);
		for (j = 0; j < AMOUNT_AGENTS; j++) {
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
	}

	setBoidsPosition(boids);
	// if(!flag){console.log('boids',...boids); flag = !flag}
	window.requestAnimationFrame(move_and_display);
}
// var flag = false;
const setBoidsPosition = (boids) => {
	if (AMOUNT_AGENTS > agents.length){
		createMoreMeshes(agents);
	}
	for (let i = 0; i < AMOUNT_AGENTS; i++) {
		agents[i].position.x = boids[i].x;
		agents[i].position.z = boids[i].y;
	}
}

function createMoreMeshes (agents) {
	for (let i = agents.length-1; i < AMOUNT_AGENTS - 1; i++) {
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
	boids = new Array(AMOUNT_AGENTS);
	for (i = 0; i < AMOUNT_AGENTS; i++) {
		boids[i] = {};
		boids[i].x = Math.floor(Math.random() * width);
		boids[i].y = Math.floor(Math.random() * height);
		boids[i].vx = Math.random() * 4.0 - 2.0;
		boids[i].vy = Math.random() * 4.0 - 2.0;
	}
}

function start() {
	init();
	window.requestAnimationFrame(move_and_display);
}