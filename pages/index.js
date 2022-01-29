import { useEffect, useState } from "react";
import Head from "next/head";
import Image from "next/image";
import Banner from "../components/banner";
import Card from "../components/card";
import useTrackLocation from "../hooks/use-track-location";
import { fetchCoffeeStores } from "../lib/coffee-stores";
import styles from "../styles/Home.module.css";

export async function getStaticProps(context) {
  // * use below method to get data. Example
  const coffeeStoresData = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
}

const Home = (props) => {
  // console.log("Home Props ", props);
  const { isFindingLocation, latLng, locationErrMsg, handleTrackLocation } =
    useTrackLocation();
  const [coffeeStores, setCoffeeStores] = useState([]);
  const [coffeeStoresError, setCoffeeStoresError] = useState(null);
  // console.log({ latLng, locationErrMsg });

  useEffect(() => {
    if (latLng) {
      async function getNearByStores() {
        try {
          const nearStores = await fetchCoffeeStores(latLng, 20);
          // console.log({ nearStores });
          setCoffeeStores(nearStores);
        } catch (error) {
          console.log(error);
          setCoffeeStoresError(error.message);
        }
      }

      getNearByStores();
    }
  }, [latLng]);

  const handleOnNearbyClick = () => {
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name="description" content="Discover your local coffee shops!" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocation ? "Locating..." : "View stores nearby"}
          handleOnClick={handleOnNearbyClick}
        />
        {locationErrMsg && <p>Something went wrong: {locationErrMsg}</p>}
        {coffeeStoresError && <p>Something went wrong: {coffeeStoresError}</p>}
        <div className={styles.heroImage}>
          <Image
            src="/static/hero-image.png"
            width={700}
            height={400}
            alt="hero image"
          />
        </div>

        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Stores near me</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}

        {props.coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>New Delhi stores</h2>
            <div className={styles.cardLayout}>
              {props.coffeeStores.map((coffeeStore) => {
                return (
                  <Card
                    key={coffeeStore.id}
                    name={coffeeStore.name}
                    imgUrl={
                      coffeeStore.imgUrl ||
                      "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
                    }
                    href={`/coffee-store/${coffeeStore.id}`}
                  />
                );
              })}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Home;
