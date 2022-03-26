type User = {
  id?: string;
  login: string;
  password: string;
  sessions?: Session[];
};

type Session = {
  id?: string;
  created?: string;
  updated?: string;
  expires?: string;
  user?: User;
  uID: string;
};

type Doctor = {
  id?: string;
  firstName: string;
  lastName: string;
  workingHoursFrom: string;
  workingHoursTo: string;
  imgPath?: string;
  appointments?: Appointment[];
};

type Appointment = {
  id?: string;
  time: string;
  doctor?: Doctor;
  doctorID: string;
  reserved?: boolean;
  userID?: string;
};

export type { User, Session, Doctor, Appointment };
