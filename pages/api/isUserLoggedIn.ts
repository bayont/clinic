import { NextApiRequest } from "next";
import prisma from "../../Prisma";
import { Session, User } from "../../types";

export const isUserLoggedIn = async (req: NextApiRequest) => {
  const sessionID = req.cookies.session;
  const session: any = await prisma.session.findUnique({
    where: {
      id: sessionID,
    },
  });
  if (
    new Date(session.expires as string).getTime() - new Date().getTime() >
    0
  ) {
    return (session as Session).user;
  } else return false;
};

export default isUserLoggedIn;
