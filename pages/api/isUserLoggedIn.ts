import { NextApiRequest } from "next";
import prisma from "../../Prisma";
import { Session, User } from "../../types";


type Return = {
  userID?: string;
};
export default async function isUserLoggedIn(req: NextApiRequest) {
  if (req.cookies.session == undefined) return false;
  const sessionID = req.cookies.session;
  const session: any = await prisma.session.findUnique({
    where: {
      id: sessionID,
    },
  });
  if(session == null)
  return false
  if (
    new Date(session.expires as string).getTime() - new Date().getTime() >
    0
  ) {
    
    return {
      userID: session.uID,
    };
  } else{
    
    await prisma.session.delete({
      where: {
        id: sessionID
      }
    })
    return false;
  } 
}
