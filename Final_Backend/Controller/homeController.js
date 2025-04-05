const { getCharitiesByCategory } = require('./charityController');
const sendEmail = require('./emailController');
const getDonationCategoryAI = require('./aiController');

module.exports = {
    getForm: async (req, res) => {
        try {
            const {
                fullName,
                phoneNumber,
                pickupAddress,
                pickupPostalCode,
                pickupCity,
                preferredDays,
                preferredStartTime,
                preferredEndTime,
                donationText,
            } = req.body;

            const donationImage = req.file; 

            const categoryResponse = await getDonationCategoryAI(donationText, donationImage);

            if (categoryResponse.category && categoryResponse.category.length > 0 && categoryResponse.category !== 'TrollDetected') {
                const categoryOrganizationsResponse = await getCharitiesByCategory(categoryResponse.category[0]);

                if (categoryOrganizationsResponse) {
                    const emails = categoryOrganizationsResponse.map(org => org.email);

                    await sendEmail(
                        emails,
                        "New Donation Available",
                        `Hello,
                    
                        A new donation has been registered under the category: ${categoryResponse.category[0]}.
                    
                        Details:
                        - Name: ${fullName}
                        - Phone: ${phoneNumber}
                        - Address: ${pickupAddress}, ${pickupCity} (${pickupPostalCode})
                        - Preferred Days: ${Array.isArray(preferredDays) ? preferredDays.join(', ') : JSON.stringify(preferredDays)}
                        - Preferred Time: ${preferredStartTime} - ${preferredEndTime}
                        - Description: ${donationText}
                    
                        Please reach out if you are interested in this donation.
                    
                        Best regards,  
                        The Donation Hub Team`
                    );

                    return res.json(true);
                } else {
                    return res.status(404).json({ message: categoryOrganizationsResponse.message });
                }
            } else {
                return res.json(false);
            }
        } catch (error) {
            res.status(500).json({ error: "Error working with the form data" });
        }
    }
};