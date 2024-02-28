class Point {
    constructor(location) {
        this.lat = location.coordinates[1];
        this.long = location.coordinates[0];
    }
}

const toPointStr = (point) => {
    return `POINT(${point.long} ${point.lat})`
}


module.exports = {
    Point,
    toPointStr,
}
