'use client'

import { useState, useEffect } from 'react';
import Headingbar from "@/components/employeeComponents/Headingbar";
import { Button } from '@/components/ui/button';

interface FormData {
  title: string;
  department: string;
  description: string;
}

export default function CreateProjectPage() {
  const [formData, setFormData] = useState<FormData>(() => {
    const savedData = localStorage.getItem('createProjectForm');
    return savedData ? JSON.parse(savedData) : { title: '', department: '', description: '' };
  });

  const [error, setError] = useState<string | null>(null);
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    localStorage.setItem('createProjectForm', JSON.stringify(formData));
  }, [formData]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCancel = () => {
    setFormData({
      title: '',
      department: '',
      description: '',
    });
    localStorage.removeItem('createProjectForm');
    setError(null);
  };

  const handleSubmit = () => {
    if (!formData.title || !formData.department || !formData.description) {
      setError('One or more fields are incomplete. Please fill them in before submitting.');
      return;
    }
    setError(null);
    setIsConfirming(true);
  };

  const confirmSubmission = () => {
    setIsConfirming(false);
    setIsSubmitted(true);
    localStorage.removeItem('createProjectForm'); // Clear localStorage on submit
  };

  return (
    <>
      <Headingbar text="Create Project" />
      <div className="space-y-4 rounded-3xl mt-4 p-8" style={{ backgroundColor: '#c9c7ce' }}>
        <div className="space-y-2">
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Project Title</span>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="px-4 py-2 outline-none rounded-xl w-full"
          />
        </div>
        <div className="space-y-2">
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Select Department</span>
          <select
            name="department"
            value={formData.department}
            onChange={handleChange}
            className="px-3 py-2 outline-none rounded-xl w-full"
          >
            <option value="" disabled></option>
            <option value="CompSci">CompSci</option>
            <option value="Engineering">Engineering</option>
            <option value="MBA">MBA</option>
            <option value="Business">Business</option>
            <option value="GIS">GIS</option>
          </select>
        </div>
        <div className="space-y-2">
          <span style={{ fontSize: '16px', fontWeight: 'bold' }}>Project Description</span>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="px-4 py-2 outline-none rounded-xl w-full"
          />
        </div>
        {error && <div className="text-red-500 font-bold">{error}</div>}
        <div className="flex justify-between gap-4">
          <Button
            onClick={handleCancel}
            style={{
              backgroundColor: '#E75973',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              width: '17.5%',
              borderRadius: '20px',
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            style={{
              backgroundColor: '#81c26c',
              color: 'white',
              fontWeight: 'bold',
              fontSize: '16px',
              width: '17.5%',
              borderRadius: '20px',
            }}
          >
            Submit
          </Button>
        </div>
      </div>

      {isConfirming && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl text-center space-y-4">
            <h2 className="text-xl font-bold">Confirm Project Idea Submission:</h2>
            <div className="flex justify-around gap-4">
              <Button
                onClick={confirmSubmission}
                style={{
                  backgroundColor: '#81c26c',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  width: '40%',
                  borderRadius: '20px',
                }}
              >
                Submit
              </Button>
              <Button
                onClick={() => setIsConfirming(false)}
                style={{
                  backgroundColor: '#81c26c',
                  color: 'white',
                  fontWeight: 'bold',
                  fontSize: '16px',
                  width: '40%',
                  borderRadius: '20px',
                }}
              >
                Keep Editing
              </Button>
            </div>
          </div>
        </div>
      )}

      {isSubmitted && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-3xl text-center space-y-4">
            <h2 className="text-xl font-bold">Project Idea Submitted.</h2>
            <Button
              onClick={() => {
                setIsSubmitted(false);
                window.location.href = '/Employee/Projects/';
              }}
              style={{
                backgroundColor: '#81c26c',
                color: 'white',
                fontWeight: 'bold',
                fontSize: '16px',
                width: '40%',
                borderRadius: '20px',
              }}
            >
              Return
            </Button>
          </div>
        </div>
      )}
    </>
  );
}