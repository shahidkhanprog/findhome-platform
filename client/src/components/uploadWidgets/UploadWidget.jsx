import { useEffect, useRef } from 'react';

const UploadWidget = ({ uwConfig, setPublicId, setAvatar }) => {
  const uploadWidgetRef = useRef(null);
  const uploadButtonRef = useRef(null);

  useEffect(() => {
    // Load Cloudinary script dynamically if not already loaded
    const loadCloudinaryScript = () => {
      return new Promise((resolve) => {
        if (window.cloudinary) {
          resolve(); // Already loaded
          return;
        }

        const script = document.createElement('script');
        script.src = 'https://upload-widget.cloudinary.com/global/all.js';
        script.async = true;
        script.onload = resolve;
        document.body.appendChild(script);
      });
    };

    const initializeUploadWidget = async () => {
      await loadCloudinaryScript();

      if (window.cloudinary && uploadButtonRef.current) {
        uploadWidgetRef.current = window.cloudinary.createUploadWidget(
          uwConfig,
          (error, result) => {
            if (!error && result && result.event === 'success') {
              console.log('Upload successful:', result.info);
              // setPublicId(result.info.public_id);
              setAvatar(result.info.secure_url); // Update avatar with the uploaded image URL
            }
          }
        );

        const buttonElement = uploadButtonRef.current;
        const handleUploadClick = () => {
          if (uploadWidgetRef.current) {
            uploadWidgetRef.current.open();
          }
        };

        buttonElement.addEventListener('click', handleUploadClick);

        return () => {
          buttonElement.removeEventListener('click', handleUploadClick);
        };
      }
    };

    const cleanup = initializeUploadWidget();

    return () => {
      cleanup.then((fn) => fn && fn());
    };
  }, [uwConfig, setPublicId]);

  return (
    <button
      ref={uploadButtonRef}
      id="upload_widget"
      className="mt-2 text-[12px] text-violet-600 font-semibold bg-transparent border-none cursor-pointer p-0 hover:text-violet-800 transition-colors"
      style={{ cursor: 'pointer' }} // optional visual confirmation
    >
      Change profile picture →
    </button>
  );
};

export default UploadWidget;