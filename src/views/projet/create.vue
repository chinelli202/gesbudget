<template>
    <div>
        <div class="dialog-row">
            <h1>{{titre}}</h1>
        </div>
        <el-card class="box-card" shadow="hover">
        <el-form
          ref="form"
          :model="projet"
          label-width="180px"
        >
            <el-form-item
                label="Libelle"
                :rules="[{ validator: validateLibelle, trigger: 'blur' }]"
            >
                <el-input
                v-model="projet.label"
                @input="formAttributeChange"
                />
            </el-form-item>

            <el-form-item
                label="Description"
                :rules="[{ validator: validateDescription, trigger: 'blur' }]"
            >
                <el-input
                type="textarea"
                v-model="projet.description"
                @input="formAttributeChange"
                />
            </el-form-item>
            <div class="dialog-row" >
                <el-radio-group v-model="selectedgroupindex" @change="handleGroupChanged">
                    <el-radio v-for="(groupe, index) in maquetteTree.groupes"
                     :key="index"
                     :label="index">{{groupe.name}}</el-radio>
                </el-radio-group>
            </div>
            <el-form-item   
                label="Chapitre / Unité"
            >
                <el-select
                    v-model="projet.chapitre_id" placeholder="Unité">
                    <el-option v-for="(chapitre, index) in selectedgroup.chapitres"
                     :key="index"
                     :label="chapitre.label" 
                     :value="chapitre.id"
                    border 
                    @change="handleChapitreSelected"
                   >{{chapitre.label}}</el-option>
                </el-select>
            </el-form-item>


        </el-form>
        
        </el-card>
        <div class="footer-group clearfix">
            <el-button type="primary"  style="float: right; margin-left: 20px" @click="handleAjouterButtonClick">Ajouter</el-button>
            <el-button plain style="float: right; " @click="handleAnnulerButtonClick">Annuler</el-button>
        </div>     
    </div>
</template>

<script lang="ts">
import { defaultProjetData, createProjet } from '@/api/projets'
import { IProjetData } from '@/api/types'
import { Component, Prop, Vue } from 'vue-property-decorator' 

@Component({
    name:'CreateProjetView'
})

export default class extends Vue {

    @Prop({required:true}) private titre:string=""
    @Prop({required:true}) private projet:IProjetData = defaultProjetData
    @Prop({required:true}) private maquetteTree!:any 
    private maquetteGroups : any = {}
    private choixSection:number = 100

    private mandatTreeSelectOptions: any[] = []
    private fonctionnementTreeSelectOptions: any[] = []
    private entrepriseTreeSelectOptions: any[] = []
    private idChapitre: number = 0
    private selectedgroup: any = {}
    private selectedgroupindex : number = 0

    created(){
        //fill up the elements
        // tree groups or single tree?
        // conditional button group. multiple groups, button group. single group, no button group, pre-selected chapter, inactive.
        let groupnames = this.maquetteTree.groupnames
        console.log("maquette tree from the created dialog", this.maquetteTree)
        this.maquetteGroups = this.maquetteTree
        this.selectedgroup = this.maquetteTree.groupes[0]
         console.log("selected group", this.selectedgroup)
    }

    private handleAjouterButtonClick(){
        // validate fields
        // perform db transaction
        // case of success, emit notification to parent
        // close window

        this.$emit('create-save-projet-dialog', this.projet)
    }

    private handleAnnulerButtonClick(){
        this.$emit('exit-save-projet-dialog')
    }

    private formAttributeChange(){}

    private validateLibelle = (rule: any, value: string, callback: Function) => {
        if (!value) {
        callback(new Error('Veuillez saisir le libellé.'))
        } else {
        callback()
        }
    }

    private validateDescription = (rule: any, value: string, callback: Function) => {
        if (!value) {
        callback(new Error('Veuillez saisir une description.'))
        } else {
        callback()
        }
    }

    private handleGroupChanged(index:number){
        //set value of selected option
        console.log('index', index )
        this.selectedgroup = this.maquetteTree.groupes[index]
        console.log('group changed to this', this.selectedgroup)
    }

    private handleChapitreSelected(){

    }
}

</script>

<style>
    .footer-group{
        margin:20px;
    }

    .dialog-row{
        text-align: center;
    }
</style>