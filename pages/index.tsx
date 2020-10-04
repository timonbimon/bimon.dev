/** @jsx jsx */
import { jsx } from 'theme-ui'
import Head from 'next/head'
import { Linkedin } from 'react-feather'
import { GitHub } from 'react-feather'
import { Link } from 'theme-ui'

export const Home = (): JSX.Element => (
  <div>
    <Head>
      <title>Timon Ruban - @timonbimon</title>
      <meta
        name="description"
        key="description"
        content="Co-Founder at Luminovo. If you want to chat about electronics, how to apply machine learning to real-world problems, exchange book recommendations or hitchhiking+camping war stories: do reach out!."
      />
    </Head>
    <h1>Hi, I am Timon. 👋</h1>
    <h2>Co-Founder at Luminovo.</h2>
    <Link
      sx={{ color: 'text' }}
      href="https://www.linkedin.com/in/timon-ruban/"
    >
      <Linkedin />
    </Link>
    <Link sx={{ color: 'text' }} href="https://github.com/timonbimon" rel="me">
      <GitHub />
    </Link>
    <h1>This is work in progress, but what isn&apos;t.</h1>
  </div>
)

export default Home
