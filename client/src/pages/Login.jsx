const Login = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <input className="w-full mb-3 p-2 border rounded" placeholder="Email" />
      <input className="w-full mb-3 p-2 border rounded" placeholder="Password" type="password" />
      <button className="w-full bg-black text-white py-2 rounded">
        Login
      </button>
    </div>
  );
};

export default Login;
