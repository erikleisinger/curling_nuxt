import Team, { TeamPosition, TeamPlayerPosition } from "@/types/team";
import { SelectOption } from "@/types/select";
import { TABLE_NAMES } from "@/constants/tables";
import SupabaseClient from "@supabase/supabase-js/src/SupabaseClient";
import { DatabaseError, ValidationError, ErrorName } from "@/types/error";
import Game from "@/types/game";
/**
 *
 * @param {TeamPosition} position
 * @param {Team} team
 * @returns {(TeamPlayerPosition|null)}
 */

export const findTeamPosition = (position: TeamPosition, team: Team) => {
    const { fifth_player_id, sixth_player_id, seventh_player_id } = team;

    const preferredPosition: TeamPlayerPosition = `${position}_player_id`;
    let newPosition: TeamPlayerPosition | null = null;
    if (!team[preferredPosition]) {
        newPosition = preferredPosition;
    } else if (!fifth_player_id) {
        newPosition = "fifth_player_id";
    } else if (!sixth_player_id) {
        newPosition = "sixth_player_id";
    } else if (!seventh_player_id) {
        newPosition = "seventh_player_id";
    }
    return newPosition;
};

export const createTeam = async (
    team: SelectOption,
    client: SupabaseClient
) => {
    const { label } = team;
    const { data, error } = await client
        .from(TABLE_NAMES.TEAMS)
        .insert({
            name: label,
        })
        .select(
            "id, name, lead_player_id, second_player_id, third_player_id, fourth_player_id, fifth_player_id, sixth_player_id, seventh_player_id"
        );
    if (error)
        throw new DatabaseError({
            name: ErrorName.INSERT_ERROR,
            message: `Error creating team '${label}'`,
            cause: error,
            table: TABLE_NAMES.TEAMS,
            fatal: true,
        });
    const [newTeam] = data || [];
    if (!newTeam?.id)
        throw new ValidationError({
            name: ErrorName.VALIDATION_FAILED,
            message: `Error creating team '${label}': received no confirmation from database`,
            fatal: true,
        });
    return newTeam;
};

export const insertPlayerIntoTeam = async (
    playerId: number,
    position: TeamPosition,
    team: Team,
    client: SupabaseClient
) => {
    const newPosition = findTeamPosition(position, team);
    if (!newPosition)
        throw new ValidationError({
            name: ErrorName.RESOURCE_LOCKED,
            message: `Cannot insert into team (id ${team.id}): team is full.`,
            fatal: false,
        });
    const { data, error } = await client
        .from(TABLE_NAMES.TEAMS)
        .update({ [newPosition]: playerId })
        .select(
            `
    ${newPosition}
    `
        )
        .eq("id", team.id);

    if (error)
        throw new DatabaseError({
            name: ErrorName.INSERT_ERROR,
            message: `Error inserting player into team: ${error.code}`,
            table: TABLE_NAMES.TEAMS,
            fatal: false,
        });
    const [updatedTeam] = data;
    return updatedTeam;
};

export const createPlayer = async (
    player: SelectOption,
    client: SupabaseClient
) => {
    const { label, value } = player;
    if (value !== 0)
        throw new ValidationError({
            name: ErrorName.VALIDATION_FAILED,
            message: "Creation of player was prevented, as it already exists",
            fatal: false,
        });
    const { data, error } = await client
        .from(TABLE_NAMES.PLAYERS)
        .insert({
            name: label,
        })
        .select("id, name");
    if (error)
        throw new DatabaseError({
            name: ErrorName.INSERT_ERROR,
            message: `Error creating player '${label}'`,
            table: TABLE_NAMES.PLAYERS,
            fatal: false,
        });

    const [newPlayer] = data || [];
    const { id: playerId } = newPlayer || {};
    if (!playerId)
        throw new DatabaseError({
            name: ErrorName.INSERT_ERROR,
            message: `Error creating player '${label}': no information from database`,
            table: TABLE_NAMES.PLAYERS,
            fatal: true,
        });

    return playerId;
};

export const initPlayers = async (
    players: {
        lead: SelectOption;
        second: SelectOption;
        third: SelectOption;
        fourth: SelectOption;
    },
    team: Team,
    client: SupabaseClient
) => {
    let leadId;
    let secondId;
    let thirdId;
    let fourthId;

    const workingTeam = { ...team };

    const { lead, second, third, fourth } = players;

    try {
        if (!lead.value) {
            leadId = await createPlayer(lead, client);
        } else {
            leadId = lead.value;
        }
        if (workingTeam.lead_player_id !== leadId) {
            const updatedTeam = await insertPlayerIntoTeam(
                leadId,
                "lead",
                workingTeam,
                client
            );

            Object.assign(workingTeam, updatedTeam);
        }
    } catch (e: ValidationError | DatabaseError) {
        if (e instanceof ValidationError || e instanceof DatabaseError) {
            if (e.fatal) throw e;
        } else {
            throw e;
        }
    }

    try {
        if (!second.value) {
            secondId = await createPlayer(second, client);
        } else {
            secondId = second.value;
        }

        if (workingTeam.second_player_id !== secondId) {
            const updatedTeam = await insertPlayerIntoTeam(
                secondId,
                "second",
                workingTeam,
                client
            );
            Object.assign(workingTeam, updatedTeam);
        }
    } catch (e: ValidationError | DatabaseError) {
        if (e instanceof ValidationError || e instanceof DatabaseError) {
            if (e.fatal) throw e;
        } else {
            throw e;
        }
    }

    try {
        if (!third.value) {
            thirdId = await createPlayer(third, client);
        } else {
            thirdId = third.value;
        }

        if (workingTeam.third_player_id !== thirdId) {
            const updatedTeam = await insertPlayerIntoTeam(
                thirdId,
                "third",
                workingTeam,
                client
            );
            Object.assign(workingTeam, updatedTeam);
        }
    } catch (e: ValidationError | DatabaseError) {
        if (e instanceof ValidationError || e instanceof DatabaseError) {
            if (e.fatal) throw e;
        } else {
            throw e;
        }
    }
    try {
        if (!fourth.value) {
            fourthId = await createPlayer(fourth, client);
        } else {
            fourthId = fourth.value;
        }

        if (workingTeam.fourth_player_id !== fourthId) {
            const updatedTeam = await insertPlayerIntoTeam(
                fourthId,
                "fourth",
                workingTeam,
                client
            );
            Object.assign(workingTeam, updatedTeam);
        }
    } catch (e: ValidationError | DatabaseError) {
        if (e instanceof ValidationError || e instanceof DatabaseError) {
            if (e.fatal) throw e;
        } else {
            throw e;
        }
    }

    return { leadId, secondId, thirdId, fourthId };
};
export const createGame = async (newGame) => {
    const client = useSupabaseClient();
    const { data, error } = await client
        .from(TABLE_NAMES.GAMES)
        .insert(newGame)
        .select("id");
    if (error) throw new Error(`Error creating game: (code ${error.code})`);
    const [game] = data || [];
    const { id } = game;
    if (!id)
        throw new ValidationError({
            name: ErrorName.VALIDATION_FAILED,
            message: "Error creating game: no return value",
            fatal: true,
        });
    return id;
};

interface PlayerList {
    leadId: string | null;
    secondId: string | null;
    thirdId: string | null;
    fourthId: string;
}

export const createPlayerGameJunction = async (
    game_id: string,
    homePlayers: PlayerList,
    awayPlayers: PlayerList,
    client: SupabaseClient
) => {
    const {
        leadId: home_lead_id,
        secondId: home_second_id,
        thirdId: home_third_id,
        fourthId: home_fourth_id,
    } = homePlayers;
    const {
        leadId: away_lead_id,
        secondId: away_second_id,
        thirdId: away_third_id,
        fourthId: away_fourth_id,
    } = awayPlayers;
    const { error } = await client
        .from(TABLE_NAMES.PLAYER_GAME_JUNCTION)
        .insert({
            game_id,
            home_lead_id,
            home_second_id,
            home_third_id,
            home_fourth_id,
            away_lead_id,
            away_second_id,
            away_third_id,
            away_fourth_id,
        });
    if (error)
        throw new DatabaseError({
            name: ErrorName.INSERT_ERROR,
            table: TABLE_NAMES.PLAYER_GAME_JUNCTION,
            fatal: true,
            message: "Could not create player game junction.",
            cause: error,
        });
};

export const generateEnds = (ends, hammerFirstEnd, homeId, awayId, gameId) => {
    const e = Object.entries(ends).reduce((all, [endNo, score], index) => {
        if (score.home === 'X') return all;

        const end = {
            game_id: gameId,
            end_number: index + 1,
            points_scored:
                score.home === "X" ? null : Math.max(score.home, score.away),
        };

        if (index === 0) {
            end.hammer_team_id = hammerFirstEnd;
        } else {
            const { scoring_team_id, points_scored, hammer_team_id } =
                all[index - 1];
                console.log(points_scored > 0)
            if (scoring_team_id === homeId && points_scored > 0) {
                end.hammer_team_id = awayId;
            } else if (scoring_team_id === awayId && points_scored > 0) {
                end.hammer_team_id = homeId;
            } else {
                console.log('hammer going to : ', hammer_team_id)
                end.hammer_team_id = hammer_team_id;
            }
        }
        end.scoring_team_id = score.home === "X"
                    ? null
                    : score.home
                    ? homeId
                    : score.away
                    ? awayId
                    : end.hammer_team_id;
        

        
        return [...all, end];
    }, []);
    return e;
};

export const createSheet = async (rink_id: number, sheet_number: number) => {
    const client = useSupabaseClient();
    const { data } = await client
        .from("sheets")
        .upsert(
            { rink_id, number: sheet_number },
            { onConflict: "rink_id, number" }
        )
        .select("id");
    const [sheetFromDb] = data || [];
    return sheetFromDb?.id;
};
