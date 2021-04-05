<template>

  <div class="app-container">

    <el-row>
      <el-col :span="13">
        <h2>Liste des projets</h2>
      </el-col>

      <el-col :span="10">
        <el-button type="primary" style="margin:15px 0px">Nouveau Projet</el-button>   
      </el-col>
    </el-row>
    <el-table
    :data="projetsData"
    border
    style="width: 100%">
    <el-table-column
      prop="label"
      label="Libelle"
      width="180">
    </el-table-column>
    <el-table-column
      prop="description"
      label="Description"
      width="180">
    </el-table-column>
    <el-table-column
      prop="chapitre_id"
      label="Chapitre / Unité">
    </el-table-column>
    <el-table-column
      prop="entreprise_code"
      label="Entreprise / Représentation">
    </el-table-column>
  </el-table>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {getProjets} from '@/api/projets'
import { IProjetData } from '@/api/types'
import {UserModule} from '@/store/modules/user'
import { component } from 'node_modules/vue/types/umd'


@Component({
  name: 'ProjetsView'
})

export default class extends Vue {
  private projetsData: IProjetData[] = []
  private listQuery = {
    entreprise_code : ''
  }
  

  created(){
    this.listQuery.entreprise_code = UserModule.loggedUser.team.entreprise_code;
    this.getProjetData()
  }

  private async getProjetData(){
    const {data} = await getProjets(this.listQuery)
    this.projetsData = data
    console.log("projets data", this.projetsData)
  }
}
</script>