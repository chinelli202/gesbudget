<template>
  <div
    class="etatnavbar"
  >
      
    <el-menu v-if="menuType === 1"
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      :background-color="navbarstyles.backgroundColor"
      :text-color="navbarstyles.textColor"
      :active-text-color="navbarstyles.activeTextColor"
    >
      <el-menu-item class="fonctionnement">
        <i class="el-icon-document fonctionnement" />
        <span class="fonctionnement">Etats {{ navTitle }}</span>
      </el-menu-item>
      <el-menu-item
        index="1"
        @click="handleGenerauxClicked()"
      >
        Général
      </el-menu-item>

      <!-- <el-menu-item @click="handleNavigate">
        Aller à...
      </el-menu-item> -->

      <!-- group menus -->
      <el-menu-item
        v-for="group in groupesMap"
        :key="group.id"
        @click="handleGroupClicked(group)"
      >
        {{ group.label }}
      </el-menu-item>

      <el-menu-item
        v-if="!isGeneraux"
        @click="handleExporter"
      >
        <i class="el-icon-download" />
        <span>Exporter</span>
      </el-menu-item>
      
    </el-menu>

    <el-menu v-else
      default-active="1"
      class="el-menu-demo"
      mode="horizontal"
      :background-color="navbarstyles.backgroundColor"
      :text-color="navbarstyles.textColor"
      :active-text-color="navbarstyles.activeTextColor"
   >
      
      <el-menu-item class="fonctionnement">
        <i class="el-icon-document fonctionnement" ></i> 
        <span class="fonctionnement">Etats {{navTitle}}</span>
  
      </el-menu-item> 
      <el-menu-item index="1"
      @click="handleGenerauxClicked()">
        Général
      </el-menu-item> 

      <el-submenu v-for="group in groupesMap"
        :key="group.id"
        :index="group.id">
          <template slot="title">
            {{group.label}}
          </template>
          <el-menu-item 
          v-for="rubrique in group.children"
          :key="rubrique.id"
          :index="rubrique.index"
          @click="handleSubMenuClicked(rubrique)"
          >
            {{rubrique.label}}
          </el-menu-item>
      </el-submenu>

      <el-menu-item v-if="!isGeneraux" @click="handleExporter">
        <i class="el-icon-download"></i>
        <span>Exporter</span> 
      </el-menu-item>
      
    </el-menu>

    <el-dialog :visible.sync="dialogTableVisible">
      <navigateur-etats
        :maquette-tree="maquetteTree"
        :domaine="domaine"
        @exit-navigateur-dialog="handleExitDialogEventRecieved"
      />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator'
import NavigateurEtats from '@/components/NavigateurEtats/index.vue'
import { FiltreEtatsModule as etatsmodule, periodes } from '@/store/modules/filtre-etats'
import { getFonctionnementTree, getMandatTree, getSectionsFonctionnementTree, getEntrepriseTree } from '@/api/maquetteTree'
import { UserModule } from '@/store/modules/user'

  @Component({
    name: 'EntrepriseNavBar',
    components: {
      NavigateurEtats
    }
  })

export default class extends Vue {
@Prop({ default: 'CPSP' }) private entreprise!: string
// collect user team and set title accordingly
private navTitle:String = 'CPSP'
private activeIndex2 : any = 'dd'
private input2 = ''
private dialogTableVisible = false
private recettesTree:any = {}
private depensesTree: any = {}
private titleGroups:any = {}
private listQuery = {
  id: 1,
  size: 10,
  entreprise_code: 'CPSP'
}
private groupType:string = "sections"

private isGeneraux = true

private navbarstyles: any = {
  backgroundColor: '',
  textColor: '',
  activeTextColor: ''
}

private groupesMap:any[] = []
private depensesMap: any [] = []
private recettesMap: any [] = []
private ssectionFonctionnementMap : any [] = []

private maquetteTree : any = {}

private exportMap: any [] = []  
private menuType:number = 1

created() {
  console.log('creating entreprise nav bar')
  // test weither menu is generaux
  const path = this.$router.currentRoute.path
  this.isGeneraux = path.split('/')[3] == 'generaux'

  //set nav title and styling
  // collect entreprise information from userloggedin variable
  this.listQuery.entreprise_code = UserModule.loggedUser.team.entreprise_code;
  this.navTitle = UserModule.loggedUser.team.description
  this.paramNavTree()
}

  private async paramNavTree(){
    console.log('running param nav tree')

      const {data} = await getEntrepriseTree(this.listQuery)
      this.maquetteTree = data
      if(this.maquetteTree.content.chapitres.length > 1){
        this.menuType = 2
        let groupesOption = this.maquetteTree.content.chapitres
        this.groupesMap = groupesOption.map((chapitre : any)=>{
          let groupe = {label : chapitre.label, id : chapitre.id, children: chapitre.rubriques.map((rubrique : any) => {
            let child = {label : rubrique.label, id : rubrique.id, type : 'rubrique'}
            return child
          })}
          return groupe
        })
      }
      else{
        this.menuType = 1
        let groupesOption = this.maquetteTree.content.chapitres[0].rubriques  
        this.groupesMap = groupesOption.map((rubrique : any)=>{
          let groupe = {label : rubrique.label, id : rubrique.id}
          return groupe
        })
      }
  }

private handleClick(element: any) {
  console.log('this is the instance ', element.index)
}

private handleNavigate() {
  this.dialogTableVisible = true
}

private checkIfDateIsDisabled(date:string) {
  return false
}

private handleExporter() {
  console.log('route params', this.$route.params.entitytype)
  const entitytype = this.$route.params && this.$route.params.entitytype
  const entitykey = this.$route.params && this.$route.params.entitykey
  const periode = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR
    : (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS) ? periodes.MOIS
      : (etatsmodule.periode == periodes.INTERVALLE) ? periodes.INTERVALLE : 'rapport_mensuel'

  const param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour
    : etatsmodule.moisPeriodeMois

  console.log('entyty type evaluated as', entitytype)
  if (entitytype == 'groupe') {
    window.location.href = process.env.VUE_APP_BASE_API + '/export/' + entitytype + '/full/' + entitykey + '?' +// 'http://localhost:8000/api/export/'+entitytype+'/'+entitykey+'?'
            'critere=' + periode + '&' +
            'param=' + param + '&' +
            'mois=' + etatsmodule.moisPeriodeMois + '&' +
            'startmonth=' + etatsmodule.debutPeriodeIntervalle + '&' +
            'endmonth=' + etatsmodule.finPeriodeIntervalle
  } else {
    window.location.href = process.env.VUE_APP_BASE_API + '/export/' + entitytype + '/' + entitykey + '?' +// 'http://localhost:8000/api/export/'+entitytype+'/'+entitykey+'?'
            'critere=' + periode + '&' +
            'param=' + param + '&' +
            'mois=' + etatsmodule.moisPeriodeMois + '&' +
            'startmonth=' + etatsmodule.debutPeriodeIntervalle + '&' +
            'endmonth=' + etatsmodule.finPeriodeIntervalle
  }
}

private handleExporterGeneraux(map:any) {
  // set periode and params
  const periode = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? periodes.JOUR
    : (etatsmodule.periode == periodes.MOIS || etatsmodule.periode == periodes.CEMOIS) ? periodes.MOIS
      : (etatsmodule.periode == periodes.INTERVALLE) ? periodes.INTERVALLE : 'rapport_mensuel'

  const param = (etatsmodule.periode == periodes.JOUR || etatsmodule.periode == periodes.TODAY) ? etatsmodule.jourPeriodeJour
    : etatsmodule.moisPeriodeMois
    // test full, domaine or simple section
  var url
  if (map.type == 'domaine') {
    window.location.href = process.env.VUE_APP_BASE_API + '/export/domaine/' + this.entreprise + '?' +// 'http://192.:8000/api/export/domaine/'+this.domaine+'?'
          'critere=' + periode + '&' +
          'param=' + param + '&' +
          'mois=' + etatsmodule.moisPeriodeMois + '&' +
          'startmonth=' + etatsmodule.debutPeriodeIntervalle + '&' +
          'endmonth=' + etatsmodule.finPeriodeIntervalle
  } else if (map.type == 'full') {
    window.location.href = process.env.VUE_APP_BASE_API + '/export/section/full/' + map.value + '/' + this.entreprise + '?' +// 'http://localhost:8000/api/export/section/full/'+map.value+'/'+this.domaine+'?'
          'critere=' + periode + '&' +
          'param=' + param + '&' +
          'mois=' + etatsmodule.moisPeriodeMois + '&' +
          'startmonth=' + etatsmodule.debutPeriodeIntervalle + '&' +
          'endmonth=' + etatsmodule.finPeriodeIntervalle
  }
  console.log('will route to this url : ', url)
}

private handleRecettesClick(el:any) {
  console.log('this is the index of the clicked item, ', el.value)
}

private handleMenuItemClicked(data:any) {
  console.log('this is the index of the clicked item')
  // will be routed to chapitre subsection with given id
  var routename
  if (this.entreprise == 'fonctionnement') { routename = 'element-fonctionnement' }
  if (this.entreprise == 'mandat') { routename = 'element-mandat' }

  // console.log("at this point, the component will navigate to : " + this.chosenEntity + " with the index : " + this.chosenEntityId)
  // var url = "/tab/custom/fonctionnement/" + this.chosenEntity + "/" + this.chosenEntityId;
  //  this.$router.push(url);
  this.$router.push({ name: routename, params: { entitytype: data.type, entitykey: data.value } })
  // console.log("will use element of type : "+data.type+", with key : " + data.value)
}

private handleGenerauxClicked() {
  var routename
  if (this.entreprise == 'fonctionnement') { routename = 'fonctionnement-generaux' }
  if (this.entreprise == 'mandat') { routename = 'mandat-generaux' }
  this.$router.push({ name: routename })
}

  private handleGroupItemClicked(data:any){
    var routename = "etats-entreprise"
    this.$router.push({ name: routename, params: { entitytype: data.elementType, entitykey: data.id } })
}
private handleGroupClicked(data:any) {
  var routename = 'etats-entreprise'
  this.$router.push({ name: routename, params: { entitytype: 'rubrique', entitykey: data.id } })
}

  private handleSubMenuClicked(data:any){
    var routename = "etats-entreprise"
    this.$router.push({ name: routename, params: { entitytype: data.type, entitykey: data.id } })
  }

  private handleAllerButtonClick(){
    this.dialogTableVisible = false
  }

private handleExitDialogEventRecieved() {
  this.dialogTableVisible = false
}
}
</script>

<style>

.fonctionnement {
  font-size : 22px;

  padding-bottom: 40px;
  padding-right: 20px;
  display: inline-block;
}
</style>
