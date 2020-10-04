import Document, { Html, Head, Main, NextScript } from 'next/document'
import { InitializeColorMode } from 'theme-ui'

export default class extends Document {
  static async getInitialProps(ctx: any) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render() {
    // Replace html lang attribute value with your language.
    return (
      <Html lang="en">
        <Head>
          <link rel="icon" type="image/x-icon" href="/favicon.png" />
          <link rel="apple-touch-icon" href="/favicon.png" />
        </Head>
        <body>
          <InitializeColorMode />
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
