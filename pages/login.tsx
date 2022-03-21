import { NextPage } from "next";
import AuthForm from "../components/AuthForm";

const Login: NextPage = (props) => {
  return <AuthForm register={false} />;
};

export default Login;
