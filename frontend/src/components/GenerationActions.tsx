import {
  DownloadIcon,
  Share2Icon,
  Trash2Icon,
  ImageIcon,
  VideoIcon,
} from "lucide-react";
import { useState } from "react";

interface GenerationActionsProps {
  imageUrl?: string;
  videoUrl?: string;
  onDelete: () => void;
}

const GenerationActions: React.FC<GenerationActionsProps> = ({
  imageUrl,
  videoUrl,
  onDelete,
}) => {
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <div className="flex gap-2 items-center">
      {imageUrl && (
        <a
          href={imageUrl}
          download
          rel="noopener noreferrer"
          title="Download image"
        >
          <ImageIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition" />
        </a>
      )}
      {videoUrl && (
        <a
          href={videoUrl}
          download
          rel="noopener noreferrer"
          title="Download video"
        >
          <VideoIcon className="w-5 h-5 text-indigo-400 hover:text-indigo-600 transition" />
        </a>
      )}
      <button
        type="button"
        title="Share"
        className="hover:text-indigo-600 text-indigo-400"
      >
        <Share2Icon className="w-5 h-5" />
      </button>
      <button
        type="button"
        title="Delete"
        className="hover:text-red-600 text-red-400"
        onClick={() => setShowConfirm(true)}
      >
        <Trash2Icon className="w-5 h-5" />
      </button>
      {showConfirm && (
        <div className="absolute z-50 bg-white text-gray-900 rounded-xl shadow-xl p-4 flex flex-col gap-3 border border-gray-200 left-1/2 -translate-x-1/2 top-10 min-w-[220px]">
          <div className="font-semibold text-base">
            Are you sure you want to delete?
          </div>
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-1 rounded bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium"
              onClick={() => setShowConfirm(false)}
            >
              Cancel
            </button>
            <button
              className="px-3 py-1 rounded bg-red-500 hover:bg-red-600 text-white font-medium"
              onClick={() => {
                setShowConfirm(false);
                onDelete();
              }}
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerationActions;
