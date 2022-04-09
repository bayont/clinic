import { useRouter } from "next/router";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import type { User } from "../types";
import styles from "../styles/AuthForm.module.css";
import classNames from "classnames";
import { motion, AnimatePresence } from "framer-motion";

type Props = {
  register?: boolean;
};

export const AuthForm = ({ register = true }: Props) => {
  const [user, setUser] = useState({ login: "", password: "" } as User);
  const [isTaken, setIsTaken] = useState(false);
  const [authFailure, setAuthFailure] = useState(false);

  const router = useRouter();

  const registerHandle = async (event: FormEvent) => {
    event.preventDefault();
    const res = await fetch("/api/register", {
      headers: { contentType: "application/json" },
      method: "POST",
      body: JSON.stringify(user),
    });
    router.push("/?auth=register", "/");
  };
  const loginHandle = async (event: FormEvent) => {
    setAuthFailure(false);
    event.preventDefault();
    const res = await fetch("/api/login", {
      headers: { contentType: "application/json" },
      method: "POST",
      body: JSON.stringify(user),
    });
    const resp = await res.json();
    if (resp) {
      router.push("/?auth=login", "/");
    } else {
      setAuthFailure(true);
    }
  };

  const checkUser = async (login: string) => {
    const r = await fetch(`/api/isLoginTaken`, {
      body: login,
      method: "POST",
    });
    const response: boolean = await r.json();
    setIsTaken(response);
    return response;
  };

  return (
    <>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <motion.div className={styles.innerContainer} layout>
            <form
              className={styles.form}
              onSubmit={(register && registerHandle) || loginHandle}
            >
              <motion.div className={styles.inputContainer}>
                {" "}
                <label className={styles.label} htmlFor="login">
                  Nazwa użytkownika{" "}
                </label>
                <input
                  placeholder="Nazwa użytkownika"
                  className={classNames(styles.input)}
                  type="text"
                  name="login"
                  onChange={(e) => {
                    if (register) {
                      checkUser(e.target.value);
                    }
                    setUser({
                      login: e.target.value,
                      password: user.password,
                    } as User);
                  }}
                />
                <AnimatePresence>
                  {register && isTaken ? (
                    <>
                      <motion.div
                        layout
                        className={styles.error}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 50, opacity: 0 }}
                        transition={{ type: "spring" }}
                      >
                        Użytkownik o tej nazwie już istnieje.
                      </motion.div>
                    </>
                  ) : (
                    ""
                  )}
                </AnimatePresence>
              </motion.div>
              <div className={styles.inputContainer}>
                <label className={styles.label} htmlFor="password">
                  Hasło{" "}
                </label>
                <input
                  placeholder="Hasło"
                  className={classNames(styles.input)}
                  type="password"
                  name="password"
                  onChange={async (e) => {
                    setUser({
                      login: user.login,
                      password: e.target.value,
                    } as User);
                  }}
                />
              </div>
              <div className={styles.submitParent}>
                <input
                  className={styles.submit}
                  type="submit"
                  value={(register && "Zarejestruj się") || "Zaloguj się"}
                />
              </div>
              <AnimatePresence>
                {register == false && authFailure ? (
                  <>
                    <motion.div
                      layout
                      className={styles.error}
                      initial={{ y: 50, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 50, opacity: 0 }}
                      transition={{ type: "spring" }}
                    >
                      Użytkownik lub hasło niepoprawne!
                    </motion.div>
                  </>
                ) : (
                  ""
                )}
              </AnimatePresence>
            </form>
          </motion.div>
        </div>
      </div>
    </>
  );
};

export default AuthForm;
