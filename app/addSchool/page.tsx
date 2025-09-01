'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useState } from 'react';

const schema = yup.object({
  name: yup.string().required('Name is required'),
  address: yup.string().required('Address is required'),
  city: yup.string().required('City is required'),
  state: yup.string().required('State is required'),
  contact: yup.string().matches(/^\d{10}$/, 'Contact must be a 10-digit number').required('Contact is required'),
  email_id: yup.string().email('Invalid email').required('Email is required'),
 image: yup
    .mixed<FileList>()
    .required("Image is required")
    .test("fileType", "Only image files are allowed", (value) => {
      return value && value.length > 0 && value[0].type.startsWith("image/");
    }),
});

type FormData = {
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  email_id: string;
  image: FileList;
};

export default function AddSchool() {
    const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
        resolver: yupResolver(schema),
    });
    const [message, setMessage] = useState<string>('');

    const onSubmit = async (data: FormData) => {
        const formData = new FormData();
        formData.append('name', data.name);
        formData.append('address', data.address);
        formData.append('city', data.city);
        formData.append('state', data.state);
        formData.append('contact', data.contact);
        formData.append('email_id', data.email_id);
        formData.append('image', data.image[0]);  

        const res = await fetch('/api/schools', {
            method: 'POST',
            body: formData,
        });

        if (res.ok) {
            setMessage('School added successfully!');
        } else {
            setMessage('Failed to add school.');
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">Add a New School</h1>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Name</label>
                        <input
                            {...register('name')}
                            className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black"
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Address</label>
                        <input {...register('address')} className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black" />
                        {errors.address && <p className="text-red-500 text-sm">{errors.address.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">City</label>
                        <input {...register('city')} className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black" />
                        {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">State</label>
                        <input {...register('state')} className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black" />
                        {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Contact</label>
                        <input {...register('contact')} className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black" />
                        {errors.contact && <p className="text-red-500 text-sm">{errors.contact.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Email</label>
                        <input {...register('email_id')} className="w-full border border-gray-300 rounded-md p-2 focus:border-blue-500 focus:ring-blue-500 text-black" />
                        {errors.email_id && <p className="text-red-500 text-sm">{errors.email_id.message}</p>}
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700">Image</label>
                        <input type="file" accept="image/*" {...register('image')} className="w-full block text-sm font-medium text-gray-700" />
                        {errors.image && <p className="text-red-500 text-black">{errors.image.message}</p>}
                    </div>
                    <button type="submit" className="w-full bg-blue-600 text-white rounded-md p-2 font-semibold hover:bg-blue-700 transition">Submit</button>
                </form>
                {message && <p className="mt-4 text-center text-green-600">{message}</p>}
            </div>
        </div>
    );
}
