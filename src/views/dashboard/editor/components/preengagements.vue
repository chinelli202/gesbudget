<template>
<div>
  <h1> <el-link href="engagement">Initiations</el-link> </h1>
   <el-table
    :data="initiatedEngagements"
    height="700"
    v-loading="listLoading"
    style="width: 100%"
  >
    <el-table-column
      fixed
      prop="id"
      label="ID"
      width="50"
    >    
    </el-table-column>
    <el-table-column
      fixed
      prop="created_at"
      :formatter="dateFormatter"
      label="Date"
      width="130"
    >
    </el-table-column>
    <el-table-column
      fixed
      prop="code"
      label="Code"
      width="170"
    >
    </el-table-column>
    <el-table-column
      prop="libelle"
      label="Libellé"
      width="250"
    >
    </el-table-column>
    <el-table-column
      prop="statut"
      label="Statut"
      width="75"
    >
    </el-table-column>
    <el-table-column
      prop="montant_ht" 
      :formatter="numFormatter"
      label="Montant HT"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="montant_ttc"
      :formatter="numFormatter"
      label="Montant TTC"
      width="150"
    >
    </el-table-column>
    <el-table-column
      prop="devise"
      label="Devise"
      width="75"
    >
    </el-table-column>
    <el-table-column
      prop="nature"
      label="Nature"
      width="75"
    >
    </el-table-column>
    <el-table-column
      prop="type"
      label="Type"
      width="75"
    >
    </el-table-column>
    <el-table-column
      prop="etat"
      label="Etat"
      width="75"
    >
    </el-table-column>
    <el-table-column
      prop="saisisseur"
      label="Saisi par"
      width="100"
    >
    </el-table-column>
    <el-table-column
      fixed="right"
      label="Opérations"
      width="120"
    >
      <template slot-scope="scope">
        <el-button 
          @click="detail(scope.$index, scope.row)"
          icon="el-icon-edit-outline"
          size="small"
        >
          Detail
        </el-button>
      </template>
    </el-table-column>
  </el-table>
</div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import { getEngagements } from '@/api/engagements'
import { IEngagementData } from '@/api/types'

@Component({
  name: 'PreEngagements',
  components: {
  },
})

export default class PreEngagements extends Vue{
  private initiatedEngagements: IEngagementData[] = []
  private listLoading = true

  created(){
    this.getInitiatedEngagements();
  }

  detail(value, engagement) {
    //console.log('click', value, engagement.id);
    this.$router.push({name: 'DetailEngagement', params: {id : engagement.id}});
  }

  deleteRow(index, rows) {
    rows.splice(index, 1);
  }
  
  numFormatter(value, row, column){
    return column.toLocaleString()
  }

  dateFormatter(value, row, column){
    let current_datetime = new Date(column)
    let formatted_date = current_datetime.getDate()
      + "/" + (current_datetime.getMonth() + 1) 
      + "/" + current_datetime.getFullYear()
      + " " + current_datetime.getHours() + ":" + current_datetime.getMinutes()
    return formatted_date;
  }
  private async getInitiatedEngagements(){
    this.listLoading = true;
    const { data } = await getEngagements({ etat: 'INIT' });
    this.initiatedEngagements = data;
    this.listLoading = false
  }

  // data() {
  //   const { data } = await getEngagements({ etat: 'INIT' });
  //   return {
  //     tableData: data,

  //     tableData2: [{
  //         date: '2016-05-03',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-02',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-04',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-01',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-08',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-06',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }, {
  //         date: '2016-05-07',
  //         name: 'Tom',
  //         state: 'California',
  //         city: 'Los Angeles',
  //         address: 'No. 189, Grove St, Los Angeles',
  //         zip: 'CA 90036'
  //       }]
  //   }
  // }
}
</script>