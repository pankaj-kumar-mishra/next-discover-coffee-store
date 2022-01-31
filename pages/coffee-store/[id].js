import { useContext, useState, useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";
import useSWR from "swr";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { StoreContext } from "../../store/store-context";
import { fetcher, isEmpty } from "../../utils";

export async function getStaticProps(context) {
  const { params } = context;

  const coffeeStoresData = await fetchCoffeeStores();

  return {
    props: {
      // ? propsData || {} => fixed the "Error: Failed to load static props"
      coffeeStore:
        coffeeStoresData.find((item) => item.id.toString() === params.id) || {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores();

  const paths = coffeeStoresData.map((item) => {
    return {
      params: {
        id: item.id.toString(),
      },
    };
  });

  return {
    // paths: [{ params: { id: "0" } }, { params: { id: "1" } }],
    paths,
    // ? it redirects to 404 page if any path not found/returned by getStaticPaths
    // fallback: false,
    /* 
    it pass that static path to getStaticProps to fetch/get data for first time 
     ? if it found then it cached it in CDN so next other users can have that data from CDN 
    */
    fallback: true,
  };
}

const CoffeeStore = (props) => {
  const router = useRouter();
  const id = router.query?.id;
  const {
    state: { coffeeStores },
  } = useContext(StoreContext);
  const [coffeeStore, setCoffeeStore] = useState(props.coffeeStore);
  const [voting, setVoting] = useState(0);

  const { data, error, isValidating } = useSWR(
    `/api/getCoffeeStoreById?id=${id}`,
    fetcher
  );

  useEffect(() => {
    if (data?.status) {
      setCoffeeStore(data.data[0]);
      setVoting(data.data[0].voting);
    }
  }, [data]);

  useEffect(() => {
    if (isEmpty(props.coffeeStore) && coffeeStores.length > 0) {
      const currStore = coffeeStores.find(
        (store) => store.id.toString() === id
      );
      if (currStore) {
        setCoffeeStore(currStore);
        handleCreateCoffeeStore(currStore);
      }
    } else {
      handleCreateCoffeeStore(props.coffeeStore);
    }
  }, [coffeeStores, id, props.coffeeStore]);

  const handleUpvote = async () => {
    try {
      const options = {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
      };
      const response = await fetch("/api/updateUpvoteCoffeeStore", options);
      const resData = await response.json();
      if (resData.status) {
        setVoting(resData.data[0].voting);
      }
    } catch (error) {
      // console.log(error);
    }
  };

  const handleCreateCoffeeStore = async (data) => {
    try {
      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };
      await fetch("/api/createCoffeeStore", options);
      // const response = await fetch("/api/createCoffeeStore", options);
      // const resData = await response.json();
      // console.log(resData);
    } catch (error) {
      // console.log(error);
    }
  };

  if (router.isFallback) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <h2>Something went wrong!!!</h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    );
  }

  // if (Object.keys(props.coffeeStore).length === 0) {
  if (isEmpty(coffeeStore) && !isValidating) {
    return (
      <div>
        <h2>Record not found</h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    );
  }

  return (
    <div className={styles.layout}>
      <Head>
        <title>{coffeeStore?.name}</title>
        <meta
          name="description"
          content={`${coffeeStore?.name} coffee store`}
        ></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{coffeeStore?.name}</h1>
          </div>
          <Image
            src={
              coffeeStore?.imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={coffeeStore?.name}
          />
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places icon"
            />
            <p className={styles.text}>{coffeeStore?.address}</p>
          </div>
          {coffeeStore?.neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{coffeeStore?.neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>{voting}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvote}>
            Up vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
