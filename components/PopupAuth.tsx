import styles from "../styles/PopupAuth.module.css";

type Props = {
  auth: string;
};

export const PopupAuth = ({ auth }: Props) => {
  console.log(auth);
  if (auth == "login")
    return (
      <>
        <div className={styles.popup}>Zalogowano!</div>
      </>
    );
  if (auth == "logout")
    return (
      <>
        <div className={styles.popup}>Wylogowano!</div>
      </>
    );
  if (auth == "register")
    return (
      <>
        <div className={styles.popup}>Zarejestrowano!</div>
      </>
    );
};
