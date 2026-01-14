const Register = () => {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 border rounded-lg">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>

      <input
        type="text"
        placeholder="Name"
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="email"
        placeholder="Email"
        className="w-full mb-3 p-2 border rounded"
      />

      <input
        type="password"
        placeholder="Password"
        className="w-full mb-3 p-2 border rounded"
      />

      <button className="w-full bg-black text-white py-2 rounded">
        Register
      </button>
    </div>
  );
};

export default Register;
