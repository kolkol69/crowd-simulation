let intervalID;
let animationID;
/* 
########################
## AGENTS' DIMENSIONS ##
########################
*/
const HEIGHT = 10;
const WIDTH = 3;
const DEPTH = 3;

/* 
####################
## SCENE SETTINGS ##
####################
*/
// ground params
const GROUND_WIDTH = 800;
const GROUND_HEIGHT = 500;
const INIT_POS_X = GROUND_WIDTH / 2;
const INIT_POS_Z = GROUND_HEIGHT / 2;
// camera params
const CAMERA_ANGLE = 1.57;
const CAMERA_ZOOM = 1000;
const CAMERA_POS_X = INIT_POS_X;
const CAMERA_POS_Y = INIT_POS_Z;
const CAMERA_VIEW_TYPE = -1; // 1 - normal view; -1 - from the top view

/* 
#######################
### SYSTEM SETTINGS ###
#######################
*/
// agent amount
let agentsAmount = 500;
// Promień sąsiedztwa
let neighbourRadius = 8.0;
// Kąt obserwacji
let observDegree = 120.0;
// Odleglosc minimalna
let minDistance = 8.0;
// Waga prędkości sąsiadów
let weightNeighbourVelocity = 0.1;
// Waga odległości sąsiadów
let weightNeighbourDistance = 0.15;
// Waga odległości minimalnej
let weightMinimalDistance = 0.15;
// Waga zakłóceń
let weightPerturbation = 0.1;
// Prędkość maksymalna
let maxVelocity = 1.0;
// defines how fast agents move towards the target
let speedToTarget = 1.0;
// defines how fast agents will get to the target
let timeToTarget = 3000; // time in ms
// defines how likely most of the agents will get to the target
let chanceToGetToTarget = 3; // example: 100 / 3 ~~ 33.3%
/* 
##########################
### OBSTACLE POSITIONS ###
##########################
*/

const OBSTACLE_POSITIONS = [{
        // SUKIENNICE
        name: "sukiennice",
        x: 400,
        y: 220,
        width: 50,
        depth: 190,
        rotation: 0,
    },
    {
        // KOSCIOL SWIETEGO WOJCECHA
        name: "Kosciol Swietego Wojcecha",
        x: 520,
        y: 100,
        width: 25,
        depth: 25,
        rotation: 30,
    },
    {
        // WIEZA RATUSZOWA
        name: "Wieza Ratuszowa",
        x: 320,
        y: 125,
        width: 25,
        depth: 25,
        rotation: 0,
    },
    {
        name:'Pomnik Adama Mickiewicza',
        x: 60,
        y: 150,
        width: 15,
        depth: 15,
        rotation: 0,
    },
    // {
    //     x: 290,
    //     y: 300,
    //     width: 50,
    //     depth: 10,
    // },
    // {
    //     x: 300,
    //     y: 200,
    //     width: 10,
    //     depth: 10,
    // }
]
let TARGET_POSITIONS = [
    // {
    //         x: 310,
    //         y: 200,
    //         width: 20,
    //         depth: 150,
    //     }, {
    //         x: 270,
    //         y: 200,
    //         width: 20,
    //         depth: 150,
    //     },
    //     {
    //         x: 150,
    //         y: 70,
    //         width: 100,
    //         depth: 10,
    //     }, {
    //         x: 60,
    //         y: 150,
    //         width: 50,
    //         depth: 100,
    //     }, {
    //         x: 290,
    //         y: 300,
    //         width: 50,
    //         depth: 10,
    //     }, 
    {
        x: 290,
        y: 200,

    }, {
        x: 200,
        y: 300,
    }, {
        x: 250,
        y: 300,
    }
]