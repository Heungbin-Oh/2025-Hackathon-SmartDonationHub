import { useState, useEffect } from 'react';
import { ThankYouModal } from '../components/ThankYouModal';
import { onHandleSubmit } from '../logic/handleSubmit';
import { TrollModal } from '../components/trollModal';
import LoadingScreen  from '../components/LoadingScreen';
import { DayPicker } from '../components/DayPicker';
import { TimeSelector } from '../components/TimeSelector';
import { ImageUpload } from '../components/ImageUpload';


export const DonatorFormPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    phoneNumber: '',
    pickupAddress: '',
    pickupPostalCode: '',
    pickupCity: '',
    preferredDays: [],
    preferredStartTime: '',
    preferredEndTime: '',
    donationText: ''
  });

  const [donImg, setDonImg] = useState({ donationImage: null });
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [troll, setTroll] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateTimes = () => {
    const { preferredStartTime, preferredEndTime } = formData;
    let error = '';
    if (preferredStartTime && preferredEndTime) {
      const [startHour, startMinute] = preferredStartTime.split(':').map(Number);
      const [endHour, endMinute] = preferredEndTime.split(':').map(Number);
      
      if (endHour < startHour || (endHour === startHour && endMinute < startMinute)) {
        error = 'End time cannot be earlier than start time';
      }
    }
    return error;
  };

  const validateForm = () => {
    let newErrors = {};
    let isValid = true;

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      isValid = false;
    }

    if (!formData.phoneNumber) {
      newErrors.phoneNumber = 'Phone number is required';
      isValid = false;
    }

    if (!formData.pickupAddress) {
      newErrors.pickupAddress = 'Pickup address is required';
      isValid = false;
    }

    const postalCodeRegex = /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/;
    if (!formData.pickupPostalCode) {
      newErrors.pickupPostalCode = 'Pickup Postal Code is required';
    } else if (!postalCodeRegex.test(formData.pickupPostalCode.trim())) {
      newErrors.pickupPostalCode = 'Invalid Postal Code format (e.g., A1A 1A1)';
      isValid = false;
    }

    if (!formData.pickupCity) {
      newErrors.pickupCity = 'Pickup City is required';
      isValid = false;
    }

    if (formData.preferredDays.length === 0) {
      newErrors.preferredDays = 'At least one preferred pickup day is required';
      isValid = false;
    }

    if (!formData.preferredStartTime || !formData.preferredEndTime) {
      newErrors.preferredHours = 'Preferred pickup hours are required';
      isValid = false;
    }

    const timeError = validateTimes();
    if (timeError) {
      newErrors.preferredHours = timeError;
      isValid = false;
    }

    if (!formData.donationText && !donImg.donationImage) {
      newErrors.donationDetails = 'At least one donation detail (text or image) is required';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    validateForm();
  }, [formData, donImg]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'preferredDays') {
      const updatedDays = (formData.preferredDays || []).includes(value)
        ? formData.preferredDays.filter(day => day !== value)
        : [...(formData.preferredDays || []), value];
      setFormData((prevData) => ({
        ...prevData,
        [name]: updatedDays,
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: name === 'pickupPostalCode' ? value.toUpperCase() : value,
      }));
    }
  };

  const handleImageChange = (e) => {
    const img = e.target.files[0];
    if (img) {
      setDonImg(() => ({
        donationImage: img,
      }));
      
      // Create preview URL for the image
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(img);
    } else {
      setDonImg({ donationImage: null });
      setImagePreview(null);
    }
  };

  const removeImage = () => {
    setDonImg({ donationImage: null });
    setImagePreview(null);
    // Clear the file input
    document.getElementById('donationImage').value = '';
  };

  const isFormValid = Object.keys(errors).length === 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    if (validateForm()) {
      setLoading(true);
      await onHandleSubmit({
        setFormSubmitted,
        formData,
        donImg,
        setTroll
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto shadow-xl border border-gray-200 rounded-lg overflow-hidden mt-4">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <LoadingScreen />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-white">
          <div className="bg-blue-400 text-white px-6 py-4">
            <h2 className="text-2xl font-bold">Donate Your Items</h2>
            <p className="text-sm text-blue-100">Fill out the form below to help someone in need</p>
          </div>

          <div className="p-6 space-y-6">
            {/* Full Name */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium text-gray-700">Full Name</label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md ${errors.fullName ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {errors.fullName && <p className="text-red-500 text-sm">{errors.fullName}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="phoneNumber" className="text-sm font-medium text-gray-700">Phone Number</label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  placeholder="Enter your phone number"
                  value={formData.phoneNumber}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md ${errors.phoneNumber ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber}</p>}
              </div>
            </div>

            {/* Pickup Address */}
            <div className="space-y-2">
              <label htmlFor="pickupAddress" className="text-sm font-medium text-gray-700">Pickup Address</label>
              <input
                id="pickupAddress"
                name="pickupAddress"
                placeholder="Enter your pickup address"
                type="text"
                value={formData.pickupAddress}
                onChange={handleChange}
                className={`w-full px-4 py-2 border rounded-md ${errors.pickupAddress ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.pickupAddress && <p className="text-red-500 text-sm">{errors.pickupAddress}</p>}
            </div>

            {/* Postal Code and City */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="pickupPostalCode" className="text-sm font-medium text-gray-700">Postal Code</label>
                <input
                  id="pickupPostalCode"
                  name="pickupPostalCode"
                  type="text"
                  placeholder="Enter your postal code"
                  value={formData.pickupPostalCode}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md ${errors.pickupPostalCode ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {errors.pickupPostalCode && <p className="text-red-500 text-sm">{errors.pickupPostalCode}</p>}
              </div>
              <div className="space-y-2">
                <label htmlFor="pickupCity" className="text-sm font-medium text-gray-700">City</label>
                <input
                  id="pickupCity"
                  name="pickupCity"
                  type="text"
                  placeholder="Enter your city"
                  value={formData.pickupCity}
                  onChange={handleChange}
                  className={`w-full px-4 py-2 border rounded-md ${errors.pickupCity ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                />
                {errors.pickupCity && <p className="text-red-500 text-sm">{errors.pickupCity}</p>}
              </div>
            </div>

            {/* Days + Hours */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Pickup Days</label>
                <DayPicker
                  selectedDays={formData.preferredDays}
                  onChange={(days) => setFormData({ ...formData, preferredDays: days })}
                />
                {errors.preferredDays && <p className="text-red-500 text-sm mt-1">{errors.preferredDays}</p>}
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <TimeSelector
                  label="Start Time"
                  value={formData.preferredStartTime}
                  onChange={(val) => setFormData({ ...formData, preferredStartTime: val })}
                />
                <TimeSelector
                  label="End Time"
                  value={formData.preferredEndTime}
                  onChange={(val) => setFormData({ ...formData, preferredEndTime: val })}
                />
              </div>
              {errors.preferredHours && <p className="text-red-500 text-sm">{errors.preferredHours}</p>}
            </div>

            {/* Donation Details */}
            <div className="space-y-2">
              <label htmlFor="donationText" className="text-sm font-medium text-gray-700">Donation Description</label>
              <textarea
                id="donationText"
                name="donationText"
                rows={4}
                maxLength={400}
                value={formData.donationText}
                onChange={handleChange}
                placeholder="Describe your donation in detail (max 400 characters)"
                className={`w-full px-4 py-2 border rounded-md ${errors.donationDetails ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
              />
              {errors.donationDetails && <p className="text-red-500 text-sm">{errors.donationDetails}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Donation Image</label>
              <ImageUpload
                image={donImg.donationImage}
                onChange={(img) => setDonImg({ donationImage: img })}
              />
            </div>

            <button
              type="submit"
              disabled={!isFormValid}
              className={`w-full py-3 text-white font-semibold rounded-md ${isFormValid ? 'bg-blue-400 hover:bg-blue-500' : 'bg-gray-400 cursor-not-allowed'} transition-colors`}
            >
              Submit Donation
            </button>
          </div>

          {formSubmitted && <ThankYouModal isOpen={formSubmitted} />}
          {troll && <TrollModal isOpen={troll} />}
        </form>
      )}
    </div>
  );
};