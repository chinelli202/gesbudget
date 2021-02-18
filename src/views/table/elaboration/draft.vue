<template>
    <div>
        <h2>Draft Budget</h2>
        <el-steps :space="200" :active="active" simple>
            <el-step title="Informations Générales  " description="Informations Générales" icon="el-icon-edit"></el-step>
            <el-step title="Maquette Fonctionnement" icon="el-icon-upload"></el-step>
            <el-step title="Maquette Mandat" icon="el-icon-upload"></el-step>
        </el-steps>
        <el-row v-if="active == 0" style="margin: 10px auto;">

            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>Informations Générales Budget</span>
                    <el-button style="float: right; padding: 3px 0" type="text">Bouton</el-button>
                </div>
                
                <el-form ref="form" :model="budgetInfo" label-width="120px">
                    <el-form-item label="Libellé">
                        <el-input v-model="budgetInfo.label"></el-input>
                    </el-form-item>
                    <el-form-item label="Description">
                        <el-input type="textarea" v-model="budgetInfo.description"></el-input>
                    </el-form-item>
                    <el-col span="8">
                        <el-form-item label="Date vote">
                            <el-date-picker type="date" placeholder="Choisissez une date" v-model="budgetInfo.dateVote" style="width: 45%;"></el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col span="12">
                        <el-form-item label="Période exercice">
                            <el-date-picker 
                                type="daterange"
                                range-separator="à"
                                start-placeholder="Date de début"
                                end-placeholder="Date de fin">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                                    
                </el-form>
            </el-card>
        </el-row>
        <el-row style="margin: 10px auto;" v-if="active == 1">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>Maquette Fonctionnement</span>
                    <el-button style="float: right; padding: 3px 0" type="text">Bouton</el-button>
                </div>
                <upload-excel
                    :on-success="handleSuccess"
                    :before-upload="beforeUpload" 
                />
                <p>Aperçu</p>
               
            </el-card>
        </el-row>
        <el-row v-if="active == 2" style="margin: 10px auto;">
            <el-card class="box-card">
                <div slot="header" class="clearfix">
                    <span>Maquette Mandat</span>
                    <el-button style="float: right; padding: 3px 0" type="text">Bouton</el-button>
                </div>

            </el-card>
        </el-row>
        <el-tabs type="border-card">
            <el-tab-pane label="Dépenses">
                <maquette-table/>
            </el-tab-pane>
            <el-tab-pane label="Recettes">
                <maquette-table/>
            </el-tab-pane>
            
        </el-tabs>
        
        <el-button style="margin-top: 12px;" @click="next">Prochaine étape</el-button>
    </div>
</template>

<script lang="ts">

import {Vue, Component} from 'vue-property-decorator'
import UploadExcel from '@/components/UploadExcel/index.vue'
import MaquetteTable from './maquette-table.vue'
import {getMaquetteActive} from '@/api/elaboration'


@Component({
    name: 'DraftBudget',
    components:{
        UploadExcel, 
        MaquetteTable
    }
})


export default class extends Vue{

    private active:number = 0
    private budgetInfo : any = {}
    private maquetteData: any = {}
    private params:any = {}
    created(){
        this.loadMaquette()
    }

    private next(){
        if (this.active++ > 2) this.active = 0;
    }

    private tableData: any = []
    private tableHeader: string[] = []

    private beforeUpload(file: File) {
        const isLt1M = file.size / 1024 / 1024 < 1
        if (isLt1M) {
        return true
        }
        this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
        })
        return false
    }

    private handleSuccess({ results, header }: { results: any, header: string[]}) {
        this.tableData = results
        this.tableHeader = header
    }

    private loadMaquette(){
        getMaquetteActive('SNHSIEGE', this.params).then((response) => {

            this.maquetteData = response.data
            //load fonctionnement maquette, then load mandat maquette
            let maquetteFonctionnement = response.data.domaines[0]
            let maquetteMandat = response.data.domaines[1]
      })
    }
}

</script>

<style>
  .text {
    font-size: 14px;
  }

  .item {
    margin-bottom: 18px;
  }

  .clearfix:before,
  .clearfix:after {
    display: table;
    content: "";
  }
  .clearfix:after {
    clear: both
  }

  .box-card {
    min-width: 700px;
  }
</style>