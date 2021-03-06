
import './App.css';
import { Display } from "./displayWeather";
import {useEffect, useState} from 'react'
import { TiWeatherPartlySunny } from 'react-icons/ti';


function App() {
  const [input,setInput]=useState('');
  const [display,setDisplay]=useState({"coord":{"lon":null,"lat":null},"weather":[{"id":null,"main":"","description":"","icon":""}],"base":"","main":{"temp":null,"feels_like":null,"temp_min":null,"temp_max":null,"pressure":null,"humidity":null},"visibility":null,"wind":{"speed":null,"deg":null},"clouds":{"all":null},"dt":null,"sys":{"type":null,"id":null,"country":"","sunrise":null,"sunset":null},"timezone":null,"id":null,"name":"","cod":null});
  const [loading , setLoading]=useState(false);
  const[errorMsg,setErrorMsg]=useState("");
  const [error,setError]=useState(false);

  function fetchWeather(){
  if(input==='')
  { setErrorMsg("Enter a valid city name👀");
    setError(true);
    return;
  }
  const apiKey="13393b032f8fdee237a93fad4cfb2a54";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${input}&appid=${apiKey}&units=metric`;
  setLoading(true);
  setError(false);
  
  fetch(url)
  .then(response => response.json())
  .then(data => {
    // do stuff with the data
     console.log(data);
     if(data.cod!=="404")
     setDisplay(data);
     else
     {
       setErrorMsg("Enter a valid city name👀");
       setError(true);
     }
     
      setLoading(false);
  })
  .catch(() => {
    setLoading("false");
    setErrorMsg("Not able to connect , please check your connection")
    setError(true); 
  });
}

// Step 1: Get user coordinates
function getCoordintes() {
	var options = {
		enableHighAccuracy: true,
		timeout: 5000,
		maximumAge: 0
	};

	function success(pos) {
		var crd = pos.coords;
		var lat = crd.latitude.toString();
		var lng = crd.longitude.toString();
		var coordinates = [lat, lng];
		console.log(`Latitude: ${lat}, Longitude: ${lng}`);
		getCity(coordinates);
		return;

	}

	function error(err) {
		console.warn(`ERROR(${err.code}): ${err.message}`);
	}

	navigator.geolocation.getCurrentPosition(success, error, options);
}

// Step 2: Get city name
async function getCity(coordinates) {
	var xhr = new XMLHttpRequest();
	var lat = coordinates[0];
	var lng = coordinates[1];

	// Paste your LocationIQ token below.
	xhr.open('GET', "https://us1.locationiq.com/v1/reverse.php?key=pk.d82ba6db6da0758f465df287fc1a507c&lat=" +
	lat + "&lon=" + lng + "&format=json", true);
	xhr.send();
	xhr.onreadystatechange = processRequest;
	xhr.addEventListener("readystatechange", processRequest, false);

	function processRequest(e) {
		if (xhr.readyState === 4 && xhr.status === 200) {
			var response = JSON.parse(xhr.responseText);
			var city = response.address.city;
       setInput(city);
      return;
		
		}
	}
}




useEffect(()=>{
  getCoordintes();
}
// eslint-disable-next-line react-hooks/exhaustive-deps
,[]);



  return( 
<>
<header>
  <h1>Weather App <TiWeatherPartlySunny style={{backgroundColor:'grey'}}/></h1>
</header>
{
!loading ?
<Display loading={loading} input={input} error={error} fetchWeather={fetchWeather} display={display} setInput={setInput}/>
:
(<div>
<h1>{loading && !error ?"Loading...":""}</h1>
</div>)}

 {
   error && <h1>{errorMsg}</h1>
 }
</>
);
}

export default App;
