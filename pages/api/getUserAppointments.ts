import prisma from "../../Prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Appointment, User } from "../../types";

const getUserAppointments = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const userID: string | null = req.body;
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
    res.status(200).json({ appointment, doctor });
  } else res.status(200).send("null");
};

export default getUserAppointments;
