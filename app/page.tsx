"use client";

import { ChangeEvent, useRef, useState } from "react";
import axios from "axios";
import { Line } from "rc-progress";

export default function Home() {
  const [file, setFile] = useState<File>();
  const [percentage, setPercentage] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File>();

  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (hiddenFileInput.current == null) {
      return;
    }
    // click on the button goes to the input
    hiddenFileInput.current.click();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target || !event.target.files) {
      console.log("File not selected");
      alert("Please select a file");
      return;
    }

    const fileObj = event.target.files[0];
    console.log("OnChange event executed");
    console.log(fileObj);
    if (!fileObj) {
      console.log("File not found!");
      alert("File not found, select a file again!");
      return;
    }
    setFile(fileObj);
    handleSubmit(event, fileObj);
  };

  const handleSubmit = async (
    event: ChangeEvent<HTMLInputElement>,
    file: File
  ) => {
    event.preventDefault();
    const url = "http://localhost:5001/upload-file";
    let percent = 0;
    const formData = new FormData();

    formData.append("file", file);
    // formData.append("fileName", file.name);

    //console.log(formData); //doesn't work - need to use the approach below
    for (let [key, value] of formData.entries()) {
      console.log("formData value printed below:");
      console.log(value); // printing whole object
      console.log(key, value); // printing whole object
      console.log(key, value.name, value.size); // printing properties of the object
    }

    const config = {
      onUploadProgress: (progressEvent: { loaded: any; total: any }) => {
        const { loaded, total } = progressEvent;
        percent = Math.floor((loaded * 100) / total);
        console.log(`${loaded / 1000}kb of ${total / 1000}kb | ${percent}%`); // just to see whats happening in the console

        if (percent <= 100) {
          setPercentage(percent); // hook to set the value of current level that needs to be passed to the progressbar
        }
      },
      headers: {
        "content-type": "multipart/form-data",
      },
    };

    try {
      const res = await axios.post(url, formData, config);
      // const res = await axios.post(url, formData);
      console.log("Response from server");
      console.log(res.data?.file); // OK
      setUploadedFile(res.data?.file);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="page-layout">
      <h1>Project - File upload</h1>
      <div className="card sm:mt-4 md:mt-4 lg:mt-8">
        {file ? <p className="info">File: {file.name}</p> : null}

        <button
          className="btn btn-orange sm:mt-4 md:mt-4 lg:mt-4"
          onClick={handleClick}
        >
          Upload File
        </button>
        <input
          id="file"
          type="file"
          ref={hiddenFileInput}
          onChange={handleChange}
          multiple={false}
          style={{ display: "none" }}
        />
        <p className="info">
          [ Supported files -{" "}
          <span className="file-extn-span">
            doc, docx, txt, pdf, ppt, jpg, png, mp3, mp4
          </span>
          ]
        </p>
      </div>
      {percentage > 1 && (
        <div className="card mt-4 justify-center items-center text-center">
          <p>File uploading</p>
          <p className="info">{file?.name}</p>
          <div
            className="progress-bar"
            style={{
              paddingLeft: "20%",
              paddingRight: "20%",
              marginTop: "20px",
            }}
          >
            <Line percent={percentage} strokeWidth={1} strokeColor="#28a745" />
            <p className="info">
              {percentage === 100
                ? `${percentage}% completed`
                : `${percentage}%`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
