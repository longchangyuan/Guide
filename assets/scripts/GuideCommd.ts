import {find } from 'cc';
import { GuideAction, SubGuideData } from './GuideData';
import { GuideUi } from './GuideUi';

class GuideCommd {
    ui: GuideUi = null;
    task:SubGuideData = null;
    performTask(task:SubGuideData,ui: GuideUi):void{
        this.ui = ui;
        this.task = task;
        this.ui.setMask(task.Mask);
        this.runActions(task.Actions)
       
    }
    runActions(actions: Array<GuideAction>){
        for(let i = 0; i < actions.length; i++){
            this[actions[i].Type](actions[i].Params)
        }
    }
    Dialog(Params){
        this.ui.setDialog(Params);
    }

    ButtonClick(Params){
        const button = find(`Canvas/${Params.url}`);
        this.ui.focusToNode(button);
    }
    prefab(Params){
        
    }

}
export const guideCommd = new GuideCommd();

