// components/AddFoodListing.js
import Navbar from '@/Components/Navbar';
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const AddFoodListing = () => {
    const router = useRouter();
    const { edit } = router.query;
    const [formData, setFormData] = useState({
        itemname: '',
        description: '',
        price: '',
        discountedprice: '',
        remainingitem: '',
        manufacturedate: ''
    });
    const [error, setError] = useState('');
    const [selectedImage, setSelectedImage] = useState(null); // Stores the File object
    const [previewImage, setPreviewImage] = useState(''); // For image preview

    useEffect(() => {
        if (edit) {
            const fetchListing = async () => {
                try {
                    const res = await axios.get(`/api/Restaurants/getlisting?id=${edit}`);
                    setFormData({
                        itemname: res.data.itemname || '',
                        description: res.data.description || '',
                        price: res.data.price || '',
                        discountedprice: res.data.discountedprice || '',
                        remainingitem: res.data.remainingitem || '',
                        manufacturedate: res.data.manufacturedate ? new Date(res.data.manufacturedate).toISOString().substr(0, 10) : '', // Format date
                    });
                    if (res.data.image && res.data.image.data) {
                        setPreviewImage(`data:${res.data.image.contentType};base64,${res.data.image.data}`);
                    }
                } catch (err) {
                    console.error(err);
                    setError('Unable to fetch listing data');
                }
            };
            fetchListing();
        }
    }, [edit]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({ ...prevState, [name]: value }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
            // Generate preview
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        try {
            let base64Image = '';
            let mimeType = '';

            if (selectedImage) {
                // Convert image file to Base64 string
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
                image: base64Image, // Base64 string
                contentType: mimeType, // MIME type
            };

            if (edit) {
                payload.id = edit; // Include listing ID for editing
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json'
                }
            };

            if (edit) {
                const res = await axios.put('/api/Restaurants/foodlisting', payload, config);
                if (res.status === 200) {
                    router.push('/Restaurants/RDashboard');
                }
            } else {
                const res = await axios.post('/api/Restaurants/foodlisting', payload, config);
                if (res.status === 200) {
                    router.push('/Restaurants/RDashboard');
                }
            }
        } catch (err) {
            console.error(err);
            setError('Unable to save food listing. Please try again.');
        }
    };

    const convertToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => {
                // Remove the data URL prefix to get only the Base64 string
                const base64String = reader.result.split(',')[1];
                resolve(base64String);
            };
            reader.onerror = error => reject(error);
        });
    };

    return (
        <>
            <Navbar />
            <form className="max-w-3xl mx-auto mt-20" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 text-center md:col-span-2">
                        {edit ? 'Edit Food Listing' : 'Add Food Listing'}
                    </h1>
                    {error && <p className="text-red-500 text-center md:col-span-2">{error}</p>}

                    {/* Item Name */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="text"
                            value={formData.itemname}
                            onChange={handleChange}
                            name="itemname"
                            id="itemname"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="itemname"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Item Name
                        </label>
                    </div>

                    {/* Price */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            step="0.01"
                            value={formData.price}
                            onChange={handleChange}
                            name="price"
                            id="price"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="price"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Price
                        </label>
                    </div>

                    {/* Discounted Price */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            step="0.01"
                            value={formData.discountedprice}
                            onChange={handleChange}
                            name="discountedprice"
                            id="discountedprice"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="discountedprice"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Discounted Price
                        </label>
                    </div>

                    {/* Remaining Items */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="number"
                            value={formData.remainingitem}
                            onChange={handleChange}
                            name="remainingitem"
                            id="remainingitem"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="remainingitem"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Remaining Items
                        </label>
                    </div>

                    {/* Image Upload */}
                    <div className="relative z-0 w-full mb-5 group md:col-span-2">
                        <label className="block mb-2 text-sm font-medium text-gray-900">Image</label>
                        {previewImage && (
                            <div className="mb-2">
                                <img
                                    src={previewImage}
                                    alt="Selected image"
                                    width={270}
                                    height={180}
                                    className="object-cover rounded"
                                />
                            </div>
                        )}
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-900 border border-gray-300 rounded-md cursor-pointer bg-gray-50 focus:outline-none"
                        />
                    </div>

                    {/* Manufacture Date */}
                    <div className="relative z-0 w-full mb-5 group">
                        <input
                            type="date"
                            value={formData.manufacturedate}
                            onChange={handleChange}
                            name="manufacturedate"
                            id="manufacturedate"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="manufacturedate"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Manufacture Date
                        </label>
                    </div>

                    {/* Description */}
                    <div className="relative z-0 w-full mb-5 group md:col-span-2">
                        <textarea
                            value={formData.description}
                            onChange={handleChange}
                            name="description"
                            id="description"
                            rows="4"
                            className="block py-2.5 px-0 w-full text-sm text-gray-900 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-violet-600 peer"
                            placeholder=" "
                            required
                        />
                        <label
                            htmlFor="description"
                            className="peer-focus:font-medium absolute text-sm text-gray-500 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
                        >
                            Description
                        </label>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full bg-violet-600 text-white py-2 rounded-md text-center"
                >
                    {edit ? 'Update Listing' : 'Add Listing'}
                </button>
            </form>
        </>
    );
};

export default AddFoodListing;
