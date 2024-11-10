import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, LayersControl, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import axios from 'axios';
const MapComponent = () => {
    // Layers
    const { BaseLayer, Overlay } = LayersControl;
    const [page, setpage] = useState(1);
    const [limit, setlimit] = useState(10);

    // States
    const [markers, setData] = useState([]);
    const [isOpen, setIsOpen] = useState(true);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [status, setstatus] = useState(null);

    // Effects
    useEffect(() => {
        const fetchCoordinates = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getCord?page=${page}&limit=${limit}`);
                setData(response.data);
                { page != 1 && setstatus("Page content from " + page + " - " + limit) };
            } catch (err) {
                setError(err.message);
                console.error("Error fetching data:", err);
            }
        };

        fetchCoordinates();

    }, [page, limit]);


    // Functions
    const toggleSidebar = () => {
        setIsOpen(!isOpen);
    };
    const toggleNavbar = () => {
        setIsOpen(!isOpen);
    };

    const sidebarwidth = isOpen ? '300px' : '30px';
    const postop = isOpen ? "40%" : "92%";
    let center = [19.7041, 77.1095];
    const Go = () => {
        setstatus("Loading...");
        const inputPage = document.querySelector('#page');
        const limit = document.querySelector('#limit');
        setpage(inputPage.value);
        setlimit(limit.value);
    }
    return (
        <div className="MapCover">
            <div className="sideNavbar">
                <img
                    src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/800px-Hamburger_icon.svg.png"
                    alt="menu"
                    width="20px"
                    style={{ margin: "10px" }}
                    height="20px"
                    className="menu-icon"
                    onClick={toggleNavbar}
                />
            </div>
            <div className="map-container">
                <div className="sidebar" style={{ width: sidebarwidth, top: postop }}>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/Hamburger_icon.svg/800px-Hamburger_icon.svg.png"
                        alt="menu"
                        width={isOpen ? "30px" : "20px"}
                        height="20px"
                        className="menu-icon"
                        onClick={toggleSidebar}
                    />

                    {/* If sidebar opened */}
                    {isOpen && (
                        <>
                            <h2>Markers Settings</h2>
                            <label htmlFor="text" >Page: </label>
                            <input type="number" defaultValue={1} id="page" />
                            <label htmlFor="text" style={{ margin: "10px" }}>Limit: </label>
                            <input type="number" defaultValue={10} id="limit" />
                            <button className="button-8" role="button" onClick={Go}>Go</button>
                            {status && (<div className='status'>{status}</div>)}

                            {selectedMarker &&
                                <div>
                                    <h3>Crop Details</h3>
                                    <ul>
                                        <li><strong>Crop Type:</strong> {selectedMarker[1]}</li>
                                        <li><strong>Crop Area:</strong> {selectedMarker[2]} hectares</li>
                                        <li><strong>Crop Production:</strong> {selectedMarker[3]} tons</li>
                                    </ul>
                                </div>
                            }
                        </>
                    )}
                </div>

                {/* Full Map */}
                <MapContainer center={center} zoom={6} style={{ height: "99vh", width: "100%" }}>
                    <LayersControl position="topright">
                        <BaseLayer name="Day">
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                        </BaseLayer>
                        <BaseLayer name="Night">
                            <TileLayer
                                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'

                            />
                        </BaseLayer>
                        <BaseLayer checked name="Street">
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                            />
                        </BaseLayer>
                        {markers.map((marker) => {
                            let iconPerson = new L.Icon({
                                iconUrl: `/Images/${marker[1]}.jpg`,
                                iconRetinaUrl: `/Images/${marker[1]}.jpg`,
                                iconSize: new L.Point(60, 60),
                                className: 'leaflet-div-icon'
                            });
                            const handleMarkerClick = (marker) => {
                                {
                                    sidebarwidth == "30px" && (
                                        toggleSidebar()
                                    )
                                }
                                setSelectedMarker(marker);
                            };
                            return (
                                <Overlay className="CropData" key={marker[0][0]} checked name={marker[0][1]}>
                                    <Marker
                                        position={marker[0]}
                                        icon={iconPerson}
                                        eventHandlers={{
                                            click: () => handleMarkerClick(marker), // Handle click event on marker
                                        }}
                                    >
                                    </Marker>
                                </Overlay>
                            )
                        })}
                    </LayersControl>
                </MapContainer>
            </div >
        </div>
    );
};

export default MapComponent;
