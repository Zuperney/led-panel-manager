import { motion } from "framer-motion";
import { forwardRef } from "react";

// Input Field Moderno
export const InputField = forwardRef(
  (
    {
      label,
      value,
      onChange,
      type = "text",
      unit,
      error,
      tooltip,
      placeholder,
      icon: Icon,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-2 ${className}`}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {tooltip && (
              <span className="ml-1 text-gray-500 cursor-help" title={tooltip}>
                ℹ️
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Icon size={16} />
            </div>
          )}

          <input
            ref={ref}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className={`
            input-field
            ${Icon ? "pl-10" : ""}
            ${unit ? "pr-12" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `}
            {...props}
          />

          {unit && (
            <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm">
              {unit}
            </span>
          )}
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

InputField.displayName = "InputField";

// Select Field Moderno
export const SelectField = forwardRef(
  (
    {
      label,
      value,
      onChange,
      options = [],
      placeholder = "Selecione uma opção",
      error,
      tooltip,
      icon: Icon,
      className = "",
      ...props
    },
    ref
  ) => {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={`space-y-2 ${className}`}
      >
        {label && (
          <label className="block text-sm font-medium text-gray-300">
            {label}
            {tooltip && (
              <span className="ml-1 text-gray-500 cursor-help" title={tooltip}>
                ℹ️
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {Icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
              <Icon size={16} />
            </div>
          )}

          <select
            ref={ref}
            value={value}
            onChange={onChange}
            className={`
            select-field
            ${Icon ? "pl-10" : ""}
            ${error ? "border-red-500 focus:ring-red-500" : ""}
          `}
            {...props}
          >
            <option value="" disabled>
              {placeholder}
            </option>
            {options.map((option) => (
              <option
                key={option.value}
                value={option.value}
                className="bg-gray-800 text-white"
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="text-red-400 text-sm"
          >
            {error}
          </motion.p>
        )}
      </motion.div>
    );
  }
);

SelectField.displayName = "SelectField";

// Button Moderno
export const Button = ({
  children,
  variant = "primary",
  size = "md",
  icon: Icon,
  iconPosition = "left",
  loading = false,
  disabled = false,
  onClick,
  className = "",
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-transparent disabled:opacity-50 disabled:cursor-not-allowed";

  const variants = {
    primary: "btn-primary focus:ring-blue-500",
    secondary: "btn-secondary focus:ring-white/20",
    ghost: "btn-ghost focus:ring-white/20",
    danger: "btn-danger focus:ring-red-500",
    success: "btn-success focus:ring-green-500",
  };

  const sizes = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-sm" /* Conforme manual: py-2 px-4 */,
    lg: "px-6 py-3 text-base",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.98 }}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        ${baseClasses}
        ${variants[variant]}
        ${sizes[size]}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-4 h-4 border-2 border-current border-t-transparent rounded-full mr-2"
          />
          Carregando...
        </>
      ) : (
        <>
          {Icon && iconPosition === "left" && (
            <Icon size={16} className="mr-2" />
          )}
          {children}
          {Icon && iconPosition === "right" && (
            <Icon size={16} className="ml-2" />
          )}
        </>
      )}
    </motion.button>
  );
};

// Status Card Moderno
export const StatusCard = ({
  title,
  value,
  icon: Icon,
  color = "blue",
  trend,
  delay = 0,
  className = "",
  onClick,
}) => {
  const colorClasses = {
    blue: "bg-blue-500/20 text-blue-400 border-blue-500/30",
    green: "bg-green-500/20 text-green-400 border-green-500/30",
    purple: "bg-purple-500/20 text-purple-400 border-purple-500/30",
    orange: "bg-orange-500/20 text-orange-400 border-orange-500/30",
    red: "bg-red-500/20 text-red-400 border-red-500/30",
    gray: "bg-gray-500/20 text-gray-400 border-gray-500/30",
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      whileHover={{ scale: 1.02 }}
      onClick={onClick}
      className={`
        status-card
        ${onClick ? "cursor-pointer" : ""}
        ${className}
      `}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <p className="text-sm text-gray-400">{title}</p>
          <p className="text-lg font-bold text-white">{value}</p>
          {trend !== undefined && (
            <div
              className={`text-xs flex items-center gap-1 ${
                trend > 0
                  ? "text-green-400"
                  : trend < 0
                  ? "text-red-400"
                  : "text-gray-400"
              }`}
            >
              <span>{trend > 0 ? "↗" : trend < 0 ? "↘" : "→"}</span>
              <span>{Math.abs(trend)}%</span>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// Modal Moderno
export const Modal = ({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
  className = "",
}) => {
  if (!isOpen) return null;

  const sizes = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
    full: "max-w-6xl",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className={`
          glass-card w-full ${sizes[size]} max-h-[90vh] overflow-hidden
          ${className}
        `}
      >
        {title && (
          <div className="glass-header rounded-t-xl p-4 border-b border-white/10">
            <h2 className="text-lg font-semibold text-white">{title}</h2>
          </div>
        )}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          {children}
        </div>
      </motion.div>
    </motion.div>
  );
};

// Loading Spinner
export const LoadingSpinner = ({ size = "md", className = "" }) => {
  const sizes = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
    xl: "w-12 h-12",
  };

  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
      className={`
        border-2 border-current border-t-transparent rounded-full
        ${sizes[size]}
        ${className}
      `}
    />
  );
};

// Toast personalizado usando react-hot-toast
export { toast } from "react-hot-toast";
