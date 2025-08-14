export const validate = (schemas) => (req, res, next) => {
    const locations = ['body', 'params', 'query'];

    for (const loc of locations) {
        if (schemas[loc]) {  // Only validate if schema exists for that location
            const { error } = schemas[loc].validate(req[loc], { abortEarly: false });
            if (error) {
                return res.status(400).json({ message: error.details[0].message });
            }
        }
    }
    console.log('Right Validation')
    next();
};
