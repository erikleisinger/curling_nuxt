import team from "./__mock__/team";
import {
    insertPlayerIntoTeam,
    initPlayers,
    findTeamPosition,
} from "../utils/create-game";
import { describe, expect, it, vi } from "vitest";
import { client } from "./__mock__/supabase-client";
import { PLAYER_INSERT } from "./__mock__/players";

describe("findTeamPosition function", () => {
    it("should output the correct team position", () => {
        expect(findTeamPosition("lead", { ...team })).toBe("fifth_player_id");
        expect(findTeamPosition("second", { ...team })).toBe("fifth_player_id");
        expect(findTeamPosition("third", { ...team })).toBe("fifth_player_id");
        expect(findTeamPosition("fourth", { ...team })).toBe("fifth_player_id");

        expect(
            findTeamPosition("lead", { ...{ ...team }, second_player_id: null })
        ).toBe("fifth_player_id");
        expect(
            findTeamPosition("second", {
                ...{ ...team },
                lead_played_id: null,
                third_player_id: null,
                fourth_player_id: null,
            })
        ).toBe("fifth_player_id");
        expect(
            findTeamPosition("third", {
                ...{ ...team },
                lead_player_id: null,
                second_player_id: null,
                fourth_player_id: null,
            })
        ).toBe("fifth_player_id");

        expect(
            findTeamPosition("fourth", { ...{ ...team }, fifth_player_id: 1 })
        ).toBe("sixth_player_id");
        expect(
            findTeamPosition("fourth", {
                ...{ ...team },
                fifth_player_id: 1,
                sixth_player_id: 1,
            })
        ).toBe("seventh_player_id");
    });
});
describe("createTeam function", () => {
    it("should insert a player on the preferred position or first available slot", () => {
        insertPlayerIntoTeam(
            1,
            "lead",
            { ...team, lead_player_id: null },
            client
        ).then((res) => {
            expect(res).toContain({ lead_player_id: "mockValue" });
        });
        insertPlayerIntoTeam(1, "lead", team, client).then((res) => {
            expect(res).toContain({ fifth_player_id: "mockValue" });
        });
        insertPlayerIntoTeam(
            1,
            "lead",
            { ...team, fifth_player_id: 1 },
            client
        ).then((res) => {
            expect(res).toContain({ sixth_player_id: "mockValue" });
        });
        insertPlayerIntoTeam(
            1,
            "lead",
            { ...team, fifth_player_id: 1, sixth_player_id: 1 },
            client
        ).then((res) => {
            expect(res).toContain({ seventh_player_id: "mockValue" });
        });
    });
    it("should throw error if team is full", async () => {
        await expect(
            (async () => {
                await insertPlayerIntoTeam(
                    1,
                    "second",
                    {
                        ...team,
                        fifth_player_id: 1,
                        sixth_player_id: 1,
                        seventh_player_id: 1,
                    },
                    client
                );
            })()
        ).rejects.toThrow(
            `Cannot insert into team (id ${team.id}): team is full.`
        );
    });
});
describe("initPlayers function", () => {
    it("should attempt to insert player into team if player_id does not match existing player_id at the same position", async () => {

        await expect(
            (async () => {
                await initPlayers({ ...PLAYER_INSERT }, { ...team }, client);
            })()
        ).rejects.toThrow(
            `Cannot insert into team (id ${team.id}): team is full.`
        );
        vi.resetAllMocks();
        await expect(
            initPlayers(
                {
                    second: PLAYER_INSERT.second,
                    third: PLAYER_INSERT.third,
                    fourth: PLAYER_INSERT.fourth,
                    lead: { ...PLAYER_INSERT.lead, value: 19 },
                },
                { ...team },
                client
            )
        ).resolves.toContain({
            lead_player_id: team.lead_player_id,
            second_player_id: team.second_player_id,
            third_player_id: team.third_player_id,
            fourth_player_id: team.fourth_player_id,
        });
    });
});
