import { useDropzone } from "react-dropzone";

const Dropzone = () => {
  const { getRootProps, getInputProps } = useDropzone({});

  return (
    <div>
      <div {...getRootProps()} className="w-fullch-80">
        <input {...getInputProps()} />
        <p>Drag and Drop</p>
      </div>
    </div>
  );
};
export default Dropzone;
