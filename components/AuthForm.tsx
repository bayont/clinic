import { useRouter } from "next/router";
import {
  ChangeEvent,
  ChangeEventHandler,
  FormEvent,
  useEffect,
  useState,
} from "react";
import type { User } from "../types";

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
      console.log();
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
      <h1>{(register && "Rejestracja") || "Logowanie"}</h1>
      <form onSubmit={(register && registerHandle) || loginHandle}>
        <div>
          <label htmlFor="login">Login: </label>
          <input
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
          {register && isTaken ? (
            <>
              <div className="error">Użytkownik o tej nazwie już istnieje.</div>
            </>
          ) : (
            ""
          )}
        </div>
        <div>
          <label htmlFor="password">Hasło: </label>
          <input
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
        <div>
          <input
            type="submit"
            value={(register && "Zarejestruj się") || "Zaloguj się"}
          />
        </div>
        {register == false && authFailure ? (
          <>
            <div className="error">Użytkownik lub hasło niepoprawne!</div>
          </>
        ) : (
          ""
        )}
      </form>
    </>
  );
};

export default AuthForm;
