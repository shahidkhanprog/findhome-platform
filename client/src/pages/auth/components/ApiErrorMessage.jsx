/**
 * ApiErrorMessage
 * ---------------
 * Centered red error banner for API-level errors (not field-level).
 * Renders nothing when message is empty.
 *
 * Props:
 *   message {string} - error text to display
 */
const ApiErrorMessage = ({ message }) => {
  if (!message) return null;

  return (
    <p className="text-sm text-red-500 text-center font-medium">{message}</p>
  );
};

export default ApiErrorMessage;