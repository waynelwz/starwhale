import type { StorybookConfig } from '@storybook/react-vite'

import { join, dirname } from 'path'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
    return dirname(require.resolve(join(value, 'package.json')))
}
const config: StorybookConfig = {
    stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
    addons: [
        getAbsolutePath('@storybook/addon-links'),
        getAbsolutePath('@storybook/addon-essentials'),
        getAbsolutePath('@storybook/addon-onboarding'),
        getAbsolutePath('@storybook/addon-interactions'),
        getAbsolutePath('@storybook/addon-designs'),
    ],
    core: {
        builder: {
            name: '@storybook/builder-vite',
            options: {
                viteConfigPath: './vite.config.ts',
            },
        },
    },
    framework: {
        name: getAbsolutePath('@storybook/react-vite'),
        options: {},
    },
    docs: {
        autodocs: true,
    },
    staticDirs: ['../src/assets', '../public'],
    typescript: {
        reactDocgen: 'react-docgen',
    },
    // async viteFinal(config, { configType }) {
    //     const { config: userConfig } = await loadConfigFromFile(resolve(__dirname, '../vite.config.ts') as any)
    //     userConfig.resolve.dedupe = ['@storybook/client-api']

    //     return mergeConfig(config, {
    //         resolve: { alias },
    //         plugins: [tsconfigPaths()],
    //     })
    // },
}
export default config
