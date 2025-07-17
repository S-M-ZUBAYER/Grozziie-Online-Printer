// Function to decrypt a single item


const decryptItem = async (dataTag, encryptedData) => {
  const pddAccessToken = localStorage.getItem("pddAccessToken");
  console.log(pddAccessToken, "Order decrypt");
  const url = `https://grozziieget.zjweiting.com:3091/GrozziiePrint-WebAPI/open/decrypt?accessToken=${pddAccessToken}`;
  const requestData = {
    dataTag: dataTag,
    encryptedData: encryptedData,
  };

  console.log(requestData, "data new");

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestData),
    });

    const responseData = await response.json();
    // Check if response contains decrypted data
    console.log(
      responseData?.open_decrypt_batch_response?.data_decrypt_list[0]
        ?.decrypted_data,
      "output decrypt"
    );
    const decryptedData =
      responseData?.open_decrypt_batch_response?.data_decrypt_list[0]
        ?.decrypted_data;
    return decryptedData;
  } catch (error) {
    console.error("Error decrypting data:", error);
    throw error;
  }
};

// Function to decrypt an array of data with a delay between requests
export const decryptArrayData = async (dataArray) => {
  try {
    const decryptedArray = [];
    console.log(dataArray, "check for coming incrypted data");

    // Iterate over each item in dataArray
    for (let index = 0; index < dataArray?.length; index++) {
      const item = dataArray[index];
      console.log(item);

      if (!item?.order_sn) {
        decryptedArray.push(""); // Push a placeholder value
      } else {
        // Decrypt the current item
        const decryptedDataAddress = await decryptItem(
          item?.order_sn,
          item?.address
        );
        await delay(12000);
        const decryptedDataReceiverAddress = await decryptItem(
          item?.order_sn,
          item?.receiver_address
        );
        await delay(12000);
        const decryptedDataReceiverName = await decryptItem(
          item?.order_sn,
          item?.receiver_name
        );
        await delay(12000);
        const decryptedDataReceiverPhoneNo = await decryptItem(
          item?.order_sn,
          item?.receiver_phone
        );
        await delay(12000);
        console.log(
          decryptedDataAddress,
          decryptedDataReceiverAddress,
          decryptedDataReceiverName,
          "check individual decript"
        );

        const newItem = {
          ...item,
          address: decryptedDataAddress,
          receiver_address: decryptedDataReceiverAddress,
          receiver_name: decryptedDataReceiverName,
          receiver_phone: decryptedDataReceiverPhoneNo,
        };
        console.log(newItem);
        decryptedArray.push(newItem);
      }

      // If it's not the last item, wait for 10 seconds before decrypting the next item
      if (index < dataArray.length - 1) {
        await delay(12000); // 10 seconds delay
      }
    }

    return decryptedArray;
  } catch (error) {
    console.error("Error decrypting array data:", error);
    throw error;
  }
};

// Function to create a delay
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
