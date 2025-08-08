/* eslint-disable no-unused-vars */
import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import api from '../../services/api';

const ScholarshipApplicationForm = ({ scholarshipId, onClose }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({
    photo: null,
    studentName: user?.name || '',
    motherName: '',
    fatherName: '',
    institution: '',
    batch: '',
    semester: '',
    session: '',
    roll: '',
    sscGrade: '',
    hscGrade: '',
    semesterGrades: '',
    permanentAddress: { village: '', postOffice: '', upozilla: '', district: '' },
    presentAddress: '',
    familyExpense: false,
    familyCondition: '',
    reference: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleInput = e => {
    const { name, value, type, checked } = e.target;
    if (name.startsWith('permanentAddress.')) {
      setForm(f => ({ ...f, permanentAddress: { ...f.permanentAddress, [name.split('.')[1]]: value } }));
    } else if (type === 'checkbox') {
      setForm(f => ({ ...f, [name]: checked }));
    } else if (type === 'file') {
      setForm(f => ({ ...f, photo: e.target.files[0] }));
    } else {
      setForm(f => ({ ...f, [name]: value }));
    }
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => {
        if (k === 'permanentAddress') {
          Object.entries(v).forEach(([kk, vv]) => data.append(`permanentAddress.${kk}`, vv));
        } else {
          data.append(k, v);
        }
      });
      data.append('scholarship', scholarshipId);
      await api.post('/scholarships/apply', data, { headers: { 'Content-Type': 'multipart/form-data' } });
      setSuccess(true);
    } catch {
      setError('Failed to submit application. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (success)
    return (
      <div className="text-green-700 bg-green-100 border border-green-300 p-4 rounded text-center font-semibold">
        🎉 Application submitted successfully!
      </div>
    );

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6 max-h-[70vh] overflow-y-auto pr-2"
      noValidate
      aria-label="Scholarship application form"
    >
      <h3 className="text-2xl font-extrabold text-indigo-700 mb-4">Scholarship Application</h3>

      {/* Photo Upload with Placeholder and Preview */}
      <div>
        <label
          htmlFor="photo"
          className="block mb-1 font-semibold text-gray-700"
        >
          Upload Your Photo
        </label>
        <div className="flex items-center gap-4 mb-2">
          <div className="w-24 h-24 bg-gray-100 border-2 border-dashed border-gray-300 rounded-md flex items-center justify-center overflow-hidden relative">
            {form.photo ? (
              <img
                src={typeof form.photo === 'string' ? form.photo : URL.createObjectURL(form.photo)}
                alt="Preview"
                className="object-cover w-full h-full"
              />
            ) : (
              <span className="text-gray-400 text-xs text-center">Photo Preview</span>
            )}
          </div>
          <input
            type="file"
            id="photo"
            name="photo"
            accept="image/*"
            onChange={handleInput}
            required
            className="border border-gray-300 rounded-md p-2 cursor-pointer focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
            aria-describedby="photoHelp"
          />
        </div>
        <small id="photoHelp" className="text-gray-500 text-sm">
          Please upload a recent passport size photo.
        </small>
      </div>

      {/* Personal Info */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-indigo-700 font-semibold mb-2">Personal Information</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Student Name', name: 'studentName', value: form.studentName, required: true },
            { label: "Mother's Name", name: 'motherName', value: form.motherName, required: true },
            { label: "Father's Name", name: 'fatherName', value: form.fatherName, required: true },
            { label: 'Institution', name: 'institution', value: form.institution, required: true },
            { label: 'Batch', name: 'batch', value: form.batch, required: true },
            { label: 'Semester', name: 'semester', value: form.semester, required: true },
            { label: 'Session', name: 'session', value: form.session, required: true },
            { label: 'Roll / ID', name: 'roll', value: form.roll, required: true },
          ].map(({ label, name, value, required }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-1 text-gray-700 font-medium"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                value={value}
                onChange={handleInput}
                required={required}
                type="text"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Academic Info */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-indigo-700 font-semibold mb-2">Academic Details</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'SSC Grade', name: 'sscGrade', value: form.sscGrade },
            { label: 'HSC Grade', name: 'hscGrade', value: form.hscGrade },
            { label: 'Semester Grades (till current)', name: 'semesterGrades', value: form.semesterGrades },
          ].map(({ label, name, value }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-1 text-gray-700 font-medium"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                value={value}
                onChange={handleInput}
                type="text"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Permanent Address */}
      <fieldset className="border border-gray-200 rounded-lg p-4">
        <legend className="text-indigo-700 font-semibold mb-2">Permanent Address</legend>
        <div className="grid gap-4 md:grid-cols-2">
          {[
            { label: 'Village', name: 'permanentAddress.village', value: form.permanentAddress.village },
            { label: 'Post Office', name: 'permanentAddress.postOffice', value: form.permanentAddress.postOffice },
            { label: 'Upozilla/Thana', name: 'permanentAddress.upozilla', value: form.permanentAddress.upozilla },
            { label: 'District', name: 'permanentAddress.district', value: form.permanentAddress.district },
          ].map(({ label, name, value }) => (
            <div key={name}>
              <label
                htmlFor={name}
                className="block mb-1 text-gray-700 font-medium"
              >
                {label}
              </label>
              <input
                id={name}
                name={name}
                value={value}
                onChange={handleInput}
                required
                type="text"
                autoComplete="off"
                className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
                aria-label={label}
              />
            </div>
          ))}
        </div>
      </fieldset>

      {/* Present Address */}
      <div>
        <label
          htmlFor="presentAddress"
          className="block mb-1 text-gray-700 font-medium"
        >
          Present Address
        </label>
        <input
          id="presentAddress"
          name="presentAddress"
          value={form.presentAddress}
          onChange={handleInput}
          required
          type="text"
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
          aria-label="Present Address"
        />
      </div>

      {/* Family Expense Yes/No */}
      <div className="flex items-center gap-4">
        <span className="font-medium text-gray-700">Is family able to take education expense?</span>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="familyExpense"
            value="yes"
            checked={form.familyExpense === true}
            onChange={() => setForm(f => ({ ...f, familyExpense: true }))}
            className="accent-indigo-600"
          />
          <span>Yes</span>
        </label>
        <label className="flex items-center gap-1 cursor-pointer">
          <input
            type="radio"
            name="familyExpense"
            value="no"
            checked={form.familyExpense === false}
            onChange={() => setForm(f => ({ ...f, familyExpense: false }))}
            className="accent-indigo-600"
          />
          <span>No</span>
        </label>
      </div>

      {/* Family Condition */}
      <div>
        <label
          htmlFor="familyCondition"
          className="block mb-1 text-gray-700 font-medium"
        >
          Family Economic Condition
        </label>
        <input
          id="familyCondition"
          name="familyCondition"
          value={form.familyCondition}
          onChange={handleInput}
          required
          type="text"
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
          aria-label="Family Economic Condition"
        />
      </div>

      {/* Reference */}
      <div>
        <label
          htmlFor="reference"
          className="block mb-1 text-gray-700 font-medium"
        >
          Reference
        </label>
        <input
          id="reference"
          name="reference"
          value={form.reference}
          onChange={handleInput}
          required
          type="text"
          autoComplete="off"
          className="w-full border border-gray-300 rounded-md p-3 focus:outline-indigo-500 focus:ring-1 focus:ring-indigo-500"
          aria-label="Reference"
        />
      </div>

      {/* Error message */}
      {error && <div className="text-red-600 font-semibold">{error}</div>}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-semibold py-3 px-6 rounded-lg w-full transition"
      >
        {loading ? 'Submitting...' : 'Submit Application'}
      </button>
    </form>
  );
};

export default ScholarshipApplicationForm;
