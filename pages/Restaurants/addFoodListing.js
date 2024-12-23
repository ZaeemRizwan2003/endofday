import Navbar from "@/Components/Navbar";
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/router";

const AddFoodListing = () => {
  const router = useRouter();
  const { edit } = router.query;
  const [formData, setFormData] = useState({
    itemname: "",
    description: "",
    price: "",
    discountedprice: "",
    remainingitem: "",
    manufacturedate: "",
  });
  const [error, setError] = useState("");
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewImage, setPreviewImage] = useState("");

  useEffect(() => {
    if (edit) {
      const fetchListing = async () => {
        try {
          const res = await axios.get(`/api/Restaurants/getlisting?id=${edit}`);
          if (res.data) {
            setFormData({
              itemname: res.data.itemname || "",
              description: res.data.description || "",
              price: res.data.price || "",
              discountedprice: res.data.discountedprice || "",
              remainingitem: res.data.remainingitem || "",
              manufacturedate: res.data.manufacturedate
                ? new Date(res.data.manufacturedate).toISOString().substr(0, 10)
                : "",
            });
            if (res.data.image && res.data.image.data) {
              setPreviewImage(
                `data:${res.data.image.contentType};base64,${res.data.image.data}`
              );
            }
          } else {
            setError("Listing not found.");
          }
        } catch (err) {
          console.error(err);
          setError("Unable to fetch listing data");
        }
      };
      fetchListing();
    }
  }, [edit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      let base64Image = "";
      let mimeType = "";

      if (selectedImage) {
        base64Image = await convertToBase64(selectedImage);
        mimeType = selectedImage.type;
      }

      const payload = {
        itemname: formData.itemname,
        description: formData.description,
        price: formData.price,
        discountedprice: formData.discountedprice,
        remainingitem: formData.remainingitem,
        manufacturedate: formData.manufacturedate,
        image: base64Image,
        contentType: mimeType,
      };

      if (edit) {
        payload.id = edit;
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
        },
      };

      const res = edit
        ? await axios.put("/api/Restaurants/foodlisting", payload, config)
        : await axios.post("/api/Restaurants/foodlisting", payload, config);

      if (res.status === 200) {
        router.push("/Restaurants/RDashboard");
      }
    } catch (err) {
      console.error(err);
      setError("Unable to save food listing. Please try again.");
    }
  };

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result.split(",")[1];
        resolve(base64String);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  return (
    <>
      <Navbar />
      <form
        className="max-w-4xl mx-auto mt-16 p-6 bg-white shadow-lg rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-3xl font-bold mb-6 text-center text-purple-800 ">
          {edit ? "Edit Food Listing" : "Add Food Listing"}
        </h1>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="itemname"
            >
              Item Name
            </label>
            <input
              type="text"
              id="itemname"
              name="itemname"
              value={formData.itemname}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="price"
            >
              Price
            </label>
            <input
              type="number"
              id="price"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="discountedprice"
            >
              Discounted Price
            </label>
            <input
              type="number"
              id="discountedprice"
              name="discountedprice"
              value={formData.discountedprice}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="remainingitem"
            >
              Remaining Items
            </label>
            <input
              type="number"
              id="remainingitem"
              name="remainingitem"
              value={formData.remainingitem}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows="4"
              value={formData.description}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
          <div className="md:col-span-2">
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="image"
            >
              Image
            </label>
            {previewImage && (
              <div className="mb-4">
                <img
                  src={previewImage}
                  alt="Selected"
                  className="w-48 h-48 object-cover rounded-lg"
                />
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="block w-full text-gray-700 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-2"
              htmlFor="manufacturedate"
            >
              Manufacture Date
            </label>
            <input
              type="date"
              id="manufacturedate"
              name="manufacturedate"
              value={formData.manufacturedate}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-violet-500"
            />
          </div>
        </div>
        <button
          type="submit"
          className="w-full mt-6 bg-violet-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-violet-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        >
          {edit ? "Update Listing" : "Add Listing"}
        </button>
      </form>
    </>
  );
};

export default AddFoodListing;
