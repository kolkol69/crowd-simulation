const frameRate = 10;

const getRoutesX = function () {
    var keyFrames = [];
    let xCoordinate = Math.floor(Math.random()*100 ) ;

    keyFrames.push({
        frame: 0,
        value: 0
    });

    keyFrames.push({
        frame: 1 * frameRate,
        value: xCoordinate
    });

    keyFrames.push({
        frame: 2 * frameRate,
        value: xCoordinate
    });

    keyFrames.push({
        frame: 3 * frameRate,
        value: 0
    });

    keyFrames.push({
        frame: 4 * frameRate,
        value: 0
    });
    return keyFrames;
}
const getRoutesY = function () {
    var keyFrames1 = [];
    let yCoordinate = Math.floor(Math.random()*100);

    keyFrames1.push({
        frame: 1 * frameRate,
        value: 0
    });

    keyFrames1.push({
        frame: 2 * frameRate,
        value: yCoordinate
    });
    keyFrames1.push({
        frame: 3 * frameRate,
        value: yCoordinate
    });

    keyFrames1.push({
        frame: 4 * frameRate,
        value: 0
    });

    return keyFrames1;
}