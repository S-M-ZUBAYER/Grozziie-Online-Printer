export const handleCapture = async (imageUrl, setCapturedImage) => {
  // const imageUrl = 'http://127.0.0.1:16666/Preview_202442_45fdf0770b895e67046d217c204147a4.bmp';
  const htmlContent = `
            <div class="border-2 border-gray-300 p-4">
                <img class="w-full h-full object-cover" src="${imageUrl}" alt="Dynamic Image" />
            </div>
        `;

  try {
    const response = await fetch("http://localhost:8000/capture-screenshot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ htmlContent }),
    });

    if (response.ok) {
      const blob = await response.blob();
      const reader = new FileReader();

      reader.onloadend = () => {
        const base64String = reader.result;
        setCapturedImage(base64String);
      };

      reader.readAsDataURL(blob);
    } else {
      console.error("Failed to capture screenshot:", response.statusText);
    }
  } catch (error) {
    console.error("Error capturing screenshot:", error);
  }
};
