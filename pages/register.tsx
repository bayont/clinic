import { NextPage } from "next";
import AuthForm from "../components/AuthForm";

const Register: NextPage = () => {
  return <AuthForm register={true} />;
};

export default Register;
