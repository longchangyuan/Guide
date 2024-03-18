import { error } from "cc";
import { MainGuideData, SubGuideData, guideData } from "./GuideData";
import { GuideUi } from "./GuideUi";
import { guideCommd } from "./GuideCommd";
class GuideCtr{

    currentTaskIndex: number = 0;
    /**
     * 当前任务
     *  */
    task: MainGuideData;
    /**
     * 当前子任务
     *  */
    subTask: SubGuideData;
        /**
     * 当前任务id
     *  */
    _taskId: number;
    ui: GuideUi;
    get taskId() {
        return this._taskId;
    }
    set taskId(taskId: number) {
        this._taskId = taskId;

    }
    startTask(id:number,ui:GuideUi){
        this.ui = ui;
        try {
            this.loadTask(id);
        } catch (error) {
            console.error('没任务');
        }
        this.executeCurrentTask();
    }

    // 获取对应任务
    loadTask(id: number){
        this.taskId = id;
        this.task = guideData.getTaskById(this.taskId);
        if (!this.task) return error
    }

    /**执行当前任务*/ 
    executeCurrentTask() {
        if (this.currentTaskIndex >= 0 && this.currentTaskIndex < this.task.SubGuideList.length) {
            const currentTask = this.task.SubGuideList[this.currentTaskIndex];
            this.subTask = currentTask;
            console.log(`执行任务: ${currentTask.SubName}`);
            guideCommd.performTask(currentTask,this.ui);
        } else {
            console.log("所有任务已完成");
            this.currentTaskIndex = 0;
            this.ui.close();
        }
    }
    /**任务结束*/ 
    endTask() {
        if (this.subTask.Done) {
            console.log("结束动画");
            guideCommd.runActions(this.subTask.Done.actions);
            setTimeout(()=>{
                this.ui.restore();
                this.nextTask();
            },this.subTask.Done.time*1000)
        }else{
            this.ui.restore();
            this.nextTask();
        }
        
    }
    // 切换到下一个任务
    nextTask() {
        this.currentTaskIndex++;
        this.executeCurrentTask();
    }

    // 跳转到指定索引的任务
    skipTo(taskIndex: number) {
        if (taskIndex >= 0 && taskIndex < this.task.SubGuideList.length) {
            this.currentTaskIndex = taskIndex;
            this.executeCurrentTask();
        } else {
            console.log("任务索引超出范围");
        }
    }

    needGuide(id: number) {
        return true
    }

    clickUi(type:string){
        // TODO 没想好怎么写判断结束
        this.endTask()
    }


}

export const guideCtr = new GuideCtr();




