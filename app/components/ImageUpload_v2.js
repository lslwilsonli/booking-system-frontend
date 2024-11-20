"use client";
import React, { useState, useEffect, useRef } from "react";

const ImageUpload = () => {
  const [error, setError] = useState(""); // set the error message
  const [linkError, setLinkError] = useState(""); // set the error message for website link
  const [file, setFile] = useState(null);
  const [filepath, setFilePath] = useState(""); // Store the Base64 URL for sending
  const [downloadFilePath, setDownloadFilePath] = useState(""); // Store the optimized URL
  const [previewURL, setPreviewURL] = useState(null); // set the preview imgae
  const [isValid, setIsValid] = useState(false); // check if the image type is valid
  const [link, setLink] = useState(""); // the entered website link

  const filePickerRef = useRef();
  const token = localStorage.getItem("token");

  const handleFileSelect = (selectedFile) => {
    setFile(selectedFile);
  };

  const pickedHandler = (ev) => {
    let pickedFile;

    if (ev.target.files && ev.target.files.length === 1) {
      pickedFile = ev.target.files[0];
      const validTypes = ["image/jpeg", "image/png", "image/jpg"];
      if (validTypes.includes(pickedFile.type)) {
        setFile(pickedFile);
        setIsValid(true);
        setError("");
        handleFileSelect(pickedFile); // Handle file selection
      } else {
        setIsValid(false);
        setError("Image format error");
      }
    } else {
      setIsValid(false);
      setError("Please select a file");
    }
  };

  const handleOnChange = (ev) => {
    setLink(ev.target.value);
  };

  const handleLinkOnSubmit = async () => {
    if (!link) {
      setLinkError("Please enter the URL");
    } else {
      const newLink = link.trim(); // remove space from the start and at the end

      const formattedLink =
        newLink.startsWith("https://") || newLink.startsWith("http://")
          ? newLink
          : `https://${newLink}`;

      const urlPattern = /^(https?:\/\/)?([a-z0-9-]+\.)+[a-z]{2,6}(\/.*)?$/i;
      if (!urlPattern.test(formattedLink)) {
        setLinkError("Invalid URL format");
      } else {
        try {
          const response = await fetch("http://localhost:3030/upload-image", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: formattedLink }),
          });

          if (response.ok) {
            setLinkError("Successfully uploaded");
            setLink("");
          } else {
            setLinkError("Unable to connect to server");
          }
        } catch (error) {
          console.log("The error is ", error);
          setLinkError("Unable to connect to server");
        }
      }
    }
  };

  useEffect(() => {
    if (!file) return;
    const fileReader = new FileReader();
    fileReader.onload = () => {
      setPreviewURL(fileReader.result);
      setFilePath(fileReader.result); // Set the Base64 URL
    };
    fileReader.readAsDataURL(file); // Create a URL for the image
  }, [file]);

  const pickImageHandler = () => {
    filePickerRef.current.click();
  };

  const handleOnSubmit = async () => {
    if (!file) {
      setError("Please select a picture");
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onloadend = async () => {
      const base64String = reader.result; // This is the Base64 string

      try {
        const response = await fetch("http://localhost:3030/upload-image", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json", // Set content type to JSON
          },
          body: JSON.stringify({ image: base64String }), // Send Base64 in JSON
        });

        console.log("Response from server:", response);

        if (!response.ok) {
          throw new Error("Unable to upload image");
        }

        const data = await response.json();
        console.log("Image sent successfully!", data);
        setError("Picture uploaded successfully");
        setDownloadFilePath(data.imageURL); // return the URL from backend
      } catch (err) {
        console.error("Error during upload:", err);
        setError("Unable to upload image");
      }
    };

    reader.onerror = () => {
      setError("Unable to read image");
    };
  };

  return (
    <>
      <input
        name="image"
        ref={filePickerRef}
        type="file"
        style={{ display: "none" }}
        accept=".jpg,.png,.jpeg,.jfif"
        onChange={pickedHandler}
      />
      <div>
        {previewURL && (
          <img className="w-48 h-48" src={previewURL} alt="Preview" />
        )}
        {!previewURL && (
          <p className="w-48 h-48 border-dotted border-8 flex items-center justify-center">
            Picture preview
          </p>
        )}
      </div>
      <div>
        <button
          className="btn mt-2 mb-2 text-xs"
          type="button"
          onClick={pickImageHandler}
        >
          Import picture
        </button>
      </div>
      {!isValid && <div>{error}</div>}
      <div>
        {!!file && (
          <button className="btn" type="button" onClick={handleOnSubmit}>
            Send
          </button>
        )}
      </div>
      {error && <div style={{ color: "red" }}>{error}</div>}
      <p>or enter a URL link:</p>
      <input
        name="link"
        type="text"
        value={link}
        onChange={handleOnChange}
        className="border-solid input input-bordered input-sm w-full max-w-xs mb-1"
        placeholder="URL Link"
      />
      <button
        className="btn text-xs ml-2"
        type="button"
        onClick={handleLinkOnSubmit}
      >
        Send
      </button>
      {linkError && <div style={{ color: "red" }}>{linkError}</div>}
      {/* {downloadFilePath && <img src={downloadFilePath} alt="Uploaded" />} */}
    </>
  );
};

export default ImageUpload;
