import { toast } from "react-toastify";

export const confirmToast = ({ message, onConfirm }) => {
  toast(
    ({ closeToast }) => (
      <div className="space-y-3">
        <p className="text-sm">{message}</p>

        <div className="flex justify-end gap-3">
          <button
            onClick={closeToast}
            className="px-3 py-1 text-sm rounded bg-gray-600/30 hover:bg-gray-600/50"
          >
            Cancel
          </button>

          <button
            onClick={() => {
              onConfirm();
              closeToast();
            }}
            className="px-3 py-1 text-sm rounded bg-red-600 text-white hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    ),
    {
      closeOnClick: false,
      autoClose: false,
      draggable: false,
    }
  );
};
