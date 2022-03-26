import prisma from "../../Prisma";
import { NextApiRequest, NextApiResponse } from "next";
import { Appointment, User } from "../../types";

const getUserAppointments = async (
  res: NextApiResponse,
  req: NextApiRequest
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
  if (appointment != null) res.status(200).json(appointment);
  else res.status(200).json(null);
};
