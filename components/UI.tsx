"use client";
import { useEffect } from "react";

export const colors = {
  blue: "hsl(217, 91%, 60%)",
  green: "hsl(142, 76%, 36%)",
  yellow: "hsl(38, 92%, 50%)",
  red: "hsl(0, 84%, 60%)",
  cyan: "hsl(189, 94%, 43%)",
  purple: "hsl(262, 83%, 58%)",
  gray: "hsl(215, 16%, 47%)",
};

export function Btn({ 
  color = "blue", 
  children, 
  onClick, 
  small,
  variant = "solid",
  disabled = false,
  className = "",
}: {
  color?: "blue" | "green" | "red" | "yellow" | "cyan" | "gray" | "purple";
  children: React.ReactNode;
  onClick?: () => void;
  small?: boolean;
  variant?: "solid" | "outline" | "ghost";
  disabled?: boolean;
  className?: string;
}) {
  const colorMap: Record<string, { bg: string; hover: string; text: string }> = {
    blue: { bg: "bg-primary", hover: "hover:bg-primary/90", text: "text-primary" },
    green: { bg: "bg-success", hover: "hover:bg-success/90", text: "text-success" },
    red: { bg: "bg-destructive", hover: "hover:bg-destructive/90", text: "text-destructive" },
    yellow: { bg: "bg-warning", hover: "hover:bg-warning/90", text: "text-warning" },
    cyan: { bg: "bg-cyan-500", hover: "hover:bg-cyan-600", text: "text-cyan-500" },
    gray: { bg: "bg-muted-foreground", hover: "hover:bg-muted-foreground/90", text: "text-muted-foreground" },
    purple: { bg: "bg-purple-500", hover: "hover:bg-purple-600", text: "text-purple-500" },
  };

  const styles = colorMap[color];
  
  const baseClasses = `inline-flex items-center justify-center gap-2 font-semibold rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed ${
    small ? 'px-3 py-1.5 text-xs' : 'px-4 py-2 text-sm'
  }`;

  const variantClasses = {
    solid: `${styles.bg} text-white ${styles.hover} focus:ring-primary`,
    outline: `border-2 ${styles.text} border-current bg-transparent hover:bg-current/10 focus:ring-current`,
    ghost: `${styles.text} bg-transparent hover:bg-current/10 focus:ring-current`,
  };

  return (
    <button 
      onClick={onClick} 
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Alias for dashboard backwards compatibility
export const ModernButton = Btn;

export function Badge({ 
  color, 
  children,
  size = "default",
}: { 
  color: string; 
  children: React.ReactNode;
  size?: "sm" | "default";
}) {
  const colorClasses: Record<string, string> = {
    green: "bg-success/10 text-success border-success/20",
    blue: "bg-primary/10 text-primary border-primary/20",
    yellow: "bg-warning/10 text-warning border-warning/20",
    red: "bg-destructive/10 text-destructive border-destructive/20",
    gray: "bg-muted text-muted-foreground border-border",
    purple: "bg-purple-500/10 text-purple-500 border-purple-500/20",
  };

  return (
    <span className={`inline-flex items-center font-semibold rounded-full border ${
      colorClasses[color] || colorClasses.gray
    } ${size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"}`}>
      {children}
    </span>
  );
}

export function Table({ 
  heads, 
  rows,
  onRowClick,
}: {
  heads: string[];
  rows: React.ReactNode[][];
  onRowClick?: (index: number) => void;
}) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full">
        <thead>
          <tr className="bg-muted/50">
            {heads.map(h => (
              <th 
                key={h} 
                className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider whitespace-nowrap"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr 
              key={i}
              onClick={() => onRowClick?.(i)}
              className={`bg-card transition-colors ${onRowClick ? 'cursor-pointer hover:bg-accent' : 'hover:bg-muted/30'}`}
            >
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 text-sm text-foreground whitespace-nowrap">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function InfoBox({ 
  icon, 
  label, 
  value, 
  color,
  trend,
}: {
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: string;
  trend?: { value: string; positive: boolean };
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-4 flex items-center gap-4 card-hover">
      <div 
        className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
        style={{ backgroundColor: color + '15', color: color }}
      >
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground font-medium">{label}</p>
        <p className="text-2xl font-bold text-foreground truncate">{value}</p>
        {trend && (
          <p className={`text-xs font-medium ${trend.positive ? 'text-success' : 'text-destructive'}`}>
            {trend.positive ? '+' : ''}{trend.value}
          </p>
        )}
      </div>
    </div>
  );
}

export function FormRow({ 
  label, 
  children,
  required,
  error,
  icon,
}: { 
  label: string; 
  children: React.ReactNode;
  required?: boolean;
  error?: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label className="flex items-center gap-2 text-sm font-medium text-foreground">
        {icon && <span className="text-muted-foreground">{icon}</span>}
        {label}
        {required && <span className="text-destructive ml-1">*</span>}
      </label>
      <div>{children}</div>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

// Alias for dashboard backwards compatibility
export const FormField = FormRow;

export function Input({ 
  placeholder, 
  defaultValue, 
  value,
  onChange,
  type = "text",
  disabled = false,
  className = "",
}: {
  placeholder?: string; 
  defaultValue?: string; 
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <input
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors ${className}`}
    />
  );
}

// Alias for dashboard backwards compatibility
export const ModernInput = Input;

export function Select({ 
  options,
  value,
  onChange,
  placeholder,
  disabled = false,
  className = "",
}: { 
  options: string[] | { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <select 
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`w-full px-3 py-2 bg-card border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed transition-colors appearance-none cursor-pointer ${className}`}
      style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%239ca3af'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 0.5rem center', backgroundSize: '1.5em 1.5em', paddingRight: '2.5rem' }}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map(o => {
        if (typeof o === 'string') {
          return <option key={o} value={o}>{o}</option>;
        }
        return <option key={o.value} value={o.value}>{o.label}</option>;
      })}
    </select>
  );
}

// Alias
export const ModernSelect = Select;

export function Box({ 
  title, 
  color = "hsl(217, 91%, 60%)", 
  children, 
  headerRight,
  noPadding,
  className = "",
}: {
  title: string; 
  color?: string; 
  children: React.ReactNode; 
  headerRight?: React.ReactNode;
  noPadding?: boolean;
  className?: string;
}) {
  return (
    <div className={`bg-card rounded-xl border border-border shadow-card overflow-hidden ${className}`}>
      <div 
        className="px-4 py-3 border-b flex items-center justify-between gap-4"
        style={{ borderBottomColor: color + '33' }}
      >
        <h3 className="text-base font-semibold text-foreground flex items-center gap-2">
          <span className="w-1 h-4 rounded-full" style={{ backgroundColor: color }} />
          {title}
        </h3>
        {headerRight}
      </div>
      <div className={noPadding ? '' : 'p-4'}>{children}</div>
    </div>
  );
}

export function Card({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div 
      onClick={onClick}
      className={`bg-card rounded-xl border border-border shadow-card overflow-hidden ${onClick ? 'cursor-pointer card-hover' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`px-4 py-4 border-b border-border ${className}`}>{children}</div>;
}

export function CardTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <h3 className={`text-base font-semibold text-foreground ${className}`}>{children}</h3>;
}

export function CardContent({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`p-4 ${className}`}>{children}</div>;
}

export function StatCard({
  label,
  value,
  icon,
  color,
  href,
  trend,
}: {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  color: string;
  href?: string;
  trend?: { value: string; positive: boolean };
}) {
  const content = (
    <div 
      className="relative overflow-hidden rounded-xl p-5 card-hover"
      style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}dd 100%)` }}
    >
      <div className="relative z-10">
        <p className="text-white/80 text-sm font-medium">{label}</p>
        <p className="text-white text-3xl font-bold mt-1">{value}</p>
        {trend && (
          <p className={`text-sm font-medium mt-2 ${trend.positive ? 'text-green-200' : 'text-red-200'}`}>
            {trend.positive ? '+' : ''}{trend.value} vs mes anterior
          </p>
        )}
      </div>
      {icon && (
        <div className="absolute right-4 top-1/2 -translate-y-1/2 opacity-20">
          {icon}
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />
    </div>
  );

  if (href) {
    return (
      <a href={href} className="block">
        {content}
      </a>
    );
  }

  return content;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {icon && (
        <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-semibold text-foreground mb-1">{title}</h3>
      {description && (
        <p className="text-sm text-muted-foreground max-w-sm mb-4">{description}</p>
      )}
      {action}
    </div>
  );
}

export function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = "md",
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  size?: "sm" | "md" | "lg";
}) {
  if (!isOpen) return null;

  const sizeClasses = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-2xl",
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div 
        className="absolute inset-0 bg-black/50 animate-fade-in"
        onClick={onClose}
      />
      <div className={`relative bg-card rounded-2xl shadow-elevated w-full ${sizeClasses[size]} animate-slide-in`}>
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button 
            onClick={onClose}
            className="p-2 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div className="p-4">
          {children}
        </div>
      </div>
    </div>
  );
}

export function Tabs({
  tabs,
  activeTab,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  activeTab: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-muted rounded-lg">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onChange(tab.id)}
          className={`flex-1 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
            activeTab === tab.id
              ? 'bg-card text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

export function SearchInput({
  value,
  onChange,
  placeholder = "Buscar...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <div className={`relative ${className}`}>
      <svg 
        className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground"
        viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
      >
        <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-4 py-2 bg-card border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
      />
    </div>
  );
}

export function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-all duration-200 ${
        active
          ? 'bg-primary text-white'
          : 'bg-muted text-muted-foreground hover:text-foreground hover:bg-accent'
      }`}
    >
      {label}
    </button>
  );
}
export function Toast({
  message,
  type = "info",
  onClose,
}: {
  message: string;
  type?: "info" | "success" | "error" | "warning";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const colors = {
    info: "bg-primary border-primary",
    success: "bg-success border-success",
    error: "bg-destructive border-destructive",
    warning: "bg-warning border-warning",
  };

  return (
    <div className="fixed bottom-4 right-4 z-[100] animate-slide-in">
      <div className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-white shadow-elevated ${colors[type]}`}>
        <span className="text-sm font-bold">{message}</span>
        <button onClick={onClose} className="hover:opacity-70">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </div>
  );
}
