<template>
  <div class="login-container">
    <div class="backgound-container">
    </div>
    <el-form
      ref="loginForm"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">
          {{ $t('login.title') }}
        </h3>
        <el-row type="flex" class="row-bg" justify="center">
          <el-col :span="5">
            <el-image
              style="width: 100px; height: 100px; margin-bottom: 1em; border-radius: 4px"
              :src="'/img/logo-snh.jpg'"
              :fit="'cover'">
              <div slot="error" class="image-slot">
                
              </div>
            </el-image>
          </el-col>
        </el-row>
      </div>

      <el-form-item prop="matricule">
        <span class="svg-container">
          <svg-icon name="user" />
        </span>
        <el-input
          ref="matricule"
          v-model="loginForm.matricule"
          :placeholder="$t('login.matricule')"
          name="matricule"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        v-model="capsTooltip"
        content="Caps lock is On"
        placement="right"
        manual
      >
        <el-form-item prop="password">
          <span class="svg-container">
            <svg-icon name="password" />
          </span>
          <el-input
            :key="passwordType"
            ref="password"
            v-model="loginForm.password"
            :type="passwordType"
            :placeholder="$t('login.password')"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup.native="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter.native="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
          >
            <svg-icon :name="passwordType === 'password' ? 'eye-off' : 'eye-on'" />
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width:100%; margin-bottom:30px;"
        @click.native.prevent="handleLogin"
      >
        {{ $t('login.logIn') }}
      </el-button>
    </el-form>

    <el-dialog
      :title="$t('login.thirdparty')"
      :visible.sync="showDialog"
    >
      {{ $t('login.thirdpartyTips') }}
      <br>
      <br>
      <br>
      <social-sign />
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator'
import { Route } from 'vue-router'
import { Dictionary } from 'vue-router/types/router'
import { Form as ElForm, Input } from 'element-ui'
import { UserModule } from '@/store/modules/user'
import { AppModule } from '@/store/modules/app'
import LangSelect from '@/components/LangSelect/index.vue'
import SocialSign from './components/SocialSignin.vue'

@Component({
  name: 'Login',
  components: {
    LangSelect,
    SocialSign
  }
})
export default class extends Vue {
  private isNumeric(value: any) {
      return /^\d+$/.test(value)
  }

  private validateUsername = (rule: any, value: string, callback: Function) => {
    if (value.length < 5 || !this.isNumeric(value)) {
      callback(new Error('Veuillez saisir un matricule valide'))
    } else {
      callback()
    }
  }

  private validatePassword = (rule: any, value: string, callback: Function) => {
    if (value.length < 5) {
      callback(new Error('Le mot de passe doit avoir au moins 5 caractères'))
    } else {
      callback()
    }
    callback()
  }

  private loginForm = {
    matricule: '00005',
    password: '12345'
  }

  private loginRules = {
    matricule: [{ validator: this.validateUsername, trigger: 'blur' }],
    password: [{ validator: this.validatePassword, trigger: 'blur' }]
  }

  private passwordType = 'password'
  private loading = false
  private showDialog = false
  private capsTooltip = false
  private redirect?: string
  private otherQuery: Dictionary<string> = {}
  private imageurl = ''

  @Watch('$route', { immediate: true })
  private onRouteChange(route: Route) {
    // TODO: remove the "as Dictionary<string>" hack after v4 release for vue-router
    // See https://github.com/vuejs/vue-router/pull/2050 for details
    const query = route.query as Dictionary<string>
    if (query) {
      this.redirect = query.redirect
      this.otherQuery = this.getOtherQuery(query)
    }
  }

  mounted() {
    if (this.loginForm.matricule === '') {
      (this.$refs.email as Input).focus()
    } else if (this.loginForm.password === '') {
      (this.$refs.password as Input).focus()
    }
  }

  private checkCapslock(e: KeyboardEvent) {
    const { key } = e
    this.capsTooltip = key !== null && key.length === 1 && (key >= 'A' && key <= 'Z')
  }

  private showPwd() {
    if (this.passwordType === 'password') {
      this.passwordType = ''
    } else {
      this.passwordType = 'password'
    }
    this.$nextTick(() => {
      (this.$refs.password as Input).focus()
    })
  }

  private handleLogin() {
    (this.$refs.loginForm as ElForm).validate(async(valid: boolean) => {
      if (valid) {
        this.loading = true
        UserModule.Login(this.loginForm)
          .then(() => {
            AppModule.fetchEngagementVariables()
              .then(() => {
                this.$router.push({
                  path: this.redirect || '/',
                  query: this.otherQuery
                }).catch(error => {
                  console.info(error.message)
                })
                this.loading = false
              })
          }).catch(error => {
            console.info(error.message)
            this.loading = false
          })
      } else {
        return false
      }
    })
  }

  private getOtherQuery(query: Dictionary<string>) {
    return Object.keys(query).reduce((acc, cur) => {
      if (cur !== 'redirect') {
        acc[cur] = query[cur]
      }
      return acc
    }, {} as Dictionary<string>)
  }
}
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input { color: $white; }
    input::first-line { color: $white; }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;

    input {
      height: 47px;
      background: transparent;
      border: 0px;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $white;
      cursor: pointer;
      caret-color: $white;
      -webkit-appearance: none;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px $loginBg inset !important;
        -webkit-text-fill-color: #fff !important;
      }
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.4);
    background: rgba(0, 0, 0, 0.3);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.backgound-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  // background-color: $loginBg;
  background-image: url("/snh-bg.jpg");

  /* Add the blur effect */
  filter: blur(8px);
  -webkit-filter: blur(8px);

  /* Center and scale the image nicely */
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  z-index: -1;
}

.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  background-color: transparent;

  .login-form {
    position: absolute;
    top: 5%;
    left: 35%;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
    z-index: 1;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $white;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $darkGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $white;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
