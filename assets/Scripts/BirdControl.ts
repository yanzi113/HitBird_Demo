

const {ccclass, property} = cc._decorator;

@ccclass
export default class BirdControl extends cc.Component {
    // 小鸟有一个存活状态，在天上飞的时候打它有效（存活），掉落的时候打它无效（失活）

    //打一下就死，所以生命值属性为1
    hp: number = 1;
    //目标位置 +-100，185
    targetPos: cc.Vec2 = null;
    //速度
    speed: number = 50;
    //游戏结束回调
    dieCallBack: Function;
    //分数增加回调
    addScoreCallBack: Function;

    start () {
        this.fly()
    }
    fly(){
        //随机目标点
        this.targetPos = cc.v2(Math.random() * 220 - 110,60);
        //如果向右飞，则翻转精灵使其看起来不那么难看
        if(this.targetPos.x > this.node.x){
            this.node.scaleX = -1;
        }
        //移动 飞持续的时间为距离/速度 这里没有用斜着的真实距离而是用的y轴上的距离
        let move_fly= cc.moveTo((this.targetPos.y - this.node.y) / this.speed, this.targetPos);
        //当飞出屏幕，调用游戏结束的回调函数
        let seq = cc.sequence(move_fly,cc.callFunc(()=>{
            this.dieCallBack();
        }))
        //seq为先执行飞移动，（完毕）再调用死亡回调函数
        this.node.runAction(seq);
    
    //如果触摸小鸟，小鸟死亡，然后掉落到地上
    this.node.on(cc.Node.EventType.TOUCH_START,(event)=>{
        //如果还活着，则让hp-1变为失活状态,停止所有动作，然后掉落到地上
        if(this.hp > 0){
            this.hp --;
            this.node.stopAllActions()
            //播放死亡动画
            this.getComponent(cc.Animation).play("die")
            //向下掉落 移动 跟飞的移动一个套路 持续时间为y距离/速度2倍，即掉落的更快，目标点（当前x,0）
            let move_die = cc.moveTo((this.node.y)/(this.speed * 2),cc.v2(this.node.x,0))
            //加分并且销毁自身
            
            this.node.runAction(cc.sequence(move_die,cc.callFunc(()=>{
                this.node.destroy()
            })))
            this.addScoreCallBack()

        }
    })}
    // update (dt) {}
}
