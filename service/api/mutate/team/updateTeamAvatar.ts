import client from '@/service/client'
const uploadAvatar = async (fileName: string, file: File) => {
    const { data, error } = await client.client.storage
        .from("Avatars")
        .upload(fileName, file);


    if (error) {
        console.error(error.message)
        throw new Error(`Error uploading avatar: ${error.message}`);
    }
}

const deleteAvatarFromStorage = async (fileName: string) => {

    const {error} = await client.client.storage
    .from('Avatars')
    .remove([fileName]);

    if (error) {
        console.error(error.message)
        throw new Error(`Error deleting team avatar: ${error.message}`);
    }
}

const updateTeamAvatarInDb = async (fileName: string, teamId: string) => {
    const { error } = await client.client
    .from("teams")
    .update({ avatar_url: fileName })
    .eq("id", teamId)
    .select('avatar_url');

    if (error) {
        console.error(error)
        throw new Error(`Error updating team avatar in Db: ${error.message}`);
    }
}

export default async ({
    fileName,
    file,
    teamId
}: {
    fileName: string,
    file: File,
    teamId: string
}): void => {
    
    await uploadAvatar(fileName, file);
    try {
        await updateTeamAvatarInDb(fileName, teamId)
    } catch (e) {
        await deleteAvatarFromStorage(fileName);
        throw new Error(e);
    }
    


}