// src/components/profile/AvatarSection.jsx
import { MdCameraAlt } from "react-icons/md";
import UploadWidget from "../uploadWidgets/UploadWidget";

export default function AvatarSection({ avatar, username, memberYear, onAvatarChange }) {
  return (
    <div className="bg-white rounded-2xl border border-violet-100 shadow-sm shadow-violet-50 overflow-hidden">
      <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-400" />
      <div className="p-4 sm:p-5 flex flex-col sm:flex-row items-center gap-4">
        <div className="relative flex-shrink-0">
          {avatar ? (
            <img
              src={avatar}
              alt={username}
              className="w-16 h-16 rounded-full object-cover border-4 border-violet-100"
            />
          ) : (
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl select-none">
              {username?.charAt(0)?.toUpperCase() || "?"}
            </div>
          )}
          <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-violet-600 rounded-full flex items-center justify-center border-2 border-white">
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