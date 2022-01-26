import Link from "next/link";
import { useRouter } from "next/router";

const CoffeeStore = () => {
  const { query } = useRouter();
  return (
    <div>
      <h1>Coffee Store {query?.id}</h1>
      <br />
      <Link href="/">
        <a>Back to home</a>
      </Link>
      <br />
      <Link href="/coffee-store/dynamic">
        <a>Go to dynamic</a>
      </Link>
    </div>
  );
};

export default CoffeeStore;
