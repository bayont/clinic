import Image from "next/image";
import type { Appointment, Doctor, User } from "../types";
import styles from "../styles/DoctorBox.module.css";
import { useState } from "react";
import Link from "next/link";
import popupStyles from "../styles/Popup.module.css";

type Props = {
  doctor: Doctor;
  isUserLogOn: boolean;
  userID?: string;
};

type Popup = {
  show: boolean;
  loginMsg?: boolean;
  doctor?: Doctor;
  appointment?: Appointment;
};

const makeAppointment: Function = async (popup: Popup, userID: string) => {
  const resp = await fetch("/api/appointmentUpdate", {
    method: "POST",
    body: JSON.stringify({ appointment: popup.appointment, userID: userID }),
  });
};

export const DoctorBox = ({ doctor, isUserLogOn, userID }: Props) => {
  let classes = `${styles.flexImg}`;
  const [popup, setPopup] = useState({ show: false } as Popup);
  const [userAppointments, setUserAppointments] = useState<Appointment | null>(
    null
  );
  const checkIfUserHasAlreadyAppointment = async () => {
    const resp = await fetch("/api/getUserAppointments", {
      method: "POST",
      body: userID,
    });
    const r: Appointment | null = await resp.json();
    console.log(r);
    setUserAppointments(r);
  };
  doctor.firstName == "Karol" && (classes += ` ${styles.reverse}`);

  return (
    <div>
      {popup.show &&
        (isUserLogOn ? (
          <div className={popupStyles.popup}>
            <div className={popupStyles.innerBox}>
              <h2>Potwierdzenie rejestracji do lekarza</h2>
              <hr />
              {userAppointments != null ? (
                <>
                  <p>Masz już umówioną wizytę.</p>
                  <p>
                    u Doktora:{" "}
                    <b>
                      {userAppointments.doctor?.firstName}{" "}
                      {userAppointments.doctor?.lastName}
                    </b>
                  </p>
                  <p>
                    O godzinie: <b>{userAppointments.time}</b>
                  </p>
                  <p>Czy chcesz zmienić swoja wizytę na: </p>
                </>
              ) : (
                <>
                  <p>Czy chcesz umówić się na wizytę:</p>
                </>
              )}
              <p>Czy chcesz umówić się na wizytę:</p>
              <p>
                Lekarz:{" "}
                <b>
                  {popup.doctor?.firstName} {popup.doctor?.lastName}
                </b>
              </p>
              <p>
                Godzina: <b>{popup.appointment?.time}</b>
              </p>
              <button
                onClick={() => {
                  makeAppointment(popup, userID);
                  setPopup({ show: false });
                }}
                className={popupStyles.buttonYes}
              >
                Tak
              </button>
              <button
                onClick={() => {
                  setPopup({ ...popup, show: false });
                }}
                className={popupStyles.buttonNo}
              >
                Nie
              </button>
            </div>
          </div>
        ) : (
          <div className={popupStyles.popup}>
            <div className={popupStyles.innerBox}>
              <h2>Jesteś niezalogowany!</h2>
              <hr />
              <p>Zaloguj się lub stwórz konto.</p>
              <Link href={"/register"}>
                <button className={popupStyles.buttonYes}>
                  Zarejestruj się
                </button>
              </Link>
              <Link href={"/login"}>
                <button
                  onClick={() => {
                    setPopup({ ...popup, show: false });
                  }}
                  className={popupStyles.buttonNo}
                >
                  Zaloguj się
                </button>
              </Link>
            </div>
          </div>
        ))}

      <div>
        <h1
          className={`${styles.h1} ${
            doctor.firstName == "Karol" ? styles.textAlignRight : ""
          }`}
        >
          dr hab.{" "}
          <span className={styles.colored}>
            {doctor.firstName} {doctor.lastName}
          </span>
        </h1>
      </div>
      <div className={classes}>
        <div>
          <Image
            className={`${doctor.firstName == "Karol" ? styles.img : ""}`}
            width={400}
            height={400}
            src={doctor.imgPath as string}
          ></Image>
          <div></div>
        </div>
        <div className={styles.terminyBox}>
          <div className={styles.heading}>Terminarz</div>
          <ul className={styles.ulGrid}>
            {doctor.appointments?.map((app) => {
              return (
                <li
                  onClick={(e) => {
                    checkIfUserHasAlreadyAppointment();
                    setPopup({ show: true, doctor: doctor, appointment: app });
                  }}
                  className={
                    app.reserved
                      ? `${styles.li}`
                      : `${styles.li} ${styles.liAvailable}`
                  }
                  key={app.id}
                >
                  <span className={styles.time}>{app.time}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};
