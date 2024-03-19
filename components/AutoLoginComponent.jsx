/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
/* eslint-disable no-undef */

import { useLoginUserMutation } from "../slices/UserSlice";
const { loginUser } = useLoginUserMutation();

export default function AutoLogin() {
  useEffect(() => {
    const res = loginUser({
      email: "123456",
      password: "123456",
    });
  }, []);

  return;
}
