<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <div class="dialog-row">
        <el-radio-group v-model="choixSection" @change="handleSectionChange">
          <el-radio :label="100" border>Dépenses</el-radio>
          <el-radio :label="200" border>Recettes</el-radio>
        </el-radio-group>
      </div>
      <el-row class="dialog-row">
        <el-radio-group v-model="radio" @change="handleRadioGroupChange">
          <el-radio :label="1">Groupes</el-radio>
          <el-radio :label="3">Chapitres</el-radio>
          <el-radio :label="6">Rubriques</el-radio>
          <el-radio :label="9">Lignes</el-radio>
        </el-radio-group>
      </el-row>
      <el-row class="dialog-row">

        <el-cascader
        class="cascader dialog-row"
          size="medium"
          v-model="selectedId"
          :options="cascadeOptions"
          :props="{ expandTrigger: 'hover' }"
          @change="handleCascaderChange"></el-cascader>
      </el-row>
    </el-card>
    <div class="footer-group clearfix">
        <el-button plain  style="float: right; margin-left: 20px" @click="handleAllerButtonClick" :disabled="allerButtonDisabled">Aller</el-button>
        <el-button plain style="float: right; " @click="handleExitClick">Annuler</el-button>
      </div>
      
  </div>
</template>

<script lang="ts">
    import { Component, Prop, Vue, Watch } from "vue-property-decorator";
    import {getFonctionnementTree} from "@/api/maquetteTree";


@Component({
  name: 'NavigateurEtats'
})

    export default class extends Vue {
      @Prop() private maquetteTree!: any
      private groupeoptions: any = {}
      private chapitreOptions: any [] = []
      private rubriqueOptions: any [] = []
      private ligneOptions: any [] = []
      private depensesTree: any = {}
      private recettesTree: any = {}
      private selectedChapitre: any = null
      private selectedRubrique: any = null
      private selectedLigne: any = null
      private selectedId: any = null
      private cascadeOptions: any [] = []
      private radio: any = 3
      private chosenEntity: string = "chapitre"
      private chosenEntityId: number = 10
      private choixSection: number = 100
      private allerButtonDisabled = true

      private lignesCascadeOptions: any [] = []
      private chapitresCascadeOptions: any [] = []
      private rubriquesCascadeOptions: any [] = []
      private groupesCascadeOptions: any [] = [
        {label: "Charges de personnel", value: 10, groupname: "SALAIRE+DE+PERSONNEL"},
        {label: "missions ", value: 11, groupname: "MISSIONS"},
        {label: "Diverses représentations", value: 12, groupname: "DIVERSES+REPRESENTATIONS"},
        {label: "Charges diverses de fonctionnement", value: 13, groupname: "CHARGES+DIVERSES+DE+FONCTIONNEMENT"},
        {label: "Honoraires", value: 14, groupname: "HONORAIRES"},
        {label: "Dons - Subventions", value: 15, groupname: "DONS+-+SUBVENTIONS"},
        {label: "Formation", value: 16, groupname: "FORMATION"},
        {label: "Imprévus", value: 17, groupname: "IMPREVUS"},
      ]
      private listQuery = {
        id:1,
        size:10
      }

      created() {
        console.log('vivre')
        //this.getFonctionnementMaquette()
        this.setNavigateur()
      }

      private setNavigateur() {

        //const { data } = await getFonctionnementTree(this.listQuery)

        this.depensesTree = this.maquetteTree.depenses
        this.recettesTree = this.maquetteTree.recettes
        let depensesOption = this.maquetteTree.depenses.chapitres
        let recettesOption = this.maquetteTree.recettes.chapitres

        this.lignesCascadeOptions = depensesOption.map((chapitre : any)=>{
        //add properties
          let mappedChapitre = {label: chapitre.label, value: chapitre.id, children: chapitre.rubriques.map((rubrique : any)=>{
            let mappedRubrique = {label: rubrique.label, value: rubrique.id, children: rubrique.lignes.map((ligne : any)=>{
              let mappedLigne = {label: ligne.label, value: ligne.id}
              return mappedLigne
            })}
            return mappedRubrique
          })}
          return mappedChapitre
        })

        this.rubriquesCascadeOptions = depensesOption.map((chapitre : any)=>{
        //add properties
          let mappedChapitre = {label: chapitre.label, value: chapitre.id, children: chapitre.rubriques.map((rubrique : any)=>{
            let mappedRubrique = {label: rubrique.label, value: rubrique.id}
            return mappedRubrique
          })}
          return mappedChapitre
        })

        this.chapitresCascadeOptions = depensesOption.map((chapitre : any)=>{
          let mappedChapitre = {label: chapitre.label, value: chapitre.id}
          return mappedChapitre
        })

        this.cascadeOptions = this.chapitresCascadeOptions
      }

      private handleSectionChanged(){}
      private handleChapitreItemChanged(selectedItem:any){
        this.rubriqueOptions = this.chapitreOptions.filter((chapitre)=>{
          return chapitre.id == this.selectedChapitre
        })[0].rubriques
        console.log("this selected chapitre : " +this.selectedChapitre)
        console.log("rubrique option at this point : " +this.rubriqueOptions.length)
      }

      private handleRadioGroupChange(value: number){
        if(value == 1){
          this.selectedId = 10
          this.chosenEntity = 'groupe'
          this.cascadeOptions = this.groupesCascadeOptions
        }
        if(value == 3){
          this.selectedId = 10
          this.chosenEntity = 'chapitre'
          this.cascadeOptions = this.chapitresCascadeOptions
        }
        if(value == 6){
          this.selectedId = 10
          this.chosenEntity = 'rubrique'
          this.cascadeOptions = this.rubriquesCascadeOptions
        }
        if(value == 9){
          this.selectedId = 10
          this.chosenEntity = 'ligne'
          this.cascadeOptions = this.lignesCascadeOptions
        }
      }

      private handleSectionChange(selected:number){

      }

       private handleAllerButtonClick(){
         const path = this.$router.currentRoute.path
         var domaine = path.split("/")[2]
         var routename
         if(domaine == 'fonctionnement')
          routename = 'element-fonctionnement'
         if(domaine == 'mandat')
          routename = 'element-mandat'
         console.log("at this point, the component will navigate to : " + this.chosenEntity + " with the index : " + this.chosenEntityId) 
          var url = "/tab/custom/fonctionnement/" + this.chosenEntity + "/" + this.chosenEntityId;
        //  this.$router.push(url);
        this.$router.push({ name: routename, params: { entitytype: this.chosenEntity, entitykey: String(this.chosenEntityId) } })
      }

      private handleRubriqueItemChanged(selectedItem:any){
        this.chosenEntityId = selectedItem
      }
      private handleLigneChanged(){}

      private handleExitClick(){
        this.$emit('exit-navigateur-dialog')
      }

      private handleCascaderChange(value:any){

        if(this.chosenEntity == 'chapitre'){
          //this.chosenEntity = 'chapitre'
          this.chosenEntityId = value[0]
        }

        if(this.chosenEntity == 'rubrique'){
          //this.chosenEntity = 'rubrique'
          this.chosenEntityId = value[1]
        }

        if(this.chosenEntity == 'ligne'){
          //this.chosenEntity = 'ligne'
          this.chosenEntityId = value[2]
        }

        if(this.chosenEntity == 'groupe'){
          let selectedGroupe = this.groupesCascadeOptions.filter((groupe:any)=>{
            return groupe.value == value
          })[0]
          //this.chosenEntity = 'groupe'
          this.chosenEntityId = selectedGroupe['groupname']
          //console.log("this is the selected entity : " + selectedGroupe['groupname'])
        }

        this.allerButtonDisabled = false
      }
    }





</script>

<style>

label {
    color: white;
}

.box-card {
  widows: 480px;
  background: #ffffff;
  width: 100%;
  margin:auto;
  padding: 0;
}

.submit-btn {
    float: right;
}

.cascader {
  min-width: 50%
}

.dialog-row {
  text-align: center;
  margin: 20px auto;
  width: 50%;
}

.footer-group{
  margin-top: 10px;
}
</style>