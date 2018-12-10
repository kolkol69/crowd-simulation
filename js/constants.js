// SCENE SETTINGS
// ground params
const GROUND_WIDTH = 600;
const GROUND_HEIGHT = 400;
const INIT_POS_X = 300;
const INIT_POS_Z = 200;
// camera params
const CAMERA_ANGLE = 1.57;
const CAMERA_ZOOM = 500;
const CAMERA_POS_X = 300;
const CAMERA_POS_Y = 200;

// SYSTEM SETTINGS
// agent amount
var AMOUNT_AGENTS = 100;
// Promień sąsiedztwa
var neighbourRadius = 50.0;
// Kąt obserwacji
var observDegree = 120.0;
// Odleglosc minimalna
var minDistance = 20.0;
// Waga prędkości sąsiadów
var weightNeighbourVelocity = 0.1;
// Waga odległości sąsiadów
var weightNeighbourDistance = 0.15;
// Waga odległości minimalnej
var weightMinimalDistance = 0.15;
// Waga zakłóceń
var weightPerturbation = 0.1;
// Prędkość maksymalna
var maxVelocity = 4.0;