export async function onHandleSubmit({setFormSubmitted, formData, donImg, setTroll}) {
    try {
        const formDataToSend = new FormData();
        const apiUrl = import.meta.env.VITE_API_URL;

        Object.keys(formData).forEach(key => {
            if (formData[key] !== null && formData[key] !== undefined) {
                formDataToSend.append(key, formData[key]);
            }
        });

        if (donImg.donationImage) {
            formDataToSend.append('donationImage', donImg.donationImage);
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          body: formDataToSend,
        });
    
        if (!response.ok) {
          throw new Error('Error posting charity');
        }
    
        const data = await response.json();
        if(data === true ){
          setFormSubmitted(true);
        } else{
          setTroll(true);
        }
        
      } catch (error) {
        console.error('Error:', error);
      }
    
} 

export async function onHandleCharitySubmit({ setFormSubmitted, formData, setTroll }) {
  try {
    const apiUrl = import.meta.env.VITE_API_URL;
    const dataToSend = {
      name: formData.name,
      email: formData.email,
      address: formData.address,
      category: formData.category,
      phone: formData.phone,
      website: formData.website || undefined, // Send undefined if website is empty
    };

    const response = await fetch( apiUrl + 'api/charities', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToSend),
    });

    if (!response.ok) {
      throw new Error('Error posting charity');
    }

    const data = await response.json();

    if (data.message === 'Charity submitted successfully!') {
      setFormSubmitted(true); 
    } else {
      setTroll(true);
    }
  } catch (error) {
    console.error('Error:', error);
    setTroll(true);
  }
}