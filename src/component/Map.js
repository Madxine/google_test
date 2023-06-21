import {
    Box,
    Button,
    ButtonGroup,
    Flex,
    HStack,
    IconButton,
    Input,
    SkeletonText,
    Text,
  } from '@chakra-ui/react'
  
  
  import { FaLocationArrow, FaTimes } from 'react-icons/fa'
  import {
    useJsApiLoader,
    GoogleMap,
    Marker,
    Autocomplete,
    DirectionsRenderer,
  } from '@react-google-maps/api'
  import { useEffect, useRef, useState } from 'react'
  import myIcon from '../assets/images.png'

  
  
  
  
  
  export default function Map() {
  
    const [locale, setLocale] = useState([]);
    const [lat, setLat] = useState();
    const [lng, setLng] = useState();
    const [addLocation, setAddLocation] = useState(false);
    const [addMessage, setAddMessage] = useState("");
    const [newLat, setNewLat] = useState(null);
    const [newLng, setNewLng] = useState(null);
  
  
    const getNewLocation = async ()=>{
      try{
        const res = await fetch('http://localhost:5000/location');
        const data = await res.json();
        
        setLocale(data.data)
        console.log(locale)
        
      }catch(err){
        console.log(err)
      }
    };
  
    useEffect(()=>{
      getNewLocation()
    },[]);
  
    // console.log(`outside ${locale[0].lat}`)
  
    const { isLoaded } = useJsApiLoader({
      googleMapsApiKey: process.env.REACT_APP_MAP_API_KEY,
      libraries: ['places'],
    })
  
    if (navigator.geolocation){
      navigator.geolocation.watchPosition((position)=>{
    setLat(position.coords.latitude)
    setLng(position.coords.longitude)
      })
    }
    const center = { lat: lat, lng: lng }
    const [map, setMap] = useState(/** @type google.maps.Map */ (null))
    const [directionsResponse, setDirectionsResponse] = useState(null)
    const [distance, setDistance] = useState('')
    const [duration, setDuration] = useState('')
  
    /** @type React.MutableRefObject<HTMLInputElement> */
    const originRef = useRef()
    /** @type React.MutableRefObject<HTMLInputElement> */
    const destiantionRef = useRef()
  
    if (!isLoaded) {
      return <SkeletonText />
    }
  
    async function calculateRoute() {
      if (originRef.current.value === '' || destiantionRef.current.value === '') {
        return
      }
      // eslint-disable-next-line no-undef
      const directionsService = new google.maps.DirectionsService()
      const results = await directionsService.route({
        origin: originRef.current.value,
        destination: destiantionRef.current.value,
        // eslint-disable-next-line no-undef
        travelMode: google.maps.TravelMode.DRIVING,
      })
      setDirectionsResponse(results)
      setDistance(results.routes[0].legs[0].distance.text)
      setDuration(results.routes[0].legs[0].duration.text)
    }
  
    function clearRoute() {
      setDirectionsResponse(null)
      setDistance('')
      setDuration('')
      originRef.current.value = ''
      destiantionRef.current.value = ''
    };
  
    const getAddress = (lat, lng) => {
      const geocoder = new window.google.maps.Geocoder();
      const latlng = new window.google.maps.LatLng(lat, lng);
      const request = {
          latLng: latlng
      }
      return new Promise((resolve, reject) => {
          geocoder.geocode(request, results => {
              results?.length ? resolve(results[0].formatted_address) : reject(null);
          });
      })
  };
  
    const mapClicked =  async (event) => {
      console.log(event.latLng.lat(), event.latLng.lng());
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      const address =  await getAddress(event.latLng.lat(), event.latLng.lng())
      console.log(address)
      setAddLocation(true);
      setNewLat(lat);
      setNewLng(lng);
  };
  console.log(`get or not? lat: ${newLat} lng: ${newLng}`);
  
  
  const handleSubmit = async(e)=>{
    e.preventDefault();
    let newLocation = {
       lat: newLat,
       lng: newLng,
       creator: addMessage
    }
    try{
      const res = await fetch("http://localhost:5000/location",{
        method:"POST",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify(newLocation)
      });
      setAddLocation(false)
    }catch(err){
      console.log(err)
    }
    };
    
  
  
    return (
      <Flex
        position='relative'
        flexDirection='column'
        alignItems='center'
        h='100vh'
        w='100vw'
      >
        <Box position='absolute' left={0} top={0} h='100%' w='100%'>
          {/* Google Map Box */}
          <GoogleMap
            center={center}
            zoom={15}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            options={{
              zoomControl: true,
              streetViewControl: true,
              mapTypeControl: true,
              fullscreenControl: true,
            }}
            onLoad={map => setMap(map)}
            onClick={mapClicked}
          >
            {addLocation?
           <Box 
            bgColor='black'
            color="white"
            onSubmit={handleSubmit}>
            
              <Button bgColor="black" variant="outlined" onClick={()=>setAddLocation(false)}>Close</Button>
              <Text >Location</Text>
              <Input disabled value={newLat} onChange={(e)=> setAddMessage(e.target.value)}/>
              <Input disabled value={newLng} onChange={(e)=> setAddMessage(e.target.value)}/>
              <Text >Your Name:</Text>
              <Input value={addMessage} onChange={(e)=> setAddMessage(e.target.value)}/>
              <Button onClick={handleSubmit}>Add Water Point</Button>
            
            </Box> : null
            }
            <Marker style={{width:"50px"}} icon={myIcon} position={center} />
           {locale?.map((lo)=> <Marker key={lo._id} position={{lat: lo.lat, lng: lo.lng}} />)}
  
            {directionsResponse && (
              <DirectionsRenderer directions={directionsResponse} />
            )}
          </GoogleMap>
        </Box>
      </Flex>
    )
  }
  
 
  
