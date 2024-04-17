import { Modal, Button, Form, ProgressBar } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { updateVideo, uploadVideo } from "../../api/index";
import { AxiosError, AxiosResponse } from "axios";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Video } from "../../types";
import { useVideo } from "../../context/videos";

function EditVideoForm({ videoId, onClose, videos }) {
  const { register, handleSubmit } = useForm();
  const onSubmit = async (data) => {
    try {
      await updateVideo({ videoId, ...data });
      onClose();
      videos();
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <div className="mb-4">
        <label htmlFor="title" className="block font-medium text-gray-800">
          Title
        </label>
        <input
          type="text"
          id="title"
          {...register("title", { required: true })}
          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800"
        />
      </div>
      <div className="mb-4">
        <label
          htmlFor="description"
          className="block font-medium text-gray-800"
        >
          Description
        </label>
        <textarea
          id="description"
          {...register("description", { required: true })}
          className="border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800"         />
      </div>
      <div className="mb-4">
        <label htmlFor="published" className="block font-medium text-gray-800">
          Published
        </label>
        <div className="flex items-center">
          <input
            type="checkbox"
            id="published"
            {...register("published")}
            className="form-checkbox h-5 w-5 text-blue-600"
          />
          <label htmlFor="published" className="ml-2">
            Published
          </label>
        </div>
      </div>
      <Button
        variant="primary"
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
      >
        Save
      </Button>
    </Form>
  );
}

// function UploadVideo() {
//   const [show, setShow] = useState(false);
//   const [progress, setProgress] = useState(0);
//   const [video, setVideo] = useState<Video>(null);
//   const videos = useVideo();

//   const handleUpload = async (acceptedFiles) => {
//     const formData = new FormData();
//     formData.append("video", acceptedFiles[0]);
//     try {
//       const response = await uploadVideo({
//         formData,
//         config: {
//           onUploadProgress: (progressEvent) => {
//             const percent = Math.round(
//               (progressEvent.loaded * 100) / progressEvent.total
//             );
//             setProgress(percent);
//           },
//         },
//       });
//       setVideo(response);
//       setShow(false);
//     } catch (error) {
//       console.error("Error uploading video:", error);
//     }
//   };

//   return (
//     <>
//       <button
//         className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
//         onClick={() => setShow(true)}
//       >
//         Upload Video
//       </button>
//       <Modal
//         show={show}
//         onHide={() => setShow(false)}
//         backdrop={true}
//         keyboard={false}
//         centered
//         className="max-w-md"
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>Upload Video</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           {progress === 0 && (
//             <Dropzone onDrop={handleUpload}>
//               {({ getRootProps, getInputProps }) => (
//                 <section>
//                   <div
//                     {...getRootProps()}
//                     className="w-full rounded-md cursor-pointer h-80 border-2 border-dashed border-gray-400 flex items-center justify-center hover:border-blue-500 focus:outline-none"
//                   >
//                     <input {...getInputProps()} />
//                     <div className="text-center">
//                       <div className="flex justify-center mb-2">
//                         <svg
//                           className="h-12 w-12 text-gray-400"
//                           viewBox="0 0 24 24"
//                           fill="none"
//                           stroke="currentColor"
//                         >
//                           <path
//                             strokeLinecap="round"
//                             strokeLinejoin="round"
//                             strokeWidth={2}
//                             d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
//                           />
//                         </svg>
//                       </div>
//                       <p className="text-gray-500">
//                         Drag 'n' drop some files here, or click to select files
//                       </p>
//                     </div>
//                   </div>
//                 </section>
//               )}
//             </Dropzone>
//           )}
//           {progress > 0 && (
//             <ProgressBar now={progress} label={`${progress}%`} animated />
//           )}
//           {progress === 100 && (
//             <EditVideoForm
//               videoId={video.videoId}
//               onClose={() => setShow(false)}
//               videos={videos}
//             />
//           )}
//         </Modal.Body>
//       </Modal>
//     </>
//   );
// }
// function CustomModal({ show, onClose, children }) {
//   return (
//     <>
//       {show && (
//         <div className="fixed z-50 inset-0 overflow-y-auto">
//           <div className="flex items-center justify-center min-h-screen">
//             <div className="bg-white rounded-lg shadow-2xl border-4 border-gray-700 w-full max-w-2xl mx-auto">
//               <div className="p-8">
//                 <div className="flex justify-end">
//                   <button
//                     className="text-gray-700 hover:text-gray-900 focus:outline-none"
//                     onClick={onClose}
//                   >
//                     <svg
//                       className="h-8 w-8"
//                       fill="none"
//                       viewBox="0 0 24 24"
//                       stroke="currentColor"
//                     >
//                       <path
//                         strokeLinecap="round"
//                         strokeLinejoin="round"
//                         strokeWidth={2}
//                         d="M6 18L18 6M6 6l12 12"
//                       />
//                     </svg>
//                   </button>
//                 </div>
//                 {children}
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }
function CustomModal({ show, onClose, children, progress }) {
  return (
    <>
      {show && (
        <div className="fixed z-50 inset-0 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="bg-white rounded-lg shadow-2xl border-4 border-gray-700 w-full max-w-2xl mx-auto">
              <div className="p-8">
                <div className="flex justify-end">
                  <button
                    className="text-gray-700 hover:text-gray-900 focus:outline-none"
                    onClick={onClose}
                  >
                    <svg
                      className="h-8 w-8"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
                {children}
                {progress > 0 && (
                  <ProgressBar now={progress} label={`${progress}%`} animated />
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UploadVideo() {
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [video, setVideo] = useState<Video>(null);
  const videos = useVideo();
  console.log(progress, "PROGRES", video);
  const handleUpload = async (acceptedFiles) => {
    const formData = new FormData();
    formData.append("video", acceptedFiles[0]);
    try {
      const response = await uploadVideo({
        formData,
        config: {
          onUploadProgress: (progressEvent) => {
            const percent = Math.round(
              (progressEvent.loaded * 100) / progressEvent.total
            );
            setProgress(percent);
          },
        },
      });
      console.log(response, "RESPONSE");
      setVideo(response);
      setShow(false);
    } catch (error) {
      console.error("Error uploading video:", error);
    }
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        onClick={() => setShow(true)}
      >
        Upload Video
      </button>
      <CustomModal
        show={show}
        onClose={() => setShow(false)}
        progress={progress}
      >
        <div>
          {progress === 0 && (
            <Dropzone onDrop={handleUpload}>
              {({ getRootProps, getInputProps }) => (
                <section>
                  <div
                    {...getRootProps()}
                    className="w-full rounded-md cursor-pointer h-80 border-4 border-dashed border-gray-600 flex items-center justify-center hover:border-blue-500 focus:outline-none"
                  >
                    <input {...getInputProps()} />
                    <div className="text-center">
                      <div className="flex justify-center mb-2">
                        <svg
                          className="h-12 w-12 text-gray-600"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                          />
                        </svg>
                      </div>
                      <p className="text-gray-600">
                        Drag 'n' drop some files here, or click to select files
                      </p>
                    </div>
                  </div>
                </section>
              )}
            </Dropzone>
          )}
          {progress > 0 && (
            <ProgressBar now={progress} label={`${progress}%`} animated />
          )}
          {progress === 100 && (
            <EditVideoForm
              videoId={video?.videoId}
              onClose={() => setShow(false)}
              videos={videos}
            />
          )}
        </div>
      </CustomModal>
    </>
  );
}

export default UploadVideo;