import { useContext, useState } from "react";
import { StoreContext, storeActionTypes } from "../store/store-context";

const useTrackLocation = () => {
  const { dispatch } = useContext(StoreContext);

  // const [latLng, setLatLng] = useState("");
  const [locationErrMsg, setLocationErrMsg] = useState("");
  const [isFindingLocation, setIsFindingLocation] = useState(false);

  const success = (position) => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    // setLatLng(`${latitude},${longitude}`);
    dispatch({
      type: storeActionTypes.SET_LAT_LNG,
      payload: `${latitude},${longitude}`,
    });
    setLocationErrMsg("");
    setIsFindingLocation(false);
  };

  const error = () => {
    setLocationErrMsg("Unable to retrieve your location!");
    setIsFindingLocation(false);
  };

  const handleTrackLocation = () => {
    setIsFindingLocation(true);
    if (!navigator.geolocation) {
      setLocationErrMsg("Geolocation is not supported by your browser");
      setIsFindingLocation(false);
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
  };

  return {
    //latLng,
    isFindingLocation,
    locationErrMsg,
    handleTrackLocation,
  };
};

export default useTrackLocation;
