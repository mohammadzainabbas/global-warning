import PropTypes from 'prop-types';
import { forwardRef } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { Box, Link, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const Logo = forwardRef(({ disabledLink = false, sx, ...other }, ref) => {

  const logo = (
    <>
      <Box
        component="img"
        src="https://raw.githubusercontent.com/mohammadzainabbas/global-warning/main/public/favicon/android-chrome-512x512.png"
        sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
      />
      <Box sx={{ my: 1.5, px: 2.5 }}>
        <Typography variant="subtitle2" noWrap>
          {`Global Warning`}
        </Typography>
        <Typography variant="caption" sx={{ color: 'text.secondary' }}>
          {`Visual Analytics Project`}
        </Typography>
    </Box>
    </>
  );

  if (disabledLink) {
    return <>{logo}</>;
  }

  return (
    <Link to="/" component={RouterLink} sx={{ display: 'contents' }}>
      {logo}
    </Link>
  );
});

Logo.propTypes = {
  sx: PropTypes.object,
  disabledLink: PropTypes.bool,
};

export default Logo;
