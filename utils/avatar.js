export const parseAvatar = (avatar) => {
    try {
        if (typeof avatar === 'string') {
            const parsedAvatar = JSON.parse(avatar);
            return parsedAvatar
        } else if (typeof avatar === 'object') {
            return avatar
        }
        
        
    } catch  {
        return {}
    }
};