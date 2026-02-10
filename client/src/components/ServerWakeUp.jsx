import { useEffect, useState } from "react";
import axios from "axios";

const ServerWakeUp = ({ onReady }) => {
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    let interval = setInterval(() => {
      setSeconds((s) => s + 1);
    }, 1000);

    const wakeServer = async () => {
      try {
        const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");
        await axios.get(`${baseUrl}/ping`);
        clearInterval(interval);
        onReady();
      } catch {
        // keep waiting silently
      }
    };

    wakeServer();

    return () => clearInterval(interval);
  }, [onReady]);

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 text-center px-4">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-gray-800 mb-4"></div>

      <p className="text-lg font-medium">
        Waking up server… please wait
      </p>

      <p className="text-sm text-gray-500 mt-2">
        {seconds}s elapsed
      </p>

      <p className="text-xs text-gray-400 mt-6">
        (Free-tier servers may take up to a minute)
      </p>
    </div>
  );
};

export default ServerWakeUp;
