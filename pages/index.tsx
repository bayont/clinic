import type {
  GetServerSideProps,
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
  NextApiRequest,
  NextPage,
} from "next";
import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";
import { DoctorBox } from "../components/DoctorBox";
import prisma from "../Prisma";
import { Doctor, Appointment, User } from "../types";
import isUserLoggedIn from "./api/isUserLoggedIn";
import { useState } from "react";

const logout = async () => {
  const r = await fetch("/api/logout", {
    method: "POST",
  })
  console.log(await r.json())
}

const Home = ({ isUserLogOn, doctors, userID }: Props) => {
  const [userLoggedIn, setIsUserLogon] = useState(isUserLogOn);
  return (
    <>
      <Head>
        <title>Przychodnia</title>
      </Head>
      <nav className={styles.flex}>
        <div className={styles.leftNav}>
          <div className={styles.logo}>przychodnia</div>
        </div>
        <div className={styles.rightNav}>
          {userLoggedIn && (
            <div className={styles.button}>
              <div onClick={() => {
                logout()
                setIsUserLogon(false)
              }} >Wyloguj się</div>
            </div>
          )}
          {!userLoggedIn && (
            <>
              <div className={styles.button}>
                <Link href="/login">Zaloguj się</Link>
              </div>

              <div className={styles.button}>
                <Link href="/register">Zarejestruj się</Link>
              </div>
            </>
          )}
        </div>
      </nav>
      <div className={styles.flexDoctors}>
        <DoctorBox
          doctor={doctors[0]}
          isUserLogOn={userLoggedIn as boolean}
          userID={userID}
        />
        <DoctorBox
          doctor={doctors[1]}
          isUserLogOn={userLoggedIn as boolean}
          userID={userID}
        />
      </div>
    </>
  );
};

type Props = {
  isUserLogOn: boolean;
  doctors: Doctor[];
  userID: string;
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  console.log(ctx.req.cookies);
  const resp = await isUserLoggedIn(ctx.req as NextApiRequest);

  let userID: string = "";
  let isUserLogOn: boolean = false;
  if (resp != false) {
    userID = resp.userID as string;
    isUserLogOn = true;
  }

  let doctors: Doctor[] = [];
  if ((await prisma.doctor.count()) < 1) {
    const paniDoktor: Doctor = {
      firstName: "Agata",
      lastName: "Woźniak",
      workingHoursFrom: "08:20",
      workingHoursTo: "14:00",
      imgPath: "/img/paniDoktor.png",
    };
    const panDoktor: Doctor = {
      firstName: "Karol",
      lastName: "Nowicki",
      workingHoursFrom: "14:20",
      workingHoursTo: "20:00",
      imgPath: "/img/panDoktor.png",
    };

    const paniDoktor2 = await prisma.doctor.create({ data: paniDoktor });
    const panDoktor2 = await prisma.doctor.create({ data: panDoktor });

    let from: Date = new Date(`2022 ${paniDoktor.workingHoursFrom}`);
    let to: Date = new Date(`2022 ${paniDoktor.workingHoursTo}`);
    const appointmentsPani = [];
    for (let i = from.getTime(); i <= to.getTime(); i += 1000 * 60 * 20) {
      const newAppointment: Appointment = {
        time: `${String(new Date(i).getHours()).padStart(2, "0")}:${String(
          new Date(i).getMinutes()
        ).padStart(2, "0")}`,
        doctorID: paniDoktor2.id,
      };
      appointmentsPani.push(
        await prisma.appointment.create({ data: newAppointment as any })
      );
    }
    from = new Date(`2022 ${panDoktor.workingHoursFrom}`);
    to = new Date(`2022 ${panDoktor.workingHoursTo}`);
    const appointmentsPan = [];
    for (let i = from.getTime(); i <= to.getTime(); i += 1000 * 60 * 20) {
      const newAppointment: Appointment = {
        time: `${String(new Date(i).getHours()).padStart(2, "0")}:${String(
          new Date(i).getMinutes()
        ).padStart(2, "0")}`,
        doctorID: panDoktor2.id,
      };
      appointmentsPan.push(
        await prisma.appointment.create({ data: newAppointment as any })
      );
    }
    doctors = [
      { ...paniDoktor2, appointments: appointmentsPani },
      { ...panDoktor2, appointments: appointmentsPan },
    ];
  } else {
    const doctorsDB: Doctor[] = await prisma.doctor.findMany();
    const doctorWithAppointments = await Promise.all(
      doctorsDB.map(async (doctor) => {
        let appointments = await prisma.appointment.findMany({
          where: { doctorID: doctor.id },
        });
        return { ...doctor, appointments: appointments };
      })
    );
    doctors = doctorWithAppointments;
  }

  return {
    props: {
      isUserLogOn,
      doctors,
      userID,
    },
  };
};

export default Home;
