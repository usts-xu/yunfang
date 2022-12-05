<template>
    <div class="main">
      <!-- <button @click="addData">测试新增</button> -->
      <cardDragger 
        :data="componentData"
        :colNum="4"
        :cardOutsideWidth="260"
        :cardInsideWidth="220"
        :cardOutsideHeight="160"
        :cardInsideHeight="150"
        @startDrag="startDrag"
        @swicthPosition="swicthPosition"
        @finishDrag="finishDrag"
      >
        <template v-slot:header="slotProps">
          <div class="topMenuBox">
            <div class="menuTitle" v-if="slotProps.item.name">{{slotProps.item.name}}</div>
            <div class="menuTitle" v-else> 默认标题 </div>
          </div>
        </template>
      </cardDragger>
    </div>
  </template>
  
  <script>
  import { cardDragger } from 'carddragger'
  import exampleChild1 from "./cardchild-tw"
  import { UpdateIncome ,InComeDetail} from '@/api/index'
  
  export default {
    name: 'carddshort',
    components:{
      cardDragger,
    },
    data() {
      return {
        user_id:0,
        flag:'',
        api_key:'',
        secret_key:'',
        passphrase:'',
        componentData: [],
        name_data: ['0','累计盈利(USDT)','今日盈利(USDT)','昨日盈利(USDT)','未实现盈亏(USDT)','账户权益(USDT)','可用保证金(USDT)','保证金率','当前实际杠杆'],
        value_data: ['0.00','0.00','0.00','0.00','0.00','0.00','0.00','0.00%','0.00X']
      }
    },
    methods: {
      getIncomeDetail(uid,flag,api_key,secret_key,passphrase){
      InComeDetail({user_id:uid,data:{flag:flag,api_key:api_key,secret_key:secret_key,passphrase:passphrase}}).then(
        response=>{
          if(response.data.total == '0.0'){
            this.componentData[0].value = '0.00'
          }else{
          this.componentData[0].value = response.data.total}
          if(response.data.today == '0.0'){
            this.componentData[1].value = '0.00'
          }else{
          this.componentData[1].value = response.data.today}
          if(response.data.yesterday == '0.0'){
            this.componentData[2].value = '0.00'
          }else{
          this.componentData[2].value = response.data.yesterday}

        }
      )
    },
      startDrag(event,id){
        console.log(event,id)
      },
      swicthPosition(OldPositon,NewPositon,originItem){
        console.log(OldPositon,NewPositon,originItem)

      },
      finishDrag(OldPositon,NewPositon,originItem){
        console.log(OldPositon,NewPositon,originItem)
        console.log(this.componentData)
        console.log('完成拖拽')
      },
      addData(){
        let num = this.componentData.length+1
        let data = {
          positionNum: num,
          name: "演示卡片"+num,
          id: "card"+num,
          componentData:exampleChild1
        }
        this.componentData.push(data)
      },
      createData(){
      for(let i = 1; i<9; i++){
        let data = {
          positionNum: i,
          name: this.name_data[i],
          value:this.value_data[i],
          id: "card"+i,
          componentData:exampleChild1
        }
        this.componentData.push(data)
      }
    },
    updateData(user_id,flag,api_key,secret_key,passphrase){
      var temp = {user_id:user_id,flag:flag,api_key:api_key,secret_key:secret_key,passphrase:passphrase}
      console.log(temp)
      if (this.secret_key !=''){
        UpdateIncome(temp).then(response => {
          if(response.data.length > 0){
            this.componentData[3].value = response.data[0]
            this.componentData[4].value = response.data[1]
            this.componentData[5].value = response.data[2]
            this.componentData[6].value = response.data[3]+'%'
            if (response.data[4] == 0){
              this.componentData[7].value = '0.00X'
            } else{
              this.componentData[7].value = response.data[4]+'X'}
            }
          }
       )}
       else{
        console.log('还没有值！')
       }
      }
    },
    mounted(){
      this.createData()
      this.updateData(this.user_id,this.flag,this.api_key,this.secret_key,this.passphrase)
      this.timeout = setInterval(() => {
      this.getIncomeDetail(this.user_id,String(this.flag),this.api_key,this.secret_key,this.passphrase)
      }, 10000); 

      this.times = setInterval(() => {

      // this.updateData(1,'0','eaf7a5ef-aca9-419f-b495-5ef8a56188c8','B67734BEF12871CC24F2133A85C8F2C7','Abcd@1234');
      this.updateData(this.user_id,this.flag,this.api_key,this.secret_key,this.passphrase)
    }, 1000 * 10);
      
    }
  }
  </script>
  
  <!-- Add "scoped" attribute to limit CSS to this component only -->
  <style scoped>
  .main{
    width: 70%;
    float: left;
    margin:50px;
  }
  .insideData{
    width: 100%;
    height: 100%;
    font-size: 15px;
    display: flex;
    justify-content: center;
    align-items: center;
    color: rgb(34, 54, 110);
    background-color: rgb(255, 255, 255);
  }
  .topMenuBox{
    background-color: rgb(22, 20, 20);
    height: 50px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 14px;
    color: #ffffff;
    padding: 0px 15px;
  }
  .dotBox{
    display: flex;
  }
  .circleDot{
    width: 3px;
    height: 3px;
    margin: 0 1.5px;
    background-color: #c4c4c4;
    border-radius: 50%;
  }
  </style>
  