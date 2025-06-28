import { motion } from "framer-motion";

// Card Base Reutilizável
export function Card({
  children,
  className = "",
  selected = false,
  onClick,
  ...props
}) {
  return (
    <motion.div
      className={`
        bg-gray-900/95 rounded-xl border-2 border-gray-500/90 
        shadow-xl backdrop-blur-sm transition-all duration-300 
        overflow-hidden hover:border-blue-400/80 hover:shadow-2xl 
        hover:shadow-blue-500/20 ring-1 ring-gray-600/50
        ${
          selected
            ? "border-blue-400 bg-blue-900/40 shadow-2xl shadow-blue-500/30 ring-2 ring-blue-400/50"
            : "hover:scale-[1.02] hover:bg-gray-800/95"
        } 
        ${className}
      `}
      onClick={onClick}
      whileHover={{ scale: selected ? 1 : 1.02 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

// Header do Card
export function CardHeader({ children, className = "" }) {
  return (
    <div
      className={`p-6 pb-4 border-b-2 border-gray-600/60 bg-gray-800/20 ${className}`}
    >
      {children}
    </div>
  );
}

// Conteúdo do Card
export function CardContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Footer do Card
export function CardFooter({ children, className = "" }) {
  return (
    <div
      className={`p-6 pt-4 border-t-2 border-gray-600/60 mt-auto bg-gray-800/20 ${className}`}
    >
      {children}
    </div>
  );
}

// Grid de Informações
export function InfoGrid({ children, className = "" }) {
  return (
    <div className={`grid grid-cols-2 gap-4 ${className}`}>{children}</div>
  );
}

// Célula de Informação
export function InfoCell({
  label,
  value,
  valueClass = "font-semibold text-white mt-1",
  className = "",
}) {
  return (
    <div
      className={`bg-gray-800/70 rounded-lg p-3 border-2 border-gray-600/60 transition-colors duration-200 hover:bg-gray-700/70 hover:border-gray-500/80 shadow-md hover:shadow-lg ${className}`}
    >
      <span className="text-gray-400 text-xs uppercase tracking-wide font-medium">
        {label}
      </span>
      <div className={valueClass}>{value}</div>
    </div>
  );
}

// Container Principal
export function MainContainer({ children, className = "" }) {
  return (
    <div
      className={`bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl overflow-hidden ${className}`}
    >
      {children}
    </div>
  );
}

// Header da Seção
export function SectionHeader({ children, className = "" }) {
  return (
    <div
      className={`border-b border-white/10 p-6 pb-4 bg-white/5 ${className}`}
    >
      {children}
    </div>
  );
}

// Conteúdo da Seção
export function SectionContent({ children, className = "" }) {
  return <div className={`p-6 ${className}`}>{children}</div>;
}

// Tags
export function Tag({ children, variant = "indoor", className = "" }) {
  const variants = {
    premium:
      "px-3 py-1 bg-gradient-to-r from-green-500/20 to-emerald-500/20 text-green-400 text-xs rounded-full font-medium border border-green-500/30",
    indoor:
      "px-3 py-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs rounded-full font-medium border border-blue-500/30",
    outdoor:
      "px-3 py-1 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-400 text-xs rounded-full font-medium border border-orange-500/30",
  };

  return (
    <span className={`${variants[variant]} ${className}`}>{children}</span>
  );
}

// Estado Vazio
export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className={`text-center py-12 ${className}`}
    >
      {Icon && <Icon className="w-16 h-16 text-gray-600 mx-auto mb-4" />}
      <p className="text-gray-400 mb-2 font-medium">{title}</p>
      <p className="text-sm text-gray-500 mb-6">{description}</p>
      {action && action}
    </motion.div>
  );
}

// Divisores
export function DividerVertical({ className = "" }) {
  return <div className={`h-8 w-px bg-gray-700 ${className}`}></div>;
}

export function DividerHorizontal({ className = "" }) {
  return <div className={`w-full h-px bg-gray-700/50 ${className}`}></div>;
}
