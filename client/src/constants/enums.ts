export enum AimState {
  Current = 1,
  Hangup,
  Abandon,
  Achieved,
}

export enum MilestoneState {
  Current = 1,
  Achieved,
  Rewarded,
}

export enum TaskState {
  Waiting = 1,
  Doing,
  Finished,
}

export enum SortType {
  ASC = 1,
  DSC = -1
}