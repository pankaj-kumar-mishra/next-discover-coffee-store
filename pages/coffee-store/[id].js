import Head from "next/head";
import { useRouter } from "next/router";
import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "../../styles/coffee-store.module.css";
import { fetchCoffeeStores } from "../../lib/coffee-stores";

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

  // console.log(paths);

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
  // console.log("Coffee Store Props", props);
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div>
        <h2>Loading...</h2>
      </div>
    );
  }

  // console.log(props.coffeeStore);
  if (Object.keys(props.coffeeStore).length === 0) {
    return (
      <div>
        <h2>Record not found</h2>
        <Link href="/">
          <a>Back to home</a>
        </Link>
      </div>
    );
  }

  const { address, name, neighbourhood, imgUrl } = props.coffeeStore;

  const handleUpvote = () => [console.log("handleUpvote")];

  return (
    <div className={styles.layout}>
      <Head>
        <title>{name}</title>
        <meta name="description" content={`${name} coffee store`}></meta>
      </Head>
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a>← Back to home</a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1504753793650-d4a2b783c15e?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2000&q=80"
            }
            width={600}
            height={360}
            className={styles.storeImg}
            alt={name}
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
            <p className={styles.text}>{address}</p>
          </div>
          {neighbourhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="near me icon"
              />
              <p className={styles.text}>{neighbourhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="star icon"
            />
            <p className={styles.text}>1</p>
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
