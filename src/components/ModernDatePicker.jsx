import { useState, forwardRef } from "react";
import DatePicker, { registerLocale } from "react-datepicker";
import { ptBR } from "date-fns/locale";
import "react-datepicker/dist/react-datepicker.css";

// Registrar locale português
registerLocale("pt-BR", ptBR);

// Componente customizado para o input do DatePicker
const CustomDateInput = forwardRef(
  ({ value, onClick, placeholder, className }, ref) => (
    <div className="relative w-full">
      <input
        ref={ref}
        value={value}
        onClick={onClick}
        placeholder={placeholder}
        readOnly
        className={`input-field w-full cursor-pointer ${className}`}
      />
    </div>
  )
);

CustomDateInput.displayName = "CustomDateInput";

export const ModernDatePicker = ({
  selected,
  onChange,
  placeholder = "Selecione uma data",
  className = "",
  error,
  ...props
}) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale="pt-BR"
      dateFormat="dd/MM/yyyy"
      placeholderText={placeholder}
      customInput={<CustomDateInput className={className} />}
      popperClassName="modern-datepicker"
      calendarClassName="modern-calendar"
      dayClassName={(date) => "modern-day"}
      weekDayClassName={(date) => "modern-weekday"}
      monthClassName={(date) => "modern-month"}
      timeClassName={(date) => "modern-time"}
      showPopperArrow={false}
      popperPlacement="bottom"
      popperModifiers={[
        {
          name: "preventOverflow",
          options: {
            rootBoundary: "viewport",
            tether: false,
            altAxis: true,
          },
        },
        {
          name: "flip",
          options: {
            behavior: ["bottom", "top"],
          },
        },
      ]}
      {...props}
    />
  );
};

export default ModernDatePicker;
