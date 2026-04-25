import { useState } from "react";
import { MdOutlineLock } from "react-icons/md";
import ForgotField from "./ForgotField";
import Spinner from "./Spinner";

/**
 * NewPasswordStep
 * ---------------
 * Step 2 of the ForgotPassword flow.
 * Collects and confirms the new password.
 *
 * Props:
 *   newPass       {string}
 *   confirmPass   {string}
 *   onNewPass     {function}   - updates newPass + clears its error
 *   onConfirmPass {function}   - updates confirmPass + clears its error
 *   onSubmit      {function}   - form submit handler
 *   errors        {object}     - { newPass, confirmPass }
 *   loading       {boolean}
 *   btnClass      {string}     - primary button class string
 */
const NewPasswordStep = ({
  newPass,
  confirmPass,
  onNewPass,
  onConfirmPass,
  onSubmit,
  errors,
  loading,
  btnClass,
}) => {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <ForgotField
        label="New Password"
        value={newPass}
        onChange={onNewPass}
        placeholder="Minimum 6 characters"
        icon={MdOutlineLock}
        error={errors.newPass}
        showToggle
        isVisible={showNew}
        onToggleShow={() => setShowNew((v) => !v)}
      />
      <ForgotField
        label="Confirm New Password"
        value={confirmPass}
        onChange={onConfirmPass}
        placeholder="Repeat new password"
        icon={MdOutlineLock}
        error={errors.confirmPass}
        showToggle
        isVisible={showConfirm}
        onToggleShow={() => setShowConfirm((v) => !v)}
      />
      <button type="submit" disabled={loading} className={btnClass}>
        {loading && <Spinner />}
        {loading ? "Saving…" : "Reset Password"}
      </button>
    </form>
  );
};

export default NewPasswordStep;
