import React from "react";

const CovertImage = ({ setSelectedImage }) => {
  // Function to handle image selection
  // const handleImageChange = (e) => {
  //   // const file = e.target.files[0];
  //   console.log(e.target.files[0], "check file");
  //   setSelectedImage([e.target.files[0]]);

  //   // if (file) {
  //   //   const reader = new FileReader();
  //   //   reader.onloadend = () => {
  //   //     setBase64Image(reader.result);
  //   //   };
  //   //   reader.readAsDataURL(file);
  //   // }
  // };
  const handleImageChange = async (event) => {
    const formData = new FormData();
    formData.append("file", event.target.files[0]);

    const response = await fetch(
      `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/fileUpload/multiple`,
      {
        method: "POST",
        body: formData,
      }
    );
    const res = await response.json();
    setSelectedImage(`https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/fileUpload/${res[0]}`)
  };


  return (
    <div>
      {/* Input field for image selection */}
      <input type="file" accept="image/*" onChange={handleImageChange} />
    </div>
  );
};

export default CovertImage;
