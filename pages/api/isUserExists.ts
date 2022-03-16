import { NextApiRequest, NextApiResponse } from "next";
import { User } from "../../types";

export default async function isUserExists(
  req: NextApiRequest,
  res: NextApiResponse<boolean>
) {
  const login = req.body as string;
  console.log(login);
  const r = await fetch(`/api/users/${login}`);
  if (r.status == 200) res.status(200).json(true);
  else res.status(200).json(false);
}
