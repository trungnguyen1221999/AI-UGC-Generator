import { Loader2Icon, WandSparkles, Zap } from "lucide-react";
import { PrimaryButton } from "./Buttons";
import React from "react";

interface GenerateButtonProps {
  isGenerating: boolean;
  onClick?: (
    e: React.MouseEvent<HTMLButtonElement> | React.FormEvent<HTMLFormElement>,
  ) => void;
  disabled?: boolean;
  label: string;
  generatingLabel?: string;
  cost?: number;
  className?: string;
  type?: "button" | "submit";
}

export const GenerateButton: React.FC<GenerateButtonProps> = ({
  isGenerating,
  onClick,
  disabled,
  label,
  generatingLabel,
  cost,
  className = "",
  type = "submit",
}) => (
  <PrimaryButton
    type={type}
    className={`px-12 py-3 text-base shadow-lg w-full ${className}`}
    disabled={disabled || isGenerating}
    onClick={onClick}
  >
    {isGenerating ? (
      <span className="flex items-center gap-2 justify-center">
        <Loader2Icon className="w-5 h-5 animate-spin" />
        {generatingLabel || "Generating..."}
      </span>
    ) : (
      <span className="flex items-center gap-2 justify-center">
        <WandSparkles className="w-5 h-5" />
        <span>{label}</span>
        {typeof cost === "number" && (
          <span className="flex items-center gap-1 ml-2">
            <span>(</span>-{cost}
            <Zap className="w-4 h-4 fill-white text-violet-400" />
            <span>)</span>
          </span>
        )}
      </span>
    )}
  </PrimaryButton>
);
