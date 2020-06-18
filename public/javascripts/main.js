function getLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            fecthWeather(position.coords.longitude, position.coords.latitude);
        })
    }
}

async function fecthWeather(lon, lat) {
    const res = await fetch(`/weather-by-coords?lon=${lon}&lat=${lat}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    });
    const data = await res.json();
    console.log(data);
}

getLocation();