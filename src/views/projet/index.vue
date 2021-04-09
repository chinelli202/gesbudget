<template>

  <div class="app-container">

    <el-row>
      <el-col :span="13">
        <h1>Liste des projets</h1>
      </el-col>

      <el-col :span="10">
        <el-button type="primary" style="margin:15px 0px" @click="handleNouveauProjetClick">Nouveau Projet</el-button>   
      </el-col>
    </el-row>
    <el-table
      :data="projetsData"
      border
      style="width: 100%">
      <el-table-column
        prop="label"
        label="Libelle">
      </el-table-column>
      <el-table-column
        prop="description"
        label="Description">
      </el-table-column>
      <el-table-column
        prop="chapitre_label"
        label="Chapitre / Unité">
      </el-table-column>
      <el-table-column
        prop="entreprise_name"
        label="Entreprise / Représentation">
      </el-table-column>
    </el-table>
  <el-dialog :visible.sync="dialogTableVisible">
       <create-projet-view 
          @exit-save-projet-dialog="handleExitDialogEventReceived" 
          @create-save-projet-dialog="handleCreateProjetEventReceived"
          :titre="saveProjetDialogTitle"
          :projet="saveProjetDialogData"
          />
  </el-dialog>

  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {getProjets, defaultProjetData, createProjet} from '@/api/projets'
import { IProjetData } from '@/api/types'
import {UserModule} from '@/store/modules/user'
import CreateProjetView from './create.vue'
import {getEntrepriseTree} from '@/api/maquetteTree'

@Component({
  name: 'ProjetsView',
  components : {CreateProjetView}
})

export default class extends Vue {
  private projetsData: IProjetData[] = []
  private newProjet : IProjetData = defaultProjetData
  private viewedProjet : IProjetData = defaultProjetData
  private saveProjetDialogData: IProjetData = defaultProjetData
  private saveProjetDialogTitle = ""
  private maquetteData:any = {}
  private listQuery = {
    entreprise_code : ''
  }
  private dialogTableVisible: boolean = false 
  

  created(){
    this.listQuery.entreprise_code = UserModule.loggedUser.team.entreprise_code;
    this.getProjetData()

  }

  private async getProjetData(){
    const {data} = await getProjets(this.listQuery)
    this.projetsData = data
    console.log("projets data", this.projetsData)
    
    getEntrepriseTree(this.listQuery).then((response) => {
      this.maquetteData = response

      //domains, more than 1 chapters, less than 1 chapters

    }).catch((error) => {
      console.log("error loading the maquette")
    })
  }

  private async createProjet(projet:IProjetData){
    
  }

  private async deleteProjet(projet:IProjetData){

  }

  private handleNouveauProjetClick(){
    this.saveProjetDialogData = this.newProjet
    this.saveProjetDialogTitle = "Nouveau Projet"
    this.dialogTableVisible = true
  }

  private handleExitDialogEventReceived(){
    this.dialogTableVisible = false
  }

  private handleCreateProjetEventReceived(projet : any){
    console.log("Projet", projet)
    this.dialogTableVisible = false
    createProjet(projet).then((response) => {
      let projetCreated = response.data
      this.projetsData.push(projetCreated)
      this.$message({
          showClose: true,
          message: 'Nouveau projet créé avec succès',
          type: 'success'
        });
    }).catch((error) => {
        //console.log('error creating the new project', error)
        this.$message({
          showClose: true,
          message: 'Ouups, une erreur est survenue lors de la création du projet.',
          type: 'error'
        });
      })
  }
}
</script>