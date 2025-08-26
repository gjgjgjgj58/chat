import React, {useState, useEffect} from 'react';
import 'ol/ol.css';
import Title from "@/components/map/Title";
import {Map as OlMap, View} from 'ol';
import {fromLonLat, get as getProjection} from 'ol/proj';
import {Tile as TileLayer} from 'ol/layer';
import {OSM} from 'ol/source';

export default function Map(props) {
    const [mapObject, setMapObject] = useState({});
    useEffect(() => {
        const map = new OlMap({
            layers: [
                new TileLayer({
                    source: new OSM()
                })
            ],
            target: 'map',
            view: new View({
                projection: getProjection('EPSG:3857'),
                center: fromLonLat([126.752, 37.4713], getProjection('EPSG:3857')),
                zoom: 13
            })
        });
        setMapObject({map});
        return () => null;
    }, []);

    return (
        <>
            <Title owner={props.outletContext.user.name}/>
            <div id="map" value={mapObject}></div>
        </>
    );
}