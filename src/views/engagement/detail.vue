<template>
  <div class="clearfix">
    <div class="app-container max-w-600 center">
      <el-card shadow="always">
        <el-container>
          <el-header>
            <h1 align="center">
              Detail Engagement - {{ engagement.id }}
            </h1>
          </el-header>
          <el-main
            v-loading="cardLoading"
          >
            <el-alert
              v-if="engagementIsClosed"
              title="Ce pré-engagement a été clôturé."
              type="info"
              :closable="false"
              effect="dark"
              style="margin-bottom: 10px"
              center
              show-icon
            />
            <el-alert
              v-else-if="engagement.next_statut !== null"
              title="Ce pré-engagement a été renvoyé pour modification."
              type="info"
              :closable="false"
              style="max-width: 400vw; margin-bottom: 10px"
              center
              show-icon
            />
            <el-form
              ref="form"
              :model="engagement"
              label-width="100px"
            >
              <el-row
                type="flex"
                justify="center"
                style="margin-bottom: 1.5em"
              >
                <el-col
                  :span="8"
                  :offset="2"
                >
                  <el-radio-group
                    v-model="domain"
                    size="small"
                    :disabled="!toEdit"
                    @change="domainChange"
                  >
                    <el-radio-button label="Fonctionnement" />
                    <el-radio-button label="Mandat" />
                  </el-radio-group>
                </el-col>
              </el-row>
              <el-form-item label="Code">
                <el-input
                  v-model="engagement.code"
                  :disabled="true"
                />
              </el-form-item>
              <el-form-item label="Ligne">
                <el-cascader
                  v-model="cascade"
                  :options="chapitresOptions"
                  :props="{expandTrigger: 'hover'}"
                  :disabled="!toEdit"
                  placeholder="Choisir la ligne budgétaire"
                  class="cascade-extra-lg"
                  @change="cascadeChange"
                />
              </el-form-item>
              <el-form-item label="Libellé">
                <el-input
                  v-model="engagement.libelle"
                  type="textarea"
                  :rows="2"
                  :disabled="!toEdit"
                  @input="formAttributeChange"
                />
              </el-form-item>
              <el-form-item label="Montant HT">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <el-form-item label="">
                      <el-select
                        v-model="engagement.devise"
                        placeholder="Devise"
                        :disabled="!toEdit"
                      >
                        <el-option
                          v-for="(obj) in deviseOptions"
                          :key="obj.code"
                          :label="obj.code"
                          :value="obj.code"
                        />
                      </el-select>
                    </el-form-item>
                  </el-col>
                  <el-col :span="18">
                    <el-input
                      v-model="engagement.montant_ht"
                      :disabled="!toEdit"
                      @input="changeMontantHT"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item label="Montant TTC">
                <el-row :gutter="10">
                  <el-col :span="3">
                    <strong>TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
                  </el-col>
                  <el-col :span="20">
                    <el-input
                      v-model="engagement.montant_ttc"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>
              <el-form-item class="no-margin-bottom">
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Type
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Statut
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <el-select
                      v-if="toEdit"
                      v-model="engagement.type"
                      placeholder="Type"
                      class="type-select"
                      @change="formAttributeChange"
                    >
                      <el-option
                        v-for="(obj) in typeOptions"
                        :key="obj.code"
                        :label="obj.libelle"
                        :value="obj.code"
                      >
                        <span style="float: left">{{ obj.libelle }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                      </el-option>
                    </el-select>
                    <el-input
                      v-else
                      v-model="engagement.type_libelle"
                      :disabled="true"
                    />
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <el-input
                      v-model="engagement.statut_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <span class="span-label">Nature
                    </span>
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <span class="span-label">Etat
                    </span>
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="10"
                    :offset="3"
                  >
                    <!-- <el-input
                      v-model="engagement.nature_libelle"
                      :disabled="true"
                    /> -->
                    <el-select
                      v-if="toEdit"
                      v-model="engagement.nature"
                      placeholder="Nature"
                      class="type-select"
                      @change="formAttributeChange"
                    >
                      <el-option
                        v-for="(obj) in natureOptions"
                        :key="obj.code"
                        :label="obj.libelle"
                        :value="obj.code"
                      >
                        <span style="float: left">{{ obj.libelle }}</span>
                        <span style="float: right; color: #8492a6; font-size: 13px">{{ obj.code }}</span>
                      </el-option>
                    </el-select>
                    <el-input
                      v-else
                      v-model="engagement.nature_libelle"
                      :disabled="true"
                    />
                  </el-col>
                  <el-col
                    :span="10"
                    :offset="1"
                  >
                    <!-- <el-input
                      v-model="engagement.etat_libelle"
                      :disabled="true"
                    /> -->
                    <el-input
                      v-model="engagement.etat_libelle"
                      :disabled="true"
                    />
                  </el-col>
                </el-row>
              </el-form-item>

              <el-form-item
                class="notes"
                style="line-height: 25px;"
              >
                <el-row :gutter="10">
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Créé le
                  </el-col>
                  <el-col :span="15">
                    {{ engagement.created_at | dateFormatLong }}
                  </el-col>
                </el-row>
                <el-row :gutter="10">
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Saisi par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserSaisisseur) ? "Vous même" : engagement.saisisseur_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_first && engagement.valideur_first !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 1ère par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurp) ? "Vous même" : engagement.valideurp_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_second && engagement.valideur_second !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation 2nde par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurs) ? "Vous même" : engagement.valideurs_name }}
                  </el-col>
                </el-row>
                <el-row
                  v-if="engagement.valideur_final && engagement.valideur_final !== ''"
                  :gutter="10"
                >
                  <el-col
                    :span="6"
                    :offset="3"
                  >
                    Validation finale par
                  </el-col>
                  <el-col :span="15">
                    {{ (isCurrentUserValideurf) ? "Vous même" : engagement.valideurf_name }}
                  </el-col>
                </el-row>
              </el-form-item>
            </el-form>
            <footer-buttons
              :entity="engagement"
              type="INIT"
              :submit-disabled="submitUpdateDisabled"
              :fallback-url="fallbackUrl"
              :on-cancel="onCancel"
              :update-submit="updateSubmit"
              :resend-update="resendUpdate"
              :validerp-submit="validerpSubmit"
              :validers-submit="validersSubmit"
              :validerf-submit="validerfSubmit"
              :restore-preeng="fbRestorePreeng"
              :options-annuler-valider="optionsAnnulerValider"
              :commentaire-submit="fbcommentaireSubmit"
              :close-preeng="fbclosePreeng"
              :send-back-submit="fbsendBackSubmit"
              :cancel-valider-submit="fbcancelValiderSubmit"
              :next-etat-action="launchImputer"
              @footerload="loadHandler($event)"
            />
          </el-main>
        </el-container>
      </el-card>
    </div>

    <el-dialog
      v-loading="imputerFormLoading"
      :visible.sync="imputerFormVisible"
      width="75%"
      :append-to-body="true"
      top="3vh"
    >
      <el-form
        :model="engagement"
      >
        <el-row
          type="flex"
          justify="center"
        >
          <el-col
            :span="10"
          >
            <h1 style="text-align: center">
              Imputer l'engagement {{ engagement.id }}
            </h1>
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Engagement</strong>
            </el-col>
            <el-col :span="17">
              <el-input
                v-model="engagement.code"
                :disabled="true"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="3"
              :offset="2"
            >
              <strong>Reference</strong>
            </el-col>
            <el-col :span="17">
              <el-input
                v-model="imputation.reference"
                @input="imputerFormAttributeChange"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-row
          :gutter="10"
          style="margin-bottom: 2em"
        >
          <el-col
            :span="3"
            :offset="2"
          >
            <strong>Observations</strong>
          </el-col>
          <el-col :span="17">
            <el-input
              v-model="imputation.observations"
              type="textarea"
              :rows="3"
              @input="imputerFormAttributeChange"
            />
          </el-col>
        </el-row>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant HT</strong>
            </el-col>
            <el-col :span="4">
              <el-select
                v-model="imputation.devise"
                placeholder="Devise"
                @input="imputerFormAttributeChange"
              >
                <el-option
                  v-for="(obj) in deviseOptions"
                  :key="obj.code"
                  :label="obj.code"
                  :value="obj.code"
                />
              </el-select>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="imputation.montant_ht"
                @input="changeImputerMontantHT"
              />
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item>
          <el-row :gutter="10">
            <el-col
              :span="4"
              :offset="2"
            >
              <strong>Montant TTC</strong>
            </el-col>
            <el-col
              :span="4"
            >
              <span class="span-label">
                <strong> TVA {{ tva.toLocaleString('fr-FR') }}%</strong>
              </span>
            </el-col>
            <el-col :span="12">
              <el-input
                v-model="imputation.montant_ttc"
                :disabled="true"
              />
            </el-col>
          </el-row>
          <el-row>
            <el-col
              :offset="2"
              :span="20"
            >
              <el-alert
                v-if="tvaImputerMismatch"
                title="Le taux de TVA de l'engagement est différent du taux de tva actuel"
                type="warning"
                :closable="false"
                center
                show-icon
              />
            </el-col>
          </el-row>
          <el-row
            v-if="false"
            style="margin-top: 2em"
          >
            <el-col
              :offset="2"
              :span="18"
            >
              <el-upload
                ref="upload"
                class="upload-demo"
                drag
                action="https://jsonplaceholder.typicode.com/posts/"
                :on-preview="handlePreview"
                :on-remove="handleRemove"
                :file-list="imputation.files"
                :on-change="changeImputerFile"
                :disabled="true"
                multiple
              >
                <i class="el-icon-upload" />
                <div class="el-upload__text">
                  Déposer les fichiers ici ou<em>cliquez pour envoyer</em>
                </div>
                <div
                  slot="tip"
                  class="el-upload__tip"
                >
                  Fichiers jpg/png avec une taille inférieure à 500kb
                </div>
              </el-upload>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
      <span
        slot="footer"
        class="dialog-footer"
      >
        <el-row
          justify="end"
        >
          <el-col
            :span="20"
            :offset="2"
          >
            <el-button @click="imputerFormVisible = false">Annuler</el-button>
            <el-button
              type="primary"
              :disabled="submitImputerDisabled"
              @click="imputerEngagement"
            >
              Imputer l'engagement
            </el-button>
          </el-col>
        </el-row>
      </span>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'
import {
  detailEngagement
  , updateEngagement, validationpPreeng, validationPreeng, cancelValidationPreeng, cancelValidationpPreeng, validationsPreeng
  , resendUpdateEngagement, addComment, closePreeng, restorePreeng, sendBack
  , imputerEngagement
} from '@/api/engagements'
import FooterButtons from './components/footerbuttons'
import { AppModule } from '@/store/modules/app'
import { UserModule } from '@/store/modules/user'
import { PermissionModule } from '@/store/modules/permission'

@Component({
  name: 'DetailEngagement',
  components: {
    FooterButtons
  },
  beforeRouteEnter(to, from, next) {
    next(vm => {
      vm.fallbackUrl = from.path
    })
  }
})

export default class extends Vue {
  /** Ligne budgetaire cascader */
  private domain = 'Fonctionnement'
  private chapitresOptions: any = AppModule.budgetStructure.fonctionnement
  private cascade: number[] = []

  /** Main card form attributes */
  private cardLoading = true
  private deviseOptions = {}
  private typeOptions = {}
  private natureOptions = {}
  private etatOptions = {}
  private statutOptions = {}
  private tva = 0

  private fallbackUrl = { path: '/' }

  private engagementIsClosed = false

  private isCurrentUserSaisisseur = false
  private isCurrentUserValideurp = false
  private isCurrentUserValideurs = false
  private isCurrentUserValideurf = false

  private submitUpdateDisabled = true;

  private toEdit = false;

  /** Variables for buttons rendering */
  private permissions : any[] = []
  private permissionCodes = {}
  private engagement = {
    id: null,
    code: '',
    montant_ht: 0,
    montant_ttc: 0,
    devise: 'XAF',
    saisisseur: '',
    saisisseur_name: '',
    statut: '',
    next_statut: '',
    etat: '',
    valideur_first: '',
    valideur_second: '',
    valideur_final: '',
    ligne_id: 0,
    chapitre_id: 0,
    rubrique_id: 0,
    domaine: 'Fonctionnement',
    documents: [],
    imputations: []
  }

  /** Variables for Imputation dialog form */
  private imputerFormVisible = false
  private imputerFormLoading = false
  private submitImputerDisabled = true
  private tvaImputerMismatch = false

  private imputations = []
  private imputation = {
    engagement_id: '',
    reference: '',
    montant_ht: 0,
    montant_ttc: 0,
    devise: 'XAF',
    observations: '',
    statut: '',
    files: []
  }

  created() {
    const id = this.$route.params && this.$route.params.id
    this.permissions = UserModule.permissions
    this.permissionCodes = PermissionModule.permissionCodes
    this.fetchData(parseInt(id))
  }

  private async fetchData(engagementId: number) {
    this.cardLoading = true
    detailEngagement({ id: engagementId }).then((response) => {
      this.engagement = response.data
      this.deviseOptions = AppModule.devises
      this.typeOptions = AppModule.typesEngagement
      this.natureOptions = AppModule.naturesEngagement
      this.etatOptions = AppModule.etatsEngagement
      this.statutOptions = AppModule.statutsEngagement
      this.tva = AppModule.tva

      this.updateViewVariables()

      /** Initialize cascader */
      this.cascade = [this.engagement.chapitre_id, this.engagement.rubrique_id, this.engagement.ligne_id]
      this.domain = this.engagement.domaine
      this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]

      this.cardLoading = false
    })
      .catch(error => {
        console.error('Error while obtaining engagement details ', error)
      })
  }

  /** Ligne budgetaire selector */
  private domainChange() {
    this.chapitresOptions = AppModule.budgetStructure[this.domain.toLowerCase()]
  }

  private cascadeChange() {
    console.log(this.cascade)
    this.formAttributeChange()
    this.engagement.ligne_id = this.cascade === null ? 0 : this.cascade[2]
    this.updateViewVariables()
  }

  /** footer button utitlities functions */
  private loadHandler(event:any) {
    // this.cardLoading = event
  }

  private async fbcommentaireSubmit(id: number, comment:string) {
    const response = await addComment({ id: id, comment: comment })
    this.updateViewVariables()
    return response
  }

  private async fbclosePreeng(id: number, comment: string) {
    this.cardLoading = true
    const response = await closePreeng({ id: id, comment: comment })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async fbRestorePreeng(id: number, comment: string) {
    this.cardLoading = true
    const response = await closePreeng({ id: id, comment: comment })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private async updateSubmit() {
    this.cardLoading = true
    updateEngagement(this.engagement).then((response) => {
      this.engagement = response.data
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error update', error)
    })
    // window.location.href = this.fallbackUrl.path ? this.fallbackUrl.path : '/'
  }

  private async resendUpdate() {
    this.cardLoading = true
    resendUpdateEngagement(this.engagement).then((response) => {
      this.engagement = response.data
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error resendUpdate', error)
    })
  }

  private async fbsendBackSubmit(id: number, comment: string) {
    this.cardLoading = true
    const response = await sendBack({ id: id, comment: comment })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private validerpSubmit() {
    this.validerSubmit('VALIDP')
  }

  private validersSubmit() {
    this.validerSubmit('VALIDS')
  }

  private validerfSubmit() {
    this.validerSubmit('VALIDF')
  }

  private validerSubmit(statut: string) {
    this.cardLoading = true
    validationPreeng({ id: this.engagement.id, statut: statut }).then((response) => {
      this.engagement = response.data
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error validationsPreeng', error)
    })
  }

  private async fbcancelValiderSubmit(id:number, comment:string, statut:string) {
    this.cardLoading = true
    const response = await cancelValidationPreeng({ id: id, comment: comment, statut: statut })
    this.engagement = response.data
    this.updateViewVariables()
    this.cardLoading = false
    return response
  }

  private checkImputerTvaMismatch() {
    let expectedTva = (this.engagement.montant_ttc / this.engagement.montant_ht) - 1
    expectedTva = expectedTva * 100
    this.tvaImputerMismatch = this.tva !== +expectedTva.toPrecision(4)
  }

  private launchImputer() {
    this.imputation.montant_ht = this.engagement.montant_ht
    this.imputation.montant_ttc = this.engagement.montant_ttc
    this.imputation.devise = this.engagement.devise
    this.imputerFormVisible = true
    this.checkImputerTvaMismatch()
  }

  private imputerEngagement() {
    console.log('Imputation de lengagement avec fichiers ' + this.imputation.files)
    this.cardLoading = true
    imputerEngagement(this.engagement).then((response:any) => {
      this.engagement.imputations.push(response.data)
      this.updateViewVariables()
      this.cardLoading = false
    }).catch(error => {
      this.cardLoading = false
      console.log('Error update', error)
    })
    // TODO : handle file upload
    this.updateViewVariables()
  }

  private optionsAnnulerValider() {
    console.log('optionsAnnulerValider')
    this.updateViewVariables()
  }

  private onCancel() {
    this.$router.push(this.fallbackUrl ? this.fallbackUrl : '/')
  }

  private changeMontantHT(value: number) {
    this.engagement.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.formAttributeChange()
  }

  private formAttributeChange() {
    this.submitUpdateDisabled = false
  }

  private changeImputerMontantHT(value: number) {
    this.imputation.montant_ttc = Math.ceil(value * (1 + this.tva / 100))
    this.imputerFormAttributeChange()
  }

  private changeImputerFile(file: any, fileList: any) {
    console.log('changeImputerFile ', file, fileList, this.imputation.files)
    // this.fileList = fileList.slice(-3);
  }

  private handleRemove(file: any, fileList: any) {
    console.log('handleRemove ', file, fileList)
  }

  private handlePreview(file: any) {
    console.log('handlePreview ', file)
  }

  private imputerFormAttributeChange() {
    this.submitImputerDisabled = false
  }

  private hasPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length > 0
  }

  private hasnotPermission(permission: string) {
    return UserModule.permissions.filter(item => item.code === permission).length === 0
  }

  private engagementHasBeenValidatePOrMore() {
    return this.engagement.valideur_first || this.engagement.valideur_second || this.engagement.valideur_final
  }

  private updateViewVariables() {
    this.isCurrentUserSaisisseur = UserModule.matricule === this.engagement.saisisseur
    this.isCurrentUserValideurp = UserModule.matricule === this.engagement.valideur_first
    this.isCurrentUserValideurs = UserModule.matricule === this.engagement.valideur_second
    this.isCurrentUserValideurf = UserModule.matricule === this.engagement.valideur_final

    // The engagement is closed
    this.engagementIsClosed = this.engagement.etat === AppModule.etatsEngagement.CLOT.code

    /** Check if the engagement is editable or not */
    if (this.isCurrentUserSaisisseur &&
      (!this.engagementHasBeenValidatePOrMore() || this.engagement.next_statut != null)) {
      this.toEdit = true
    }
  }
}

</script>

<style lang="scss" scoped>
.el-container{
  box-shadow: 2px;
}

.cascade-extra-lg{
  width: 58.5vw;
}

.notes{
  color:gray;
}

.no-margin-bottom{
  margin-bottom: 0px;
}

.span-label{

}

.type-select .el-input__inner {
    padding-right: 149px;
}

.el-col-20{
    width: 86.7%;
  }

.max-w-600{
  max-width: 70vw;
}
.center{
  margin: auto;
}

</style>
