// @ts-ignore
import System from 'systemjs/dist/system.js'

import { config } from '../config'
import { locateWithCache } from './pluginCacheBuster'

// @ts-ignore

/**
 * Option to specify a plugin css that should be applied for the dark
 * and the light theme.
 *
 * @public
 */
export interface PluginCssOptions {
    light: string
    dark: string
}

/**
 * @internal
 */
export const SystemJS = System

/**
 * Use this to load css for a Grafana plugin by specifying a {@link PluginCssOptions}
 * containing styling for the dark and the light theme.
 *
 * @param options - plugin styling for light and dark theme.
 * @public
 */
export function loadPluginCss(options: PluginCssOptions): Promise<any> {
    const theme = config.bootData.user.lightTheme ? options.light : options.dark
    return SystemJS.import(`${theme}!css`)
}

SystemJS.registry.set('plugin-loader', SystemJS.newModule({ locate: locateWithCache }))

// grafanaRuntime.SystemJS.config({
//     baseURL: 'public',
//     defaultExtension: 'js',
//     packages: {
//         plugins: {
//             defaultExtension: 'js',
//         },
//     },
//     map: {
//         text: 'vendor/plugin-text/text.js',
//         css: 'vendor/plugin-css/css.js',
//     },
//     meta: {
//         '/*': {
//             esModule: true,
//             authorization: true,
//             loader: 'plugin-loader',
//         },
//     },
// })

// export function exposeToPlugin(name: string, component: any) {
//     grafanaRuntime.SystemJS.registerDynamic(name, [], true, (require: any, exports: any, module: { exports: any }) => {
//         module.exports = component
//     })
// }
