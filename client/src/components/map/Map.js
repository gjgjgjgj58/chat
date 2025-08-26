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
import {Style, Text, Fill, Stroke, Icon} from 'ol/style';

const projection = 'EPSG:3857';

const setFeatureStyle = (text, avatar) => {
    const src = !avatar ? '/images/user.png' : avatar;
    return new Style({
        image: new Icon({
            src: src,
            width: 40, // px
            height: 40, // px
            // anchor: [0.5, 1], // Anchor the icon at the bottom center
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
            offsetY: 36 // Adjust vertical position relative to the point
        })
    });
}

const createFeature = (lonLat, text, avatar) => {
    const pointFeature = new Feature({
        geometry: new Point(fromLonLat(lonLat)),
        name: text, // 피처에 이름 속성 추가
    });
    pointFeature.setStyle(setFeatureStyle(text, avatar));
    return pointFeature;
}

export default function Map(props) {
    const [mapObject, setMapObject] = useState({});
    useEffect(() => {

        const simsimiLonLat = [127.0543980571477, 37.505139387657884]; // 심심이주식회사 위경도

        const vectorLayer = new VectorLayer({
            source: new VectorSource(),
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
                center: fromLonLat(simsimiLonLat, getProjection(projection)),
                zoom: 12
            }),
        });

        map.getTargetElement().classList.add('spinner');

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // 성공했을 때 위치 정보를 사용하는 코드
                    map.getTargetElement().classList.remove('spinner'); // load end
                    const myPositionLabel = '나의 위치';
                    const latitude = position.coords.latitude;  // 위도
                    const longitude = position.coords.longitude; // 경도
                    console.dir(position);
                    console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
                    const lonLat = [longitude, latitude]; // 추가할 위치의 경위도
                    vectorLayer.getSource().addFeature(createFeature(lonLat, myPositionLabel)); // vectorSource에 피처 추가
                    vectorLayer.getSource().addFeature(createFeature(simsimiLonLat, '심심이 위치', '/images/chatbot.png')); // vectorSource에 피처 추가
                    map.getView().animate({
                        center: fromLonLat(lonLat, getProjection(projection)),
                        zoom: 14,
                        duration: 800, // Animation duration in milliseconds
                        // Optional: add an easing function for different animation effects
                        // easing: easeIn, // Requires importing easeIn from 'ol/easing'
                    });
                },
                function (error) {
                    // 실패했을 때 처리하는 코드
                    map.getTargetElement().classList.remove('spinner'); // load end
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
                    alert(errorMessage);
                }
            );
        } else {
            map.getTargetElement().classList.remove('spinner'); // load end
            alert("이 브라우저에서는 Geolocation API를 지원하지 않습니다.");
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