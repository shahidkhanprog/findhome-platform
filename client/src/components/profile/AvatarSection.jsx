// src/components/profile/AvatarSection.jsx
import { MdCameraAlt } from "react-icons/md";
import UploadWidget from "../uploadWidgets/UploadWidget";

export default function AvatarSection({ avatar, username, memberYear, onAvatarChange }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm shadow-gray-50 overflow-hidden">
      <div className="h-1 w-full bg-gray-500" />
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-16 h-16 rounded-full object-cover border-4 border-gray-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gray-600 flex items-center justify-center text-white font-bold text-xl select-none">
              {username?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gray-600 rounded-full flex items-center justify-center border-2 border-white">
            <MdCameraAlt size={11} className="text-white" />
          </div>
        </div>

        <div className="flex-1 min-w-0 text-center sm:text-left">
          <p className="text-[15px] font-bold text-slate-800 truncate">
            {username || "Your Name"}
          </p>
          <p className="text-[11px] text-slate-400 mt-0.5">
            Member since {memberYear}
          </p>
          <div className="mt-2">
            <UploadWidget
              uwConfig={{
                cloudName: "droah7qf8",
                uploadPreset: "FindHome",
                multiple: false,
                cropping: true,
                folder: "user_avatars",
                maxFileSize: 5000000,
                clientAllowedFormats: ["jpg", "jpeg", "png"],
              }}
              setAvatar={onAvatarChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}