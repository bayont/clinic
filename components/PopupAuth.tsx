import styles from "../styles/PopupAuth.module.css";

type Props = {
  auth: string;
};

export const PopupAuth = ({ auth }: Props) => {
  if (auth == "login")
    return (
      <>
        <div className={styles.popup}>Zalogowano!</div>
      </>
    );
  if (auth == "logout")
    return (
      <>
        <div className={styles.popup}>Wylogowano</div>
      </>
    );
  return (
    <>
      <div className={styles.popup}>
        <p>Zarejestrowano!</p>
      </div>
    </>
  );
};
