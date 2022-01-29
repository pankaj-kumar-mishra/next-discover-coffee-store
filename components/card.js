import Link from "next/link";
import Image from "next/image";
import cls from "classnames";

import styles from "./card.module.css";

const Card = (props) => {
  // ? scroll false will show the page as in previous position but true will show page from start
  {
    /* <Link scroll={true}></Link> */
  }
  return (
    <Link href={props.href}>
      <a className={styles.cardLink}>
        <div className={cls("glass", styles.container)}>
          <div className={styles.cardHeaderWrapper}>
            <h2 className={styles.cardHeader}>{props.name}</h2>
          </div>
          <div className={styles.cardImageWrapper}>
            <Image
              alt={props.name}
              className={styles.cardImage}
              src={props.imgUrl}
              width={260}
              height={160}
            />
          </div>
        </div>
      </a>
    </Link>
  );
};

export default Card;
