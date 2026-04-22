import { Ellipsis, Share2Icon, Trash2Icon, VideoIcon, ImageIcon, XIcon } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { PrimaryButton, GhostButton } from "../components/Buttons";

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

const EllipsisMenu: React.FC<EllipsisMenuProps> = ({ imageUrl, videoUrl, onDelete, text }) => {
  const [open, setOpen] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handleClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  useEffect(() => {
    if (!showConfirm) return;
    const handleClick = (e: MouseEvent) => {
      if (confirmRef.current && !confirmRef.current.contains(e.target as Node)) {
        setShowConfirm(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showConfirm]);

  const download = (url: string, filename: string) => {
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    setOpen(false);
  };

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        className="rounded-full p-1 hover:bg-white/10 focus:outline-none"
        onClick={() => setOpen((v) => !v)}
        aria-label="Open actions"
      >
        <Ellipsis className="w-6 h-6 mt-5 mr-4 md:mt-3 md:mr-3 p-1 bg-violet-500 rounded-full" />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 w-48 bg-white/70 rounded-xl shadow-xl border border-gray-100 z-50 overflow-hidden">
          {imageUrl && (
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-violet-300 text-gray-800 text-sm text-left"
              onClick={() => download(imageUrl, 'image.png')}
            >
              <ImageIcon className="w-4 h-4" /> {text.downloadImage}
            </button>
          )}
          {videoUrl && (
            <button
              type="button"
              className="w-full flex items-center gap-2 px-4 py-2 hover:bg-violet-300 text-gray-800 text-sm text-left"
              onClick={() => download(videoUrl, 'video.mp4')}
            >
              <VideoIcon className="w-4 h-4" /> {text.downloadVideo}
            </button>
          )}
          <button
            type="button"
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-violet-300 text-gray-800 text-sm"
            onClick={() => setOpen(false)}
          >
            <Share2Icon className="w-4 h-4" /> {text.share}
          </button>
          <button
            type="button"
            className="w-full flex items-center gap-2 px-4 py-2 hover:bg-violet-300 text-red-600 text-sm"
            onClick={() => { setOpen(false); setShowConfirm(true); }}
          >
            <Trash2Icon className="w-4 h-4 text-red-500" /> {text.delete}
          </button>
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div ref={confirmRef} className="bg-white/80 rounded-2xl shadow-2xl px-8 py-7 min-w-[320px] flex flex-col gap-5 border border-gray-100 relative">
            <button
              type="button"
              className="absolute top-2 right-2 p-0.5 rounded-full bg-red-500 hover:bg-red-600 transition"
              onClick={() => setShowConfirm(false)}
              title="Close"
              aria-label="Close"
            >
              <XIcon className="w-4 h-4" />
            </button>
            <div className="font-semibold text-lg text-gray-900 text-center">
              {text.confirmDelete}
            </div>
            <div className="flex gap-3 justify-center mt-2">
              <button className="px-4 py-2"
                onClick={() => setShowConfirm(false)}
              >
                <p className="text-gray-700 font-mediums">{text.cancel}</p>
              </button>
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white font-semibold transition"
                onClick={() => { setShowConfirm(false); onDelete(); }}
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