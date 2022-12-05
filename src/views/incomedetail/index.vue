<template>
    <div class="app-container">
    <el-table
        v-loading="tacticLoading"
        :data="tactic_list"
        highlight-current-row
        style="width: 65%; margin: 30px auto;"
      >
      <el-table-column label="交易对" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.instId }}</span>
          </template>
        </el-table-column>
      <el-table-column label="累计成交张数" width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.accFillSz }}</span>
          </template>
        </el-table-column>
        <el-table-column label="成交均价" width="200px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.avgPx }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收益" width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.pnl }}</span>
          </template>
        </el-table-column>
        <el-table-column label="持仓方向" width="120px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.posSide }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单平仓时间" width="250px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.uTime }}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  </template>
  <script>
  import {FetchIncomeDetail} from '@/api/income'
  export default {
    name: 'ComplexTable',
    data() {
      return {
        tacticLoading: false,
        tactic_list:[]
      }
    },
    mounted() {
        this.fetchincomedetail()
    },
    methods: {
        fetchincomedetail(){
            this.tacticLoading = true
            FetchIncomeDetail().then(
            response =>{
                if (response.data.length > 0){
                    for(var i=0; i<response.data.length;i++){
                        this.tactic_list.push({
                            accFillSz:response.data[i].accFillSz,
                            avgPx:response.data[i].avgPx,
                            instId:response.data[i].instId,
                            pnl:response.data[i].pnl,
                            posSide:response.data[i].posSide,
                            uTime:response.data[i].uTime
                        })
                    }
                }else{
                    this.$message("还没有收益详情，请耐心等待！")
                }
                this.tacticLoading = false
            }           
           ) 
        }
    }
  }
  </script>