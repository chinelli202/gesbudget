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
            <div class="dialog-row">
                <el-radio-group v-model="choixSection" @change="handleSectionChanged">
                <el-radio :label="100" border>Fonctionnement</el-radio>
                <el-radio :label="200" border>Mandat</el-radio>
                </el-radio-group>
            </div>
            <el-form-item
                label="Chapitre / Unité"
            >
                <el-select v-model="projet.chapitre_id" placeholder="please select your zone">
                    <el-option label="Chapitre 2" value="2"></el-option>
                    <el-option label="Chapitre 4" value="4"></el-option>
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
    @Prop({required:true}) private maquetteTree:any = {}
    private choixSection:number = 100

    private mandatTreeSelectOptions: any[] = []
    private fonctionnementTreeSelectOptions: any[] = []
    private entrepriseTreeSelectOptions: any[] = []


    created(){
        //fill up the elements
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