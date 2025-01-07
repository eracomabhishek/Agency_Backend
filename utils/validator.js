class VALIDATIONUTILS {
   
    isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }


    isValidPhoneNumber(phone) {
       const phoneRegex = /^\+\d{1,4}\s?\d{10}$/; // Adjust regex based on format requirements
        return phoneRegex.test(phone);
    }

    
    isValidPassword(password) {
        const passwordRegex = /(?=.*[A-Za-z])(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
        return passwordRegex.test(password);
    }

}

const validationUtils = new VALIDATIONUTILS();
module.exports = validationUtils;
