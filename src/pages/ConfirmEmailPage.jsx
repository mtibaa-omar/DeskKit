import { Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Button from "../components/Button";
import { useVerifyOtp, useResendOtp } from "../features/auth/useOtp";

export default function ConfirmEmailPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || "";
  
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const { isLoading: isVerifying, verifyOtp } = useVerifyOtp();
  const { isLoading: isResending, resendOtp } = useResendOtp();

  useEffect(() => {
    if (!email) {
      navigate("/signup", { replace: true });
    }
  }, [email, navigate]);

  const resetOtp = () => {
    setOtp(["", "", "", "", "", ""]);
    inputRefs.current[0]?.focus();
  };

  const handleChange = (index, value) => {
    if (value && !/^\d$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (value && index === 5 && newOtp.every(d => d !== "")) {
      verifyOtp(
        { email, token: newOtp.join("") },
        { onError: resetOtp }
      );
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = [...otp];
    pastedData.split("").forEach((char, i) => {
      if (i < 6) newOtp[i] = char;
    });
    setOtp(newOtp);

    if (pastedData.length === 6) {
      verifyOtp(
        { email, token: newOtp.join("") },
        { onError: resetOtp }
      );
    } else {
      inputRefs.current[pastedData.length]?.focus();
    }
  };

  const handleVerify = () => {
    if (otp.every(d => d !== "")) {
      verifyOtp(
        { email, token: otp.join("") },
        { onError: resetOtp }
      );
    }
  };

  if (!email) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8 md:p-10">
          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Mail className="w-10 h-10 text-white" />
            </div>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-900 mb-3">
            Verify Your Email
          </h1>

          <p className="text-center text-gray-600 mb-8">
            We sent a 6-digit code to
            <span className="font-semibold text-gray-900 block mt-1">{email}</span>
          </p>

          <div className="flex justify-center gap-2 md:gap-3 mb-6">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                className="w-12 h-14 md:w-14 md:h-16 text-center text-2xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                disabled={isVerifying}
              />
            ))}
          </div>

          <Button
            variant="primary"
            fullWidth
            size="lg"
            icon={CheckCircle}
            onClick={handleVerify}
            isLoading={isVerifying}
            disabled={!otp.every(d => d !== "")}
            className="mb-4"
          >
            Verify Email
          </Button>

          <div className="text-center mb-6">
            <span className="text-gray-500 text-sm">Didn't receive the code? </span>
            <button
              onClick={() => resendOtp(email)}
              disabled={isResending}
              className="text-blue-600 hover:text-blue-700 font-semibold text-sm disabled:opacity-50"
            >
              {isResending ? "Sending..." : "Resend Code"}
            </button>
          </div>

          <div className="pt-4 border-t border-gray-100">
            <Link
              to="/signup"
              className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Signup
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
