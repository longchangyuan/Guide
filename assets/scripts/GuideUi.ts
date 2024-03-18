import { _decorator, Component, Graphics, Label, Node, Rect, Scheduler, UITransform, v3 } from 'cc';
import {MainGuideData } from './GuideData';
import { guideCtr } from './GuideCtr';
const { ccclass, property } = _decorator;

@ccclass('GuideUi')
export class GuideUi extends Component {
    @property(Node) showNode: Node = null;
    @property(Node) maskNode: Node = null;
    /**
     * 手指节点
     */
    figger: Node;
    /**
     * 文本节点
     */
    txt: Node;

    task: MainGuideData;
    // rects: Rect[];
    rect: Rect;
    cliclNode: Node;

    protected onLoad(): void {
        this.figger = this.showNode.getChildByName("figger");
        this.txt = this.showNode.getChildByName("txt");
        this.txt.active = false;
        this.figger.active = false;
    }

    init(taskId:number) {
       guideCtr.startTask(taskId,this);
    }

    setMask(active: boolean = true) {
        this.maskNode.active = active;
    }

    restore(){
        this.txt.active = false;
        this.figger.active = false;
    }
    // TODO:应该另开一个操作处理
    // 给对应节点在mask上画圈
    focusToNode(node: Node) {
        const graphics = this.maskNode.getComponent(Graphics)
        graphics.clear();
        const rect = node.getComponent(UITransform).getBoundingBoxToWorld();
        const nodePos = v3(rect.origin.x, rect.origin.y)
        const p = this.node.getComponent(UITransform).convertToNodeSpaceAR(nodePos);
        rect.x = p.x;
        rect.y = p.y;
        graphics.fillRect(p.x, p.y, rect.width, rect.height);
        this.cliclNode = node;
        // this.rect = new Rect(p.x, p.y, rect.width, rect.height);
        return rect;
    }

    setDialog(Params){
        this.txt.active = true;
        this.txt.getComponent(Label).string = Params.Content;
        const pos = v3(Params.Pos[0],Params.Pos[1],Params.Pos[2])
        this.txt.setPosition(pos);
        if(Params.time){
            this.schedule(()=>{
                this.txt.active = false;
            },Params.time);
        }
    }
    onclick(event){
        const touchLoc = event.getLocation(); // 获取点击位置
        const dialogRect = this.txt.getComponent(UITransform).getBoundingBoxToWorld(); // 获取目标节点的世界边界框
        // 检查点击位置是否在目标节点的边界框内
        let click = 'mask' ;
        if (dialogRect.contains(touchLoc)) {
            console.log('touch txt');
            click = 'dialog'
            // 点击了目标节点的处理逻辑
        }
        const nodeRect = this.cliclNode.getComponent(UITransform).getBoundingBoxToWorld();
        // const element = this.rects[index];
        if (nodeRect.contains(touchLoc)) {
            click = 'show'
            console.log('touch rect');
            // 点击了目标节点的处理逻辑
        }
        guideCtr.clickUi(click)
    }
    close(){
        this.node.active  = false;
    }
}


