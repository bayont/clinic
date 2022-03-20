import prisma from "../../Prisma";
import { User, Session } from "../../types";

const EXPR_TIME = 1000 * 60 * 60; //godzina

export const createSession = async (user: User) => {
  return await prisma.session.create({
    data: {
      updated: new Date(),
      expires: new Date(new Date().getTime() + EXPR_TIME),
      uID: user.id as string,
    },
  });
};

export default createSession;
