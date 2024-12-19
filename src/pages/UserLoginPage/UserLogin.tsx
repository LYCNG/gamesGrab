import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthProvider";

const labelConfig = {
  account: "會員帳號",
  password: "會員密碼",
  accountPlaceholder: "請輸入會員帳號",
  passwordPlaceholder: "請輸入會員密碼",
};

export const UserLogin = () => {
  const { login, error } = useAuth();
  const navigate = useNavigate();
  const [account, setAccount] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const result = login(account, password);
    if (result.success) {
      navigate(result.redirectTo);
    }
  };
  return (
    <div
      className="min-h-screen flex items-center justify-center w-full p-6 "
      style={{
        backgroundImage: 'url("/image/bg.png")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className="bg-white/20 text-black shadow-md rounded-lg px-8 py-6 max-w-md backdrop-blur-sm">
        <h1 className="text-2xl font-bold text-center mb-4 ">
          歡迎來參加抽獎小遊戲
        </h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="account"
              className="block text-sm font-medium text-black  mb-2"
            >
              {labelConfig.account}
            </label>
            <input
              type="text"
              id="account"
              value={account}
              onChange={(e) => setAccount(e.target.value)}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={labelConfig.accountPlaceholder}
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-blackmb-2"
            >
              {labelConfig.password}
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm rounded-md w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder={labelConfig.passwordPlaceholder}
              required
            />
          </div>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">{error}</div>
          )}

          <button
            type="submit"
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};
