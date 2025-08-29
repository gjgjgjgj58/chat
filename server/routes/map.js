import express from 'express';
import MapService from '@/services/map.service';
import {verifyToken} from '@/utils/interceptor';

const router = express.Router();

router.get('/map/geocoding', verifyToken, async (req, res, next) => {
    try {
        const mapService = new MapService({
            lonLat: req.query.lonLat,
            projection: req.query.projection,
        });
        const result = await mapService.geocoding();

        res.status(result.status).send(result.message);
    } catch (err) {
        console.error(err);
        return res.status(500).send(serverErrResponse(err).message);
    }
});

module.exports = router;