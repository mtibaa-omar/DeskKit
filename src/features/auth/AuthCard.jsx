export function AuthCard({ title, subtitle, children }) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <img
              src="/logo3.png"
              alt="deskkit"
              className="h-16 w-16 rounded-2xl"
            />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
          {subtitle && <p className="text-gray-600">{subtitle}</p>}
        </div>

        <div className="bg-white rounded-xl border-2 border-gray-200 p-8 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}

export default AuthCard;
