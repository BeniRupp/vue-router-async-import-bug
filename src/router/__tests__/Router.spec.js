import {createRouter, createWebHistory} from "vue-router";
// import AboutView from "@/views/AboutView.vue"; // ✅does work
const AboutView = async () => {
    console.log('importing about view ...')
    const aboutView = await import("@/views/AboutView.vue")
    console.log('about view loaded')
    return aboutView
} // 💥does not work with router-link but with router.push() (await does not resolve)
import HomeView from "@/views/HomeView.vue";
import {flushPromises, mount, RouterLinkStub} from "@vue/test-utils";
import { expect, it} from "vitest";

it('should work', async () => {
    const router = createRouter({
        history: createWebHistory(),
        routes: [
            {path: '/', component: HomeView},
            {path: '/about', component: AboutView},
        ],
    })
    await router.push('/')
    await router.isReady()

    router.beforeEach((to, from) => {
        console.log(`will change route from ${from.fullPath} to ${to.fullPath}`)
    })

    router.afterEach((to, from) => {
        console.log(`route changed to ${to.fullPath}`)
    })

    const wrapper = mount(
        {
            template: '<router-link class="link" to="/about">test</router-link>',
        },
        { global: { plugins: [router], }
        }
    )

    expect(router.currentRoute.value.fullPath).toBe('/')
    // await router.push('/about') // ✅router.push() instead of click on router-link will work, too
    await wrapper.find('.link').trigger('click') // 💥does not work
    await flushPromises()
    expect(router.currentRoute.value.fullPath).toBe('/about')
})
