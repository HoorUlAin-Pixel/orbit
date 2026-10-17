export type Member = { id: string; name: string };
export type Chore = { id: string; name: string; every_n_days: number };
export type Completion = { chore_id: string; member_id: string; done_on: string };