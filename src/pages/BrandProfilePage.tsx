// client/src/pages/BrandProfilePage.tsx

import React, { useState, useEffect } from 'react';
import { getAuth } from 'firebase/auth';

const BrandProfilePage: React.FC = () => {
  const [brandName, setBrandName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [brandColors, setBrandColors] = useState<string[]>(['#000000']);
  const [slogan, setSlogan] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const auth = getAuth();
  const user = auth.currentUser;

  useEffect(() => {
    const fetchBrandProfile = async () => {
      if (!user) {
        setIsLoading(false);
        return;
      }
      try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/brand-profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const data = await response.json();
          if (data) {
            setBrandName(data.brandName || '');
            setLogoUrl(data.logoUrl || '');
            setSlogan(data.slogan || '');
            if (data.brandColors && data.brandColors.length > 0) {
              setBrandColors(data.brandColors);
            }
          }
        } else if (response.status === 404) {
          // No profile exists yet, which is fine.
          /* CODemod: console.log('No brand profile found, user can create one.'); */
        } else {
          throw new Error('Failed to fetch brand profile');
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBrandProfile();
  }, [user]);

  const handleColorChange = (index: number, color: string) => {
    const newColors = [...brandColors];
    newColors[index] = color;
    setBrandColors(newColors);
  };

  const addColor = () => {
    setBrandColors([...brandColors, '#000000']);
  };

  const removeColor = (index: number) => {
    const newColors = brandColors.filter((_, i) => i !== index);
    setBrandColors(newColors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
        setError("You must be logged in to save a brand profile.");
        return;
    }
    setError(null);
    try {
        const token = await user.getIdToken();
        const response = await fetch('/api/v1/brand-profile', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify({
                brandName,
                logoUrl,
                brandColors,
                slogan,
            }),
        });

        if (!response.ok) {
            throw new Error('Failed to save brand profile');
        }

        alert('Brand profile saved successfully!');

    } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">My Brand</h1>
      <p className="text-gray-600 mb-8">
        Set your brand assets here. They will be used by the AI to generate videos that match your identity.
      </p>
      <form onSubmit={handleSubmit} className="max-w-lg">
        <div className="mb-6">
          <label htmlFor="brandName" className="block text-gray-700 text-sm font-bold mb-2">
            Brand Name
          </label>
          <input
            type="text"
            id="brandName"
            value={brandName}
            onChange={(e) => setBrandName(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Acme Inc."
          />
        </div>

        <div className="mb-6">
          <label htmlFor="slogan" className="block text-gray-700 text-sm font-bold mb-2">
            Slogan (Optional)
          </label>
          <input
            type="text"
            id="slogan"
            value={slogan}
            onChange={(e) => setSlogan(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="e.g., Quality Since 1950"
          />
        </div>

        <div className="mb-6">
          <label htmlFor="logoUrl" className="block text-gray-700 text-sm font-bold mb-2">
            Logo URL (Optional)
          </label>
          <input
            type="text"
            id="logoUrl"
            value={logoUrl}
            onChange={(e) => setLogoUrl(e.target.value)}
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="https://example.com/logo.png"
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Brand Colors
          </label>
          {brandColors.map((color, index) => (
            <div key={index} className="flex items-center mb-2">
              <input
                type="color"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="w-10 h-10"
              />
              <input
                type="text"
                value={color}
                onChange={(e) => handleColorChange(index, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ml-4"
              />
              <button
                type="button"
                onClick={() => removeColor(index)}
                className="bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-2 rounded focus:outline-none focus:shadow-outline ml-2"
              >
                &times;
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addColor}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-2"
          >
            Add Color
          </button>
        </div>

        {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}

        <div className="flex items-center justify-between">
          <button
            type="submit"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Brand Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default BrandProfilePage;
