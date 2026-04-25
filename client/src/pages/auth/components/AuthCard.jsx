/**
 * AuthCard
 * --------
 * Outer white card used on every auth page (Login, Register, ForgotPassword).
 *
 * Props:
 *   title       {string}      - Bold heading text
 *   subtitle    {string}      - Muted subheading below the title
 *   titleColor  {string}      - Tailwind text color class (default: "text-blue-600")
 *   children    {ReactNode}   - Form content
 */
const AuthCard = ({ title, subtitle, titleColor = "text-blue-600", children }) => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md">
        <h2 className={`text-3xl font-extrabold text-center mb-2 ${titleColor}`}>
          {title}
        </h2>
        {subtitle && (
          <p className="text-center text-gray-500 mb-8">{subtitle}</p>
        )}
        {children}
      </div>
    </div>
  );
};

export default AuthCard;