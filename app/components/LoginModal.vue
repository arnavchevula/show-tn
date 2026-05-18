<script setup lang="ts">
import * as z from 'zod'
const { setSession, user, signOut } = useAuth()
const { public: {  userPreferencesDb } } = useRuntimeConfig();

const supabase = useSupabase()
const props = defineProps({
  open: Boolean
})
const emit = defineEmits(['close'])
const step = ref<'phone' | 'otp'>('phone');
const smsAlerts = ref<boolean>(false);
const emailAlerts = ref<boolean>(false);
const userEmail = ref<string>('');
 
const state = reactive({
  phone: '',
  token: []
})

const captchaToken = ref();

const phoneSchema = z.object({ phone: z.string().min(10, 'Enter a valid 10-digit phone number') })
const otpSchema = z.object({ token: z.array(z.string()).length(6) })

async function sendCode() {
  await $fetch('/api/auth/send-otp', { method: 'POST', body: { phone: state.phone, captchaToken: captchaToken.value }
})
  step.value = 'otp'
}

async function verify() {
  try {
    const data = await $fetch('/api/auth/verify-otp', { method: 'POST', body: { phone: state.phone, token: state.token } })
    await setSession(data.session)
    await supabase.from(userPreferencesDb).upsert(
      { user_id: data.session.user.id, phone:data.session.user.phone, sms_alerts: false, email_alerts: false },
      { onConflict: 'user_id', ignoreDuplicates: true }
    )
    const { data: preference } = await supabase
      .from(userPreferencesDb)
      .select('sms_alerts, email_alerts, email')
      .eq('user_id', data.session.user.id)
      .single()
    smsAlerts.value = preference?.sms_alerts ?? false
    emailAlerts.value = preference?.email_alerts ?? false
    userEmail.value = preference?.email ?? ''
    emit('close')
  } catch (e) {
    console.error('Login failed:', e)
  }
}

async function handleSignOut() {
  await signOut()
  emit('close')
}
async function updatePreferences() {
  await supabase.from(userPreferencesDb).update(
      { sms_alerts: smsAlerts.value, email_alerts: emailAlerts.value }).eq('user_id', user.value.id)
}

async function saveEmail() {
  if (!userEmail.value || !user.value) return
  await supabase.from(userPreferencesDb)
    .update({ email: userEmail.value })
    .eq('user_id', user.value.id)
}

watch(() => props.open, async (isOpen) => {
  if (!isOpen || !user.value) return
  const { data: preference } = await supabase
    .from(userPreferencesDb)
    .select('sms_alerts, email_alerts, email')
    .eq('user_id', user.value.id)
    .single()
  smsAlerts.value = preference?.sms_alerts ?? false
  emailAlerts.value = preference?.email_alerts ?? false
  userEmail.value = preference?.email ?? ''
})
</script>

<template>
    <UModal :open="props.open" @update:open="emit('close')" class="mx-auto flex items-center flex-col flex-1 p-8 sm:p-6 gap-y-8 w-full min-h-80">
        <template #content>
          <div class="w-full flex flex-col gap-4 p-6">

            <template v-if="user">
              <div class="w-full flex flex-col items-center gap-3">
                <UIcon name="i-lucide-circle-check" class="text-4xl mb-1"/>
                <h1 class="text-2xl font-semibold">You're already signed in!</h1>
              </div>
              <div class="w-full flex flex-col gap-3">
                <h2 class="text-xl text-center">Alerts Preferences</h2>
                <UFormField label="Email" name="email" hint="For show reminders">
                  <UInput v-model="userEmail" type="email" placeholder="you@example.com" class="w-full" @blur="saveEmail" />
                </UFormField>
                <div class="flex flex-col gap-y-2">
                  <USwitch
                    unchecked-icon="i-lucide-x"
                    checked-icon="i-lucide-check"
                    v-model="smsAlerts"
                    label="SMS Alerts"
                    size="xl"
                    @update:modelValue="updatePreferences()"
                  />
                  <div class="flex flex-col gap-0.5">
                    <USwitch
                      unchecked-icon="i-lucide-x"
                      checked-icon="i-lucide-check"
                      v-model="emailAlerts"
                      label="Email Alerts"
                      size="xl"
                      :disabled="!userEmail"
                      @update:modelValue="updatePreferences()"
                    />
                    <p v-if="!userEmail" class="text-xs text-muted ml-1">Add an email above to enable</p>
                  </div>
                </div>
              </div>
              <UButton variant="outline" color="neutral" label="Sign Out" icon="i-lucide-log-out" class="flex justify-center" @click="handleSignOut"/>
            </template>

            <template v-else>
              <div class="w-full flex flex-col items-center">
                <UIcon name="i-lucide-user" class="text-3xl mb-2"/>
                <h1 class="text-2xl font-semibold">Login</h1>
                <p class="text-base text-pretty text-muted">Enter your credentials to access your account.</p>
              </div>
              <div class="w-full">
                <UForm v-if="step==='phone'" :state="state" :schema="phoneSchema" @submit="sendCode" class="mx-auto flex flex-col gap-2">
                  <UFormField label="Phone Number" name="phone">
                    <UInput v-model="state.phone" type="tel" placeholder="(555) 000-0000" class="w-full">
                      <template #leading><span class="text-sm text-muted select-none">+1</span></template>
                    </UInput>
                  </UFormField>
                  <NuxtTurnstile v-model="captchaToken" :options="{ size: 'flexible', theme: 'dark' }" class="w-full"/>
                  <UButton variant="solid" color="primary" label="Send Passcode" icon="i-lucide-message-square-lock" type="submit" class="flex justify-center"/>
                </UForm>
                <UForm v-else-if="step==='otp'" :state="state" :schema="otpSchema" @submit="verify" class="mx-auto flex flex-col gap-2">
                  <UFormField label="Passcode" name="otp">
                    <UPinInput v-model="state.token" :length="6" otp/>
                  </UFormField>
                  <UButton variant="solid" color="primary" label="Login" icon="i-lucide-key" type="submit" class="flex justify-center"/>
                </UForm>
              </div>
            </template>

          </div>
        </template>
    </UModal>
</template>
