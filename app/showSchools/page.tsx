'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface School {
  id: number;
  name: string;
  address: string;
  city: string;
  image: string;
}

export default function ShowSchools() {
  const [schools, setSchools] = useState<School[]>([]);
  const [filteredSchools, setFilteredSchools] = useState<School[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/schools')
      .then(res => res.json())
      .then(data => {
        setSchools(data);
        setFilteredSchools(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  useEffect(() => {
    const filtered = schools.filter(school =>
      school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      school.city.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredSchools(filtered);
  }, [searchTerm, schools]);

  if (loading) return <p className="text-center text-blue-600 font-semibold">Loading...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-3xl font-bold text-center mb-6 text-blue-600">Schools Directory</h1>
      <div className="max-w-2xl mx-auto mb-6">
        <input
          type="text"
          placeholder="Search by name or city..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          className="w-full border border-gray-700 rounded-md p-3 focus:border-blue-500 focus:ring-blue-500 shadow-sm text-black    "
        />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {filteredSchools.map(school => (
          <Link href={`/school/${school.id}`} key={school.id}>
            <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition cursor-pointer">
              <img src={school.image} alt={school.name} className="w-full h-48 object-cover" />
              <div className="p-4">
                <h2 className="font-bold text-lg text-blue-600">{school.name}</h2>
                <p className="text-gray-600">{school.address}</p>
                <p className="text-gray-500">{school.city}</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
      {filteredSchools.length === 0 && <p className="text-center text-gray-500 mt-4">No schools found.</p>}
    </div>
  );
}