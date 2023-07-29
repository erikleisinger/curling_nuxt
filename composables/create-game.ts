import { useTeamStore } from "@/store/teams";
import { SelectOption } from "@/types/select";
import { createTeam, initPlayers, createGame, createPlayerGameJunction } from "@/utils/create-game";
import { ErrorName, ValidationError } from "@/types/error";
export const useCreateGame = () => {
    const teamStore = useTeamStore();

    const progress = ref(0)
    const message = ref('')

    const increaseProgress = (num:number) => {
        progress.value += num *.1;
    }
    const initGame = async ({
        home,
        away,
        homePlayers,
        awayPlayers,
        home_color,
        away_color,
        awayHammer,
        homeHammer,
        rink,
        sheet,
        name,
        time,
    }: {
        home: SelectOption;
        away: SelectOption;
        homePlayers: {
            lead: SelectOption;
            second: SelectOption;
            third: SelectOption;
            fourth: SelectOption;
        };
        awayPlayers: {
            lead: SelectOption;
            second: SelectOption;
            third: SelectOption;
            fourth: SelectOption;
        };
        home_color: string;
        away_color: string;
        awayHammer: boolean;
        homeHammer: boolean;
        rink: SelectOption;
        sheet: SelectOption;
        name: string | null;
        time: string;
        goTo: string;
    }) => { 
        //Init players
        const client = useSupabaseClient();

        // Set loading
        message.value = 'Initializing teams...'
        increaseProgress(1); // .1

        // Init teams
        let homeTeam;
        if (!home.value) {
            homeTeam = await createTeam(home, client);
        } else {
            homeTeam = teamStore.teams.find(({ id }) => id === home.value);
        }

        // Loading increment
        increaseProgress(1); // .2

        let awayTeam;
        if (!away.value) {
            awayTeam = await createTeam(away, client);
        } else {
            awayTeam = teamStore.teams.find(({ id }) => id === away.value);
        }

        // Set loading
        message.value = 'Initializing players...'
        increaseProgress(1); // .3

        const homePlayerIds = await initPlayers(homePlayers, homeTeam!, client);
        increaseProgress(1); // .4
        const awayPlayerIds = await initPlayers(awayPlayers, awayTeam!, client);
        increaseProgress(1); // .5


        if (!rink.value) {
            console.log("INIT RINK");
        }
        if (!sheet.value) {
            console.log("INIT SHEET");
        }
        increaseProgress(1); // .6

        const { toUTC, toTimezone } = useTime();

        if (!homeTeam?.id)
            throw new ValidationError({
                name: ErrorName.VALIDATION_FAILED,
                message: "Could not initialize game. Missing home team",
                fatal: true,
            });
        if (!awayTeam?.id)
            throw new ValidationError({
                name: ErrorName.VALIDATION_FAILED,
                message: "Could not initialize game. Missing away team",
                fatal: true,
            });

            if (!homeTeam?.id || !awayTeam?.id || !home_color || !away_color) throw new ValidationError({
                name: ErrorName.VALIDATION_FAILED,
                message: 'Missing key values for game creation',
                fatal: true
            })

        const newGame = {
            home: homeTeam.id,
            away: awayTeam.id,
            start_time: toUTC(toTimezone(time), undefined, true),
            name: name,
            home_color: home_color,
            away_color: away_color,
            hammer_first_end: awayHammer ? awayTeam.id : homeTeam.id,
        };

        const gameId = await createGame(newGame);

        increaseProgress(2); // .8

        await createPlayerGameJunction(gameId, homePlayerIds, awayPlayerIds, client)
        increaseProgress(2)

        return gameId;

    };
    return { initGame, progress, message };
};
