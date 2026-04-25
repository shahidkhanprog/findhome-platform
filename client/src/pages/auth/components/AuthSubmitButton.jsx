/**
 * AuthSubmitButton
 * ----------------
 * Full-width blue submit button with loading state.
 * Used identically in Login and Register.
 *
 * Props:
 *   isLoading   {boolean}  - shows loading label and disables button
 *   label       {string}   - default label (e.g. "Login")
 *   loadingLabel {string}  - label shown while loading (e.g. "Logging in...")
 */
const AuthSubmitButton = ({ isLoading, label, loadingLabel }) => {
  return (
    <button
      type="submit"
      disabled={isLoading}
      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors disabled:bg-blue-300"
    >
      {isLoading ? loadingLabel : label}
    </button>
  );
};

export default AuthSubmitButton;