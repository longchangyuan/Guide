import { _decorator, Component, error, instantiate, Node, Prefab, resources } from 'cc';
import { guideData } from './GuideData';
import { guideCtr } from './GuideCtr';
import { GuideUi } from './GuideUi';
const { ccclass, property } = _decorator;

@ccclass('GuideTest')
export class GuideTest extends Component {
    onLoad(): void {
        this.init();
    }
    async init() {
        await guideData.loadAllTask();
        if (guideCtr.needGuide(101)) {
            resources.load<Prefab>('prefabs/guide', (err, prefab) => {
                if (err||!prefab) {
                    error(err)
                } else {
                    const guideNode = instantiate(prefab)
                    this.node.addChild(guideNode);
                    guideNode.getComponent(GuideUi).init(101);
                }
            })
        }
    }
    start() {

    }


}


