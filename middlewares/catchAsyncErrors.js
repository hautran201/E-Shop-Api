module.exports = (theFunc) => (req, res, next) => {
    Promise.resolve(theFunc(req, red, next)).catch(next);
};
