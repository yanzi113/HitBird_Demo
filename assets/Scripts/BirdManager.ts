import BirdControl from './BirdControl';


const {ccclass, property} = cc._decorator;

@ccclass
export default class BirdManager extends cc.Component {
    //小鸟预设体
    @property(cc.Prefab)
    birdPre: cc.Prefab;
    //1s出现一只鸟
    @property(cc.Label)
    scoreLabel: cc.Label;
    @property(cc.Node)
    backView: cc.Node
    time: number = 1;
    //分数
    score: number = 0;

    start () {
        //创建鸟（创建鸟，设置父物体并赋予初始位置）
        //通过runAction方法实现定时器
        this.node.runAction(cc.repeatForever(cc.sequence(cc.delayTime(this.time),cc.callFunc(()=>{
            //创建鸟 instantiate方法
            let bird = cc.instantiate(this.birdPre);
            //设置预设体的父物体
            bird.setParent(this.node);
            //设置小鸟初始位置
            bird.x = Math.random() * 220 - 110;
            bird.y = this.node.y
            //调用鸟里面的飞方法
            bird.getComponent(BirdControl).fly()
            //加分回调函数
            bird.getComponent(BirdControl).addScoreCallBack = ()=>{
                this.score ++;
                //console.log("分数：" + this.score)
                this.scoreLabel.string = this.score + "";
            }
            bird.getComponent(BirdControl).dieCallBack = ()=>{
                //销毁所有小鸟
                this.node.destroyAllChildren()
                //停止所有动作
                this.node.stopAllActions();
                this.backView.active = true;
            }

        }))))
    }
    BackView(){
        cc.director.loadScene("start")
    }

    // update (dt) {}
}
