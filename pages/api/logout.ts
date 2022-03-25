import { NextApiRequest, NextApiResponse } from "next";
import prisma from "../../Prisma";

type Cookies = {
  session: string
}

const logout = async (req: NextApiRequest, res: NextApiResponse) => {
  const cookies = req.cookies;
  await prisma.session.delete({
    where: {
      id: cookies.session
    }
  })
  res.setHeader("Set-Cookie", "session=; path=/; HttpOnly;");
  res.status(200).send(JSON.stringify(true));
};

export default logout;
