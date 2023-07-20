import React from 'react'

import { Box, Typography } from '@mui/material'
import { Link } from '../ui/link'

export const AboutPage = () => {
  return (
    <Box sx={{ padding: '2rem' }}>
      <Typography variant='h3'>About Us</Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Our Vision
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        At Transgender.org, we envision a world where every transgender individual can live their
        truth, free from bias and discrimination. We're committed to fostering a culture that
        upholds respect, inclusivity, and understanding for all forms of gender expression and
        identity.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Our Mission
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        We are on a mission to build a comprehensive, supportive hub of resources for transgender
        individuals and their allies. Through curation of essential resources and fostering an
        engaging community, we aim to promote the rights, recognition, and acceptance of transgender
        people globally.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Who We Are
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        Transgender.org is an initiative brought to life by a dedicated team of engineers,
        designers, advocates, and allies, passionate about making a positive difference in the lives
        of transgender individuals. While our backgrounds are diverse, we are united by our goal to
        improve understanding, acceptance, and support for the transgender community.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        What We Do
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        At its core, Transgender.org is a resource center. We consolidate useful, educational, and
        supportive content from various sources around the web, providing a single, user-friendly
        platform where transgender individuals and their allies can find the information they need.
        While we are not content creators, we are discerning curators, choosing only the most
        helpful, accurate, and empowering resources to share with our community.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Our Community
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        Our community is the cornerstone of our initiative. It's composed of transgender
        individuals, allies, advocates, and anyone committed to promoting inclusivity and equality.
        Our community members actively contribute to our mission, making our platform a dynamic and
        ever-evolving resource.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Join Us
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        We welcome anyone who believes in equality, acceptance, and the power of information. By
        participating in our community, you can contribute to the global dialogue on transgender
        rights, learn from shared experiences, and help shape a more inclusive future.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Moving Forward
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        We are currently in the process of becoming a non-profit organization. This change will
        allow us to extend our reach, increase our impact, and further support the transgender
        community.
      </Typography>
      <Typography variant='body2' sx={{ marginTop: '1rem' }}>
        Contact Us
      </Typography>
      <Typography variant='body1' sx={{ marginTop: '1rem' }}>
        For more information, suggestions, or to join our mission, feel free to reach out to us.
        We're excited to connect with you and appreciate your interest in Transgender.org. The best
        way to do this is to{' '}
        <Link href='https://discord.gg/wtRVNzpGkx' target='_blank'>
          reach out to us on Discord
        </Link>
        .
      </Typography>
    </Box>
  )
}
