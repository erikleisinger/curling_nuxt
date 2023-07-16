export const extractFormData = (e) => {
const formData = new FormData(e.target)
    return [...formData.entries()].reduce((all, [key, value]) => {
        return {...all, [key]: value}
    }, {}) 
};