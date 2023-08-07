export type RequestRole = 'requester' | 'requestee'
export type RequestStatus = 'pending' | 'rejected' | 'accepted'

export interface BasicTeamRequest {
    id: number
    team_name: string | null
    requestee_avatar: string | null
    requestee_username: string
    requester_avatar: string | null
    requester_usename: string
    role: RequestRole
    status: RequestStatus
    updated_at: string | null
}