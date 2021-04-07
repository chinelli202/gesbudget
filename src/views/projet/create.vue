<template>
    <div>
        <el-card class="box-card" shadow="hover">
        <div class="dialog-row">
            <h2>{{titre}}</h2>
        </div>
        <el-row>
            <el-col>
                <label for=""></label>
            </el-col>
            <el-col>
                <el-input
                    placeholder="Libellé du projet"
                    v-model="label"
                    clearable>
                </el-input>
            </el-col>
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
            <el-button plain  style="float: right; margin-left: 20px" @click="handleAjouterButtonClick" :disabled="allerButtonDisabled">Ajouter</el-button>
            <el-button plain style="float: right; " @click="handleAnnulerButtonClick">Annuler</el-button>
        </div>     
    </div>
</template>

<script lang="ts">
import { defaultProjetData } from '@/api/projets'
import { IProjetData } from '@/api/types'
import { Component, Vue } from 'vue-property-decorator' 

@Component({
    name:'CreateProjetView'
})

export default class extends Vue {
    private titre:string=""
    private projet:IProjetData = defaultProjetData

    private handleAjouterButtonClick(){

    }

    private handleAnnulerButtonClick(){
        
    }
}
</script>