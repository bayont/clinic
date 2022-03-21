import prisma from "../../Prisma";
import { NextApiRequest, NextApiResponse } from "next";

import { User } from "../../types";

export const login = async (req: NextApiRequest, res: NextApiResponse) => {
  const user: User = JSON.parse(req.body);
  const resUser = await prisma.user.findUnique({
    where: {
      login: user.login,
    },
  });
  if (resUser != null)
    if (resUser.password == user.password) {
      res.status(200).send(JSON.stringify(true));
      return;
    }

  res.status(200).send(JSON.stringify(false));
};
export default login;
