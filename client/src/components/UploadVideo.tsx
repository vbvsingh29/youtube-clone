import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { updateVideo, uploadVideo } from "../../api/index";
import { useState } from "react";
import Dropzone from "react-dropzone";
import { Video } from "../../types";
import { useVideo } from "../../context/videos";
import { Slide, toast } from "react-toastify";
import Progress_Bar from "../utils/ProgressBar";
import { useSelector } from "react-redux";
import { RootState } from "../../store/store";

function EditVideoForm({ videoId, onClose, videos }) {
  const token = useSelector((state: RootState) => state.token.token);
  const { register, handleSubmit } = useForm();
  const [thumbnail, setThumbnail] = useState<File | null>(null);

  const onSubmit = async (data) => {
    try {
      await updateVideo({
        videoId,
        title: data.title,
        description: data.description,
        published: data.published,
        thumbnail,
        sourceCode: data.sourceCode,
        token,
      });
      onClose();
      // videos();
      toast.success("Video published Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Error, please try again later", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    }
  };

  const handleThumbnailChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setThumbnail(event.target.files[0]);
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
          className="border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800  p-2"
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
          className="border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800  p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="sourceCode" className="block font-medium text-gray-800">
          Source Code
        </label>
        <textarea
          id="sourceCode"
          {...register("sourceCode")}
          className="border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800  p-2"
        />
      </div>
      <div className="mb-4">
        <label htmlFor="thumbnail" className="block font-medium text-gray-800">
          Thumbnail
        </label>
        <input
          type="file"
          id="thumbnail"
          {...register("thumbnail")}
          onChange={handleThumbnailChange}
          className="border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 block w-full text-gray-800  p-2"
        />
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
                {/* {progress > 0 && (
                  <div className="mt-4">
                    <Progress_Bar progressPercentage={progress} />
                  </div>
                )} */}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function UploadVideo() {
  const token = useSelector((state: RootState) => state.token.token);
  const [show, setShow] = useState(false);
  const [progress, setProgress] = useState(0);
  const [video, setVideo] = useState<Video>(null);
  const videos = useVideo();

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
        token,
      });
      setVideo(response);
      setProgress(100);
      setShow(true);
      toast.success("Video uploaded Successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
    } catch (error) {
      console.error("Error uploading video:", error);
      setProgress(0);
      toast.error("Error uploading video. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        transition: Slide,
      });
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
        onClose={() => {
          setProgress(0);
          setShow(false);
        }}
        progress={progress}
      >
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
        {progress > 0 && progress < 100 && (
          <div className="mt-4">
            <Progress_Bar progressPercentage={progress} />
          </div>
        )}
        {progress === 100 && (
          <EditVideoForm
            videoId={video?.videoId}
            onClose={() => setShow(false)}
            videos={videos}
          />
        )}
      </CustomModal>
    </>
  );
}

export default UploadVideo;
