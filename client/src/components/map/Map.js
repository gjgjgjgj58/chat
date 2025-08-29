import React, {useState, useEffect} from 'react';
import 'ol/ol.css';
import Title from "@/components/map/Title";
import {Map as OlMap, View} from 'ol';
import {fromLonLat, toLonLat, get as getProjection} from 'ol/proj';
import {Tile as TileLayer} from 'ol/layer';
import {XYZ} from 'ol/source';
import VectorSource from 'ol/source/Vector';
import VectorLayer from 'ol/layer/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import {Style, Text, Fill, Stroke, Icon} from 'ol/style';
import Overlay from 'ol/Overlay';
import Select from 'ol/interaction/Select';
import {geocoding} from "@/api/api";
import {axiosResponse} from "@/utils/common";

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
        avatar: avatar, // 피처에 아바타 속성 추가
    });
    pointFeature.setStyle(setFeatureStyle(text, avatar));
    return pointFeature;
}

export default function Map(props) {
    const [mapObject, setMapObject] = useState({});
    useEffect(() => {

        const apiKey = process.env.REACT_APP_VWORLD_API_KEY;
        const myPositionLabel = '나의 위치';
        const myPositionSrc = props.outletContext.user.avatar;
        const simsimiLabel = '심심이 위치';
        const simsimiLonLat = [127.0543980571477, 37.505139387657884]; // 심심이주식회사 위경도
        const simsimiSrc = '/images/chatbot.png'; // 심심이 아바타

        const vectorLayer = new VectorLayer({
            source: new VectorSource(),
            zIndex: 2
        });

        const vworldBaseLayer = new TileLayer({
            source: new XYZ({url: `https://api.vworld.kr/req/wmts/1.0.0/${apiKey}/Base/{z}/{y}/{x}.png`}),
            properties: {name: 'base-vworld-base'},
            zIndex: 1,
            preload: Infinity
        });

        /**
         * Elements that make up the popup.
         */
        const container = document.getElementById('popup');
        const content = document.getElementById('popup-content');
        const closer = document.getElementById('popup-closer');

        /**
         * Create an overlay to anchor the popup to the map.
         */
        const overlay = new Overlay({
            element: container,
            autoPan: {
                animation: {
                    duration: 250,
                },
            },
            offset: [0, -20]
        });

        /**
         * Add a click handler to hide the popup.
         * @return {boolean} Don't follow the href.
         */
        closer.onclick = function () {
            overlay.setPosition(undefined);
            closer.blur();
            const interactions = map.getInteractions();
            let selectInteraction;
            interactions.forEach((interaction) => {
                if (interaction instanceof Select) {
                    selectInteraction = interaction;
                }
            });
            if (selectInteraction) {
                selectInteraction.getFeatures().clear();
            }
            return false;
        };

        const map = new OlMap({
            layers: [
                vworldBaseLayer,
                vectorLayer,
            ],
            target: 'map',
            view: new View({
                projection: getProjection(projection),
                center: fromLonLat(simsimiLonLat, getProjection(projection)),
                zoom: 14
            }),
            overlays: [overlay],
        });

        map.getTargetElement().classList.add('spinner');

        const selectSingleClick = new Select({
            style: function (feature) {
                return setFeatureStyle(feature.get('name'), feature.get('avatar'));
            }
        });

        selectSingleClick.on('select', (e) => {
            const selectedFeature = e.selected[0];
            if (selectedFeature) {
                const coordinate = selectedFeature.getGeometry().getCoordinates();
                setTimeout(async function () {
                    const res = await geocoding(toLonLat(coordinate, getProjection(projection)));

                    axiosResponse(
                        res,
                        async () => {
                            const feature = await setAddress(res, selectedFeature);
                            content.innerHTML = '<p>' + feature.get("name") + '</p><code>' + feature.get("address") + '</code>';
                            overlay.setPosition(coordinate);
                        },
                        () => alert(res.data.message)
                    );
                });
            }
            const deselectedFeature = e.deselected[0];
            if (deselectedFeature && !selectedFeature) {
                overlay.setPosition(undefined);
                closer.blur();
                return false;
            }
        });

        map.addInteraction(selectSingleClick);

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                function (position) {
                    // 성공했을 때 위치 정보를 사용하는 코드
                    map.getTargetElement().classList.remove('spinner'); // load end
                    const latitude = position.coords.latitude;  // 위도
                    const longitude = position.coords.longitude; // 경도
                    console.dir(position);
                    console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
                    const lonLat = [longitude, latitude]; // 추가할 위치의 경위도
                    vectorLayer.getSource().addFeature(createFeature(lonLat, myPositionLabel, myPositionSrc)); // vectorSource에 피처 추가
                    vectorLayer.getSource().addFeature(createFeature(simsimiLonLat, simsimiLabel, simsimiSrc)); // vectorSource에 피처 추가
                    map.getView().animate({
                        center: fromLonLat(lonLat, getProjection(projection)),
                        zoom: 16,
                        duration: 400, // Animation duration in milliseconds
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

    const setAddress = async (res, feature) => {
        let address = null;
        if (res.data && res.data.result) {
            // 지번
            address = res.data.result[0].text;
        }
        if (res.data.result.length > 1) {
            // 도로명주소
            address = res.data.result[1].text;
        }
        if (feature && address) {
            feature.set('address', address);
        }
        return feature;
    };

    return (
        <div className={'chatApp__mapContainer'}>
            <Title owner={props.outletContext.user.name}/>
            <div id="map" value={mapObject}></div>
            <div id="popup" className={'ol-popup'}>
                <a href="#" id="popup-closer" className={'ol-popup-closer'}></a>
                <div id="popup-content"></div>
            </div>
        </div>
    );
}