"use client";

import { Check, ChevronDown } from "lucide-react";
import { Select } from "@base-ui/react/select";

export interface ThemeSelectOption {
  value: string;
  label: string;
}

interface ThemeSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  options: readonly ThemeSelectOption[];
  placeholder?: string;
  name?: string;
  id?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

export function ThemeSelect({
  value,
  onValueChange,
  options,
  placeholder,
  name,
  id,
  required,
  disabled,
  className = "",
  "aria-label": ariaLabel,
}: ThemeSelectProps) {
  return (
    <Select.Root
      value={value}
      onValueChange={(nextValue) => onValueChange(nextValue ?? "")}
      items={options}
      name={name}
      id={id}
      required={required}
      disabled={disabled}
    >
      <Select.Trigger
        aria-label={ariaLabel}
        className={`flex h-12 w-full items-center justify-between rounded-lg border border-border bg-white px-4 text-sm text-brand-text outline-none transition-all duration-200 hover:border-brand-primary/50 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      >
        <Select.Value className="truncate" placeholder={placeholder} />
        <Select.Icon>
          <ChevronDown
            size={17}
            className="shrink-0 text-muted-foreground"
          />
        </Select.Icon>
      </Select.Trigger>

      <Select.Portal>
        <Select.Positioner
          side="bottom"
          sideOffset={6}
          align="start"
          alignItemWithTrigger={false}
          className="z-[100]"
        >
          <Select.Popup className="max-h-72 min-w-[var(--anchor-width)] overflow-hidden rounded-xl border border-border bg-white p-1.5 shadow-[0_12px_32px_rgba(23,35,31,0.16)]">
            <Select.List className="max-h-68 overflow-y-auto">
              {options.map((option) => (
                <Select.Item
                  key={option.value}
                  value={option.value}
                  className="grid cursor-pointer grid-cols-[1fr_16px] items-center rounded-lg px-3 py-2.5 text-sm text-brand-text outline-none transition-colors data-[highlighted]:bg-brand-primary/10 data-[highlighted]:text-brand-primary data-[selected]:font-semibold data-[selected]:text-brand-primary"
                >
                  <Select.ItemText>{option.label}</Select.ItemText>
                  <Select.ItemIndicator>
                    <Check size={16} strokeWidth={2.5} />
                  </Select.ItemIndicator>
                </Select.Item>
              ))}
            </Select.List>
          </Select.Popup>
        </Select.Positioner>
      </Select.Portal>
    </Select.Root>
  );
}
