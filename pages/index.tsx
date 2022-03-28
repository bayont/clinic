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
import { useEffect, useState } from "react";
import { PopupAuth } from "../components/PopupAuth";
import getUserAppointments from "./api/getUserAppointments";
import { useRouter } from "next/router";

const Home = ({
  isUserLogOn,
  doctors,
  userID,
  auth,
  userAppointments,
}: Props) => {
  const [userLoggedIn, setIsUserLogon] = useState(isUserLogOn);
  const [authParam, setAuthParam] = useState(auth);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const logout = async () => {
    const r = await fetch("/api/logout", {
      method: "POST",
    });
    router.push("/", "/", { scroll: false });
  };
  useEffect(() => {
    getUser();
  }, []);
  const getUser = async () => {
    const r = await fetch(`/api/users/${userID}`, {
      method: "GET",
    });
    const userRes: User = await r.json();
    setUser(userRes);
  };
  return (
    <>
      <Head>
        <title>Przychodnia</title>
      </Head>
      <div className={styles.popUpAuth}>
        {authParam && (
          <>
            <PopupAuth auth={authParam} />
          </>
        )}
      </div>
      <nav className={styles.flex}>
        <div className={styles.leftNav}>
          <div className={styles.logo}>przychodnia</div>
        </div>
        <div className={styles.loggedAs}>
          {userLoggedIn && (
            <div className={styles.flexLogin}>
              Zalogowano jako:{" "}
              <span className={styles.userLogin}> {user?.login}</span>
            </div>
          )}
        </div>
        <div className={styles.rightNav}>
          {userLoggedIn && (
            <div className={`${styles.button}`}>
              <div
                onClick={() => {
                  logout();
                  setIsUserLogon(false);
                }}
              >
                Wyloguj się
              </div>
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
          userAppointments={userAppointments as RestAppointmentRes}
        />
        <DoctorBox
          doctor={doctors[1]}
          isUserLogOn={userLoggedIn as boolean}
          userID={userID}
          userAppointments={userAppointments as RestAppointmentRes}
        />
      </div>
    </>
  );
};
type RestAppointmentRes = {
  appointment: Appointment;
  doctor: Doctor;
};
type Props = {
  isUserLogOn: boolean;
  doctors: Doctor[];
  userID: string;
  auth?: string;
  userAppointments?: RestAppointmentRes;
};

export const getServerSideProps: GetServerSideProps = async (
  ctx: GetServerSidePropsContext
) => {
  const auth: string | null = ctx.query.auth as string | null;
  console.log(ctx.query);

  const resp = await isUserLoggedIn(ctx.req as NextApiRequest);

  let userID: string = "";
  let isUserLogOn: boolean = false;
  if (resp != false) {
    userID = resp.userID as string;
    isUserLogOn = true;
  }
  let userAppointments = null;
  let appointment;
  if (userID != null) {
    appointment = await prisma.appointment.findFirst({
      where: {
        userID,
      },
    });
  } else appointment = null;
  if (appointment != null) {
    const doctor = await prisma.doctor.findUnique({
      where: {
        id: appointment.doctorID,
      },
    });
    userAppointments = { appointment, doctor };
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
      auth: auth || null,
      userAppointments,
    },
  };
};

export default Home;
