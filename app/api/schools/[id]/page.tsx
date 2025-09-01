'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  state: string;
  contact: string;
  image: string;
  email_id: string;
}

export default function SchoolDetails() {
  const { id } = useParams();
  const [school, setSchool] = useState<School | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/schools/${id}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setSchool(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to fetch school');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p className="text-center text-blue-600 font-semibold min-h-screen flex items-center justify-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500 min-h-screen flex items-center justify-center">{error}</p>;
  if (!school) return null;

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
        <img src={school.image} alt={school.name} className="w-full h-64 object-cover rounded-lg mb-6" />
        <h1 className="text-2xl font-bold text-center mb-4 text-blue-600">{school.name}</h1>
        <div className="space-y-3 text-gray-700">
          <p><strong>Address:</strong> {school.address}</p>
          <p><strong>City:</strong> {school.city}</p>
          <p><strong>State:</strong> {school.state}</p>
          <p><strong>Contact:</strong> {school.contact}</p>
          <p><strong>Email:</strong> {school.email_id}</p>
        </div>
      </div>
    </div>
  );
}