import {
  Ellipsis,
  Share2Icon,
  Trash2Icon,
  VideoIcon,
  ImageIcon,
  XIcon,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";

interface EllipsisMenuProps {
  imageUrl?: string;
  videoUrl?: string;
  onDelete: () => void;
  text: {
    downloadImage: string;
    downloadVideo: string;
    share: string;
    delete: string;
    confirmDelete: string;
    cancel: string;
    deleteAction: string;
  };
}

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({
  imageUrl,
  videoUrl,
  onDelete,
  text,
}) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  // Close the main menu when clicking outside
  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  // Close the confirmation modal when clicking outside
  useEffect(() => {
    if (!showConfirm) return;
    const handleClick = (e: MouseEvent) => {
      if (
        confirmRef.current &&
        !confirmRef.current.contains(e.target as Node)
      ) {
        setShowConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [showConfirm]);

  /**
   * Handles file downloading by fetching the URL as a Blob.
   * This forces the browser to download the file instead of opening it in a new tab.
   */
  const download = async (url: string, filename: string) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();

      // Cleanup cleanup cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      setOpen(false);
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
      window.open(url, "_blank"); // Fallback for CORS issues
    }
  };

  /**
   * Handles sharing using the Web Share API.
   * Falls back to copying the URL to the clipboard if the API is not supported.
   */
  const handleShare = async () => {
    const shareUrl = videoUrl || imageUrl || window.location.href;
    const shareData = {
      title: "Check this out!",
      text: "Look at this amazing AI generation!",
      url: shareUrl,
    };

    try {
      if (navigator.share) {
        // Native mobile share sheet
        await navigator.share(shareData);
      } else {
        // Desktop clipboard fallback
        await navigator.clipboard.writeText(shareUrl);
        alert("Link copied to clipboard!");
      }
    } catch (error: any) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setOpen(false);
    }
  };

  return (
    <div className="relative" ref={menuRef}>
      {/* Trigger Button */}
      <button
        type="button"
        className="rounded-full transition-transform active:scale-95 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
      >
        <Ellipsis className="w-8 h-8 p-1.5 bg-violet-600 hover:bg-violet-500 text-white rounded-full shadow-lg" />
      </button>

      {/* Main Action Menu */}
      {open && (
        <div className="absolute right-0 mt-2 w-52 bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 z-50 overflow-hidden animate-in fade-in zoom-in duration-200 origin-top-right">
          <div className="py-1">
            {imageUrl && (
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-100 text-gray-700 text-sm transition-colors"
                onClick={() => download(imageUrl, "generated-image.png")}
              >
                <ImageIcon className="w-4 h-4 text-violet-600" />{" "}
                {text.downloadImage}
              </button>
            )}
            {videoUrl && (
              <button
                type="button"
                className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-100 text-gray-700 text-sm transition-colors"
                onClick={() => download(videoUrl, "generated-video.mp4")}
              >
                <VideoIcon className="w-4 h-4 text-violet-600" />{" "}
                {text.downloadVideo}
              </button>
            )}
            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-violet-100 text-gray-700 text-sm transition-colors"
              onClick={handleShare}
            >
              <Share2Icon className="w-4 h-4 text-blue-500" /> {text.share}
            </button>

            <div className="h-[1px] bg-gray-200/50 my-1" />

            <button
              type="button"
              className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-50 text-red-600 text-sm transition-colors"
              onClick={() => {
                setOpen(false);
                setShowConfirm(true);
              }}
            >
              <Trash2Icon className="w-4 h-4" /> {text.delete}
            </button>
          </div>
        </div>
      )}

      {/* Modal Backdrop & Confirm Modal */}
      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
          <div
            ref={confirmRef}
            className="bg-white rounded-3xl shadow-2xl p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-6 relative animate-in slide-in-from-bottom-4 duration-300"
          >
            {/* Close modal button */}
            <button
              type="button"
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              onClick={() => setShowConfirm(false)}
            >
              <XIcon className="w-5 h-5" />
            </button>

            {/* Icon & Message */}
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <Trash2Icon className="w-8 h-8 text-red-500" />
            </div>

            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">
                {text.confirmDelete}
              </h3>
              <p className="text-gray-500 text-sm mt-2">
                This action cannot be undone.
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 w-full">
              <button
                type="button"
                className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 transition-colors"
                onClick={() => setShowConfirm(false)}
              >
                {text.cancel}
              </button>
              <button
                type="button"
                className="flex-1 px-4 py-3 rounded-xl bg-red-500 hover:bg-red-600 text-white font-semibold transition-all shadow-lg shadow-red-200"
                onClick={() => {
                  setShowConfirm(false);
                  onDelete();
                }}
              >
                {text.deleteAction}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EllipsisMenu;
