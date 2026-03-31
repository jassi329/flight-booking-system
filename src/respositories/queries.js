function addRowLockOnFlights(flightId) {
    return `SELECT * from flights WHERE Flghts.id = ${flightId} FOR UPDATE;`
}

module.exports = {
    addRowLockOnFlights,
    
}