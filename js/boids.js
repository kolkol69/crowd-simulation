const boids = new Array(AMOUNT_AGENTS);
var agents = new Array(AMOUNT_AGENTS);

// Promień sąsiedztwa
var neighbourRadius = 50.0;
// Kąt obserwacji
var observDegree = 120.0;
// Odleglosc minimalna
var minDistance = 20.0;
// Waga prędkości sąsiadów
var weightNeighbourDistance = 0.1;
// Waga odległości sąsiadów
var weightNeighbourDistance = 0.15;
// Waga odległości minimalnej
var weightMinimalDistance = 0.15;
// Waga zakłóceń
var weightPerturbation = 0.1;
// Prędkość maksymalna
var maxValocity = 4.0;

const width = GROUND_WIDTH;
const height = GROUND_HEIGHT;

//calculate new speed and direction
function modify_speed_and_direction() {
	var dist = 0.0;
	var deg = 0.0;

	for (i = 0; i < boids.length; i++) {
		boids[i].mean_vx = boids[i].vx;
		boids[i].mean_vy = boids[i].vy;
		boids[i].mean_d = 0;
		boids[i].num = 1;
		for (j = 0; j < boids.length; j++) {
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

	for (i = 0; i < boids.length; i++) {
		//adjust speed to neighbours speed
		boids[i].vx += (weightNeighbourDistance * ((boids[i].mean_vx / boids[i].num) - boids[i].vx));
		boids[i].vy += (weightNeighbourDistance * ((boids[i].mean_vy / boids[i].num) - boids[i].vy));

		//perturbation
		boids[i].vx += (weightPerturbation * ((Math.random() - 0.5) * maxValocity));
		boids[i].vy += (weightPerturbation * ((Math.random() - 0.5) * maxValocity));

		if (boids[i].num > 1) boids[i].mean_d /= (boids[i].num - 1);
		for (j = 0; j < boids.length; j++) {
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
		if (Math.sqrt(boids[i].vx * boids[i].vx + boids[i].vy * boids[i].vy) > maxValocity) {
			boids[i].vx *= 0.75;
			boids[i].vy *= 0.75;
		}
	}
}

//move and display boids
function move_and_display() {
	//first modify speed and direction
	modify_speed_and_direction();

	for (i = 0; i < boids.length; i++) {
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

	window.requestAnimationFrame(move_and_display);
}

//initialize data
const setBoidsPosition = (boids) => {
	for (let i = 0; i < agents.length; i++) {
		agents[i].position.x = boids[i].x;
		agents[i].position.z = boids[i].y;
	}
}

const init = () => {
	for (i = 0; i < boids.length; i++) {
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