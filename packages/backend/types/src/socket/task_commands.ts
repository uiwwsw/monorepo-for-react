export enum TaskCommnds {
    TASK_PAUSE = 'Pause',
    TASK_ABORT = 'Abort',
    TASK_RESUME = 'Resume',
    TASK_RECOVER = 'Recovery',
    TASK_RESUME_ALL = 'ResumeAll',
    TASK_PAUSE_ALL = 'PauseAll',
    TASK_RECOVERY_ALL = 'RecoveryAll',
}


export interface TaskCmdReq {
    TaskID : number;
}