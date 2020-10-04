import React from 'react'
import { ThemeProvider } from 'theme-ui'
// import { merge } from 'theme-ui'
// import { toTheme } from '@theme-ui/typography'
// import future from '@theme-ui/preset-future'
// import wp2016 from 'typography-theme-wordpress-2016'

import type { AppProps /*, AppContext */ } from 'next/app'

// const theme = merge(future, {
//     colors: {
//       background: '#fff'
//     },
//   })

const theme = {
  colors: {
    text: '#4A4A4A',
    background: '#FFF',
    primary: '#61AFE0',
    secondary: '#EB465C',
    accent: '#62B85A',
    muted: '#F2F4F4',
    blue: '#61AFE0',
    red: '#EB465C',
    green: '#62B85A',
  },
  styles: {
    root: {
      border: 'solid muted',
    },
  },
}

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ThemeProvider theme={theme}>
      <Component {...pageProps} />
    </ThemeProvider>
  )
}

export default MyApp
