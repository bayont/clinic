import { NextApiRequest, NextApiResponse } from "next";

const logout = (req: NextApiRequest, res: NextApiResponse) => {
  req;
  res.setHeader("Set-Cookie", "session=");
  res.status(200).send(JSON.stringify(true));
};

export default logout;
