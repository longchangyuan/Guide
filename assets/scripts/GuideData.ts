import { _decorator, Component, error, JsonAsset, Node, resources } from 'cc';
const { ccclass, property } = _decorator;
export interface MainGuideData {
    // 引导的名称
    GuideName: string;
    // 引导的id;
    GuideId: number;
    // // 前置引导id;
    // PreId: number;
    // // 后置引导id;
    // PostId: number;
    // 触发模块
    // Trigger: string
    // 存贮的子引导任务;
    SubGuideList: Array<SubGuideData>;
}
export interface SubGuideData {
    //子引导id
    SubId: number;
    //子引导名字
    SubName: string;
    
    // 是否需要mask 默认有 
    Mask: boolean;
    // 是否强制引导
    ForceGuide: boolean;
    // 引导触发条件
    Conditions?: Array<GuideCondition>;
    // 引导表现
    Actions: Array<GuideAction>;
    // 引导结束条件
    DoneConditions?: Array<GuideCondition>;
    // 引导Action保持需要的条件;
    StayConditions?: Array<GuideCondition>;
    // 引导结束后的动作表现;
    Done?: DoneGuideAction;
}
// ui表现
export interface GuideAction {
    Type: ActionType;
    Params: {
        [key: string]: string
    };
}

export interface GuideCondition {
    Type: ConditionType;
    Params?: {
        [key: string]: string
    };
}

export interface DoneGuideAction {
    time?:number,
    actions: Array<GuideAction>
}

// 触发条件类型
enum ConditionType {

}
// 表现类型
enum ActionType {
    'Dialog',
    'ButtonClick',
    'prefab'
}
@ccclass('GuideData')
 class GuideData {
    private static _instance: GuideData;
    /**
     * 所有任务
     *  */
    allTasks: Array<JsonAsset>

    loadAllTask() {
        return new Promise((resolve, reject) => {
            resources.loadDir<JsonAsset>('json', (err, JsonAsset) => {
                if (!err && JsonAsset) {
                    resolve(true);
                    this.allTasks = JsonAsset;
                } else {
                    error(err);
                    resolve(false);
                }
            })
        });
    }

    getTaskById(id: number) {
        let task: MainGuideData = 
        {
            GuideName: '',
            GuideId:0,
            SubGuideList: []
        };
        for (let i = 0; i < this.allTasks.length; i++) {
            const json = this.allTasks[i].json
            if (json.GuideId == id) {
                const data = Object.keys(json);
                for (let index = 0; index < data.length; index++) {
                    const key = data[index];
                    task[key] = json[key];
                }

            }
        }
        return task
    }
}
export const guideData = new GuideData();

