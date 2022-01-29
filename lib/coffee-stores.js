import { createApi } from "unsplash-js";

const unsplashApi = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
  //...other fetch options
});

const getUrlForCoffeeStores = (latLng, query, limit, version = "20220128") => {
  return `https://api.foursquare.com/v3/places/nearby?ll=${latLng}&query=${query}&limit=${limit}&v=${version}`;
};

const getListOfCoffeeStorePhotos = async () => {
  const photosResponse = await unsplashApi.search.getPhotos({
    query: "coffee shop",
    perPage: 30,
  });
  const photos = photosResponse.response?.results || [];
  return photos.map((result) => result.urls["small"]);
};

export const fetchCoffeeStores = async (
  latLng = "28.656397351175222,77.18852247748002",
  limit = 6
) => {
  const options = {
    method: "GET",
    headers: {
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
      Accept: "application/json",
    },
  };
  const reqData = {
    // latLng: "28.656397351175222,77.18852247748002",
    // lat: 28.656397351175222,
    // lng: 77.18852247748002,
    // limit: 6,
    query: "coffee stores",
    version: "20220128", //YYYYMMDD
  };
  const photos = await getListOfCoffeeStorePhotos();
  const response = await fetch(
    getUrlForCoffeeStores(latLng, reqData.query, limit),
    options
  );
  const data = await response.json();
  // console.log(data);
  const transformedData =
    data?.results?.map((venue, idx) => {
      return {
        // ...venue,
        id: venue.fsq_id,
        address: venue.location.address || "",
        name: venue.name,
        neighbourhood:
          venue.location.neighborhood || venue.location.crossStreet || "",
        imgUrl: photos[idx],
      };
    }) || [];

  return transformedData;
};
