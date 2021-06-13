const bcrypt = require('bcrypt');

const hashPass = async (password, saltRounds) => {
    try {
        // Generate a salt
        const salt = await bcrypt.genSalt(saltRounds);
        
        // Hash password
        return await bcrypt.hash(password, salt);
    } catch (error) {
        console.log(error);
    }
}

const comparePass = async (plaintextPassword, hashedPassword) => {
    try {
        let res = await bcrypt.compare(plaintextPassword, hashedPassword);
        return res;
    }catch (error) {

    }
}

module.exports = {
    bcrypt,
    hashPass,
    comparePass
}