import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../Prisma";
import { Appointment } from "../../types";

export default async function appointmentUpdate(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const body = JSON.parse(req.body);
  const { appointment, userID } = body;
  await prisma.appointment.update({
    where: { id: appointment.id },
    data: {
      userID: userID,
      reserverd: true,
    },
  });
  res.status(200).send("OK");
}
