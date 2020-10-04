import React from 'react'
import { ThemeProvider } from 'theme-ui'
// import { merge } from 'theme-ui'
// import { toTheme } from '@theme-ui/typography'
// import future from '@theme-ui/preset-future'
// import wp2016 from 'typography-theme-wordpress-2016'

// import App from "next/app";
import type { AppProps /*, AppContext */ } from 'next/app'

// const theme = merge(future, {
//     colors: {
//       background: '#fff'
//     },
//   })
const theme = {
  colors: {
    background: '#fff',
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
