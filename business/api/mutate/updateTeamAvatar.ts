const uploadAvatar = async (client: any, fileName: string, file: File) => {
    console.log('upload avatar: ', fileName, file)
    const { data, error } = await client.storage
        .from("Avatars")
        .upload(fileName, file);


    if (error) {
        console.log('ERROR UPLOAD AVATAR')
        console.error(error.message)
        throw new Error(`Error uploading avatar: ${error.message}`);
    }
}

const deleteAvatarFromStorage = async (client: any, fileName: string) => {

    const {error} = await client.storage
    .from('Avatars')
    .remove([fileName]);

    if (error) {
        console.error(error.message)
        throw new Error(`Error deleting team avatar: ${error.message}`);
    }
}

const updateTeamAvatarInDb = async (client: any, fileName: string, teamId: string) => {
    const { error } = await client
    .from("teams")
    .update({ avatar_url: fileName })
    .eq("id", teamId)
    .select('avatar_url');

    if (error) {
        console.error(error)
        throw new Error(`Error updating team avatar in Db: ${error.message}`);
    }
}

export default async (client: any, {
    fileName,
    file,
    teamId
}: {
    fileName: string,
    file: File,
    teamId: string
}): void => {
    
    await uploadAvatar(client, fileName, file);
    try {
        await updateTeamAvatarInDb(client, fileName, teamId)
    } catch (e) {
        await deleteAvatarFromStorage(client, fileName);
        throw new Error(e);
    }


}