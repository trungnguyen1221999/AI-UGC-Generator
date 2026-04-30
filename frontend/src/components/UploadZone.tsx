import { UploadIcon, XIcon } from "lucide-react";
import { uploadZoneText } from "../../public/assets/data";
import { useLanguage } from "../context/LanguageContext";

interface UploadZoneProps {
  label?: string;
  file?: File | null;
  onClear?: () => void;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const UploadZone = ({ label, file, onClear, onChange }: UploadZoneProps) => {
  const { language } = useLanguage();
  const t = uploadZoneText[language] || uploadZoneText["en"];
  return (
    <div className="relative w-full">
      <div
        className={`relative h-64 rounded-2xl border-2 border-dashed flex flex-col items-center justify-center bg-white/5 p-8 transition-all duration-300
        ${file ? "border-violet-500/40 bg-violet-900/10" : "border-white/10 hover:border-violet-400/40 hover:bg-white/10"}`}
      >
        {file ? (
          <div className="flex flex-col items-center gap-4 w-full">
            <div className="relative w-32 h-32 rounded-xl overflow-hidden border border-white/10 bg-white/10 flex items-center justify-center">
              <img
                src={URL.createObjectURL(file)}
                alt={t.previewAlt}
                className="object-cover w-full h-full"
              />
              {onClear && (
                <button
                  type="button"
                  onClick={onClear}
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white text-gray-800 rounded-full p-1 shadow"
                  aria-label={t.clearImage}
                >
                  <XIcon className="w-4 h-4" />
                </button>
              )}
            </div>
            <div className="text-center">
              <p className="text-base font-medium text-white truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>
        ) : (
          <label className="flex flex-col items-center gap-3 w-full cursor-pointer">
            <span className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-violet-500/10 border border-violet-400/20 mb-2">
              <UploadIcon className="w-7 h-7 text-violet-400" />
            </span>
            <span className="text-lg font-semibold text-white mb-1">
              {label || t.upload}
            </span>
            <span className="text-gray-400 text-sm mb-2">{t.dragDrop}</span>
            <input
              type="file"
              accept="image/*"
              onChange={onChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default UploadZone;
