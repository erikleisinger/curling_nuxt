export const parseAvatar = (avatar) => {
    try {
        const parsedAvatar = JSON.parse(avatar);
        return parsedAvatar
        
    } catch  {
        return "{}"
    }
};