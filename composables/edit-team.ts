import EditedTeam from '@/business/models/team/EditedTeam';
import Team from '@/store/models/team'
export const useEditTeam = () => { 

    const editedTeam = useState('edit-team', () => {
        return reactive(new EditedTeam())
    })

    const editing = useState('editing-team', () => {
        return false
    })

    const toggleEditing = (bool: boolean, clear: boolean = false) => {
        editing.value = bool;
        if (clear && !bool) {
            editedTeam.value = reactive(new EditedTeam());
        }
    }

    const init = async (teamId: number) => {
        if (!teamId) return;
        const team = useRepo(Team)
        .with("players")
        .with("rink")
        .where("id", teamId)
        .first() ?? {};
        editedTeam.value = reactive(new EditedTeam(team));
        const {$api} = useNuxtApp();
        const {data: avatar_blob} = await $api.getTeamAvatar(teamId)
        editedTeam.value.avatar.url = toValue(avatar_blob);
    }
    return {editedTeam, init, toggleEditing, editing} 
    
}