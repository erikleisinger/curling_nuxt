import EditedTeam from '@/business/models/team/EditedTeam';
import Team from '@/store/models/team'
import { getTeamAvatar } from "@/business/api/query/team"

export const useEditTeam = () => { 

    const editedTeam = useState('edit-team', () => {
        return reactive(new EditedTeam())
    })

    const editing = useState('editing-team', () => {
        return false
    })

    const resetEditedTeam = () => {
        editedTeam.value = reactive(new EditedTeam());
    }

    const toggleEditing = (bool: boolean, clear: boolean = false) => {
        editing.value = bool;
        if (clear && !bool) {
            resetEditedTeam()
        }
    }



    const {fetch} = useApi()

    const init = async (teamId: number) => {
        if (!teamId) return;
        const team = useRepo(Team)
        .with("players")
        .with("rink")
        .where("id", teamId)
        .first() ?? {};
        editedTeam.value = new EditedTeam(team)
        const fetchFunc = getTeamAvatar(teamId);
        const avatar_blob = await fetchFunc();
        editedTeam.value.avatar.url = avatar_blob;
    }

    return {editedTeam, init, toggleEditing, editing, resetEditedTeam} 
    
}