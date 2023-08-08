// const openPlayerSelector = (position: string) => {
//     const editorStore = useEditorStore();
//     editorStore.togglePlayerSelect({
//         open: true,
//         onSelect: (playerId: number) => {
//             addPlayer(playerId, position);
//         },
//     });
// };

// const addPlayer = async (playerId: number, position: string) => {
//     const teamId = props.item.id;
//     if (!position || !playerId || !teamId) {
//         console.error(
//             "error adding player to team: no player or position or team specified: ",
//             position,
//             teamId,
//             playerId
//         );
//         return;
//     }
//     await teamStore.addPlayerToTeam(playerId, teamId, position);
// };

/ const requestAccess = useThrottleFn(
    //     async ({
    //         team_id,
    //         requestee_profile_id,
    //     }: {
    //         team_id: number;
    //         requestee_profile_id: string;
    //     }) => {
    //         await teamStore.sendTeamRequest({ team_id, requestee_profile_id });
    
    //         emit("update", {
    //             teamId: team_id,
    //             updates: {
    //                 status: "pending",
    //                 subject: "requester",
    //             },
    //         });
    //     },
    //     10000
    // );
    // const cancelRequest = useThrottleFn(
    //     async ({
    //         team_id,
    //         requestee_profile_id,
    //     }: {
    //         team_id: number;
    //         requestee_profile_id: string;
    //     }) => {
    //         await teamStore.cancelTeamRequest({ team_id, requestee_profile_id });
    
    //         emit("update", {
    //             teamId: team_id,
    //             updates: {
    //                 status: null,
    //                 subject: null,
    //             },
    //         });
    //     },
    //     10000
    // );
    // const confirmRequest = useThrottleFn(
    //     async ({
    //         team_id,
    //         requester_profile_id,
    //     }: {
    //         team_id: number;
    //         requester_profile_id: string;
    //     }) => {
    //         await teamStore.confirmTeamRequest({ team_id, requester_profile_id });
    //         emit("update", {
    //             teamId: team_id,
    //             updates: {
    //                 status: "accepted",
    //                 subject: null,
    //             },
    //         });
    //     },
    //     10000
    // );
    // const denyRequest = useThrottleFn(
    //     async ({
    //         team_id,
    //         requester_profile_id,
    //     }: {
    //         team_id: number;
    //         requester_profile_id: string;
    //     }) => {
    //         await teamStore.denyTeamRequest({ team_id, requester_profile_id });
    //         emit("update", {
    //             teamId: team_id,
    //             updates: {
    //                 status: "denied",
    //                 subject: null,
    //             },
    //         });
    //     },
    //     10000
    // );