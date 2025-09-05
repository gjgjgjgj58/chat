import {errResponse, serverErrResponse, dataResponse} from '@/utils/common';

export default class MapService {
    static VWORLD_API_KEY = process.env.VWORLD_API_KEY;

    constructor(body) {
        this.lonLat = body.lonLat;
        this.projection = body.projection;
    }

    geocoding = async () => {
        try {
            // TODO
            // from fetch to axios
            const projection = this.projection || "epsg:4326";
            const point = this.lonLat;
            const VWORLD_API_URL = 'https://api.vworld.kr/req/address';
            const res = await fetch(`${VWORLD_API_URL}?service=address&request=getAddress&version=2.0&crs=${projection}&point=${point}&format=json&type=both&zipcode=true&simple=false&key=${MapService.VWORLD_API_KEY}`, {
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                method: 'GET'
            });

            // status code
            if (!res.ok) {
                return errResponse(res.status, 'VWorld API Error');
            }

            const resJson = await res.json(); // 응답을 json파일로 변환

            if (resJson.response.status !== 'OK') {
                return errResponse(400, resJson.response.error.text);
            }

            return dataResponse({lonLat: this.lonLat, result: resJson.response.result});
        } catch (err) {
            return serverErrResponse(err);
        }
    };
}
