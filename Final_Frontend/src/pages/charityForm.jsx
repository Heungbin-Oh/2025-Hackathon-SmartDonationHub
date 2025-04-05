import { useEffect, useState } from 'react';
import { ThankYouModal } from '../components/ThankYouModal';
import { onHandleCharitySubmit } from '../logic/handleSubmit';
import { TrollModal } from '../components/trollModal';
import LoadingScreen from '../components/LoadingScreen';

export const CharityFormPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    address: '',
    category: '',
    phone: '',
    website: ''
  });

  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [troll, setTroll] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateForm = (updatedData = formData) => {
    let newErrors = {};
    let isValid = true;

    if (!updatedData.name.trim()) {
      newErrors.name = 'Name is required';
      isValid = false;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!updatedData.email.trim()) {
      newErrors.email = 'Email is required';
      isValid = false;
    } else if (!emailRegex.test(updatedData.email)) {
      newErrors.email = 'Invalid email format';
      isValid = false;
    }

    if (!updatedData.address.trim()) {
      newErrors.address = 'Address is required';
      isValid = false;
    }

    if (!updatedData.category) {
      newErrors.category = 'Category is required';
      isValid = false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!updatedData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
      isValid = false;
    } else if (!phoneRegex.test(updatedData.phone)) {
      newErrors.phone = 'Invalid phone number';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
      validateForm();
  }, [formData]);

  const isFormValid = Object.keys(errors).length === 0;

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedData = { ...formData, [name]: value };

    setFormData(updatedData);
    
    validateForm(updatedData);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (validateForm()) {
      setLoading(true);
      await onHandleCharitySubmit({
        setFormSubmitted,
        formData,
        setTroll,
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto bg-white shadow-md rounded-lg overflow-hidden mt-4">
      {loading ? (
        <LoadingScreen />
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="bg-blue-400 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">Charity Registration</h2>
            <p className="text-sm text-blue-100">Connect your organization with generous donors today.</p>
          </div>

          <div className="p-6 space-y-6">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-gray-700">Address</label>
              <input
                id="address"
                name="address"
                type="text"
                placeholder="Enter your address"
                value={formData.address}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.address ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.address && <p className="text-red-500 text-sm">{errors.address}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</label>
              <input
                id="phone"
                name="phone"
                type="tel"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.phone ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium text-gray-700">Category</label>
              <select
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.category ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              >
                <option value="">Select a donation category</option>
                <option value="Canned Goods">Canned Goods</option>
                <option value="Non-Perishable">Non-Perishable Items</option>
                <option value="Clothes">Clothes</option>
              </select>
              {errors.category && <p className="text-red-500 text-sm">{errors.category}</p>}
            </div>

            <div className="pt-4">
              <button
                type="submit"
                disabled={!isFormValid}
                className={`w-full py-3 text-white font-semibold rounded-md ${isFormValid ? 'bg-blue-500 hover:bg-blue-600' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
              >
                Submit
              </button>
            </div>

            {formSubmitted && <ThankYouModal isOpen={formSubmitted} />}
            {troll && <TrollModal isOpen={troll} />}
          </div>
        </form>
      )}
    </div>
  );
};