import React, {useState, useEffect} from 'react';
import 'ol/ol.css';
import Title from "@/components/map/Title";
import {Map as OlMap, View} from 'ol';
import {fromLonLat, get as getProjection} from 'ol/proj';
import {Tile as TileLayer} from 'ol/layer';
import {OSM, XYZ} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Style, Text, Fill, Stroke} from 'ol/style';
import CircleStyle from 'ol/style/Circle';

const projection = 'EPSG:3857';

const setTextStyle = (text) => {
    return new Style({
        image: new CircleStyle({
            radius: 6,
            fill: new Fill({
                color: 'blue'
            }),
            stroke: new Stroke({
                color: 'white',
                width: 1.5
            })
        }),
        text: new Text({
            text: text, // Text content
            font: '14px Calibri,sans-serif',
            fill: new Fill({
                color: 'black'
            }),
            stroke: new Stroke({
                color: 'white',
                width: 3
            }),
            offsetY: 20 // Adjust vertical position relative to the point
        })
    });
}

export default function Map(props) {
    const [mapObject, setMapObject] = useState({});
    useEffect(() => {
        const vectorSource = new VectorSource();
        const vectorLayer = new VectorLayer({
            source: vectorSource,
            zIndex: 2
        });
        const vworldBaseLayer = new TileLayer({
            source: new XYZ({url: 'http://xdworld.vworld.kr:8080/2d/Base/202002/{z}/{x}/{y}.png'}),
            properties: {name: 'base-vworld-base'},
            zIndex: 1,
            preload: Infinity
        });
        const map = new OlMap({
            layers: [
                vworldBaseLayer,
                vectorLayer,
            ],
            target: 'map',
            view: new View({
                projection: getProjection(projection),
                center: fromLonLat([126.752, 37.4713], getProjection(projection)),
                zoom: 12
            }),
        });

        map.getTargetElement().classList.add('spinner');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // 성공했을 때 위치 정보를 사용하는 코드
                    map.getTargetElement().classList.remove('spinner'); // load end
                    const latitude = position.coords.latitude;  // 위도
                    const longitude = position.coords.longitude; // 경도
                    console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
                    const lonLat = [longitude, latitude]; // 추가할 위치의 경위도
                    const pointFeature = new Feature({
                        geometry: new Point(fromLonLat(lonLat)),
                        name: '나의 위치', // 피처에 이름 속성 추가
                    });
                    // 지도에 표시하거나 다른 위치 기반 서비스에 활용할 수 있습니다.
                    pointFeature.setStyle(setTextStyle("나의 위치"));
                    vectorSource.addFeature(pointFeature); // vectorSource에 피처 추가
                    map.getView().setCenter(fromLonLat(lonLat, getProjection(projection))); // 위치 이동
                    map.getView().setZoom(16);
                },
                function (error) {
                    // 실패했을 때 처리하는 코드
                    let errorMessage = "위치 정보를 가져오는 데 실패했습니다.";
                    switch (error.code) {
                        case error.PERMISSION_DENIED:
                            errorMessage = "사용자가 위치 정보 접근을 거부했습니다."
                            break;
                        case error.POSITION_UNAVAILABLE:
                            errorMessage = "위치 정보를 사용할 수 없습니다."
                            break;
                        case error.TIMEOUT:
                            errorMessage = "위치 정보 요청이 시간 초과되었습니다."
                            break;
                        case error.UNKNOWN_ERROR:
                            errorMessage = "알 수 없는 오류가 발생했습니다."
                            break;
                    }
                    console.error(errorMessage);
                }
            );
        } else {
            console.log("이 브라우저에서는 Geolocation API를 지원하지 않습니다.");
        }

        setMapObject({map});

        return () => map.setTarget(undefined);
    }, []);

    return (
        <>
            <Title owner={props.outletContext.user.name}/>
            <div id="map" value={mapObject}></div>
        </>
    );
}