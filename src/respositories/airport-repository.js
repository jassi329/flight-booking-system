const CrudRepository = require('./crud-repository');
const { Airport } = require('../models');
const { where } = require('sequelize');

class AirportRepository extends CrudRepository {
    constructor(){ 
        super(Airport);
    }

    async getAirportByCode(code) {
        const airport = await Airport.findOne({
            where: {
                code: code
            }
        });
        return airport;
    }
}

module.exports = AirportRepository;