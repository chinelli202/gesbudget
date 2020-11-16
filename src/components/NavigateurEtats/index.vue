<template>
  <div>
    <el-card class="box-card" shadow="hover">
      <el-row :gutter="20">
        <el-col :span="8">
            <label>Division / Direction</label> 
          <el-select v-model="selectedChapitre" placeholder="Selectionnez la Division / Direction" @change="handleChapitreItemChanged">
            <el-option
              v-for="item in chapitreOptions"
              :key="item.id"
              :label="item.label"
              :value="item.id"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
          <label>Rubrique</label>
          <el-select v-model="selectedRubrique" placeholder="Selectionnez la rubrique" @change="handleRubriqueItemChanged">
            <el-option
              v-for="item in rubriqueOptions"
              :key="item.id"
              :label="item.label"
              :value="item"
            >
            </el-option>
          </el-select>
        </el-col>
        <el-col :span="8">
            <label>Ligned bb</label>
          <el-select v-model="selectedLigne" placeholder="Selectionnez la ligne" @change="handleLigneChanged">
            <el-option
              v-for="item in ligneOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-col>
      </el-row>
      <el-row>
        <el-radio-group v-model="radio" @change="handleRadioGroupChange">
          <el-radio :label="3">Chapitres</el-radio>
          <el-radio :label="6">Rubriques</el-radio>
          <el-radio :label="9">Lignes</el-radio>
        </el-radio-group>
      </el-row>
      <el-row>
        <span>Choisir </span>
        <el-cascader
          v-model="selectedId"
          :options="cascadeOptions"
          :props="{ expandTrigger: 'hover' }"
          @change="handleCascaderChange"></el-cascader>
      </el-row>
      <el-row>
        <el-button class="submit-btn" plain>Défaut bb</el-button>
      </el-row>
    </el-card>
  </div>
</template>

<script lang="ts">
    import { Component, Vue, Watch } from "vue-property-decorator";
    import {getFonctionnementTree} from "@/api/maquetteTree";


@Component({
  name: 'NavigateurEtats'
})

    export default class extends Vue {
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
      

      private lignesCascadeOptions: any [] = []
      private chapitresCascadeOptions: any [] = []
      private rubriquesCascadeOptions: any [] = []

      private listQuery = {
        id:1,
        size:10
      }

      created() {
        console.log('vivre')
        this.getFonctionnementMaquette()
      }

      // beforeCreate(){
      //   console.log("Vue beforeCreate ")
      // }

      // beforeMount(){
      //   console.log("Vue beforeMount ")
      // }
      // mounted(){
      //   console.log("Vue mounted ")
      // }
      // beforeUpdate(){
      //   console.log("Vue beforeUpdate ")
      // }
      // updated(){
      //   console.log("Vue updated ")
      // }
      // beforeDestroy(){
      //   console.log("Vue beforeDestroy ")
      // }
      // destroyed(){
      //   console.log("Vue destroyed ")
      // }

      private async getFonctionnementMaquette() {

        const { data } = await getFonctionnementTree(this.listQuery)
        this.depensesTree = data.depenses
        this.recettesTree = data.recettes
        this.chapitreOptions = data.depenses.chapitres

         this.cascadeOptions = this.chapitreOptions.map((chapitre)=>{
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

        this.lignesCascadeOptions = this.chapitreOptions.map((chapitre)=>{
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

        this.rubriquesCascadeOptions = this.chapitreOptions.map((chapitre)=>{
        //add properties
          let mappedChapitre = {label: chapitre.label, value: chapitre.id, children: chapitre.rubriques.map((rubrique : any)=>{
            let mappedRubrique = {label: rubrique.label, value: rubrique.id}
            return mappedRubrique
          })}
          return mappedChapitre
        })

        this.chapitresCascadeOptions = this.chapitreOptions.map((chapitre)=>{
          let mappedChapitre = {label: chapitre.label, value: chapitre.id}
          return mappedChapitre
        })

      }

      private handleSectionChanged(){}
      private handleChapitreItemChanged(selectedItem:any){
        this.rubriqueOptions = this.chapitreOptions.filter((chapitre)=>{
          return chapitre.id == this.selectedChapitre
        })[0].rubriques
        console.log("this selected chapitre : " +this.selectedChapitre)
        console.log("rubrique option at this point : " +this.rubriqueOptions.length)
      }
      private handleRubriqueItemChanged(selectedItem:any){

      }
      private handleLigneChanged(){}

      private handleCascaderChange(){}

      private handleRadioGroupChange(value: number){
        console.log("the new value is " + value)
        if(value == 3){
          console.log("this value is 3 nigga")
          this.chapitreOptions = this.chapitresCascadeOptions
          console.log("and the chapitre options looks like this " + this.chapitresCascadeOptions)
        }
        if(value == 6){
          console.log("this value is 6 nigga")
          this.chapitreOptions = this.chapitresCascadeOptions
          console.log("and the chapitre options looks like this " + this.chapitresCascadeOptions)
          this.chapitreOptions = this.rubriquesCascadeOptions
        }
        if(value == 9)
          this.chapitreOptions = this.lignesCascadeOptions
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

}

.submit-btn {
    float: right;
}
</style>