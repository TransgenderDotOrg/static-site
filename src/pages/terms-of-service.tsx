import React from "react";
import { useNavigate } from "react-router";

import { Box, Typography } from "@mui/material";
import { Link } from "../ui/link";

export const TermsOfServicePage = () => {
  const navigate = useNavigate();

  return (
    <Box sx={{ padding: "2rem 8rem" }}>
      <Typography variant="h3">Transgender.org Terms of Service</Typography>
      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        1. Acceptance of Terms
      </Typography>
      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        By using the services, features, and content offered on Transgender.org
        (the "Website"), you are agreeing to these Terms of Service ("Terms")
        and our Privacy Policy. If you do not agree to these Terms, you should
        not use our Website.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        2. Use of the Website
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        This Website is intended to provide resources, support, and a platform
        for open collaboration for the transgender community. You agree to use
        the Website in a manner consistent with any and all applicable laws and
        regulations.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        3. User Generated Content
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        You are solely responsible for any content you post on the Website. By
        posting content, you grant us a non-exclusive, royalty-free, perpetual,
        irrevocable, and fully sublicensable right to use, reproduce, modify,
        adapt, publish, translate, create derivative works from, distribute, and
        display such content throughout the world in any media.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        4. Intellectual Property
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        The content on the Website, excluding user-generated content, is owned
        by us or our licensors and is protected by copyright, trademark, and
        other intellectual property laws. You may not use our intellectual
        property without our prior written consent.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        5. Privacy
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        Your privacy is very important to us. Please review our{" "}
        <Link
          href="/privacy-policy"
          onClick={(e) => {
            e.preventDefault();
            navigate("/privacy-policy");
          }}
        >
          Privacy Policy
        </Link>{" "}
        to understand our practices.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        6. Changes to These Terms
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        We reserve the right to modify these Terms at any time. We encourage you
        to review these Terms regularly to ensure you understand the terms and
        conditions that apply to your use of the Website.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        7. Limitation of Liability
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        The Website is provided on an "as is" and "as available" basis. We
        disclaim all warranties, express or implied, including but not limited
        to implied warranties of merchantability, fitness for a particular
        purpose, and non-infringement.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        8. Governing Law and Venue
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        These Terms are governed by the laws of the state in which your
        organization is registered, without regard to its conflict of law
        principles.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        9. Contact
      </Typography>

      <Typography variant="body1" sx={{ marginTop: "1rem" }}>
        If you have any questions about these Terms, please contact us at
        hello@transgender.org.
      </Typography>

      <Typography variant="body2" sx={{ marginTop: "1rem" }}>
        Last Updated: 7/16/2024
      </Typography>
    </Box>
  );
};
