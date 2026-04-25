import { MdOutlineEmail } from "react-icons/md";
import ForgotField from "./ForgotField";
import Spinner from "./Spinner";

/**
 * EmailStep
 * ---------
 * Step 0 of the ForgotPassword flow.
 * Collects the user's email and triggers OTP dispatch.
 *
 * Props:
 *   email       {string}
 *   onChange    {function}   - updates email + clears errors
 *   onSubmit    {function}   - form submit handler
 *   error       {string}     - email field error
 *   loading     {boolean}
 *   btnClass    {string}     - primary button class string
 */
const EmailStep = ({ email, onChange, onSubmit, error, loading, btnClass }) => {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ForgotField
        label="Email Address"
        type="email"
        value={email}
        onChange={onChange}
        placeholder="ahmad@example.com"
        icon={MdOutlineEmail}
        error={error}
      />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading && <Spinner />}
        {loading ? "Sending Code…" : "Send Reset Code"}
      </button>
    </form>
  );
};

export default EmailStep;
